const utils = require('./utils');
const assert = require('assert');
const should = require('should');

describe('utils.js module capitalize function', () => {
    it('string capitalize', () => {
        const result = utils.capitalize('hello');
        // assert.equal(result, 'Hello');
        result.should.be.equal('Hello');
    });
});