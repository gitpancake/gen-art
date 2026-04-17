const fs = require('fs');
const { minify } = require('terser');
const htmlMinifier = require('html-minifier-terser');

async function minifyForOnChain() {
    // Read the standalone HTML
    const html = fs.readFileSync('standalone.html', 'utf8');
    
    // Extract JavaScript code
    const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
    if (!scriptMatch) {
        console.error('No script found');
        return;
    }
    
    const jsCode = scriptMatch[1];
    
    // Minify JavaScript with aggressive settings
    const minifiedJS = await minify(jsCode, {
        compress: {
            dead_code: true,
            drop_console: true,
            drop_debugger: true,
            passes: 3,
            unsafe: true,
            unsafe_comps: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true,
            pure_funcs: ['console.log'],
        },
        mangle: {
            toplevel: true,
            properties: {
                regex: /^_/
            }
        },
        format: {
            comments: false,
            ascii_only: true
        }
    });
    
    // Create minimal HTML
    const minimalHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0}body{overflow:hidden;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh}canvas{display:block}</style></head><body><canvas id="c"></canvas><script>${minifiedJS.code}</script></body></html>`;
    
    // Minify the entire HTML
    const finalHTML = await htmlMinifier.minify(minimalHTML, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
    });
    
    // Write minified version
    fs.writeFileSync('onchain-minified.html', finalHTML);
    
    // Calculate stats
    const originalSize = Buffer.byteLength(html);
    const minifiedSize = Buffer.byteLength(finalHTML);
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
    
    console.log(`✅ Minification complete!`);
    console.log(`📊 Original size: ${originalSize} bytes`);
    console.log(`📊 Minified size: ${minifiedSize} bytes`);
    console.log(`📊 Reduction: ${reduction}%`);
    console.log(`💰 Estimated gas: ~${Math.ceil(minifiedSize / 32 * 20000)} gas`);
    console.log(`💰 Cost on Base (~0.0001 gwei): $${(minifiedSize / 32 * 20000 * 0.0001 * 0.000000001 * 2000).toFixed(2)}`);
}

minifyForOnChain();