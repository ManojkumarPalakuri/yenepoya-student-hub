const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = '12345@yenepoya.edu.in';
        const user = await User.findOne({ email }).select('+password');

        if (user) {
            console.log('User FOUND:', user.email);
            console.log('Role:', user.role);
            console.log('Verified:', user.isVerified);
            console.log('Password Hash exists:', !!user.password);
        } else {
            console.log('User NOT FOUND');
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

checkUser();
