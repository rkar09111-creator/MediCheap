import Prescription from '../models/Prescription.js';

export const uploadPrescription = async (req, res) => {
  try {
    const { phone, patientInstructions, priority } = req.body;
    const imageUrl = `/uploads/prescriptions/${req.file.filename}`;
    
    const prescription = await Prescription.create({
      user: req.user.id,
      imageUrl,
      phone,
      patientInstructions,
      priority
    });
    res.status(201).json({ status: 'success', data: { prescription } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate('user').sort('-createdAt');
    res.status(200).json({ status: 'success', data: { prescriptions } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { prescriptions } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const reviewPrescription = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, {
      status,
      adminNotes
    }, { new: true });
    res.status(200).json({ status: 'success', data: { prescription } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
