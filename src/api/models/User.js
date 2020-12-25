import mongoose from 'mongoose';
import UserSchema from '../schemas/UserSchema';

const User = mongoose.model('User', UserSchema);
export default User;