import phone from 'phone';

export default function validateMobileNumber(mobileNumber) {
    const isValid = phone(mobileNumber);
    if (isValid.length < 0) {
        return false;
    }
    return isValid[0];
}
