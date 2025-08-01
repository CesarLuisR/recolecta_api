interface AppConfig {
    port: number;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    origin: string;
    ENV: string;
    SMTP: {
        host: string;
        user: string;
        pass: string;
    }
    db: {
        user: string;
        host: string;
        database: string;
        password?: string;
        port: number;
    };
    external: {
        cedula_validator_api: string;
    }
}

const config: AppConfig = {
    port: parseInt(process.env.PORT || '5000'),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "otrosecreto",
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    ENV: process.env.NODE_ENV || 'production',
    SMTP: {
        host: process.env.SMTP_HOST || "",
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || ""
    },
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'my_drive',
        password: process.env.DB_PASS || 'cesarluis2005',
        port: parseInt(process.env.DB_PORT || '5432'),
    },
    external: {
        cedula_validator_api: process.env.CEDULA_API || ""
    }
};

export default config;