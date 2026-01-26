const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check specifically for the user in the screenshot
        const email = '30066@yenepoya.edu.in';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`\nUser Found: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`); // <--- The Moment of Truth
        } else {
            console.log(`\nUser ${email} not found!`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

checkRole();
