const Audit = require('../models/Audit');

const logActivity = (action, entity) => {
  return async (req, res, next) => {
    // We only log if the request was successful
    const originalJson = res.json;
    res.json = function (data) {
      if (data.success && req.user) {
        // Asynchronously log the activity
        const auditLog = {
          admin: req.user.id,
          action: action,
          target: req.body.name || req.body.title || req.params.id || 'N/A',
          entity: entity,
          details: {
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            body: req.body
          },
          ip: req.ip,
          device: req.headers['user-agent']
        };
        
        Audit.create(auditLog).catch(err => console.error('Audit Log failed:', err));
      }
      return originalJson.call(this, data);
    };
    next();
  };
};

module.exports = { logActivity };
