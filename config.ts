export default {
    // ================== Your Cherry Node name ==================
    NAME: 'ADD_YOUR_NODE_NAME',

    AGGREGATOR_URL: 'https://network.jelly.market/api/v1/info/update',

    // ================== Server configuration ==================
    SERVER: {
        PORT: 9000,
    },

    // ================== Database configuration ==================
    //options: mongodb or sqlite
    ACTIVE_DB: 'mongodb',
    MONGODB: {
        //Docker Setup
        URL: 'mongodb://db:27017/butler',
        AUTH: 'admin',
        MONGO_PASSWORD: process.env.MONGO_PASSWORD,

        //Manual setup
        //URL: 'mongodb://localhost:27017/butler',
    },
    SQLITE: {
        //Database name
        database: 'butler.sqlite',
    },

    // Specify the networks you want to support
    // Available options: ETH, BTC, DAI, WBTC, AE
    NETWORKS: {
        ETH: true,
        DAI: true,
        USDC: false,
        WBTC: false,
        BTC: false,
        AE: false,
        TRX: false,
    },

    // For every enabled network, you should specify an address and a secret
    BLOCKCHAIN: {
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

        AES: {
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

        TRX: {
            ADDRESS: '',
            // Tron Private Key
            SECRET: '',
        },
    },

    // The amount of fee that is charged by JellySwap protocol.
    // Currently the usage of JellySwap protocol is free
    FEE: 0.0,

    // Choose wheter you will cover the fees for the user on their first withdraw or not.
    // If a user wants to swap BTC for ETH, but his ETH wallet is empty, he won't be able to make the withdraw.
    // By enabling this option, you will perform the withraw for the user, only if his address has 0 ETH balance
    COVER_FEES: true,

    // Specify the pairs you want to support as a liquidity provider.
    PAIRS: {
        'ETH-BTC': true,
        'ETH-DAI': true,
        'ETH-AE': true,
        'ETH-USDC': true,

        'BTC-ETH': true,
        'BTC-DAI': true,
        'BTC-AE': true,
        'BTC-USDC': true,

        'DAI-BTC': true,
        'DAI-ETH': true,

        'AE-BTC': true,
        'AE-ETH': true,

        'USDC-BTC': true,
        'USDC-ETH': true,
    },

    // Specify the exchange you want to use as a risk management tool.
    // Available options: binance or leave it empty
    // Spreads are measured in percentage  0.08 = 8% spread on top of the market price
    // Tolerance option - minimum spread a t which you will take the order
    // If you enable this option, whenever you execute a swap, a mirror order will be placed on Binance.
    // Example: You swap 1 BTC for 10 ETH. With the 10 ETH you receive you place an order to buy BTC from Binance.
    // If you have gathered enough fees, you will receive more than 1 BTC for the 10 ETH leaving you with profit.
    EXCHANGE: '',

    // ================== Price configuration ==================
    PRICE: {
        COINS: ['USDT', 'BTC', 'ETH', 'TRX', 'DAI', 'AE', 'USDC'],
        SPREAD: {
            DEFAULT: 0.0091,
            'AE-ETH': 0.08,
            'ETH-AE': 0.08,
            'ETH-BTC': 0.5,
            'BTC-ETH': 0.5,
            'ETH-TRX': 0.7,
        },
        TOLERANCE: {
            DEFAULT: 0.001,
            'AE-ETH': 0.1,
            'ETH-AE': 0.1,
            'ETH-BTC': 0.3,
            'BTC-ETH': 0.3,
            'ETH-TRX': 0.3,
        },
        PROVIDER: 'cryptocompare',
        UPDATE_INTERVAL: 30,
        USE_FALLBACK: false,
        FALLBACK: 'cryptocompare',
    },
    // ================== Balance Snapshot ==================
    // Saves you current balance on every x seconds. 
    // You can track your portfolio P&L with this option
    BALANCE_SNAPSHOT_INTERVAL: 3600,

    // ================== Email configuration ==================
    // If you enable this option, you will receive an email whenever you process a new swap/withdraw/refund.
    EMAIL: {
        ENABLED: false,
        SERVICE: 'gmail',
        USERNAME: '',
        PASSWORD: '',
        FROM: '',
        TO: '',
        SUBJECT: 'JELLY',
    },

    // If you specify a Slack Webhook, you will receive real time messages with your swap statuses.
    SLACK_WEBHOOK_URL: '', //https://hooks.slack.com/services/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

    CRYPTOCOMPARE_API: '',

    // ================== Binance configuration ==================
    BINANCE: {
        API_KEY: '', // place binance API KEY here
        SECRET_KEY: '', // place binance SECRET KEY here

        PAIRS: {
            ETHBTC: true,
            BTCUSDT: true,
            AEETH: true,
            AEBTC: true,
            ETHUSDC: true,
            BTCUSDC: true,
        },
        PRECISION: {
            ETH: 3,
            TRX: 0,
            BTC: 4,
            USDT: 4,
            AE: 1,
            USDC: 4,
        },
        DUPLICATE_PRICE: { DAI: 'USDC' },
    },
};
