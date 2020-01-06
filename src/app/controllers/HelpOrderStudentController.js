import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderStudentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const orders = await HelpOrder.findAll({
      where: {
        student_id: req.params.id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    // Verifica de o corpo da requiisição está valido.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Verifica se o id passado pertence a um estudante cadastrado
    const checkStudent = Student.findByPk(req.params.id);

    if (!checkStudent) {
      return res.status(400).json({ error: 'Student not found with this id' });
    }
    // Pega question do corpo da requisição
    const { question } = req.body;
    // Cria o pedido de auxilio no banco de dados
    const helpOrders = await HelpOrder.create({
      student_id: req.params.id,
      question,
    });
    // retorna os dados desse pedido
    return res.json(helpOrders);
  }
}
export default new HelpOrderStudentController();
