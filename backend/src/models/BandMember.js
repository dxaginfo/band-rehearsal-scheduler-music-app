const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const BandMember = sequelize.define('BandMember', {
    band_member_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    band_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bands',
        key: 'band_id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'member',
      validate: {
        isIn: [['admin', 'member']]
      }
    },
    instrument: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    join_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'band_members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['band_id', 'user_id']
      }
    ]
  });

  BandMember.associate = (models) => {
    BandMember.belongsTo(models.Band, {
      foreignKey: 'band_id'
    });

    BandMember.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    BandMember.hasMany(models.Attendance, {
      foreignKey: 'band_member_id',
      as: 'attendances'
    });
  };

  return BandMember;
};