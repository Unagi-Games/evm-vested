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

.PHONY: migrate
migrate: ## Migrate Solidity SmartContracts
	@docker-compose run --rm --no-deps evm-contracts npm run migrate

.PHONY: clean
clean: ## Clean dependencies and build
	@docker-compose run --rm --no-deps evm-contracts rm -rf node_modules
	@docker-compose run --rm --no-deps evm-contracts rm -rf build/*

.PHONY: evm-emulator
evm-emulator: ## Start EVM Emulator forked from Binance Smart Chain
	@docker-compose up evm-emulator

.PHONY: help
help: ## Show help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
