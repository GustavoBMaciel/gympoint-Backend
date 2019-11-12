import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController  {
  async index(req, res){
    const registration = await Registration.findAll({
      order: ['start_date'],
      attributes: ['id', 'start_date', 'end_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id','name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id','title', 'price'],
        },
      ],
    });

    return res.json(registration);
  }
  async store(req, res){
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    //Verifica se o schema esta valido
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails'});
    }
    //pega as informações do corpo da requisição
    const { student_id, plan_id, start_date } = req.body;
    //verifica se tem estudante com o id passado
    const chekStudent = await Student.findByPk(student_id);
    if(!chekStudent) {
      return res.status(400).json({error: 'Student not found with given ID'})
    }
    //Verifica se tem plano com id passado
    const checkPlan = await Plan.findByPk(plan_id);
    if(!checkPlan) {
      return res.status(400).json({error: 'Plan not found with given ID'})
    }
    //Adiciona a quantidade de meses na data informada de acordo com o plano
    const parsedDate = parseISO(start_date);//"2019-11-06T15:00:00-03:00" checkPlan.duration = 3
    const month = addMonths(new Date(parsedDate), checkPlan.duration);//2020-02-06T18:00:00.000Z
    //Grava as informações no banco
    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      price: (checkPlan.price * checkPlan.duration),
      end_date: month
    });

    const registrationEmail = await Registration.findByPk(registration.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price'],
        }
      ]
    });

    await Queue.add(RegistrationMail.key, {
      registrationEmail,
    })

    //Retorna ao usuario as informações cadastradas
    return res.json(registration);
  }
  async update(req, res){
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation Fails'});
    }
    //pega as informações do corpo da requisição
    const { student_id, plan_id, start_date } = req.body;
    //verifica se tem estudante com o id passado
    const chekStudent = await Student.findByPk(student_id);
    if(!chekStudent) {
      return res.status(400).json({error: 'Student not found with given ID'})
    }
    //Verifica se tem plano com id passado
    const checkPlan = await Plan.findByPk(plan_id);
    if(!checkPlan) {
      return res.status(400).json({error: 'Plan not found with given ID'})
    }
    //Traz os dados da matricula informado no cabeçalho da requisição
    const registration = await Registration.findByPk(req.params.id);
    //Adiciona a quantidade de meses na data informada de acordo com o plano
    const parsedDate = parseISO(start_date);//"2019-11-06T15:00:00-03:00" checkPlan.duration = 3
    const month = addMonths(new Date(parsedDate), checkPlan.duration);//2020-02-06T18:00:00.000Z
    //Grava as informações no banco
    const registrationUpdatde = await registration.update({
      student_id,
      plan_id,
      start_date,
      price: (checkPlan.price * checkPlan.duration),
      end_date: month
    });

    return res.json(registrationUpdatde);
  }
  async delete(req, res){
    const registration = await Registration.findByPk(req.params.id);
    //Verifica se o existe o plano informado
    if(!registration){
      return res.status(400).json({error: 'Registration not found'});
    }
    //Se achar faz o delete na tabela e returna uma mensagem para o usario
    registration.destroy();

    return res.json({message: `Registration with id ${req.params.id} deleted`})
  }
}

export default new RegistrationController();
