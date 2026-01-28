module.exports = (sequelize, DataTypes) => {
  const RoomType = sequelize.define('RoomType', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    max_occupancy: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      validate: {
        min: 1
      }
    },
    amenities: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('amenities');
        return rawValue ? JSON.parse(JSON.stringify(rawValue)) : [];
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
    tableName: 'room_types',
    timestamps: true,
    indexes: [
      {
        fields: ['tenant_id']
      },
      {
        fields: ['tenant_id', 'name']
      }
    ]
  });

  // Define associations
  RoomType.associate = (models) => {
    // A room type belongs to a tenant
    RoomType.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant'
    });

    // A room type has many rooms
    RoomType.hasMany(models.Room, {
      foreignKey: 'room_type_id',
      as: 'rooms'
    });
  };

  return RoomType;
};
