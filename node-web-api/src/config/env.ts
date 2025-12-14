import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  mongodb: {
    uri: string;
    dbName: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  bcrypt: {
    rounds: number;
  };
  cors: {
    origin: string | string[] | boolean;
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  upload: {
    maxFileSize: number;
    uploadDir: string;
  };
  logging: {
    level: string;
    logDir: string;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

export const env: EnvConfig = {
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  apiVersion: getEnvVar('API_VERSION', 'v1'),
  mongodb: {
    uri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/ces-lms'),
    dbName: getEnvVar('MONGODB_DB_NAME', 'ces-lms'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET', 'your-super-secret-refresh-key-change-in-production'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '30d'),
  },
  bcrypt: {
    rounds: parseInt(getEnvVar('BCRYPT_ROUNDS', '12'), 10),
  },
  cors: {
    origin: (() => {
      const origin = process.env.CORS_ORIGIN || '*';
      // If CORS_ORIGIN is '*' or not set, allow all origins
      if (origin === '*') {
        return true; // Allow all origins
      }
      // Support multiple origins separated by comma
      return origin.includes(',') ? origin.split(',').map(o => o.trim()) : origin;
    })(),
    credentials: getEnvVar('CORS_CREDENTIALS', 'true') === 'true',
  },
  rateLimit: {
    windowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    maxRequests: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  },
  upload: {
    maxFileSize: parseInt(getEnvVar('MAX_FILE_SIZE', '10485760'), 10),
    uploadDir: getEnvVar('UPLOAD_DIR', 'uploads'),
  },
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
    logDir: getEnvVar('LOG_DIR', 'logs'),
  },
};

