const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const email = process.argv[2];

if (!email) {
    console.log('Please provide an email address.');
    console.log('Usage: node make_admin.js <email>');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB...');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`SUCCESS: User ${user.name} (${user.email}) is now an ADMIN.`);
        console.log('You can now access the dashboard at /admin');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
