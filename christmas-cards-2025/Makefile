# Makefile for Christmas Cards 2025 NFT Deployment

.PHONY: help install compile deploy deploy-sepolia deploy-base test clean verify

help: ## Show this help message
	@echo "Christmas Cards 2025 - Deployment Commands"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install
	@echo "✅ Dependencies installed"
	@echo "⚠️  Don't forget to:"
	@echo "   1. Copy .env.example to .env"
	@echo "   2. Add your private key to .env"
	@echo "   3. Add RPC URLs if using custom endpoints"

compile: ## Compile smart contracts
	npx hardhat compile
	@echo "✅ Contracts compiled"

test: ## Run tests
	npx hardhat test

# Deployment commands
deploy-local: ## Deploy to local Hardhat network
	npx hardhat run scripts/deploy.js --network hardhat

deploy-sepolia: ## Deploy to Sepolia testnet
	@echo "🚀 Deploying to Sepolia Testnet..."
	@echo "⚠️  Make sure you have:"
	@echo "   - Sepolia ETH (get from faucet)"
	@echo "   - Private key in .env file"
	@read -p "Continue? (y/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		npx hardhat run scripts/deploy.js --network sepolia; \
	fi

deploy-base-sepolia: ## Deploy to Base Sepolia testnet
	@echo "🚀 Deploying to Base Sepolia Testnet..."
	@echo "⚠️  Make sure you have:"
	@echo "   - Base Sepolia ETH"
	@echo "   - Private key in .env file"
	@read -p "Continue? (y/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		npx hardhat run scripts/deploy.js --network baseSepolia; \
	fi

deploy-base: ## Deploy to Base mainnet
	@echo "🚀 Deploying to Base Mainnet..."
	@echo "⚠️  WARNING: This is MAINNET!"
	@echo "   Make sure you have:"
	@echo "   - Base ETH for gas"
	@echo "   - Private key in .env file"
	@echo "   - Tested on testnet first"
	@read -p "Are you SURE you want to deploy to mainnet? (yes/no) " -r; \
	echo; \
	if [[ $$REPLY == "yes" ]]; then \
		npx hardhat run scripts/deploy.js --network base; \
	fi

# Verification
verify: ## Verify contract on Etherscan/Basescan (requires contract address)
	@read -p "Enter contract address: " address; \
	read -p "Enter network (sepolia/baseSepolia/base): " network; \
	npx hardhat verify --network $$network $$address

# Utility commands
console-sepolia: ## Open Hardhat console on Sepolia
	npx hardhat console --network sepolia

console-base: ## Open Hardhat console on Base Sepolia
	npx hardhat console --network baseSepolia

clean: ## Clean build artifacts
	npx hardhat clean
	rm -rf cache artifacts
	@echo "✅ Build artifacts cleaned"

gas-report: ## Generate gas usage report
	REPORT_GAS=true npx hardhat test

size: ## Check contract size
	npx hardhat size-contracts

# Quick commands
quick-deploy-sepolia: compile deploy-sepolia ## Compile and deploy to Sepolia

quick-deploy-base: compile deploy-base-sepolia ## Compile and deploy to Base Sepolia

# Faucet links
faucets: ## Show testnet faucet links
	@echo "🚰 Testnet Faucets:"
	@echo ""
	@echo "Sepolia ETH:"
	@echo "  - https://sepoliafaucet.com"
	@echo "  - https://faucet.sepolia.dev"
	@echo "  - https://sepolia-faucet.pk910.de"
	@echo ""
	@echo "Base Sepolia ETH:"
	@echo "  - https://faucet.quicknode.com/base/sepolia"
	@echo "  - Bridge from Sepolia: https://bridge.base.org"

# Check setup
check: ## Check deployment setup and wallet info
	@echo "🔍 Checking setup..."
	@if [ -f .env ]; then \
		echo "✅ .env file exists"; \
	else \
		echo "❌ .env file missing - copy .env.example to .env"; \
	fi
	@if [ -f .env ] && grep -q "^PRIVATE_KEY=" .env; then \
		if grep -q "^PRIVATE_KEY=your" .env || grep -q "^PRIVATE_KEY=\"your" .env || grep -q "^PRIVATE_KEY='your" .env; then \
			echo "❌ Private key not configured (still has placeholder text)"; \
		else \
			echo "✅ Private key appears to be set"; \
			node -e "\
				require('dotenv').config(); \
				if(process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length > 10) { \
					const { ethers } = require('ethers'); \
					try { \
						let pk = process.env.PRIVATE_KEY; \
						if (!pk.startsWith('0x')) pk = '0x' + pk; \
						const wallet = new ethers.Wallet(pk); \
						console.log('🔑 Wallet address:', wallet.address); \
					} catch(e) { \
						console.log('❌ Invalid private key format:', e.message); \
					} \
				} else { \
					console.log('❌ Private key is too short or not loading properly'); \
				}" 2>/dev/null || echo "   (ethers not installed yet - run 'make install')"; \
		fi \
	else \
		echo "❌ Private key not found in .env"; \
	fi
	@echo ""
	@echo "📊 Current configuration:"
	@npx hardhat compile > /dev/null 2>&1 && echo "✅ Contracts compile successfully" || echo "❌ Compilation errors"

wallet: ## Check wallet address and balances
	@npx hardhat run scripts/check-wallet.js 2>/dev/null || echo "Run 'make install' first"