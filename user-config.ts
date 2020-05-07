export default {
    // ================== BASIC ==================
    NAME: 'NODE_NAME',

    // Traiding pairs
    PAIRS: {
        'BTC-USDC': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'BTC-WBTC': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'ETH-USDC': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'BTC-DAI': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'ETH-DAI': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'DAI-ETH': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'USDC-ETH': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },

        'BTC-ETH': {
            FEE: 0.01,
            SLIPPAGE: 0.01,
        },
    },

    // WALLET SETUP
    WALLETS: {
        //ETH provider wallet
        //Should be different than your ERC20 provider wallet
        ETH: {
            ADDRESS: '',
            // Ethereum Private Key
            SECRET: '',
        },

        BTC: {
            ADDRESS: '',
            // BIP39 mnemonic
            SECRET: '',
        },

        AE: {
            ADDRESS: '',
            // Aeternity Key Pair
            SECRET: {
                publicKey: '',
                secretKey: '',
            },
        },

        //Use one common ETH address for all ERC20 tokens
        //Should be different than your ETH provider wallet
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
        PROVIDER: 'cryptocompare',
        API_KEY: '',
        SECRET_KEY: '',
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

    AGGREGATOR_URL: 'https://network.jelly.market/api/v1/info/update',

    SERVER: { PORT: 9000 },

    // ================== Database configuration ==================
    //options: mongodb or sqlite
    DATABASE: {
        ACTIVE: 'SQLITE',

        MONGODB: {
            //Docker Setup
            URL: 'mongodb://localhost:27017/butler',
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
