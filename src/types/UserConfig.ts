export interface IUserConfig {
    NAME: string;

    PAIRS: {
        [key: string]: {
            FEE: number;
        };
    };

    WALLETS: {
        [key: string]: {
            ADDRESS: string;
            SECRET: string;
        };
    };

    BLOCKCHAIN_PROVIDER?: {
        INFURA?: string;
    };

    PRICE: {
        PROVIDER: string;
        API_KEY: string;
        SECRET_KEY?: string;
        UPDATE_INTERVAL: number;
    };

    EXCHANGE: {
        NAME: string;
        API_KEY: string;
        SECRET_KEY: string;
    };

    NOTIFICATIONS: {
        EMAIL: {
            ENABLED: boolean;
            SERVICE: string;
            USERNAME: string;
            PASSWORD: string;
            FROM: string;
            TO: string;
            SUBJECT: string;
        };
        SLACK: {
            ENABLED: boolean;
            WEBHOOK_URL: string;
        };
    };

    AGGREGATOR_URL: string;
    TRACKER_URL: string;
    JELLY_PRICE_PROVIDER: string;

    SERVER: { PORT: number };

    DATABASE: {
        ACTIVE: string;

        MONGODB: {
            URL: string;
            AUTH: string;
            MONGO_PASSWORD: string;
        };
        SQLITE: {
            database: string;
        };
    };
}
