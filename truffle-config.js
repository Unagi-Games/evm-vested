require("ts-node").register({
  files: true,
});
require("dotenv").config({
  path: ".env",
});
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { TESTNET_POLYGON_PROVIDER_URL, POLYGON_PROVIDER_URL, TESTNET_GOERLI_PROVIDER_URL, ETHEREUM_PROVIDER_URL, MNEMONIC_SECRET, POLYGONSCAN_API_KEY, ETHERSCAN_API_KEY } = process.env;
if(!TESTNET_POLYGON_PROVIDER_URL) {
  throw new Error('Missing env TESTNET_POLYGON_PROVIDER_URL');
}
if(!POLYGON_PROVIDER_URL) {
  throw new Error('Missing env POLYGON_PROVIDER_URL');
}
if(!TESTNET_GOERLI_PROVIDER_URL) {
  throw new Error('Missing env TESTNET_GOERLI_PROVIDER_URL');
}
if(!ETHEREUM_PROVIDER_URL) {
  throw new Error('Missing env ETHEREUM_PROVIDER_URL');
}
if(!MNEMONIC_SECRET) {
  throw new Error('Missing env MNEMONIC_SECRET');
}
if(!POLYGONSCAN_API_KEY) {
  throw new Error('Missing env POLYGONSCAN_API_KEY');
}
if(!ETHERSCAN_API_KEY) {
  throw new Error('Missing env ETHERSCAN_API_KEY');
}

module.exports = {
  networks: {
    test: {
      host: "evm-emulator",
      port: 8545,
      network_id: "*",
      disableConfirmationListener: true,
    },
    development: {
      host: "evm-emulator",
      port: 8545,
      network_id: "*",
    },
    "testnet-polygon": {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, TESTNET_POLYGON_PROVIDER_URL),
      network_id: 80001,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygon: {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, POLYGON_PROVIDER_URL),
      network_id: 137,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    "testnet-goerli": {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, TESTNET_GOERLI_PROVIDER_URL),
      network_id: 5,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    ethereum: {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, ETHEREUM_PROVIDER_URL),
      network_id: 1,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
    polygonscan: POLYGONSCAN_API_KEY
  },
  compilers: {
    solc: {
      version: "0.8.12",
    }
  }
}