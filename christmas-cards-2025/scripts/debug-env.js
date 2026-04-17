require('dotenv').config();

console.log("🔍 Debugging .env configuration");
console.log("================================\n");

// Check if PRIVATE_KEY exists
if (process.env.PRIVATE_KEY) {
  console.log("✅ PRIVATE_KEY is loaded from .env");
  
  // Check length
  const keyLength = process.env.PRIVATE_KEY.length;
  console.log(`📏 Key length: ${keyLength} characters`);
  
  // Check format
  if (process.env.PRIVATE_KEY.startsWith('0x')) {
    console.log("✅ Key starts with 0x");
    if (keyLength === 66) {
      console.log("✅ Key is correct length (66 chars with 0x)");
    } else {
      console.log(`⚠️  Key should be 66 chars with 0x prefix (got ${keyLength})`);
    }
  } else {
    console.log("📝 Key doesn't start with 0x (will add it automatically)");
    if (keyLength === 64) {
      console.log("✅ Key is correct length (64 chars without 0x)");
    } else {
      console.log(`⚠️  Key should be 64 chars without 0x prefix (got ${keyLength})`);
    }
  }
  
  // Try to load with ethers
  try {
    const { ethers } = require('ethers');
    let pk = process.env.PRIVATE_KEY;
    if (!pk.startsWith('0x')) {
      pk = '0x' + pk;
    }
    
    const wallet = new ethers.Wallet(pk);
    console.log("\n✅ Successfully loaded wallet!");
    console.log(`🔑 Wallet address: ${wallet.address}`);
    
  } catch (error) {
    console.log("\n❌ Failed to load wallet with ethers:");
    console.log(`   Error: ${error.message}`);
    console.log("\n💡 Tips:");
    console.log("   - Make sure your private key is 64 hex characters (or 66 with 0x)");
    console.log("   - Only use characters 0-9 and a-f");
    console.log("   - Don't include spaces or quotes around the key");
  }
  
  // Show first/last few chars for verification (safely)
  const masked = process.env.PRIVATE_KEY.substring(0, 6) + "..." + 
                 process.env.PRIVATE_KEY.substring(process.env.PRIVATE_KEY.length - 4);
  console.log(`\n🔒 Key preview: ${masked}`);
  
} else {
  console.log("❌ PRIVATE_KEY not found in environment");
  console.log("\n💡 Check that your .env file:");
  console.log("   - Has PRIVATE_KEY=yourkey (no spaces around =)");
  console.log("   - No quotes unless they're part of the key");
  console.log("   - File is in the root directory");
}

// Check other env vars
console.log("\n📋 Other environment variables:");
const envVars = ['SEPOLIA_RPC_URL', 'ETHERSCAN_API_KEY', 'BASESCAN_API_KEY'];
envVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName} is set`);
  } else {
    console.log(`   ⭕ ${varName} not set (optional)`);
  }
});