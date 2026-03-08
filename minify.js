const fs = require('fs');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

async function minifyFiles() {
    // Minify JS
    const jsInput = fs.readFileSync('script.js', 'utf8');
    const jsResult = await minify(jsInput, {
        compress: true,
        mangle: true
    });
    fs.writeFileSync('script.min.js', jsResult.code);
    console.log('script.min.js created');

    // Minify CSS
    const cssInput = fs.readFileSync('styles.css', 'utf8');
    const cssResult = new CleanCSS({}).minify(cssInput);
    fs.writeFileSync('styles.min.css', cssResult.styles);
    console.log('styles.min.css created');
}

minifyFiles().catch(console.error);