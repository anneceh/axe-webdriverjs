var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

var AxeBuilder = require('axe-webdriverjs'),
    Key = webdriver.Key;

var util = require('util');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('Axe WebDriver JS demo', function() {

    beforeEach(function(done) {
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();

            driver.get('https://clothes4all.netlify.com/v2').then(function () {
                  driver.executeAsyncScript(function(callback) {
                      var script = document.createElement('script');
                      script.innerHTML = 'document.documentElement.classList.add("deque-axe-is-ready");';
                      document.documentElement.appendChild(script);
                      callback();
                  })
                  .then(function () {
                      return driver.wait(webdriver.until.elementsLocated(webdriver.By.css('.deque-axe-is-ready')));
                  })
                  .then(function () {
                      done();
                  });
              });
    });

    // Close website after each test is run (so it is opened fresh each time)
    afterEach(function(done) {
        driver.quit().then(function () {
            done();
        });
    });

    it('should fetch webpage and analyze it', function (done) {
      driver.findElement(webdriver.By.tagName('body'))
          .then(function () {
              AxeBuilder(driver)
                  .analyze(function(results) {
                      console.log('Accessibility Violations: ', results.violations.length);
                      if (results.violations.length > 0) {
                          console.log(util.inspect(results.violations, true, null));
                      }
                      expect(results.violations.length).toBe(0);
                      done();
                  })
          });
    });
});
