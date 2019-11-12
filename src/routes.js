import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderStudentController from './app/controllers/HelpOrderStudentController';
import HelpOrderAcademyController from './app/controllers/HelpOrderAcademyController';

import authMiddleware from './app/middlewares/auth';


const routes = new Router();

routes.post('/sessions', SessionController.store);
//checkin
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);
//help_orders
routes.post('/students/:id/help-orders', HelpOrderStudentController.store);
routes.get('/students/:id/help-orders', HelpOrderStudentController.index);


routes.use(authMiddleware);
routes.post('/students', StudentController.store);
//plans
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);
//registrations
routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);
//help_orders
routes.put('/help-orders/:id/answer', HelpOrderAcademyController.store);

export default routes;
