module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define('Tenant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isURL: true
      }
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {},
      get() {
        const rawValue = this.getDataValue('settings');
        return rawValue ? JSON.parse(JSON.stringify(rawValue)) : {};
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'tenants',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['domain']
      }
    ]
  });

  // Define associations
  Tenant.associate = (models) => {
    // A tenant has many users
    Tenant.hasMany(models.User, {
      foreignKey: 'tenant_id',
      as: 'users',
      onDelete: 'CASCADE'
    });

    // A tenant has many room types
    Tenant.hasMany(models.RoomType, {
      foreignKey: 'tenant_id',
      as: 'roomTypes',
      onDelete: 'CASCADE'
    });

    // A tenant has many rooms
    Tenant.hasMany(models.Room, {
      foreignKey: 'tenant_id',
      as: 'rooms',
      onDelete: 'CASCADE'
    });

    // A tenant has many customers
    Tenant.hasMany(models.Customer, {
      foreignKey: 'tenant_id',
      as: 'customers',
      onDelete: 'CASCADE'
    });

    // A tenant has many bookings
    Tenant.hasMany(models.Booking, {
      foreignKey: 'tenant_id',
      as: 'bookings',
      onDelete: 'CASCADE'
    });

    // A tenant has many payments
    Tenant.hasMany(models.Payment, {
      foreignKey: 'tenant_id',
      as: 'payments',
      onDelete: 'CASCADE'
    });

    // A tenant has many maintenance logs
    Tenant.hasMany(models.MaintenanceLog, {
      foreignKey: 'tenant_id',
      as: 'maintenanceLogs',
      onDelete: 'CASCADE'
    });

    // A tenant has many reviews
    Tenant.hasMany(models.Review, {
      foreignKey: 'tenant_id',
      as: 'reviews',
      onDelete: 'CASCADE'
    });

    // A tenant has many settings
    Tenant.hasMany(models.Setting, {
      foreignKey: 'tenant_id',
      as: 'settings',
      onDelete: 'CASCADE'
    });
  };

  return Tenant;
};
