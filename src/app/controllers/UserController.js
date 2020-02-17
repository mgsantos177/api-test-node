import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const {
        id,
        first_name,
        last_name,
        email,
        password,
        sexo,
        ativo,
        gestor,
        matricula,
        created_by,
        last_modification_by,
      } = req.body;

      if (first_name === undefined || first_name === '') {
        return res.status(400).json({ message: 'O campo Nome é obrigatório' });
      }

      if (last_name === undefined || last_name === '') {
        return res
          .status(400)
          .json({ message: 'O campo Sobrenome é obrigatório' });
      }

      if (email === undefined || email === '') {
        return res.status(400).json({ message: 'O campo email é obrigatório' });
      }

      if (password === undefined || password === '') {
        return res.status(400).json({ message: 'O campo Senha é obrigatório' });
      }

      if (sexo === undefined || sexo === '') {
        return res.status(400).json({ message: 'O campo Sexo é obrigatório' });
      }

      if (gestor === undefined || gestor === '') {
        return res
          .status(400)
          .json({ message: 'O campo Gestor é obrigatório' });
      }

      if (matricula === undefined || matricula === '') {
        return res
          .status(400)
          .json({ message: 'O campo Matrícula é obrigatório' });
      }

      const UserExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (UserExists) {
        return res
          .status(400)
          .json({ message: 'Email já existente no portal' });
      }

      const matriculaExists = await User.findOne({
        where: { matricula: req.body.matricula },
      });

      if (matriculaExists) {
        return res
          .status(400)
          .json({ message: 'Matrícula já existente no portal' });
      }

      await User.create(req.body);

      return res.json({
        id,
        first_name,
        last_name,
        email,
        password,
        sexo,
        ativo,
        gestor,
        matricula,
        created_by,
        last_modification_by,
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  async listar(req, res) {
    const user = await User.sequelize.query(
      "select a.*, (b.first_name||' '||b.last_name) as creator, (c.first_name||' '||c.last_name) as modificator from users as a join users as b ON a.created_by = b.id join users as c ON a.last_modification_by = c.id"
    );
    return res.json(user[0]);
  }

  // async listar(req, res) {
  //  try{
  //   const users = await User.findAll({
  //   });

  //   return res.json({
  //     users,

  //   });
  //  }catch(error){
  //   res.status(401).json({ error: 'error'});
  //   console.log(error)
  //  }
  // }

  async getOneUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.sequelize.query(
        "select a.*, (b.first_name||' '||b.last_name) as creator, (c.first_name||' '||c.last_name) as modificator from users as a join users as b ON a.created_by = b.id join users as c ON a.last_modification_by = c.id where a.id=" +
          id
      );
      return res.json(user[0]);
    } catch (err) {
      return res.status(401).json({ error: 'User not exists' });
    }
  }

  async ultimoLogin(id) {
    try {
      const user = await User.update(
        {
          ultimoLogin: new Date().toLocaleString(),
        },
        {
          where: {
            id,
          },
        }
      );

      return console.log(new Date().toLocaleString());
    } catch (err) {
      console.log(err);
    }
  }

  async createDate(id) {
    try {
      const user = await User.update(
        {
          creation_date: new Date(),
        },
        {
          where: {
            id,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      ativo,
      sexo,
      gestor,
      matricula,
      last_modification_by,
    } = req.body;

    try {
      const user = await User.update(
        {
          first_name,
          last_name,
          ativo,
          sexo,
          gestor,
          matricula,
          last_modification_by,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.json({ message: 'Usuario Alterado' });
    } catch (err) {
      return res.status(400).json({ message: err + 'erro na alteração' });
    }
  }
}

export default new UserController();
