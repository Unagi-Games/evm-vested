require("dotenv").config({
  path: ".env",
});
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { EVM_PROVIDER_URL, MNEMONIC_SECRET } = process.env;
if(!EVM_PROVIDER_URL) {
  throw new Error('Missing env EVM_PROVIDER_URL');
}

if(!MNEMONIC_SECRET) {
  throw new Error('Missing env MNEMONIC_SECRET');
}

module.exports = {
  networks: {
    development: {
      host: "evm-emulator",
      port: 8545,
      network_id: "*",
    },
    evm: {
      provider: () => new HDWalletProvider(MNEMONIC_SECRET, EVM_PROVIDER_URL),
      network_id: 97,
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