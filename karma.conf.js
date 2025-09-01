// Karma configuration with headless Chrome and coverage thresholds
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
    ],
    files: [],
    client: {
      clearContext: false,
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'text' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' },
      ],
      check: {
        global: { statements: 80, branches: 80, functions: 80, lines: 80 },
      },
    },
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
