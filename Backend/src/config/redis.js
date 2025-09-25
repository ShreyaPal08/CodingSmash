const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSW,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12637
    }
});

module.exports=redisClient;