# What is Butler?[](#what-is-butler)

Butler is automated market making software that is used for liquidity provision to JellySwap protocol. Everyone can run Butler instance on his/her own machine and start earning interest from market spreads. Butler supports automatic order matching, withdraws, refunds, portfolio rebalancing, email notifications. Supported coins are BTC, ETH, DAI, AE, WBTC, USDC.

# How to install Butler?[](#how-to-install-butler)

There are two main approaches to install Butler:

1.  [Docker Setup](#docker-setup)

2.  [Manual Setup](#manual-setup)

# Docker setup[](#docker-setup)

**1. Setup Docker on your system.**

-   Linux
    To install Docker on Linux follow this quick guide: [https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/) Docker Compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

-   Windows
    To install Docker on Windows follow this quick guide: [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)

-   Mac
    To install Docker on Mac follow this quick guide: [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)

    **2. Download Butler**
    Once, you have successfully installed docker on your system you can clone/download this repository.

        git clone https://github.com/jelly-swap/jelly-butler-beta.git

**3. Configure Butler**

-   Setup a password for the database in `.env` `MONGO_PASSWORD='your password'`

-   Open `config.ts` and fill all required fields.

-   Butler needs a price source and you have two options:

    **Binance** - Create Binance API key [https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API](https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API)
    **CryptoCompare** - Create Cryptocompare API Key [https://min-api.cryptocompare.com/](https://min-api.cryptocompare.com/)

-   If you want Email Notifications you can provide your GMAIL credentials.

## Note: All provided private keys, API keys, and gmail credentials are securely stored only on your local machine.

**4. Start Butler**

After `.env` and `config.ts` are filled you can run the following command

    chmod 777 wait-for.sh (for linux and macOS)

    mkdir logs && docker-compose up -d

The above mentioned command will start the application in background mode.

Type in the next command to check the log and verify that everything is working fine

    docker-compose logs -f

You should see something like this if the application is running and configured correctly

    3/19/2020,  16:14:00 info: Starting task: Price Task
    3/19/2020,  16:14:01 info: Starting task: Balance Task
    3/19/2020,  16:14:04 info: Starting task: Info Task
    3/19/2020,  16:14:04 info: Server started on port 9003
    3/19/2020,  16:14:04 info: Starting BTC Events
    3/19/2020,  16:14:04 info: Starting ETH Events
    3/19/2020,  16:14:04 info: Starting ERC20 Events

To confirm that everything works, you can open your browser at [http://localhost:9003/api/v1/info](http://localhost/api/v1/info)

**5. Stop or Reconfigure**[](#stop-or-reconfigure)

If you want to stop Butler or you jast want to update the configuration use this command:

    docker-compose stop

Then you can open again config.ts and update your configurations. When you are ready you can start Butler:

    docker-compose up

# Manual Setup[](#manual-setup)

**1. Setup MongoDB on your system**

-   Linux - [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

-   Windows - [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

-   Mac - [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

**1. Install NodeJS**

-   Install https://nodejs.org/en/download/
-   Install **yarn** using this command `npm install yarn -g`
-   Install **pm2** `npm install pm2 -g`

**2. Clone or download this repository**

    git clone https://github.com/jelly-swap/jelly-butler.git

**3. Open the downloaded directory**

-   Install all packages using this command `yarn install`

    **4. Configure Butler**

-   Open `config.ts` and fill all required fields.

-   Butler needs a price source and you have two options:

    **Binance** - Create Binance API key [https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API](https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API)
    **CryptoCompare** - Create Cryptocompare API Key [https://min-api.cryptocompare.com/](https://min-api.cryptocompare.com/)

-   If you want Email Notifications you can provide your GMAIL credentials.

**5. Start Butler**

After `config.ts` is filled you can run the following command

    pm2 start yarn --name "butler"  -- start

The above mentioned command will start the application in background mode.

Type in the next command to check the log and verify that everything is working fine

    pm2 logs

You should see something like this if the application is running and configured correctly

    3/19/2020,  16:14:00 info: Starting task: Price Task
    3/19/2020,  16:14:01 info: Starting task: Balance Task
    3/19/2020,  16:14:04 info: Starting task: Info Task
    3/19/2020,  16:14:04 info: Server started on port 9003
    3/19/2020,  16:14:04 info: Starting BTC Events
    3/19/2020,  16:14:04 info: Starting ETH Events
    3/19/2020,  16:14:04 info: Starting ERC20 Events

To confirm that everything works, you can open your browser at [http://localhost:9003/api/v1/info](http://localhost/api/v1/info)

**6. Stop or Reconfigure**
Run the following command:

    pm2 stop butler

Then you can change `config.ts` and start it again.

# What are the risks?[](#what-are-the-risks)

Butler is automated software and it should be up and running 24/7 as long as you want to participate in the protocol.

**Risks related to connectivity and hardware:**

-   Power outage

-   Internet outage

-   Hardware problem

**Next group of problems is related to software and service dependencies:**

-   Bug in the Butler software or smart contracts

-   Price provider service outage

-   Lack of connectivity to blockchain

-   Database problem

-   Problem with connecting to rebalancing exchange

-   Hacker attack that can get access to Butler operator node

**Market related risks:**

-   Too volatile market and big price movement can bring some losses

-   Ghost attack - fake swaps are started, but never finalized - no losses for Butler operator, but funds will be locked for 4 hours in HTLC

-   Slow blockchain transaction speed due to network overload, usually combined with massive price movement

All swaps have a lock period of 24 hours. If Butler is down for some of the above mentioned reasons or some new unexpected bug, every Butler node operator have 24 hours period to recover his/her Butler and no loses will be encountered.

JellySwap team have paid for 3rd party security audit and all of the code for Butler is open source, therefore everyone can check it and run it on his/her own risk.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
