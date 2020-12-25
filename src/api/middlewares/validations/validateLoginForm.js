import InvalidInputError from '../../../core/errors/InvalidInputError';

export default function validateLoginForm(req, res, next) {
    const formErrors = {};

    const {
        email,
        password
    } = req.body;

    if (!email) {
        formErrors.email = 'Email field is missing';
    }

    if (!password) {
        formErrors.password = 'Password field is required';
    }

    if (Object.entries(formErrors).length !== 0 && formErrors.constructor === Object) {
        return next(new InvalidInputError('Invalid inputs', formErrors));
    }

    return next();
}
