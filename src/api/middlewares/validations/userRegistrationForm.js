import moment from 'moment';
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import isISO8601 from 'validator/lib/isISO8601';
import PasswordValidator from 'password-validator';
import InvalidInputError from '../../../core/errors/InvalidInputError';
import validateMobileNumber from '../../helpers/validateMobileNumber';
import { OTHER, MALE, FEMALE } from '../../../core/constants/user';

export default async function validateUserRegistrationForm(req, res, next) {
    const formErrors = {};
    // eslint-disable-next-line no-useless-escape
    const speacialCharsRegEx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const {

        firstName,
        lastName,
        birthDate,
        gender,
        password,
        address,
        confirmPassword,
        email,
        mobileNumber

    } = req.body;


    if (!firstName) {
        formErrors.firstName = 'First name is required';
    }

    if (firstName && speacialCharsRegEx.test(firstName)) {
        formErrors.firstName = 'First name cannot contains speacial characters';
    }



    if (!lastName) {
        formErrors.lastName = 'Last name is required';
    }

    if (lastName && speacialCharsRegEx.test(lastName)) {
        formErrors.lastName = 'Last name cannot contains speacial characters';
    }

    if (!mobileNumber) {
        formErrors.mobileNumber = 'Mobile Number is required';
    }
    const cleanedMobileNumber = validateMobileNumber(mobileNumber);

    if (mobileNumber && !cleanedMobileNumber) {
        formErrors.mobileNumber = 'Invalid mobile number';
    }

    if (!address) {
        formErrors.address = 'Address is required';
    }
    if (!birthDate) {
        formErrors.birthDate = 'Date of birth is required';
    }
    if (birthDate) {
        const isValidDate = isISO8601(birthDate);
        if (isValidDate) {
            if (moment(birthDate).isBefore('1900-01-01')) {
                formErrors.birthDate = 'Date of birth must be greater than 01-01-1900';
            }
            if (moment(birthDate).isAfter(new Date())) {
                formErrors.birthDate = 'Date of birth must be lesser than present date';
            }
        }
        if (!isValidDate) {
            formErrors.birthDate = 'Date of birth is invalid';
        }
    }
    if (!gender) {
        formErrors.gender = 'Gender is required';
    }
    if (gender && ![MALE, FEMALE, OTHER].includes(gender)) {
        formErrors.gender = 'Invalid gender value';
    }
    if (email) {
        if (!isEmail(email)) {
            formErrors.email = 'Email address is invalid';
        }
    }
    if (!password) {
        formErrors.password = 'Password is required';
    }

    if (password && !isByteLength(password, { min: 6, max: 12 })) {
        formErrors.password = 'Password length should between 6 and 12 letters';
    }

    if (password) {
        // Create a schema
        const schema = new PasswordValidator();

        // Add properties to it
        schema
            .has()
            .not()
            .spaces(); // Should not have spaces

        if (!schema.validate(password)) {
            formErrors.password = 'Password cannot contain spaces';
        }
    }

    if (!confirmPassword) {
        formErrors.confirmPassword = 'Confirm password is required';
    }
    if (password && confirmPassword) {
        if (password !== confirmPassword) {
            formErrors.password = 'Password do not match';
        }
    }

    if (Object.entries(formErrors).length !== 0 && formErrors.constructor === Object) {
        return next(new InvalidInputError('Invalid inputs', formErrors));
    }
    return next();
}
