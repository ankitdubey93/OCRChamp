import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import healthRoutes from './routes/healthRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/invoices', invoiceRoutes);

app.use(errorHandler);

export default app;
