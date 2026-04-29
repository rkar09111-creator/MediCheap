const express = require('express');
const router = express.Router();
const Company = require('../models/Company.model');
const CompanyCategory = require('../models/CompanyCategory.model');
const CompanyProduct = require('../models/CompanyProduct.model');
const { protect, restrictTo } = require('../middleware/auth');

// Manual slugify helper for 100% accuracy without external dependencies
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

// --- COMPANY ROUTES ---

// GET / [public]
router.get('/', async (req, res) => {
  try {
    const { active, featured, page = 1, limit = 20 } = req.query;
    let query = {};
    
    // Non-admins only see active/public companies
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
      query.showOnWebsite = true;
    } else {
      if (active === 'true') query.isActive = true;
      if (active === 'false') query.isActive = false;
    }
    
    if (featured === 'true') query.isFeatured = true;

    const companies = await Company.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await Company.countDocuments(query);

    res.json({ success: true, data: { companies, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /slug/:slug [public]
router.get('/slug/:slug', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug, isActive: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    
    const categories = await CompanyCategory.find({ company: company._id, isActive: true }).sort({ displayOrder: 1 });
    
    res.json({ success: true, data: { company, categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /:id [public]
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    
    res.json({ success: true, data: { company } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST / [admin]
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    const company = await Company.create({
      ...req.body,
      slug,
      createdBy: req.user.id
    });

    req.app.get('io').emit('companies:updated');
    res.status(201).json({ success: true, data: { company } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:id [admin]
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    req.app.get('io').emit('companies:updated');
    res.json({ success: true, data: { company } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:id/toggle [admin]
router.patch('/:id/toggle', protect, restrictTo('admin'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    
    company.isActive = !company.isActive;
    await company.save();

    req.app.get('io').emit('companies:updated');
    res.json({ success: true, data: { company } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:id [admin]
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const productCount = await CompanyProduct.countDocuments({ company: req.params.id });
    // Soft delete or hard delete based on preference, here hard delete but with warning handled by frontend
    await Company.findByIdAndDelete(req.params.id);
    await CompanyCategory.deleteMany({ company: req.params.id });
    await CompanyProduct.deleteMany({ company: req.params.id });

    req.app.get('io').emit('companies:updated');
    res.json({ success: true, message: `Company and its ${productCount} products deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- CATEGORY ROUTES ---

// GET /:companyId/categories [public]
router.get('/:companyId/categories', async (req, res) => {
  try {
    const categories = await CompanyCategory.find({ 
      company: req.params.companyId,
      isActive: true,
      showOnWebsite: true
    }).sort({ displayOrder: 1 });
    
    res.json({ success: true, data: { categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /:companyId/categories [admin]
router.post('/:companyId/categories', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    const category = await CompanyCategory.create({
      ...req.body,
      company: req.params.companyId,
      slug
    });

    await Company.findByIdAndUpdate(req.params.companyId, { $inc: { totalCategories: 1 } });

    req.app.get('io').emit('companies:updated');
    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:companyId/categories/:catId [admin]
router.put('/:companyId/categories/:catId', protect, restrictTo('admin'), async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    const category = await CompanyCategory.findByIdAndUpdate(req.params.catId, req.body, { new: true });
    
    req.app.get('io').emit('companies:updated');
    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:companyId/categories/:catId [admin]
router.delete('/:companyId/categories/:catId', protect, restrictTo('admin'), async (req, res) => {
  try {
    const productCount = await CompanyProduct.countDocuments({ category: req.params.catId });
    await CompanyCategory.findByIdAndDelete(req.params.catId);
    await CompanyProduct.deleteMany({ category: req.params.catId });
    
    await Company.findByIdAndUpdate(req.params.companyId, { 
      $inc: { totalCategories: -1, totalProducts: -productCount } 
    });

    req.app.get('io').emit('companies:updated');
    res.json({ success: true, message: 'Category and products deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- PRODUCT ROUTES ---

// GET /:companyId/products [public]
router.get('/:companyId/products', async (req, res) => {
  try {
    const { category, page = 1, limit = 20, sort } = req.query;
    let query = { company: req.params.companyId };
    
    if (!req.user || req.user.role !== 'admin') {
      query.isAvailable = true;
    }
    
    if (category) query.category = category;

    let sortQuery = { displayOrder: 1, createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { sellingPrice: 1 };
    if (sort === 'price_desc') sortQuery = { sellingPrice: -1 };

    const products = await CompanyProduct.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('category', 'name');

    const total = await CompanyProduct.countDocuments(query);
    
    res.json({ success: true, data: { products, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /:companyId/products [admin]
router.post('/:companyId/products', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    
    const product = await CompanyProduct.create({
      ...req.body,
      company: req.params.companyId,
      slug,
      createdBy: req.user.id
    });

    await CompanyCategory.findByIdAndUpdate(req.body.category, { $inc: { productCount: 1 } });
    await Company.findByIdAndUpdate(req.params.companyId, { $inc: { totalProducts: 1 } });

    req.app.get('io').emit('companies:updated');
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /:companyId/products/:productId [admin]
router.put('/:companyId/products/:productId', protect, restrictTo('admin'), async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    const product = await CompanyProduct.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    
    req.app.get('io').emit('companies:updated');
    res.json({ success: true, data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /:companyId/products/:productId/toggle [admin]
router.patch('/:companyId/products/:productId/toggle', protect, restrictTo('admin'), async (req, res) => {
  try {
    const product = await CompanyProduct.findById(req.params.productId);
    product.isAvailable = !product.isAvailable;
    await product.save();
    
    req.app.get('io').emit('companies:updated');
    res.json({ success: true, data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /:companyId/products/:productId [admin]
router.delete('/:companyId/products/:productId', protect, restrictTo('admin'), async (req, res) => {
  try {
    const product = await CompanyProduct.findByIdAndDelete(req.params.productId);
    if (product) {
      await CompanyCategory.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
      await Company.findByIdAndUpdate(product.company, { $inc: { totalProducts: -1 } });
    }

    req.app.get('io').emit('companies:updated');
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /products/detail/:productId [public]
router.get('/products/detail/:productId', async (req, res) => {
  try {
    const product = await CompanyProduct.findById(req.params.productId)
      .populate('company')
      .populate('category');
    
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    product.viewCount += 1;
    await product.save();
    
    res.json({ success: true, data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- GLOBAL SEARCH ---
router.get('/search/products', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await CompanyProduct.find(
      { $text: { $search: q }, isAvailable: true },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .populate('company', 'name slug logo primaryColor')
    .populate('category', 'name')
    .limit(20);
    
    res.json({ success: true, data: { results } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
