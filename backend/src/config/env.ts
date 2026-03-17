const requiredVars = [
  'PORT',
  'FRONTEND_URL',
  'PG_HOST',
  'PG_USER',
  'PG_PASSWORD',
  'PG_DATABASE',
] as const;

for (const key of requiredVars) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  PORT: process.env['PORT'] as string,
  FRONTEND_URL: process.env['FRONTEND_URL'] as string,
  PG_HOST: process.env['PG_HOST'] as string,
  PG_PORT: Number(process.env['PG_PORT'] ?? 5432),
  PG_USER: process.env['PG_USER'] as string,
  PG_PASSWORD: process.env['PG_PASSWORD'] as string,
  PG_DATABASE: process.env['PG_DATABASE'] as string,
};
