const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config({ path: './.env' });

const products = [
    {
        name: 'University Tie',
        price: 150,
        category: 'Merchandise',
        imageUrl: 'https://placehold.co/300x300?text=University+Tie',
        description: 'Official Yenepoya University Tie'
    },
    {
        name: 'Uniform Shirt',
        price: 500,
        category: 'Uniform',
        imageUrl: 'https://placehold.co/300x300?text=Uniform+Shirt',
        description: 'Standard issue uniform shirt'
    },
    {
        name: 'University T-Shirt',
        price: 350,
        category: 'Merchandise',
        imageUrl: 'https://placehold.co/300x300?text=University+T-Shirt',
        description: 'Casual T-Shirt with Logo'
    },
    {
        name: 'Shoes',
        price: 900,
        category: 'Uniform',
        imageUrl: 'https://placehold.co/300x300?text=Shoes',
        description: 'Black formal shoes'
    },
    {
        name: 'Record Notebook',
        price: 120,
        category: 'Stationery',
        imageUrl: 'https://placehold.co/300x300?text=Record+Notebook',
        description: 'A4 Record Notebook'
    },
    {
        name: 'ID Card Holder',
        price: 150,
        category: 'Merchandise',
        imageUrl: 'https://placehold.co/300x300?text=ID+Card+Holder',
        description: 'Official Yenepoya ID Card Holder with Strap'
    },
    {
        name: 'University Tag',
        price: 80,
        category: 'Merchandise',
        imageUrl: 'https://placehold.co/300x300?text=University+Tag',
        description: 'Premium University Lanyard Tag'
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await Product.deleteMany(); // Clear existing
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
