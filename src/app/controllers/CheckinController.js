import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const checkin = await Checkin.findAll({
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

    return res.json(checkin);
  }

  async store(req, res) {
    const checkinID = req.params.id;
    // Verifica se o id existe como um estudante
    const student = await Student.findByPk(checkinID);
    if (!student) {
      return res.status(400).json({ error: 'Student not found with this id' });
    }
    const today = Number(new Date());
    const startDate = Number(subDays(today, 7));
    const lastCheckins = await Checkin.findAll({
      where: {
        student_id: checkinID,
        created_at: { [Op.between]: [startOfDay(startDate), endOfDay(today)] },
      },
    });

    if (lastCheckins && lastCheckins.length >= 5)
      return res
        .status(401)
        .json('You can only check-in 5 times every 7 days!');

    const checkin = await Checkin.create({ student_id: checkinID });

    return res.json(checkin);
  }
}

export default new CheckinController();
