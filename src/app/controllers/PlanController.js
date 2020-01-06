import * as Yup from 'yup';
import Plans from '../models/Plan';

class PlanController {
  // Metodo de listagem
  async index(req, res) {
    const { page = 1 } = req.query;
    const plans = await Plans.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(plans);
  }

  // Metodo de criação
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });
    // Verificando se o corpo da requisição esta de acordo com o schema passado
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    // Se estiver de acordo cria o plano de matricula com os dados
    const plan = await Plans.create(req.body);
    // Retorna essa plano de matricula
    return res.json(plan);
  }

  // Metodo de atualização
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().integer(),
      price: Yup.number(),
    });
    // Verificando se o corpo da requisição esta de acordo comm o schema passado
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validatrion fails!' });
    }
    // Se estiver de acordo pesquisa a matricula desejada
    const findPlan = await Plans.findByPk(req.params.id);
    // Verifica se existe uma matricula com esse id
    if (!findPlan) {
      return res.status(400).json({ error: 'Plan not found' });
    }
    // Se encontrar o plano, faz o update e retorna os dados para o usuario
    const { id, title, price } = await findPlan.update(req.body);

    return res.json({ id, title, price });
  }

  // Metodo de show
  async show(req, res) {
    const plan = await Plans.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found with given ID' });
    }
    return res.json(plan);
  }

  // Metodo de deletar
  async delete(req, res) {
    const findPlan = await Plans.findByPk(req.params.id);
    // Verifica se o existe o plano informado
    if (!findPlan) {
      return res.status(400).json({ error: 'Plan not found' });
    }
    // Se achar faz o delete na tabela e returna uma mensagem para o usario
    findPlan.destroy();

    return res.json({ message: `Plan with id ${req.params.id} deleted` });
  }
}

export default new PlanController();
