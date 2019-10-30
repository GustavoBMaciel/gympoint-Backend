import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });
    //Verificando se o schema está valido( se os campos foram preenchidos)
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails.'});
    }
    //pegando os dados do corpo da requisição
    const { email, password } = req.body;
    //buscando os dados do usuario de acordo com o email passado
    const user = await User.findOne({ where: { email } });
    //verificando se o usuario com este email existe no banco de dados
    if(!user) {
      return res.status(401).json({ error: 'User not found'});
    }
    //verificando se a senha que foi informada é valida
    if(!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match'});
    }
    //pegando id e nome do usuario retornado para exibir na tela
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  };
}

export default new SessionController();
