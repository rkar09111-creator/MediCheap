import Address from '../models/Address.js';

// Get user's saved addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id, isActive: true }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    // If setting as default, unset others
    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete address
export const deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set as default
export const setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDefault: true },
      { new: true }
    );

    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
