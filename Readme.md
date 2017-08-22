# ETHEREST JavaScript Client

[ETHEREST](https://www.etherest.io) provides a simple way to make calls and transactions to the Ethereum blockchain using a REST-like API. This library is a lightweight and flexible interface to the API which can be used in both Node.js and browser based projects. It's a fast way to start getting data from and mutating the blockchain without running your own node.

# Installation

## Node.js

You can install ETHEREST as an npm module: `npm install etherest`

As well as using server side, it's safe to webpack or browserify the npm module for use in browsers.

## Browsers

A standalone library for web browsers is also provided which can be embeded onto your page using jsdlvr's npm cdn:

`<script src="https://cdn.jsdelivr.net/npm/etherest@0.1/dist/etherest.min.js"></script>`

The browser script defines a global variable `Etherest` which is the same as the entry point of the default export of the npm module.

# Example Usage

## Call Without an ABI ([Sandiwch Shop](https://www.etherest.io/main/0x4dc924EeB4D87ab938f5a72fC0ef4460f6b35a8A/getSandwichInfoCaloriesPrice/2))

```javascript
Etherest
.address('0x4dc924EeB4D87ab938f5a72fC0ef4460f6b35a8A')
.method('getSandwichInfoCaloriesPrice')
.param(2, 'uint')
.returns(['string', 'string', 'string', 'uint256'])
.call()
.then(function (result) {
	console.log("Got info from the sandwich shop!");
	console.log(result);
});
```

## Transaction ([Rouleth](https://www.etherest.io/main/0x91A57B2F6FA86B373Bce5716eb26C81cbb004223/betOnNumber/7))

```javascript
Etherest
.address('0x91A57B2F6FA86B373Bce5716eb26C81cbb004223')
.method('betOnNumber')
.param(7, 'uint')
.sendTransaction({
	from: '0xd3c14E7E6Feb41d8210412fc77ef94a72d8B089b',
	privateKey: '5172eb05eb9b27e15d4fe963157967b2d6e13e128e79d9b6dc27acf4dcf654ab',
	value: 0.01
})
.then(function (txid) {
	console.log("Transaction ID: " + txid);
});
```

## Call Using a Public ABI ([Basic Attention Token](https://www.etherest.io/main/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/tokenExchangeRate))

```javascript
Etherest
.address('0x0D8775F648430679A709E98d2b0Cb6250d2887EF')
.loadAbi()
.then(function (basicAttentionToken) {
	basicAttentionToken
	.tokenExchangeRate()
	.then(function (rate) {
		console.log("1 ETH = " + rate + " Basic Attention Tokens");
	});
});
```

Got a private abi you want to use instead? Just provide it by calling `Etherest.address(...).abi([...])`. See the full documentation below for a deep dive into the library's full functionality.

## Etherest API

To learn more about the ETHEREST API check out some of our getting started guides:

* [Introducing ΞTHEREST — the easiest way to interact with the Ethereum Blockchain](https://blog.w3k.it/introducing-%CE%BEtherest-the-easiest-way-to-interact-with-the-ethereum-blockchain-fab0235f2180)
* [Automate your ÐICE dividend collection every quarter with ΞTHEREST](https://blog.w3k.it/automate-your-%C3%B0ice-dividend-collection-every-quarter-without-hassle-48bee072b2f7)
* [Making a call to Ethereum’s pre-eminent eating establishment](https://blog.w3k.it/making-a-call-to-ethereums-pre-eminent-eating-establishment-1545cd44c240)

# Full Documentation

<a name="Etherest"></a>

## Etherest
**Kind**: global class  

* [Etherest](#Etherest)
    * [new Etherest([options])](#new_Etherest_new)
    * [.address(address, [network])](#Etherest+address) ⇒ <code>Address</code>
    * [.request([options])](#Etherest+request) ⇒ <code>Promise</code>
    * [.call([path])](#Etherest+call) ⇒ <code>Promise</code>
    * [.sendTransaction([path], options)](#Etherest+sendTransaction) ⇒ <code>Promise</code>

<a name="new_Etherest_new"></a>

### new Etherest([options])
The main entry point to the client library, can be instantiated or used as a static class upon which all instance methods are available

**Returns**: [<code>Etherest</code>](#Etherest) - new Etherest instance  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options to pass in to a new etherest instance |
| [options.server] | <code>string</code> | url for the api server to use, allows you to roll your own Etherest instance with our open source code |
| [options.apiKey] | <code>string</code> | api key to send with requests |

<a name="Etherest+address"></a>

### etherest.address(address, [network]) ⇒ <code>Address</code>
Creates a new address object linked to this etherest instance for executing queries against

**Kind**: instance method of [<code>Etherest</code>](#Etherest)  
**Returns**: <code>Address</code> - new address instance  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | the address to instantiate the object with |
| [network] | <code>string</code> | network the address is associated with (ie main, ropsten etc) |

<a name="Etherest+request"></a>

### etherest.request([options]) ⇒ <code>Promise</code>
Executes a request against this instance's etherest server

**Kind**: instance method of [<code>Etherest</code>](#Etherest)  
**Returns**: <code>Promise</code> - promise which resolves when the request is complete with the response from etherest  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | custom options for the request (see request and browser-request for supported options) |

<a name="Etherest+call"></a>

### etherest.call([path]) ⇒ <code>Promise</code>
Executes a call request against the etherest server

**Kind**: instance method of [<code>Etherest</code>](#Etherest)  
**Returns**: <code>Promise</code> - promise which resolves when the call is completed with the data returned from etherest  

| Param | Type | Description |
| --- | --- | --- |
| [path] | <code>string</code> | path to call relative to the base URL of the server |

<a name="Etherest+sendTransaction"></a>

### etherest.sendTransaction([path], options) ⇒ <code>Promise</code>
Sends a transaction to the etherest server

**Kind**: instance method of [<code>Etherest</code>](#Etherest)  
**Returns**: <code>Promise</code> - a promise which resolves when the transaction has been submitted with an Ethereum txid  

| Param | Type | Description |
| --- | --- | --- |
| [path] | <code>string</code> | path to send the transaction to relative to the base URL of the server |
| options | <code>Object</code> | options for the transaction, see options argument of Query.options |

<a name="Address"></a>

## Address
**Kind**: global class  

* [Address](#Address)
    * [new Address(etherest, address, [network])](#new_Address_new)
    * [.query(method, params)](#Address+query) ⇒ <code>Query</code>
    * [.method(name, ...param)](#Address+method) ⇒ <code>Query</code>
    * [.defineMethod(name, params, returns)](#Address+defineMethod) ⇒ <code>function</code>
    * [.defineCall(name, params, returns)](#Address+defineCall) ⇒ <code>function</code>
    * [.defineTransaction(name, params)](#Address+defineTransaction) ⇒ <code>function</code>
    * [.abi(abi)](#Address+abi) ⇒ [<code>Address</code>](#Address)
    * [.loadAbi()](#Address+loadAbi) ⇒ <code>Promise</code>
    * [.urlEncode(suffix)](#Address+urlEncode) ⇒ <code>string</code>
    * [.call(path)](#Address+call) ⇒ <code>Promise</code>
    * [.sendTransaction(path, options)](#Address+sendTransaction) ⇒ <code>Promise</code>

<a name="new_Address_new"></a>

### new Address(etherest, address, [network])
Represents an address on the blockchain

**Returns**: [<code>Address</code>](#Address) - new Address instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| etherest | <code>Etherest</code> |  | etherest connection instance associated with this address |
| address | <code>string</code> |  | the ethereum address for this instance |
| [network] | <code>string</code> | <code>&quot;main&quot;</code> | the network identifier this instance uses (ie main, ropsten, etc) |

<a name="Address+query"></a>

### address.query(method, params) ⇒ <code>Query</code>
Creates a new query object which is linked to this address instance

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>Query</code> - new query instance  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | name of the method which the query will call/sendTransaction against |
| params | <code>Array</code> | array of params which will be passed with this query, can take the form of an array of values or value/type pairs. See constructor of Query |

<a name="Address+method"></a>

### address.method(name, ...param) ⇒ <code>Query</code>
Creates a new query object for a method with params passed in as arguments

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>Query</code> - new query instance  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the method to be used for this query |
| ...param | <code>\*</code> | params to be passed to the query |

<a name="Address+defineMethod"></a>

### address.defineMethod(name, params, returns) ⇒ <code>function</code>
Add a method to this instance with a given name and list of param types which returns a query when invoked

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>function</code> - reference to the function defined  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the method to be used for this query |
| params | <code>Array</code> | array of types of the params to be passed to this method as arguments |
| returns | <code>string</code> | the return type of the method |

<a name="Address+defineCall"></a>

### address.defineCall(name, params, returns) ⇒ <code>function</code>
Add a method to this instance with a given name and list of param types which performs a call when invoked

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>function</code> - reference to the function defined  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the method to be used for this query |
| params | <code>Array</code> | array of types of the params to be passed to this method as arguments |
| returns | <code>string</code> | the return type of the method |

<a name="Address+defineTransaction"></a>

### address.defineTransaction(name, params) ⇒ <code>function</code>
Add a method to this instance with a given name and list of param types which creates a transaction when invoked

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>function</code> - reference to the function defined  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the method to be used for this query |
| params | <code>Array</code> | array of types of the params to be passed to this method as arguments |

<a name="Address+abi"></a>

### address.abi(abi) ⇒ [<code>Address</code>](#Address)
Create methods on this instance which match the definitions from a contract abi

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: [<code>Address</code>](#Address) - reference to this object for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| abi | <code>Array</code> | application binary interface for this address |

<a name="Address+loadAbi"></a>

### address.loadAbi() ⇒ <code>Promise</code>
Load the abi publically associated with this address on etherest

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>Promise</code> - promise which resolves when the abi has been loaded with a reference to this address instance  
<a name="Address+urlEncode"></a>

### address.urlEncode(suffix) ⇒ <code>string</code>
Gets the data for a request against an address encoded as a URL to send to etherest

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>string</code> - the encoded URL part to execute this query  

| Param | Type | Description |
| --- | --- | --- |
| suffix | <code>string</code> | additional string data to add to the end of the URL |

<a name="Address+call"></a>

### address.call(path) ⇒ <code>Promise</code>
Executes a call against this address

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>Promise</code> - a promise which resolves when the call has been completed with the value returned  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | a relative path from this address to execute the call against |

<a name="Address+sendTransaction"></a>

### address.sendTransaction(path, options) ⇒ <code>Promise</code>
Sends a transaction to the etherest server

**Kind**: instance method of [<code>Address</code>](#Address)  
**Returns**: <code>Promise</code> - a promise which resolves when the transaction has been submitted with an Ethereum txid  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to send the transaction to relative to this address |
| options | <code>Object</code> | options for the transaction, see options argument of Query.options |

<a name="Query"></a>

## Query
**Kind**: global class  

* [Query](#Query)
    * [new Query([address], [method], params)](#new_Query_new)
    * [.param(value, [type])](#Query+param) ⇒ [<code>Query</code>](#Query)
    * [.returns(type)](#Query+returns) ⇒ [<code>Query</code>](#Query)
    * [.urlEncode()](#Query+urlEncode) ⇒ <code>string</code>
    * [.call(address)](#Query+call) ⇒ <code>Promise</code>
    * [.sendTransaction(address, options)](#Query+sendTransaction) ⇒ <code>Promise</code>

<a name="new_Query_new"></a>

### new Query([address], [method], params)
Represents a single instance of an interaction with the blockchain, can be executed as a transaction or call

**Returns**: [<code>Query</code>](#Query) - new Query instance  

| Param | Type | Description |
| --- | --- | --- |
| [address] | <code>Address</code> | address instance associated with this query |
| [method] | <code>string</code> | the contract method this query will target |
| params | <code>Array</code> | either a flat array of values which are the parameters or an array of type/value pairs |
| params[].value | <code>string</code> | the value of a param |
| params[].type | <code>string</code> | the type of a param |

<a name="Query+param"></a>

### query.param(value, [type]) ⇒ [<code>Query</code>](#Query)
Adds a param to the call/transaction to be sent

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: [<code>Query</code>](#Query) - instance of this query to chain method calls from  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>mixed</code> | the value of the parameter in this query |
| [type] | <code>string</code> | the type of the the parameter if we are not aware of it |

<a name="Query+returns"></a>

### query.returns(type) ⇒ [<code>Query</code>](#Query)
Set the return type for a query

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: [<code>Query</code>](#Query) - instance of this query to chain method calls from  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | the type of the data returned by the query |

<a name="Query+urlEncode"></a>

### query.urlEncode() ⇒ <code>string</code>
Gets the data for this query encoded as a URL to send to etherest against a particular address

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <code>string</code> - the encoded URL part to execute this query  
<a name="Query+call"></a>

### query.call(address) ⇒ <code>Promise</code>
Executes this query as a call

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <code>Promise</code> - a promise which resolves when the call has been completed with the value returned  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | the address to execute the call against, required if the query was not constructed with one |

<a name="Query+sendTransaction"></a>

### query.sendTransaction(address, options) ⇒ <code>Promise</code>
Executes this query as a transaction

**Kind**: instance method of [<code>Query</code>](#Query)  
**Returns**: <code>Promise</code> - a promise which resolves when the transaction has been submitted to the blockchain with a transaction id string  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>Address</code> |  | the address to send the transaction to, required if the query was not constructed with one |
| options | <code>Object</code> |  | options for the transaction |
| options.from | <code>string</code> |  | the address this transaction is being sent from |
| options.privateKey | <code>string</code> |  | the private key of the address this transaction is being sent from |
| [options.value] | <code>number</code> | <code>0</code> | the amount ot eth to send with this transaction (1 = 1.0 Ether sent) |
| [options.gasPrice] | <code>number</code> | <code>20</code> | the price to pay for gas for this transaction in gwei |
| [options.gasLimit] | <code>number</code> | <code>200000</code> | the maximum amount of gas this transaction is allowed to use |