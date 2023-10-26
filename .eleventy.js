module.exports = function (eleventyConfig) {
    eleventyConfig.setBrowserSyncConfig({
      files: './dist/static/**/*.css',
    });
  
    return {
      dir: {
        input: 'src',
        output: 'dist',
      },
    };
  };