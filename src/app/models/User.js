import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        first_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ativo: Sequelize.BOOLEAN,

        sexo: {
          type: Sequelize.CHAR,
          allowNull: false,
        },

        ultimoLogin: Sequelize.DATE,

        gestor: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        matricula: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        last_modification_by: {
          type: Sequelize.INTEGER,
          references: {
            model: 'user',
            key: 'id',
          },
        },

        created_by: {
          type: Sequelize.INTEGER,
          references: {
            model: 'user',
            key: 'id',
          },
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },

        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  checkUserExist(req, res, next) {
    const { id } = req.params;
    const user = User.find(p => p.id === id);

    if (!user) {
      return res.status(400).json({ error: 'User não existe' });
    }
    return next();
  }
}

// User.associate = models => {
//   User.belongsToMany(models.Permission, {
//     through: models.ApplicationPermission,
//     as: 'users',
//     foreignKey: 'user_id',
//   })
// };

export default User;
