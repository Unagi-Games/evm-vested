require("ts-node").register({
  files: true,
});
require("dotenv").config({
  path: ".env",
});
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { TESTNET_BSC_PROVIDER_URL, BSC_PROVIDER_URL, MNEMONIC_SECRET } = process.env;
if(!TESTNET_BSC_PROVIDER_URL) {
  throw new Error('Missing env TESTNET_BSC_PROVIDER_URL');
}
if(!BSC_PROVIDER_URL) {
  throw new Error('Missing env BSC_PROVIDER_URL');
}
if(!MNEMONIC_SECRET) {
  throw new Error('Missing env MNEMONIC_SECRET');
}

module.exports = {
  networks: {
    test: {
      host: "evm-emulator",
      port: 8545,
      network_id: "*",
    },
    development: {
      host: "evm-emulator",
      port: 8545,
      network_id: "*",
    },
    "testnet-bsc": {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, TESTNET_BSC_PROVIDER_URL),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, BSC_PROVIDER_URL),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "^0.8.6",
    }
  }
}