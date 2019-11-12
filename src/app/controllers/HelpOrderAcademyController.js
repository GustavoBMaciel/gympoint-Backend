import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderAcademyController{
  async store(req, res){
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    //Verifica de o corpo da requiisição está valido.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    //Verifica se o id passado pertence a um pedido de auxilio cadastrado
    const checkOrder = await HelpOrder.findByPk(req.params.id);

    if (!checkOrder) {
      return res.status(400).json({ error: 'Help Order not found with this id' });
    }
    //Pega question do corpo da requisição
    const { answer } = req.body;
    //Cria o pedido de auxilio no banco de dados
    const helpOrders = await checkOrder.update({
      answer,
      answer_at: new Date()
    });
    //Envia o email
    const answerMail = await HelpOrder.findByPk(helpOrders.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        }
      ]
    });

    await Queue.add(AnswerMail.key, {
      answerMail,
    })

    //retorna os dados desse pedido
    return res.json(helpOrders);
  }
}

export default new HelpOrderAcademyController();
