import SqliteEntities from '../entity/sql';

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
    }
};

const commonConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    logging: false,
    synchronize: true,
};
