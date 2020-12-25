import jwt from 'jsonwebtoken';
import { JWT_EXPIRY, JWT_SECRET, JWT_AUTH } from '../../core/constants';

export function GENERATE_TOKEN(uData) {
    console.log('In Generate token=', uData)
    return new Promise((res, rej) => {
        jwt.sign(uData, JWT_SECRET, { expiresIn: JWT_EXPIRY, issuer: JWT_AUTH }, (err, token) => {
            if (err) { rej(err); }
            res(token);
        });
    });
};
