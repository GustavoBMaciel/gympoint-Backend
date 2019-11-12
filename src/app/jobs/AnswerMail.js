import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { answerMail } = data;

    await Mail.sendMail({
      to: `${answerMail.student.name}<${answerMail.student.email}>`,
      subject: 'Resposta Gympoint',
      template: 'answer',
      context: {
        student: answerMail.student.name,
        question: answerMail.question,
        answer: answerMail.question
      }
    })
  }

}

export default new AnswerMail();
