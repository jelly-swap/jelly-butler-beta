export default {
    // ================== BASIC ==================
    NAME: 'NODE_NAME',

    // Traiding pairs
    PAIRS: {
        'BTC-ETH': {
            FEE: 0.01,
        },

        'ETH-BTC': {
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

        ONE: {
            ADDRESS: '',
            // Harmony Private Key
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

        MATIC: {
            ADDRESS: '',
            // Matic Private Key
            SECRET: '',
        },

        AVAX: {
            ADDRESS: '',
            // Avalanche Private Key
            SECRET: '',
        },

        XDC:{
            //XDC public address starting with 0x instead of xdc
            ADDRESS: '',
            // XDC Private Key
            SECRET: '',
        },
    },

    // BLOCKCHAIN PROVIDER
    BLOCKCHAIN_PROVIDER: {
        INFURA: '',
    },

    // PRICE PROVIDER
    PRICE: {
        PROVIDER: 'CryptoCompare',
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
    },

    // ================== ADVANCED ==================

    AGGREGATOR_URL: 'https://network.jelly.market/api/v1/info',
    TRACKER_URL: 'jelly-tracker.herokuapp.com',
    JELLY_PRICE_PROVIDER: '',

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
