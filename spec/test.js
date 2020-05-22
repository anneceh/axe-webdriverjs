const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

let driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
                 .build();

const AxeBuilder = require('axe-webdriverjs'),
      Key = webdriver.Key;

const util = require('util');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('Axe WebDriver JS demo', function() {

    beforeEach(function(done) {
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

    afterEach(function(done) {
        driver.quit().then(function () {
            done();
        });
    });

    it('should fetch webpage and analyze it', function (done) {
      driver.findElement(webdriver.By.tagName('body'))
          .then(function () {
              AxeBuilder(driver)
                  .analyze(function(err, results) {
                      // if (err) {
                      //   return done(err);
                      // }
                      //console.log('Accessibility Violations: ', results.violations.length);
                      if (results.violations.length > 0) {
                          console.log(util.inspect(results.violations, true, null));
                      }
                      expect(results.violations.length).toBe(0);
                      done();
                  })
          });
    });
});
