module.exports = function(eleventyConfig) {
    // Watch CSS files for changes
    eleventyConfig.setBrowserSyncConfig({
          files: './dist/css/**/*.css'
    });
    eleventyConfig.addPassthroughCopy("./src/assets");
    eleventyConfig.addPassthroughCopy("./src/templates");
  
    return {
      dir: {
        input: 'src',
        output: 'dist',
      },
      pathPrefix: "/Personal-portfolio/"
    };
  };