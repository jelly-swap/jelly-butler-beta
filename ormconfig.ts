import AppConfig from './config';

const db_config = {
    sqlite: {
        type: 'sqlite',
        database: AppConfig.SQLITE.database || 'butler.sqlite',
        synchronize: true,
        logging: false,
        entities: ['src/entity/sql/**/*.ts'],
        migrations: ['/src/migration/sql/**/*.ts'],
        subscribers: ['/src/subscriber/sql/**/*.ts'],
        cli: {
            entitiesDir: '/src/entities/sql/',
            migrationsDir: '/src/migration/sql/',
            subscribersDir: '/src/subscriber/sql/',
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    mongodb: {
        type: 'mongodb',
        url: process.env.MONGODB_URI || AppConfig.MONGODB.URL || 'mongodb://db:27017/butler',
        synchronize: true,
        logging: false,
        entities: ['src/entity/mongo/**/*.ts'],
        migrations: ['/src/migration/mongo/**/*.ts'],
        subscribers: ['/src/subscriber/mongo/**/*.ts'],
        cli: {
            entitiesDir: '/src/entities/mongo/',
            migrationsDir: '/src/migration/mongo/',
            subscribersDir: '/src/subscriber/mongo/',
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: process.env.DB_USER || AppConfig.MONGODB.AUTH || 'admin',
        password: process.env.MONGO_PASSWORD || AppConfig.MONGODB.MONGO_PASSWORD || 'admin',
    },
};

export = db_config[AppConfig.ACTIVE_DB];
