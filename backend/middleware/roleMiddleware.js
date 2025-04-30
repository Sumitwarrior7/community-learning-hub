// middleware/roleMiddleware.js
const verifyRoles = (...allowedRoles) => (req, res, next) => {
    if (!req?.user?.role) return res.sendStatus(401);
    if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
  
  const adminOnly = (req, res, next) => verifyRoles('admin')(req, res, next);
  const moderatorAccess = (req, res, next) => 
    verifyRoles('admin', 'moderator')(req, res, next);
  
  module.exports = { verifyRoles, adminOnly, moderatorAccess };
  