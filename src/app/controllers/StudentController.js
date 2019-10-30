import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController{
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().integer().required(),
      weight: Yup.number().required(),
      height: Yup.number().required()
    });
    //Verificando se o schema está valido( se os campos foram preenchidos)
    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails!'});
    }
    //Verificando se existe um estudante com o email informado no corpo da requisição
    const studentExists = await Student.findOne({ where: { email: req.body.email }});
    if(studentExists) {
      return res.status(400).json({ error: 'Student already exists with this email!'})
    }
    //Caso não exista, cria o estudante com os dados informados
    const { id, name, email, age, weight, height } = await Student.create(req.body);
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }

}

export default new StudentController();
