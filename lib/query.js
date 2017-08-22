var forEach = require('lodash/forEach');
var map = require('lodash/map');

/**
 * Represents a single instance of an interaction with the blockchain, can be executed as a transaction or call
 * @constructor
 * @param {Address=} address - address instance associated with this query
 * @param {string=} method - the contract method this query will target
 * @param {Array} params - either a flat array of values which are the parameters or an array of type/value pairs
 * @param {string} params[].value - the value of a param
 * @param {string} params[].type - the type of a param
 * @returns {Query} new Query instance
 */
function Query (address, method, params) {
	if (!method) {
		params = method;
		method = address;
		address = null;
	}

	this.address = address;
	this.method = method;

	// clean up the params passed in so that we support both passing in an array of values as params OR an array of type/value param objects
	this.params = map(params || [], function (param) {
		if (typeof param === 'Object' && param.value) {
			return param;
		} else {
			return {value: param}
		}
	});

	this.return = null;

	return this;
}

/**
 * Adds a param to the call/transaction to be sent
 * @param {mixed} value - the value of the parameter in this query
 * @param {string=} type - the type of the the parameter if we are not aware of it
 * @returns {Query} instance of this query to chain method calls from
 */
Query.prototype.param = function (value, type) {
	this.params.push({
		value: value,
		type: type
	});

	return this;
}

/**
 * Set the return type for a query
 * @param {string} type - the type of the data returned by the query
 * @returns {Query} instance of this query to chain method calls from
 */
Query.prototype.returns = function (type) {
	this.return = type;

	return this;
}

/**
 * Gets the data for this query encoded as a URL to send to etherest against a particular address
 * @returns {string} the encoded URL part to execute this query
 */
Query.prototype.urlEncode = function () {
	var encoded = this.method;
	if (this.return) encoded += ':' + encodeType(this.return);
	encoded += '/';

	forEach(this.params, function (param) {
		if (param.type) encoded += param.type + ':';
		encoded += param.value;
		encoded += '/';
	});

	return encoded;
}

/**
 * Executes this query as a call
 * @param {Address} address - the address to execute the call against, required if the query was not constructed with one
 * @returns {Promise} a promise which resolves when the call has been completed with the value returned
 */
Query.prototype.call = function (address) {
	if (!address) address = this.address;
	if (!address) return Promise.reject("no address provided to execute call using");

	var encoded = this.urlEncode();

	return address.call(encoded);
}

/**
 * Executes this query as a transaction
 * @param {Address} address - the address to send the transaction to, required if the query was not constructed with one
 * @param {Object} options - options for the transaction
 * @param {string} options.from - the address this transaction is being sent from
 * @param {string} options.privateKey - the private key of the address this transaction is being sent from
 * @param {number} [options.value=0] - the amount ot eth to send with this transaction (1 = 1.0 Ether sent)
 * @param {number} [options.gasPrice=20] - the price to pay for gas for this transaction in gwei
 * @param {number} [options.gasLimit=200000] - the maximum amount of gas this transaction is allowed to use
 * @returns {Promise} a promise which resolves when the transaction has been submitted to the blockchain with a transaction id string
 */
Query.prototype.sendTransaction = function (address, options) {
	if (!options) {
		options = address;
		address = null;
	}

	if (!address) address = this.address;
	if (!address) return Promise.reject("no address provided to send transaction with");

	var encoded = this.urlEncode();

	return address.sendTransaction(encoded, options);
}

module.exports = Query;

function encodeType (type) {
	if (type.constructor === Array) {
		return type.join(',');
	} else {
		return type;
	}
}