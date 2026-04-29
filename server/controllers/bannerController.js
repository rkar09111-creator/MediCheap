import Banner from '../models/Banner.js';

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('-createdAt');
    res.status(200).json({ status: 'success', data: { banners } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ status: 'success', data: { banner } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ status: 'success', data: { banner } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
