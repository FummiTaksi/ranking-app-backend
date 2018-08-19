const userService = require('../services/userService');

const seedAdminToDataBase = async () => {
  const newAdmin = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };
  await userService.createAdmin(newAdmin);
};

exports.seedAdminToDataBase = seedAdminToDataBase;
