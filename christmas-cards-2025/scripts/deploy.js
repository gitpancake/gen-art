const hre = require("hardhat");

async function main() {
  console.log("🎄 Deploying Christmas Cards 2025...");
  
  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📍 Deploying to network: ${network.name} (chainId: ${network.chainId})`);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🔑 Deploying with account: ${deployer.address}`);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  // Deploy the contract
  console.log("\n📦 Deploying ChristmasCardsOnChain contract...");
  const ChristmasCards = await hre.ethers.getContractFactory("ChristmasCardsOnChain");
  const christmasCards = await ChristmasCards.deploy();
  
  // Wait for deployment
  await christmasCards.waitForDeployment();
  const contractAddress = await christmasCards.getAddress();
  
  console.log(`✅ Contract deployed to: ${contractAddress}`);
  console.log(`🔗 View on explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Wait for a few confirmations before verification
  console.log("\n⏳ Waiting for confirmations...");
  await christmasCards.deploymentTransaction().wait(5);
  
  // Verify on Etherscan if API key is provided
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }
  
  // Log deployment summary
  console.log("\n🎊 Deployment Complete!");
  console.log("========================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log("========================");
  
  // Instructions for interaction
  console.log("\n📝 Next steps:");
  console.log("1. Send ETH to the contract if needed for operations");
  console.log("2. Call toggleMinting() to enable minting");
  console.log("3. Users can mint by calling mint() with 0.005 ETH");
  console.log("4. View NFTs at: https://testnets.opensea.io/assets/sepolia/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });