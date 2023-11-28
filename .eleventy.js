const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
    // Copy files to dist
    eleventyConfig.addPassthroughCopy("./src/assets");
    // Watch changes in scss files
    eleventyConfig.setWatchThrottleWaitTime(100); 
    eleventyConfig.addWatchTarget('./src/static/scss');
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