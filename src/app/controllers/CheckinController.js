import { getDate, parseISO } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';


class CheckinController {
  async store(req, res){
    const checkinID = req.params.id;
    //Verifica se o id existe como um estudante
    const student = await Student.findByPk(checkinID);
    if (!student) {
      return res.status(400).json({error: 'Student not found with this id'});
    }
    //Verifica se o estudante ja fez os 5 checkins no prazo de 7 dias
    const checkCheckin = await Checkin.findAll({
      where: { student_id: checkinID },
      order: [['id', 'DESC']],
      limit: 5
    })
    const checkinInitial = getDate(checkCheckin[0].createdAt);
    const checkinFinal = getDate(checkCheckin[4].createdAt);

    if(checkinInitial - checkinFinal < 7){
      return res.status(400).json({error: "you've done more than 5 chechkins in 7 days"})
    }
    //cria o checkin do estudante
    const checkin = await Checkin.create({
      student_id: checkinID,
    });
    //retorna os dados desse estudante
    return res.json(checkCheckin);
  }
  async index(req, res){
    const checkin = await Checkin.findAll({
      where:{
        student_id: req.params.id
      },
      include:[
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        }
      ]
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
