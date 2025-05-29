import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { validateToken } from './middlewares/validateToken';
import loginRouter from './routes/login';
import userRouter from './routes/user';
import wavesRouter from './routes/wave';
import ticketsRouter from './routes/ticket';
import availabilityRouter from './routes/availability';

dotenv.config();

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if(!req.originalUrl.startsWith('/api-docs')) {
    validateToken({ req, res, next });
  } else {
    next();
  }
})

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST com Express e TypeScript',
      version: '1.0.0',
      description: 'Uma API REST construída com Express e TypeScript'
    },
    servers: [
      {
        url: `http://localhost:${process.env.API_PORT}`,
        description: 'Servidor de desenvolvimento'
      }
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api', loginRouter);

app.use('/api/user', userRouter);

app.use('/api/waves', wavesRouter);

app.use('/api/tickets', ticketsRouter);

app.use('/api/availability', availabilityRouter);

export default app;