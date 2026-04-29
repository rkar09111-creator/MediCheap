import React from 'react';
const Placeholder = ({ name }) => (
  <div className="admin-card p-12 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl">🚧</div>
    <h2 className="text-2xl font-display font-bold text-admin-text-primary">{name} Page</h2>
    <p className="text-admin-text-secondary max-w-xs">We are currently building this section. It will be available shortly in the next update.</p>
  </div>
);

export const Medicines = () => <Placeholder name="Medicines" />;
export const MedicineDetail = () => <Placeholder name="Medicine Detail" />;
export const Orders = () => <Placeholder name="Orders" />;
export const OrderDetail = () => <Placeholder name="Order Detail" />;
export const Prescriptions = () => <Placeholder name="Prescriptions" />;
export const Riders = () => <Placeholder name="Riders" />;
export const Users = () => <Placeholder name="Users" />;
export const Settings = () => <Placeholder name="Settings" />;
export const Analytics = () => <Placeholder name="Analytics" />;
export const Notifications = () => <Placeholder name="Notifications" />;
export const Categories = () => <Placeholder name="Categories" />;
export const Inventory = () => <Placeholder name="Inventory" />;
export const BulkImport = () => <Placeholder name="Bulk Import" />;
