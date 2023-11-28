const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
    // Watch CSS files for changes
    eleventyConfig.setBrowserSyncConfig({
          files: './dist/css/*.css'
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
      markdownTemplateEngine: 'njk',
      pathPrefix: "/Personal-portfolio/"
    };
  };