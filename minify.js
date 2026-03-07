const fs = require('fs');
const path = require('path');
const Terser = require('terser');
const CleanCSS = require('clean-css');

console.log('Starting minification process...');
console.log('Current directory:', __dirname);

// ============================================
// Minify JavaScript files (in root folder)
// ============================================
console.log('\nLooking for JS files in root folder...');

// Get all files in current directory
const files = fs.readdirSync(__dirname);

// Filter for .js files (but not .min.js and not minify.js)
const jsFiles = files.filter(file => 
    file.endsWith('.js') && 
    !file.endsWith('.min.js') && 
    file !== 'minify.js'
);

console.log('Found JS files:', jsFiles);

// Process each JS file
jsFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    console.log('Processing:', file);
    
    try {
        const code = fs.readFileSync(filePath, 'utf8');
        
        // Minify the code
        Terser.minify(code, {
            compress: true,
            mangle: true
        }).then(result => {
            if (result.error) {
                console.error('Error minifying ${file}:', result.error);
                return;
            }
            
            const minFileName = file.replace('.js', '.min.js');
            const minFilePath = path.join(__dirname, minFileName);
            
            fs.writeFileSync(minFilePath, result.code);
            
            const originalSize = (code.length / 1024).toFixed(2);
            const minifiedSize = (result.code.length / 1024).toFixed(2);
            const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(0);
            
            console.log(`${file}: ${originalSize}KB → ${minifiedSize}KB (${savings}% reduction)`);
        }).catch(err => {
            console.error('Error in Terser for ${file}:', err);
        });
    } catch (err) {
        console.error('Error reading ${file}:', err);
    }
});

// ============================================
// Minify CSS files (in root folder)
// ============================================
console.log('\nLooking for CSS files in root folder...');

// Filter for .css files (but not .min.css)
const cssFiles = files.filter(file => 
    file.endsWith('.css') && 
    !file.endsWith('.min.css')
);

console.log('Found CSS files:', cssFiles);

// Process each CSS file
cssFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    console.log('Processing:', file);
    
    try {
        const css = fs.readFileSync(filePath, 'utf8');
        
        // Minify the CSS
        const minified = new CleanCSS({ level: 2 }).minify(css);
        
        if (minified.errors.length > 0) {
            console.error('Error minifying ${file}:', minified.errors);
            return;
        }
        
        const minFileName = file.replace('.css', '.min.css');
        const minFilePath = path.join(__dirname, minFileName);
        
        fs.writeFileSync(minFilePath, minified.styles);
        
        const originalSize = (css.length / 1024).toFixed(2);
        const minifiedSize = (minified.styles.length / 1024).toFixed(2);
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(0);
        
        console.log(`${file}: ${originalSize}KB → ${minifiedSize}KB (${savings}% reduction)`);
    } catch (err) {
        console.error('Error reading ${file}:', err);
    }
});

console.log('\nMinification process complete!');
console.log('\nSummary:');
console.log('Check your folder for .min.js and .min.css files');