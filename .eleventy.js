module.exports = function(eleventyConfig) {
    // Watch CSS files for changes
    eleventyConfig.setBrowserSyncConfig({
          files: './dist/css/**/*.css'
      });
  
    return {
      dir: {
        input: 'src',
        output: 'dist',
      },
    };
  };
  