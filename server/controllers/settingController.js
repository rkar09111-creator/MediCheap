import Setting from '../models/Setting.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json({ status: 'success', data: { settings: settingsMap } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ status: 'success', data: { setting } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
