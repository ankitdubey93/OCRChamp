import { Pool } from 'pg';
import { env } from '../config/env';

const pool = new Pool({
  host: env.PG_HOST,
  port: env.PG_PORT,
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  database: env.PG_DATABASE,
});

export default pool;
