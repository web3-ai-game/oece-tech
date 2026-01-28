module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
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
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {},
      get() {
        const rawValue = this.getDataValue('preferences');
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
    tableName: 'customers',
    timestamps: true,
    indexes: [
      {
        fields: ['tenant_id']
      },
      {
        fields: ['email']
      },
      {
        fields: ['tenant_id', 'email']
      }
    ]
  });

  // Instance methods
  Customer.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`.trim();
  };

  Customer.prototype.getAge = function() {
    if (!this.date_of_birth) return null;
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Define associations
  Customer.associate = (models) => {
    // A customer belongs to a tenant
    Customer.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant'
    });

    // A customer has many bookings
    Customer.hasMany(models.Booking, {
      foreignKey: 'customer_id',
      as: 'bookings'
    });

    // A customer has many reviews
    Customer.hasMany(models.Review, {
      foreignKey: 'customer_id',
      as: 'reviews'
    });
  };

  return Customer;
};
