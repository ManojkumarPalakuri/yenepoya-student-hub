const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const resetUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = '12345@yenepoya.edu.in'; // Default test user
        const newPassword = 'password123';

        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found. Creating new admin user...');
            user = new User({
                name: 'Test Student',
                email: email,
                role: 'student',
                isVerified: true,
                password: bcrypt.hashSync(newPassword, 10)
            });
        } else {
            console.log('User found. Updating password...');
            user.password = bcrypt.hashSync(newPassword, 10);
            user.isVerified = true; // Ensure verified
        }

        await user.save();
        console.log(`SUCCESS: Password for ${email} set to: ${newPassword}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

resetUser();
