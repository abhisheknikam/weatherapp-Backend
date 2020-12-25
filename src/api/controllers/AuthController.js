import md5 from 'md5';
import logger from '../../core/logger';
import InternalServerError from '../../core/errors/InternalServerError';
import InvalidInputError from '../../core/errors/InvalidInputError';
import InvalidCredentialError from '../../core/errors/InvalidCredentialError';
import { APP_NAME } from '../../core/constants';
import { GENERATE_TOKEN } from '../helpers/generateJWTToken';
import User from '../models/User';
import bcrypt from 'bcrypt';
const debug = require('debug')(`${APP_NAME}:AuthController`);

class AuthController {

    static getShortToken(token) {
        return md5(token);
    }

    static async doLogoutAttempt(req, res, next) {
        try {
            //Your Logout logic will be here
            return res.json({
                success: true,
                code: 'logout_successfully',
                status: 200
            });
        } catch (error) {
            logger.error(error.message);
            const err = new InternalServerError();
            err.stack = error.stack;
            return next(err);
        }
    }

    static async doLoginAttempt(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email }).exec();
            if (!user) {
                const error = new InvalidCredentialError('Incorrect Email Address!');
                return next(error, false);
            }
            const isHashVerified = await bcrypt.compare(password, user.password);
            if (!isHashVerified) {
                const error = new InvalidCredentialError('Incorrect Password!');
                return next(error, false);
            }
            let tokenData = {
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                mobileNumber: user.mobileNumber,
                birthDate: user.birthDate,
                email: user.email,
                address: user.address,
                createdAt: user.createdAt
            }
            let token = await GENERATE_TOKEN(tokenData);
            const userData = { ...tokenData, token };
            return res.json({
                success: true,
                token,
                userInfo: { ...userData },
                code: 'jwt_created',
                status: 200
            });
        } catch (error) {
            logger.error(error.message);
            const err = new InternalServerError();
            err.stack = error.stack;
            return next(err);
        }
    }
}

export default AuthController;
