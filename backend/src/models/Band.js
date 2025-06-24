const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Band = sequelize.define('Band', {
    band_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    tableName: 'bands',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Band.associate = (models) => {
    Band.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Band.belongsToMany(models.User, {
      through: models.BandMember,
      foreignKey: 'band_id',
      as: 'members'
    });

    Band.hasMany(models.Rehearsal, {
      foreignKey: 'band_id',
      as: 'rehearsals'
    });
  };

  return Band;
};