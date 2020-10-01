export default {
    // ================== BASIC ==================
    NAME: 'TESTNET_BUTLER',

    // Traiding pairs
    PAIRS: {
        'ONE-ETH': {
            FEE: 0.01,
        },

        'ETH-ONE': {
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

        BNB: {
            ADDRESS: '',
            // Binance Private Key
            SECRET: '',
        },

        ONE: {
            ADDRESS: '',
            // Harmony Private Key
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
    },

    // ================== ADVANCED ==================

    AGGREGATOR_URL: 'https://jelly-jam-testnet.herokuapp.com/api/v1/info',
    TRACKER_URL: 'jelly-tracker-testnet.herokuapp.com',
    JELLY_PRICE_PROVIDER: 'http://localhost:8080/prices',

    SERVER: { PORT: 9000 },

    // ================== Database configuration ==================
    //options: SQLITE
    DATABASE: {
        ACTIVE: 'SQLITE',

        SQLITE: {
            database: 'butler.sqlite',
        },
    },
};
