.DEFAULT_GOAL := help

# GLOBAL

.PHONY: install
install: ## Install dependencies
	@docker-compose run --rm --no-deps evm-contracts npm install

.PHONY: test
test: ## Run truffle tests
	@docker-compose run --rm --no-deps evm-contracts npm run test

.PHONY: migrate-dev
migrate-dev: ## Migrate Solidity SmartContracts to development EVM emulator
	@docker-compose run --rm --no-deps evm-contracts npm run migrate:dev

.PHONY: migrate-testnet-polygon
migrate-testnet-polygon: ## Migrate Solidity SmartContracts to Testnet Polygon
	@docker-compose run --rm --no-deps evm-contracts npm run migrate:testnet-polygon

.PHONY: migrate-polygon
migrate-polygon: ## Migrate Solidity SmartContracts to Polygon
	@docker-compose run --rm --no-deps evm-contracts npm run migrate:polygon

.PHONY: migrate-testnet-goerli
migrate-testnet-goerli: ## Migrate Solidity SmartContracts to Testnet Ethereum Goerli
	@docker-compose run --rm --no-deps evm-contracts npm run migrate:testnet-goerli

.PHONY: migrate-ethereum
migrate-ethereum: ## Migrate Solidity SmartContracts to Ethereum
	@docker-compose run --rm --no-deps evm-contracts npm run migrate:ethereum

.PHONY: format
format: ## Format typescript code with prettier
	@docker-compose run --rm --no-deps evm-contracts npm run prettier:write

.PHONY: clean
clean: ## Clean dependencies and build
	@docker-compose run --rm --no-deps evm-contracts rm -rf node_modules
	@docker-compose run --rm --no-deps evm-contracts rm -rf build/*
	@docker-compose run --rm --no-deps evm-contracts rm -rf types/*

.PHONY: evm-emulator
evm-emulator: ## Start EVM Emulator forked from Polygon Smart Chain
	@docker-compose up evm-emulator

.PHONY: help
help: ## Show help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
