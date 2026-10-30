const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express Auth API Documentation",
      version: "1.0.0",
      description:
        "API Documentation for Authentication and Authorization System",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Route file gulo scan korar jonno path
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
