'use strict';

// use any assertion library you like
let request = require('request');
const container = require('codeceptjs').container;

/**
 * Sauce Labs Helper for Codeceptjs
 *
 * @author Puneet Kala
 */
class SauceHelper extends Helper {

    constructor(config) {
        super(config);
    }

    /**
     *
     * @param sessionId Session ID for current Test browser session
     * @param data      Test name, etc
     * @private
     */
    _updateSauceJob(sessionId, data) {
        var sauce_url = "Test finished. Link to job: https://saucelabs.com/jobs/";
        sauce_url = sauce_url.concat(sessionId);
        console.log(sauce_url);


        var status_url = 'https://saucelabs.com/rest/v1/';
        status_url = status_url.concat(this.config.user);
        status_url = status_url.concat('/jobs/');
        status_url = status_url.concat(sessionId);

        console.log(this.config.user);
        request({ url: status_url, method: 'PUT', json: data, auth: {'user': this.config.user, 'pass': this.config.key}}, this._callback);
    }

    /**
     * Request call back function
     * @param error
     * @param response
     * @param body
     * @private
     */
    _callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }

    /**
     * Helper function gets called if the test is passing
     * @param test
     * @private
     */
    _passed (test) {
        console.log ("Test has Passed");
        var sessionId = container.helpers().WebDriverIO.browser.requestHandler.sessionID;
        this._updateSauceJob(sessionId, {"passed": true, "name": test.title});
    }

    /**
     * Helper function gets called if the test execution fails
     * @param test
     * @param error
     * @private
     */
    _failed (test, error) {
        console.log ("Test has failed");
        var sessionId = container.helpers().WebDriverIO.browser.requestHandler.sessionID;
        this._updateSauceJob(sessionId, {"passed": false, "name": test.title});
    }
}

module.exports = SauceHelper;
