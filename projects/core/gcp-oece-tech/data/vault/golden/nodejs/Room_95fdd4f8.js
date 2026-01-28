module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    room_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room_types',
        key: 'id'
      }
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'out_of_order'),
      defaultValue: 'available',
      validate: {
        isIn: [['available', 'occupied', 'maintenance', 'out_of_order']]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'rooms',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['tenant_id', 'room_number']
      },
      {
        fields: ['tenant_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['room_type_id']
      }
    ]
  });

  // Instance methods
  Room.prototype.isAvailable = function() {
    return this.status === 'available';
  };

  Room.prototype.isOccupied = function() {
    return this.status === 'occupied';
  };

  Room.prototype.isUnderMaintenance = function() {
    return this.status === 'maintenance' || this.status === 'out_of_order';
  };

  // Define associations
  Room.associate = (models) => {
    // A room belongs to a tenant
    Room.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant'
    });

    // A room belongs to a room type
    Room.belongsTo(models.RoomType, {
      foreignKey: 'room_type_id',
      as: 'roomType'
    });

    // A room has many bookings
    Room.hasMany(models.Booking, {
      foreignKey: 'room_id',
      as: 'bookings'
    });

    // A room has many maintenance logs
    Room.hasMany(models.MaintenanceLog, {
      foreignKey: 'room_id',
      as: 'maintenanceLogs'
    });
  };

  return Room;
};
