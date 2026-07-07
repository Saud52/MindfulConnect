const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not set. Ensure backend/.env is loaded correctly.');
        }

        const dnsServers = (process.env.MONGO_DNS_SERVERS || '8.8.8.8,1.1.1.1')
            .split(',')
            .map((server) => server.trim())
            .filter(Boolean);

        dns.setServers(dnsServers);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB Connected...'); // Simplified message for initial check
    } catch (err) {
        console.error(`Error: ${err.message}`);
        if (err.message.includes('querySrv')) {
            console.error('MongoDB SRV lookup failed. Check DNS/network or set MONGO_DNS_SERVERS in .env.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;


// const mongoose = require('mongoose');
// const dns = require('dns');

// const connectDB = async () => {
//     try {
//         const dnsServers = (process.env.MONGO_DNS_SERVERS || '8.8.8.8,1.1.1.1')
//             .split(',')
//             .map((server) => server.trim())
//             .filter(Boolean);

//         dns.setServers(dnsServers);

//         await mongoose.connect(process.env.MONGO_URI, {
//             serverSelectionTimeoutMS: 10000,
//         });
//         console.log('MongoDB Connected...'); // Simplified message for initial check
//     } catch (err) {
//         console.error(`Error: ${err.message}`);
//         if (err.message.includes('querySrv')) {
//             console.error('MongoDB SRV lookup failed. Check DNS/network or set MONGO_DNS_SERVERS in .env.');
//         }
//         process.exit(1);
//     }
// };

// module.exports = connectDB;