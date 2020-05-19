import SqliteEntities from '../entity/sql';
import MongodbEntities from '../entity/mongo';

export default (options) => {
    switch (options.name) {
        case 'SQLITE': {
            return {
                type: 'sqlite',
                database: options.database || 'butler.sqlite',
                entities: SqliteEntities,
                cli: { entitiesDir: '/src/entities/sql/' },
                ...commonConfig,
            };
        }

        case 'MONGODB': {
            return {
                type: 'mongodb',
                url: process.env.MONGODB_URI || options.URL || 'mongodb://db:27017/butler',
                entities: MongodbEntities,
                cli: { entitiesDir: '/src/entities/mongo/' },
                authSource: process.env.DB_USER || options.AUTH || 'admin',
                password: process.env.MONGO_PASSWORD || options.MONGO_PASSWORD || 'admin',
                ...commonConfig,
            };
        }
    }
};

const commonConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    logging: false,
    synchronize: true,
};
