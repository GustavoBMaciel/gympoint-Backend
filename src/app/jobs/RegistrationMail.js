import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }){
    const { registrationEmail } = data;

    await Mail.sendMail({
      to: `${registrationEmail.student.name}<${registrationEmail.student.email}>`,
      subject: 'Matrícula Gympoint',
      template: 'registration',
      context: {
        student: registrationEmail.student.name,
        title: registrationEmail.plan.title,
        price: registrationEmail.plan.price,
        date_start: format(parseISO(registrationEmail.start_date)," 'dia' dd 'de' MMMM', às' H:mm'h' ",{
          locale: pt,
        }),
        date_end: format(parseISO(registrationEmail.end_date), " 'dia' dd 'de' MMMM', às' H:mm'h' ",{
          locale: pt,
        }),
      }
    })
  }
}

export default new RegistrationMail();
