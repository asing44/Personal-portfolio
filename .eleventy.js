const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
    // Watch CSS files for changes
    eleventyConfig.setBrowserSyncConfig({
          files: './dist/**'
    });
    // Copy files to dist
    eleventyConfig.addPassthroughCopy("./src/assets");
    // HTML Base plugin
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  
    return {
      dir: {
        input: 'src',
        output: 'dist',
      },
      pathPrefix: "/Personal-portfolio/"
    };
  };