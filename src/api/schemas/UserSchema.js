import { Schema } from 'mongoose';
import {
    MALE,
    FEMALE,
    OTHER
} from '../../core/constants/user';

const UserSchema = new Schema(
    {
        firstName: Schema.Types.String,
        lastName: Schema.Types.String,
        gender: {
            type: Schema.Types.String,
            enum: [MALE, FEMALE, OTHER]
        },
        address: { type: Schema.Types.String },
        birthDate: {
            type: Schema.Types.String,
            get: function getDate(value) {
                const d = new Date(value);
                const date = d.getDate();
                const month = d.getMonth() + 1;
                const year = d.getFullYear();
                const dateStr = `${year}-${month}-${date}`;
                return dateStr;
            }
        },
        mobileNumber: { type: Schema.Types.String, index: true },
        email: { type: Schema.Types.String, index: true },
        password: Schema.Types.String,
    },
    { collection: 'users', timestamps: true, autoIndex: false }
);

export default UserSchema;
