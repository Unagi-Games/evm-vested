# Ultimate Champions SmartContracts

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

### Prerequisites

#### Required ports

The following ports must be free:
 
* (optional) evm-emulator: 8545

#### Install docker (20+)

* https://docs.docker.com/install/linux/docker-ce/ubuntu/
* https://docs.docker.com/install/linux/linux-postinstall/

#### Install docker-compose (1.28.0+)

* https://docs.docker.com/compose/install/

### Makefile

There is a lot of utility command in our Makefile. Run `make help` to show them.

## Setup

### Local environment configuration

You must create .env file and adapt it to your local environment. You'll find an example for each required .env :
* `/.env`

For a fast setup, you can copy/paste .env.example:
```bash
cp ./.env.example ./.env
```

Set as `MNEMONIC_SECRET` value your 12 word mnemonic seed phrase. To get the seedwords from metamask wallet you can go to Metamask Settings, then from the menu choose Security and Privacy where you will see a button that says reveal seed words.

`/.env` contains instructions for which user:group use in docker containers. \
Make sure `DOCKER_USER_ID` and `DOCKER_GROUP_ID` are set to properly runs docker images.

### Setup containers

Build containers and install all dependencies:
```bash
make install
```

### Config

`./src/config.ts` contains an empty configuration for the initial token allocation of the CHAMP token.

## Developments

### Start

Run the following command to start the EVM Emulator

```bash
make evm-emulator
```

### Migrate contracts

Run the following command to migrate the contracts.
```bash
# Migrate on your local evm emulator
make migrate-dev

# Migrate on Ethereum testnet (Goerli)
make migrate-testnet-goerli

# Migrate on Ethereum
make migrate-ethereum
```

## Troubleshooting

### I'm stuck on the setup and troubleshooting did not help
Ask on discord some help and update troubleshooting if needed