import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  //Pegando o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;
  //Verificando se existe o token
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  //Pegando somente o token caso exista
  const [, token] = authHeader.split(' ');
  //verificando se no token contem o ID do usuario, coforme foi definido
  try{
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userID = decoded.id;

    return next();
  }catch (err) {
    return res.status(401).json({ error: 'Token Invalid' });
  }

}
