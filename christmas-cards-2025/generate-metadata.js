// Metadata generator for NFT collection
// This generates metadata compatible with OpenSea/ERC721 standards

const fs = require('fs');
const path = require('path');

// Configuration
const COLLECTION_SIZE = 100; // Number of tokens to generate
const BASE_URI = "https://yourwebsite.com/christmas-cards/"; // Update with your hosting URL
const OUTPUT_DIR = "./metadata";

// Simple deterministic random generator
class Random {
    constructor(seed) {
        this.seed = this.hashCode(seed.toString());
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 2147483647;
        return this.seed / 2147483647;
    }
}

// Generate features for a token
function generateFeatures(tokenId) {
    const rng = new Random(tokenId);
    const fxrand = () => rng.next();
    
    const palettes = [
        "Midnight Blue",
        "Northern Sky",
        "Purple Twilight",
        "Winter Dawn",
        "Arctic Night"
    ];
    
    const paletteIndex = Math.floor(fxrand() * palettes.length);
    const snowIntensityRand = fxrand();
    const snowSizeRand = fxrand();
    const windRand = fxrand();
    
    return {
        palette: palettes[paletteIndex],
        snowIntensity: snowIntensityRand > 0.7 ? "Blizzard" : snowIntensityRand > 0.4 ? "Heavy" : "Light",
        snowSize: snowSizeRand > 0.5 ? "Large Flakes" : "Small Flakes",
        wind: windRand > 0.7 ? "Strong" : windRand > 0.3 ? "Moderate" : "Calm",
        stars: 50 // Fixed for consistency
    };
}

// Generate metadata for a single token
function generateTokenMetadata(tokenId) {
    const features = generateFeatures(tokenId);
    
    return {
        name: `Christmas Card #${tokenId}`,
        description: "An interactive generative winter scene featuring falling snow, twinkling stars, and a peaceful snowy landscape. Each card is unique and deterministically generated based on its token ID.",
        external_url: `${BASE_URI}?id=${tokenId}`,
        image: `${BASE_URI}images/${tokenId}.png`, // You'll need to generate these separately
        animation_url: `${BASE_URI}?id=${tokenId}`, // The interactive HTML version
        attributes: [
            {
                trait_type: "Palette",
                value: features.palette
            },
            {
                trait_type: "Snow Intensity",
                value: features.snowIntensity
            },
            {
                trait_type: "Snow Size",
                value: features.snowSize
            },
            {
                trait_type: "Wind",
                value: features.wind
            },
            {
                trait_type: "Stars",
                value: features.stars,
                display_type: "number"
            }
        ]
    };
}

// Generate all metadata files
function generateAllMetadata() {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Track trait distribution
    const traitCounts = {};
    
    for (let tokenId = 0; tokenId < COLLECTION_SIZE; tokenId++) {
        const metadata = generateTokenMetadata(tokenId);
        
        // Track traits for rarity analysis
        metadata.attributes.forEach(attr => {
            const key = `${attr.trait_type}: ${attr.value}`;
            traitCounts[key] = (traitCounts[key] || 0) + 1;
        });
        
        // Write individual metadata file
        fs.writeFileSync(
            path.join(OUTPUT_DIR, `${tokenId}.json`),
            JSON.stringify(metadata, null, 2)
        );
    }
    
    // Generate collection metadata
    const collectionMetadata = {
        name: "Christmas Cards 2025",
        description: "A collection of interactive generative winter scenes",
        image: `${BASE_URI}collection.png`,
        external_link: BASE_URI,
        seller_fee_basis_points: 250, // 2.5% royalty
        fee_recipient: "0x0000000000000000000000000000000000000000" // Update with your address
    };
    
    fs.writeFileSync(
        path.join(OUTPUT_DIR, "collection.json"),
        JSON.stringify(collectionMetadata, null, 2)
    );
    
    // Generate rarity report
    const rarityReport = Object.entries(traitCounts)
        .map(([trait, count]) => ({
            trait,
            count,
            percentage: ((count / COLLECTION_SIZE) * 100).toFixed(2) + '%'
        }))
        .sort((a, b) => a.count - b.count);
    
    fs.writeFileSync(
        path.join(OUTPUT_DIR, "rarity-report.json"),
        JSON.stringify(rarityReport, null, 2)
    );
    
    console.log(`✅ Generated ${COLLECTION_SIZE} metadata files in ${OUTPUT_DIR}/`);
    console.log(`📊 Rarity report saved to ${OUTPUT_DIR}/rarity-report.json`);
}

// Run the generator
generateAllMetadata();