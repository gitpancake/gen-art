const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔍 Wallet Information");
  console.log("====================\n");
  
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "your_wallet_private_key_here") {
    console.log("❌ Private key not configured in .env file");
    return;
  }
  
  try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    console.log("🔑 Wallet Address:", wallet.address);
    console.log("");
    
    // Networks to check
    const networks = [
      { 
        name: "Sepolia", 
        rpc: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
        explorer: "https://sepolia.etherscan.io/address/"
      },
      { 
        name: "Base Sepolia", 
        rpc: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
        explorer: "https://sepolia.basescan.org/address/"
      }
    ];
    
    console.log("💰 Balances:");
    console.log("------------");
    
    for (const network of networks) {
      try {
        const provider = new ethers.JsonRpcProvider(network.rpc);
        const balance = await provider.getBalance(wallet.address);
        const formatted = ethers.formatEther(balance);
        
        console.log(`${network.name}: ${formatted} ETH`);
        
        if (parseFloat(formatted) === 0) {
          console.log(`  ⚠️  No balance - get testnet ETH from faucet`);
        }
      } catch (error) {
        console.log(`${network.name}: Error connecting`);
      }
    }
    
    console.log("\n🔗 Block Explorers:");
    console.log("------------------");
    networks.forEach(network => {
      console.log(`${network.name}: ${network.explorer}${wallet.address}`);
    });
    
  } catch (error) {
    console.log("❌ Invalid private key format");
    console.log("   Make sure your private key starts with 0x or is 64 hex characters");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });