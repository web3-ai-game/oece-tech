const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Import models
const Tenant = require('./Tenant');
const User = require('./User');
const RoomType = require('./RoomType');
const Room = require('./Room');
const Customer = require('./Customer');
const Booking = require('./Booking');
const Payment = require('./Payment');
const MaintenanceLog = require('./MaintenanceLog');
const Review = require('./Review');
const Setting = require('./Setting');

// Initialize models
const models = {
  Tenant: Tenant(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
  RoomType: RoomType(sequelize, DataTypes),
  Room: Room(sequelize, DataTypes),
  Customer: Customer(sequelize, DataTypes),
  Booking: Booking(sequelize, DataTypes),
  Payment: Payment(sequelize, DataTypes),
  MaintenanceLog: MaintenanceLog(sequelize, DataTypes),
  Review: Review(sequelize, DataTypes),
  Setting: Setting(sequelize, DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  ...models,
  sequelize,
  Sequelize
};
