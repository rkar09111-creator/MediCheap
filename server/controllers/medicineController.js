import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';

export const getAllMedicines = async (req, res) => {
  try {
    const { 
      search, category, minPrice, maxPrice, brand, 
      requiresPrescription, sort, system, type, consumerCategory 
    } = req.query;
    let query = { isLive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      // Handle both ObjectId and Category Name
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        query.$or = [
          { categoryName: category },
          { categoryName: { $regex: category, $options: 'i' } }
        ];
      }
    }

    if (system) {
      query.medicineSystem = system;
    }

    if (type) {
      query.regulatoryCategory = { $in: type.split(',') };
    }

    if (consumerCategory) {
      query.consumerCategory = { $in: consumerCategory.split(',') };
    }

    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (requiresPrescription !== undefined) {
      query.requiresPrescription = requiresPrescription === 'true';
    }

    let apiQuery = Medicine.find(query);

    // Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      apiQuery = apiQuery.sort(sortBy);
    } else {
      apiQuery = apiQuery.sort('-createdAt');
    }

    const medicines = await apiQuery;
    res.status(200).json({ status: 'success', results: medicines.length, data: { medicines } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('ratings.user', 'name');
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.status(200).json({ status: 'success', data: { medicine } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ status: 'success', data: { medicine } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.status(200).json({ status: 'success', data: { medicine } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    res.status(200).json({ status: 'success', data: { medicine } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    medicine.isAvailable = !medicine.isAvailable;
    await medicine.save();
    res.status(200).json({ status: 'success', data: { medicine } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    medicine.ratings.push(review);
    
    // Recalculate average rating
    const totalRating = medicine.ratings.reduce((acc, item) => item.rating + acc, 0);
    medicine.averageRating = totalRating / medicine.ratings.length;

    await medicine.save();
    res.status(201).json({ status: 'success', data: { medicine } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAIRecommendations = async (req, res) => {
  try {
    const { symptoms, maxBudget } = req.body;
    if (!symptoms) return res.status(400).json({ message: 'Symptoms are required' });

    // 1. Initial filter: budget and availability
    let query = { 
      isLive: true,
      sellingPrice: { $lte: Number(maxBudget) || 1000000 }
    };

    // 2. Symptom matching
    const symptomRegex = new RegExp(symptoms.split(' ').join('|'), 'i');
    query.$or = [
      { name: { $regex: symptomRegex } },
      { genericName: { $regex: symptomRegex } },
      { description: { $regex: symptomRegex } },
      { fullDescription: { $regex: symptomRegex } }
    ];

    let medicines = await Medicine.find(query);

    // 3. Scoring Algorithm
    const scoredMedicines = medicines.map(med => {
      let score = 0;
      
      // Relevance Score
      if (new RegExp(symptoms, 'i').test(med.name)) score += 50;
      if (new RegExp(symptoms, 'i').test(med.genericName)) score += 40;
      
      // Quality Score
      score += (med.averageRating || 0) * 10;
      if (med.isFeatured) score += 20;
      
      // Budget Efficiency
      const priceRatio = 1 - (med.sellingPrice / (Number(maxBudget) || 1000000));
      score += priceRatio * 30;

      return { 
        ...med.toObject(), 
        matchScore: Math.round(score) 
      };
    });

    scoredMedicines.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ 
      status: 'success', 
      results: scoredMedicines.length, 
      data: { recommendations: scoredMedicines.slice(0, 5) } 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkImportMedicines = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of items.' });
    }

    const results = {
      success: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    for (const item of items) {
      try {
        // Find existing by serialNumber or Name
        let medicine = await Medicine.findOne({ 
          $or: [
            { serialNumber: item.serialNumber },
            { name: item.name }
          ]
        });

        if (medicine) {
          // Update existing
          Object.assign(medicine, item);
          await medicine.save();
          results.updated++;
        } else {
          // Create new
          await Medicine.create(item);
          results.success++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push({ item: item.name, error: err.message });
      }
    }

    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
