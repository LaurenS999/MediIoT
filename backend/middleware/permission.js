const permissions = require("../config/permissions");

function allow(permission) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("ROLE USER : ", role);

    const rolePermissions = permissions[role] || [];

    if (!rolePermissions.includes(permission)) {
      return res.status(403).json({
        message: `Forbidden: missing permission ${permission}`,
      });
    }

    next();
  };
}

module.exports = allow;
