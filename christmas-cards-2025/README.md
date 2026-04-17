# christmas-cards-2025

A generative **Christmas Cards 2025** project — an on-chain ERC-721 NFT collection combining a fxhash-style p5.js generative-art piece with a fully on-chain (HTML-in-contract) rendering mode. Intended for a limited 100-card drop on Base.

## What it is

- **Generative piece** — `index.js` / `standalone.html` render Christmas-themed variations using a seeded RNG (fxhash compatibility layer via `fxhash.min.js`) so each mint produces a unique card
- **On-chain rendering** — `ChristmasCardsOnChain.sol` stores the art's HTML directly in the contract, using the minified `onchain-minified.html` so each token renders fully on-chain without IPFS
- **Simpler variant** — `ChristmasCards2025.sol` + `contracts/ChristmasCardsSimple.sol` use a `baseTokenURI` + external metadata for a lighter gas footprint
- **Max supply**: 100 cards; mint price 0.01 ETH (Base-tuned)

## Files

| File | Role |
|---|---|
| `ChristmasCards2025.sol` | Main ERC-721 — `ERC721URIStorage` + `Ownable`, max supply 100, configurable mint price |
| `ChristmasCardsOnChain.sol` | Fully on-chain variant — stores minified HTML in the contract |
| `contracts/ChristmasCardsSimple.sol` | Simplest variant |
| `index.html` / `standalone.html` | Art harness for local preview |
| `index.js` | The p5.js generative sketch |
| `onchain-minified.html` | Minified single-file art for on-chain storage |
| `minify.js` | Tooling — minifies HTML/JS into `onchain-minified.html` |
| `generate-metadata.js` | Generates the metadata JSON for each token |
| `fxhash.min.js` | Vendored fxhash SDK shim for deterministic randomness |
| `hardhat.config.js` | Hardhat config — Sepolia + Base Mainnet networks |
| `Makefile` | Common deploy/verify targets |
| `scripts/deploy.js` | Deployment script |
| `scripts/check-wallet.js` | Wallet-balance helper |
| `scripts/debug-env.js` | Env-var sanity checker |

## Tech stack

- **Solidity 0.8.20** + **Hardhat** + OpenZeppelin ERC-721
- **p5.js** for the generative renderer
- fxhash SDK shim for seeded randomness
- **Base Mainnet** target deploy (Sepolia for testing)

## Setup

```bash
npm install
cp .env.example .env   # fill in PRIVATE_KEY + optional RPC/API keys
npx hardhat compile
npx hardhat test
```

## Deploy

```bash
# Sepolia test
npx hardhat run scripts/deploy.js --network sepolia

# Base mainnet (check-wallet first!)
node scripts/check-wallet.js
npx hardhat run scripts/deploy.js --network base
```

## Status

**Frozen.** Built in December 2025 for the 2025 holiday season. Not deployed to mainnet.
