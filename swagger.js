const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'electronics  Api',
        description: 'Electronics Api'
    },
    host: 'electronics-inventory-backend.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
