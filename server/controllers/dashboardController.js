import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';

export const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    
    const totalMedicines = await Medicine.countDocuments();
    const lowStockItems = await Medicine.countDocuments({ stock: { $lte: 10 } }); // Use minStockAlert in future
    const totalUsers = await User.countDocuments();
    const pendingPrescriptions = await Order.countDocuments({ 'prescription.status': 'pending' });

    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const todayOrdersList = await Order.find({ createdAt: { $gte: today }, status: { $ne: 'cancelled' } });
    const todayRevenue = todayOrdersList.reduce((sum, order) => sum + order.totalAmount, 0);

    // Last 7 days revenue & orders for chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const revenueChart = await Promise.all(last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDay },
        status: { $ne: 'cancelled' }
      });
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        orders: dayOrders.length
      };
    }));

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name email');

    const topMedicines = await Medicine.find()
      .sort({ totalSold: -1 })
      .limit(5);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    const actionsRequired = [];
    if (pendingOrders > 0) {
      actionsRequired.push({ 
        id: 'orders', 
        title: `${pendingOrders} orders waiting processing`, 
        time: 'Immediate', 
        type: 'order',
        btn: 'Process'
      });
    }
    if (lowStockItems > 0) {
      actionsRequired.push({ 
        id: 'stock', 
        title: `${lowStockItems} items low on stock`, 
        time: 'Inventory Alert', 
        type: 'stock',
        btn: 'Restock'
      });
    }
    if (pendingPrescriptions > 0) {
      actionsRequired.push({ 
        id: 'rx', 
        title: `${pendingPrescriptions} prescriptions waiting review`, 
        time: 'Clinical', 
        type: 'rx',
        btn: 'Review'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        pendingOrders,
        totalMedicines,
        lowStockItems,
        totalUsers,
        pendingPrescriptions,
        revenueChart,
        recentOrders,
        topMedicines,
        ordersByStatus,
        actionsRequired
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
