import RiderLocation from '../models/RiderLocation.js';

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const riderLocation = await RiderLocation.findOneAndUpdate(
      { rider: req.user.id },
      { 
        currentLocation: { lat, lng },
        isOnline: true,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: 'success', data: { riderLocation } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRiderLocation = async (req, res) => {
  try {
    const riderLocation = await RiderLocation.findOne({ rider: req.params.riderId });
    if (!riderLocation) return res.status(404).json({ message: 'Rider location not found' });
    res.status(200).json({ status: 'success', data: { riderLocation } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAvailableRiders = async (req, res) => {
  try {
    const riders = await RiderLocation.find({ isOnline: true }).populate('rider');
    res.status(200).json({ status: 'success', data: { riders } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const riderLocation = await RiderLocation.findOneAndUpdate(
      { rider: req.user.id },
      { isOnline },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: 'success', data: { riderLocation } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
