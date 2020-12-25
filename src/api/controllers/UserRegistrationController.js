import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS, JWT_EXPIRY } from '../../core/constants';
import InternalServerError from '../../core/errors/InternalServerError';
import User from '../models/User';
import logger from '../../core/logger';
import { GENERATE_TOKEN } from '../helpers/generateJWTToken';

class UserRegistrationController {

    static async registerUser(req, res, next) {

        const {
            firstName,
            lastName,
            gender,
            mobileNumber,
            birthDate,
            email,
            address,
            password
        } = req.body;
        try {

            const user = new User();

            const checkExistance = await User.find({ email: email })
            if (checkExistance.length == 0) {
                user.firstName = firstName;
                user.lastName = lastName;
                user.gender = gender;
                user.mobileNumber = mobileNumber;
                user.birthDate = birthDate;
                user.email = email;
                user.address = address;
                user.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);


                await user.save();

                const savePromisesList = [user.save()];
                const [saveUser] = await Promise.all(savePromisesList);

                if (saveUser) {
                    let tokenData = {
                        firstName: saveUser.firstName,
                        lastName: saveUser.lastName,
                        gender: saveUser.gender,
                        mobileNumber: saveUser.mobileNumber,
                        birthDate: saveUser.birthDate,
                        email: saveUser.email,
                        address: saveUser.address
                    }
                    let token = await GENERATE_TOKEN(tokenData);
                    return res.json({
                        status: 200,
                        code: 'user_registered',
                        success: true,
                        message: 'User registered successfully',
                        token,
                        userInfo: {
                            ...tokenData
                        }
                    });
                }
            } else {
                return res.json({
                    status: 200,
                    code: 'user_not_registered',
                    success: true,
                    message: 'User already register with this email'

                });
            }

            logger.error('registerUser:: Could not register user');
            const err = new InternalServerError('An error occured while saving data');
            return next(err);

        } catch (error) {
            console.log('Error in registration=', error)
            logger.error('registerUser:: An error occured');
            logger.error(error.message);
            logger.error(error.stack);
            return next(new InternalServerError('An internal server error occured!'));
        }
    }
}

export default UserRegistrationController;