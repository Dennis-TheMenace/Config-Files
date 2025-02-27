require('dotenv').config();

const staticAssests =
{
    development:
    {
        path: 'clientDev/'
    },
    production:
    {
        path: 'client/'
    }
};

const connections = {
    development: {
      http: {
        port: 3000,
      },
      mongo: process.env.MONGODB_URI || 'mongodb://localhost/ConfigExample',
      redis: process.env.REDISCLOUD_URL,
    },
  
    production: {
      http: {
        port: process.env.PORT || process.env.NODE_PORT || 3000,
      },
      mongo: process.env.MONGODB_URI,
      redis: process.env.REDISCLOUD_URL,
    },
};

module.exports =
{
    staticAssests: staticAssests[process.env.NODE_ENV],
    connections: connections[process.env.NODE_ENV],
    secret: process.env.SECRET
};