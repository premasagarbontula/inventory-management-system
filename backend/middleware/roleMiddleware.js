const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({
        message: "Access denied. Contact Admin",
      });
    }
    next();
  };
};

module.exports = authorizeRoles;
