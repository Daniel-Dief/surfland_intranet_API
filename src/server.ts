import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger: http://localhost:${process.env.API_PORT}/api-docs`);
});