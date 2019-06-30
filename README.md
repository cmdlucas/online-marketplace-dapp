## About
This is an online marketplace that operates on the ethereum blockchain and allows shoppers to buy products from store owners.

### Specifications

   - **Admin** manages the central marketplace.
   - **Admin** allows store owners to add stores to the marketplace.
   - **Store Owner** manages their store's inventory and funds.
   - **Shoppers** can visit stores and purchase goods that are in stock using cryptocurrency.

## Usage
To start application,

Run a devlopment server from terminal like: `ganache-cli`

Then do,
`truffle compile`
Then,
`truffle migrate`
Then
`npm start`

To run smart contract tests:
Run,
`truffle test`

#### Note:
This application does not consider the fact that it's data is stored on the blockchain where data is virtually visible to everybody. However, I have tried as much as possible not to deal with any sensitive information.
All user profile data is visible and prone to manipulation by everyone, hence be careful of what you store.
Any web app feature to handle real login functionalities before reading user's address should be provided separately.

## License
MIT