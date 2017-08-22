var forEach = require('lodash/forEach');
var map = require('lodash/map');

var Query = require('./query');

/**
 * Represents an address on the blockchain
 * @constructor
 * @param {Etherest} etherest - etherest connection instance associated with this address
 * @param {string} address - the ethereum address for this instance
 * @param {string} [network=main] - the network identifier this instance uses (ie main, ropsten, etc)
 * @returns {Address} new Address instance
 */
function Address (etherest, address, network) {
	if (!address) {
		network = address;
		address = etherest;
		etherest = null;
	}

	network = network || 'main';

	this.address = address;
	this.etherest = etherest;
	this.network = network;

	return this;
}

/**
 * Creates a new query object which is linked to this address instance
 * @param {string} method - name of the method which the query will call/sendTransaction against
 * @param {Array} params - array of params which will be passed with this query, can take the form of an array of values or value/type pairs. See constructor of Query
 * @returns {Query} new query instance
 */
Address.prototype.query = function (method, params) {
	return new Query(this, method);
}

/**
 * Creates a new query object for a method with params passed in as arguments
 * @param {string} name - the name of the method to be used for this query
 * @param {...*} param - params to be passed to the query
 * @returns {Query} new query instance
 */
Address.prototype.method = function (name /*, param1, param2, ...*/) {
	var params = Array.prototype.slice.call(arguments);
	var name = params.shift();

	var query = this.query(name, params);

	return query;
}

/**
 * Add a method to this instance with a given name and list of param types which returns a query when invoked
 * @param {string} name - the name of the method to be used for this query
 * @param {Array} params - array of types of the params to be passed to this method as arguments
 * @param {string} returns - the return type of the method
 * @returns {function} reference to the function defined
 */
Address.prototype.defineMethod = function (name, params, returns) {
	this[name] = function () {
		var args = Array.prototype.slice.call(arguments);
		var query = this.query(name);

		if (returns) query.returns(returns);

		forEach(params, function (type, index) {
			query.param(args[index], type);
		});

		return query;
	}

	return this[name];
}

/**
 * Add a method to this instance with a given name and list of param types which performs a call when invoked
 * @param {string} name - the name of the method to be used for this query
 * @param {Array} params - array of types of the params to be passed to this method as arguments
 * @param {string} returns - the return type of the method
 * @returns {function} reference to the function defined
 */
Address.prototype.defineCall = function (name, params, returns) {
	var method = this.defineMethod(name, params, returns);

	this[name] = function () {
		var query = method.apply(this, Array.prototype.slice.call(arguments));

		return query.call();
	}

	return this[name];
}

/**
 * Add a method to this instance with a given name and list of param types which creates a transaction when invoked
 * @param {string} name - the name of the method to be used for this query
 * @param {Array} params - array of types of the params to be passed to this method as arguments
 * @returns {function} reference to the function defined
 */
Address.prototype.defineTransaction = function (name, params) {
	var method = this.defineMethod(name, params);

	this[name] = function () {
		var args = Array.prototype.slice.call(arguments);
		var options = args[args.length - 1]; // options should be passed in as last parameter

		var query = method.apply(this, args.slice(0, args.length - 1));
		return query.sendTransaction(options);
	}

	return this[name];
}

/**
 * Create methods on this instance which match the definitions from a contract abi
 * @param {Array} abi - application binary interface for this address
 * @returns {Address} reference to this object for chaining calls
 */
Address.prototype.abi = function (abi) {
	var defineTransaction = this.defineTransaction;
	var defineCall = this.defineCall;

	var self = this;
	forEach(abi, function (define) {
		if (define.type === 'function') {
			var invoke = define.constant ? defineCall : defineTransaction;

			invoke.call(self, define.name, arrayToTypes(define.inputs), arrayToTypes(define.outputs));
		}
	});

	return this;
}

/**
 * Load the abi publically associated with this address on etherest
 * @returns {Promise} promise which resolves when the abi has been loaded with a reference to this address instance
 */
Address.prototype.loadAbi = function () {
	var self = this;
	return this.call()
	.then(function (response) {
		if (response.abi && response.abi) self.abi(response.abi);

		return self;
	});
}

/**
 * Gets the data for a request against an address encoded as a URL to send to etherest
 * @param {string} suffix - additional string data to add to the end of the URL
 * @returns {string} the encoded URL part to execute this query
 */
Address.prototype.urlEncode = function (suffix) {
	suffix = suffix || '';

	var encoded = this.network + '/' + this.address + '/' + suffix;

	return encoded;
}

/**
 * Executes a call against this address
 * @param {string} path - a relative path from this address to execute the call against
 * @returns {Promise} a promise which resolves when the call has been completed with the value returned
 */
Address.prototype.call = function (path) {
	var encoded = this.urlEncode(path);

	return this.etherest.call(encoded);
}

/**
 * Sends a transaction to the etherest server
 * @param {string} path - path to send the transaction to relative to this address
 * @param {Object} options - options for the transaction, see options argument of Query.options
 * @returns {Promise} a promise which resolves when the transaction has been submitted with an Ethereum txid
 */
Address.prototype.sendTransaction = function (path, options) {
	var encoded = this.urlEncode(path);

	return this.etherest.sendTransaction(encoded, options);
}

module.exports = Address;

function arrayToTypes (inputs) {
	return map(inputs, function (input) {
		return input.type;
	});
}