var request = require('./request');
var Address = require('./address');

/**
 * The main entry point to the client library, can be instantiated or used as a static class upon which all instance methods are available
 * @constructor
 * @param {Object=} options - options to pass in to a new etherest instance 
 * @param {string=} options.server - url for the api server to use, allows you to roll your own Etherest instance with our open source code
 * @param {string=} options.apiKey - api key to send with requests
 * @returns {Etherest} new Etherest instance
 */
function Etherest (options) {
	options = options || {}

	this.server = options.server || Etherest.server;
	this.apiKey = options.apiKey || Etherest.apiKey;

	return this;
}

Etherest.server = 'https://api.etherest.io:8080/v1/';

/**
 * Creates a new address object linked to this etherest instance for executing queries against
 * @param {string} address - the address to instantiate the object with
 * @param {string=} network - network the address is associated with (ie main, ropsten etc)
 * @returns {Address} new address instance
 */
Etherest.prototype.address = function (address, network) {
	return new Address(this, address, network);
}

/**
 * Executes a request against this instance's etherest server
 * @param {Object=} options - custom options for the request (see request and browser-request for supported options)
 * @returns {Promise} promise which resolves when the request is complete with the response from etherest
 */
Etherest.prototype.request = function (options) {
	var apiKey = this.apiKEy;

	return new Promise(function (resolve, reject) {
		request(Object.assign({
			headers: {
				apiKey: apiKey
			}
		}, options || {}), function (err, response, body) {
			if (err) {
				reject(err);
				return;
			}

			try {
				var result = JSON.parse(body);
			} catch (err) {
				reject(err);
			}

			if (result.error) {
				reject(result.error);
				return;
			}

			resolve(result.response);
		});
	});
}

/**
 * Executes a call request against the etherest server
 * @param {string=} path - path to call relative to the base URL of the server
 * @returns {Promise} promise which resolves when the call is completed with the data returned from etherest
 */
Etherest.prototype.call = function (path) {
	var url = this.server + (path || '');

	return this.request({
		method: 'GET',
		url: url
	});
}

/**
 * Sends a transaction to the etherest server
 * @param {string=} path - path to send the transaction to relative to the base URL of the server
 * @param {Object} options - options for the transaction, see options argument of Query.options
 * @returns {Promise} a promise which resolves when the transaction has been submitted with an Ethereum txid
 */
Etherest.prototype.sendTransaction = function (path, options) {
	if (!path) {
		options = path;
		path = null;
	}

	options = options || {};
	options.gasLimit = options.gasLimit || 200000;
	options.gasPrice = options.gasPrice || 20;

	console.log(options);

	var url = this.server + (path || '');

	return this.request({
		method: 'POST',
		url: url,
		form: options
	});
}

// make etherest work without instantiating a new instance if we just want to use the default configuration
Object.assign(Etherest, Etherest.prototype);

module.exports = Etherest;