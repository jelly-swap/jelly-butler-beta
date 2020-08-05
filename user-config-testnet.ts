export default {
    // ================== BASIC ==================
    NAME: 'TESTNET_BUTLER',

    // Traiding pairs
    PAIRS: {
        'AVAX-ETH': {
            FEE: 0.01,
        },

        'ETH-AVAX': {
            FEE: 0.01,
        },
    },

    // WALLET SETUP
    WALLETS: {
        //ETH provider wallet
        //Should be different than your ERC20 provider wallet
        ETH: {
            ADDRESS: '',
            // Ethereum Private Key
            SECRET: '3ee89553f5524191a80a4230b015a0781898b2d97b7d74fc16e027604b05ff3c',
        },

        AVAX: {
            ADDRESS: '',
            // Avalanche Private Key
            SECRET: '',
        },

        BTC: {
            ADDRESS: '',
            // BIP39 mnemonic
            SECRET: '',
        },

        AE: {
            ADDRESS: '',
            // Aeternity Private key
            SECRET: '',
        },

        //Use one common ETH address for all ERC20 tokens!
        //Should be different than your ETH provider wallet!
        DAI: {
            ADDRESS: '',
            // Ethereum Private Key
            SECRET: '',
        },

        USDC: {
            ADDRESS: '',
            // Ethereum Private Key
            SECRET: '',
        },

        WBTC: {
            ADDRESS: '',
            // Ethereum Private Key
            SECRET: '',
        },
    },

    // PRICE PROVIDER
    PRICE: {
        PROVIDER: 'Testnet',
        API_KEY: '',
        SECRET_KEY: '',
        UPDATE_INTERVAL: 30,
    },

    // REBALANCE
    EXCHANGE: {
        NAME: '',
        API_KEY: '',
        SECRET_KEY: '',
    },

    // NOTIFICATIONS
    NOTIFICATIONS: {
        EMAIL: {
            ENABLED: false,
            SERVICE: 'gmail',
            USERNAME: '',
            PASSWORD: '',
            FROM: '',
            TO: '',
            SUBJECT: 'JELLY',
        },
        SLACK: {
            ENABLED: false,
            WEBHOOK_URL: '', //https://hooks.slack.com/services/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
        },
    },

    // ================== ADVANCED ==================

    AGGREGATOR_URL: 'https://jelly-jam-testnet.herokuapp.com/api/v1/info',
    TRACKER_URL: 'jelly-tracker-testnet.herokuapp.com',

    SERVER: { PORT: 9000 },

    // ================== Database configuration ==================
    //options: MONGODB or SQLITE
    DATABASE: {
        ACTIVE: 'SQLITE',

        MONGODB: {
            //Docker Setup
            URL: 'mongodb://db:27017/butler',
            AUTH: 'admin',
            MONGO_PASSWORD: process.env.MONGO_PASSWORD,

            //Manual setup
            //URL: 'mongodb://localhost:27017/butler',
        },
        SQLITE: {
            database: 'butler.sqlite',
        },
    },
};
