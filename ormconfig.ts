import AppConfig from './config';

export = {
    type: 'mongodb',
    url: process.env.MONGODB_URI || AppConfig.MONGODB.URL || 'mongodb://db:27017/butler',
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['/src/migration/**/*.ts'],
    subscribers: ['/src/subscriber/**/*.ts'],
    cli: {
        entitiesDir: '/src/entities',
        migrationsDir: '/src/migration',
        subscribersDir: '/src/subscriber',
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.DB_USER || AppConfig.MONGODB.AUTH || 'admin',
    password: process.env.MONGO_PASSWORD || AppConfig.MONGODB.MONGO_PASSWORD || 'admin',
};
