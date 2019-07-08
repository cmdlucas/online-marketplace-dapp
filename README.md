## About
This is a demo online marketplace that operates on the ethereum blockchain and allows shoppers to buy products from store owners.

### Specifications

   - **Admin** manages the central marketplace.
   - **Admin** allows store owners to add stores to the marketplace.
   - **Store Owner** manages their store's inventory and funds.
   - **Shoppers** can visit stores and purchase goods that are in stock using cryptocurrency.

## Usage
To start application,

Run a devlopment server from terminal like: `ganache-cli`

Then run these commands in order,
`truffle compile`

`truffle migrate`

`cd client`

`npm start`

To run smart contract tests: `truffle test`

If you plan to deploy app again to rinkeby testnet, first do
`npm install truffle-hdwallet-provider`

Then do, `truffle migrate --network rinkeby`

#### Note:
This application does not consider the fact that it's data is stored on the blockchain where data is virtually visible to everybody. However, I have tried as much as possible not to deal with any sensitive information.
All user profile data is visible and prone to manipulation by everyone, hence be careful of what you store.
Any web app feature to handle real login functionalities before reading user's address should be provided separately.

Also, it is left to the client to decide the floating point values and store them semantically as integers. E.g. 0.12 could be stored as 12 while 12 could be stored as 1200. This indicates that each of those values have to be reduced by a factor of 100 when read. 

## License
MIT