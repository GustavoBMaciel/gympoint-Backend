import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  //Definindo os campos que serão informados
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
    },
      {
        sequelize,
      }
    );
    //Adicionando um hook para criptografar a senha antes de salvar
    this.addHook('beforeSave', async (user) => {
      if(user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }
  //Metodo para verificar se a senha bate com a criptografia que esta no banco.
  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
