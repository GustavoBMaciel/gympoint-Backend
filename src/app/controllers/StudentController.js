import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { nameStudent, page = 1 } = req.query;
    const { Op } = Sequelize;

    if (nameStudent) {
      const student = await Student.findAll({
        where: {
          name: { [Op.like]: `%${nameStudent}%` },
        },
        limit: 10,
        offset: (page - 1) * 10,
      });
      return res.json(student);
    }

    const student = await Student.findAll();
    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
    // Verificando se o schema está valido( se os campos foram preenchidos)
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    // Verificando se existe um estudante com o email informado no corpo da requisição
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'Student already exists with this email!' });
    }
    // Caso não exista, cria o estudante com os dados informados
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    // pega as informações do corpo da requisição
    const { name, email, age, weight, height } = req.body;
    // Verifica se tem estudante com id passado
    const checkStudent = await Student.findByPk(req.params.id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student not found with given ID' });
    }
    // Grava as informações no banco
    const studentUpdate = await checkStudent.update({
      name,
      email,
      age,
      weight,
      height,
    });

    return res.json(studentUpdate);
  }

  async show(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found with given ID' });
    }
    return res.json(student);
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);
    // Verifica se o existe o aluno informado
    if (!student) {
      return res.status(400).json({ error: 'Student not exist' });
    }
    // Se achar faz o delete na tabela e retorna uma mensagem para o usuario
    student.destroy();

    return res.json({
      message: `Student with id ${req.params.id} deleted`,
    });
  }
}

export default new StudentController();
