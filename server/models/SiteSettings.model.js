const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  store: {
    name: { type: String, default: 'MediCheap' },
    tagline: { type: String },
    email: { type: String },
    phone: { type: String },
    whatsapp: { type: String },
    address: { type: String },
    drugLicense: { type: String },
    logo: { type: String },
    favicon: { type: String },
    supportHours: { type: String },
    coordinates: { 
      lat: { type: Number }, 
      lng: { type: Number } 
    }
  },
  homepage: {
    announcementBar: {
      isActive: { type: Boolean, default: true },
      text: { type: String },
      bgColor: { type: String, default: '#16A34A' },
      link: { type: String }
    },
    hero: {
      isActive: { type: Boolean, default: true },
      headlineL1: { type: String },
      headlineL2: { type: String },
      highlightedWord: { type: String },
      subheadline: { type: String },
      cta1Text: { type: String },
      cta1Link: { type: String },
      cta2Text: { type: String },
      cta2Link: { type: String },
      popularSearches: [{ type: String }]
    },
    trustBar: {
      isActive: { type: Boolean, default: true },
      items: [{
        icon: { type: String },
        title: { type: String },
        subtitle: { type: String }
      }]
    },
    categoriesSection: {
      isActive: { type: Boolean, default: true },
      heading: { type: String },
      subheading: { type: String },
      maxToShow: { type: Number, default: 8 }
    },
    featuredMedicines: {
      isActive: { type: Boolean, default: true },
      heading: { type: String },
      tabs: [{
        label: { type: String },
        autoMode: { type: Boolean, default: true },
        medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
        maxItems: { type: Number, default: 8 }
      }]
    },
    prescriptionBanner: {
      isActive: { type: Boolean, default: true },
      heading: { type: String },
      body: { type: String },
      ctaText: { type: String },
      bgStyle: { type: String }
    },
    whyUs: {
      isActive: { type: Boolean, default: true },
      heading: { type: String },
      subheading: { type: String },
      features: [{
        icon: { type: String },
        title: { type: String },
        description: { type: String }
      }]
    },
    reviewsSection: {
      isActive: { type: Boolean, default: true },
      heading: { type: String },
      subheading: { type: String },
      autoMode: { type: Boolean, default: true },
      featuredReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
    },
    sectionOrder: [{ type: String }]
  },
  delivery: {
    fee: { type: Number, default: 49 },
    freeAbove: { type: Number, default: 499 },
    cutoffTime: { type: String, default: '18:00' },
    estimatedTime: { type: String, default: '2-4 hours' },
    codEnabled: { type: Boolean, default: true },
    codMaxAmount: { type: Number, default: 5000 },
    codExtraCharge: { type: Number, default: 0 },
    deliveryRadius: { type: Number, default: 15 },
    storeCoordinates: { 
      lat: { type: Number }, 
      lng: { type: Number } 
    }
  },
  payment: {
    upi: {
      enabled: { type: Boolean, default: true },
      qrImageUrl: { type: String },
      upiId: { type: String },
      payeeName: { type: String },
      instructions: { type: String }
    },
    cod: {
      enabled: { type: Boolean, default: true },
      instructions: { type: String },
      availablePincodes: [{ type: String }],
      unavailablePincodes: [{ type: String }]
    }
  },
  seo: {
    siteTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    ogImage: { type: String },
    googleAnalyticsId: { type: String },
    facebookPixelId: { type: String }
  },
  notifications: {
    adminEmail: { type: String },
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUser: { type: String },
    smtpPass: { type: String },
    fromEmail: { type: String },
    fromName: { type: String }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
