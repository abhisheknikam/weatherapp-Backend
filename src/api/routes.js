import { Router } from 'express';

// Middlewares
import cors from 'cors';
import validateLoginForm from './middlewares/validations/validateLoginForm';
import verifyAccessToken from './middlewares/verifyAccessToken';
import validateUserRegistrationForm from './middlewares/validations/userRegistrationForm';

// Controllers
import UserRegistrationController from './controllers/UserRegistrationController';

import WeatherController from './controllers/WeatherController';
import AuthController from './controllers/AuthController';


const routes = Router();

routes.post(
    '/register',
    validateUserRegistrationForm,
    UserRegistrationController.registerUser
);

routes.post(
    '/login',
    validateLoginForm,
    AuthController.doLoginAttempt
);

routes.post(
    '/get-weather',
    WeatherController.getWeather
);

routes.get('/logout', verifyAccessToken, AuthController.doLogoutAttempt);

export default routes;
