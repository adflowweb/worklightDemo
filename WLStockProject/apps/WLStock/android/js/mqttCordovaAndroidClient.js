/*
============================================================================ 
Licensed Materials - Property of IBM

5747-SM3
 
(C) Copyright IBM Corp. 1999, 2012 All Rights Reserved.
 
US Government Users Restricted Rights - Use, duplication or
disclosure restricted by GSA ADP Schedule Contract with
IBM Corp.
============================================================================
 */

/**
 * @namespace Messaging Send and receive messages using Android via a Cordova
 *            plugin.
 * 
 * <code><pre>
 * var client = new Messaging.Client(&quot;mqtthost.co.uk&quot;, 80, &quot;clientName&quot;);
 * client.onMessageArrived = function(message) {
 * 	alert(message.stringPayload);
 * }
 * client.connect();
 * client.subscribe(&quot;World&quot;);
 * var message = new Message(&quot;Hello&quot;);
 * message.destinationName = &quot;World&quot;;
 * client.send(message);
 * client.disconect();
 * </pre></code>
 * 
 * <p>
 * This programming interface allows a Javascript client applications to use the
 * MQTT V3.1 protocol to connect to an MQTT-supporting messaging server, for
 * example websphereMQ v7.5 with the MQ Telemetry feature installed.
 * 
 * The function supported includes:
 * <ol>
 * <li>Connecting to and disconnecting from a server. The server is identified
 * by its host name and port number.
 * <li>Specifying options that relate to the communications link with the
 * server, for example the frequency of keep-alive heartbeats, and whether
 * SSL/TLS is required.
 * <li>Subscribing to and receiving messages from MQTT Topics.
 * <li>Publishing a message to MQTT Topics.
 * </ol>
 * <p>
 * <h2>The API consists of two main objects:</h2>
 * The <b>Messaging.Client</b> object. This contains methods that provide the
 * functionality of the API, including provision of callbacks that notify the
 * application when a message arrives from or is delivered to the messaging
 * server, or when the status of its connection to the messaging server changes.
 * <p>
 * The <b>Messaging.Message</b> object. This encapsulates the payload of the
 * message along with various attributes associated with its delivery, in
 * particular the destination to which it has been (or is about to be) sent.
 * <p>
 * The programming interface validates parameters passed to it, and will throw
 * an Error containing an error message intended for developer use, if it
 * detects an error with any parameter.
 */
Messaging = (function(global) {

	/**
	 * Takes a String and calculates its length in bytes when encoded in UTF8.
	 * 
	 * @private
	 */
	function UTF8Length(input) {
		var output = 0;
		for ( var i = 0; i < input.length; i++) {
			var charCode = input.charCodeAt(i);
			if (charCode > 0x7FF)
				output += 3;
			else if (charCode > 0x7F)
				output += 2;
			else
				output++;
		}
		return output;
	}

	/**
	 * Takes a String and writes it into an array as UTF8 encoded bytes.
	 * 
	 * @private
	 */
	function stringToUTF8(input, output, start) {
		var pos = start;
		for ( var i = 0; i < input.length; i++) {
			var charCode = input.charCodeAt(i);
			if (charCode <= 0x7F) {
				output[pos++] = charCode;
			} else if (charCode <= 0x7FF) {
				output[pos++] = charCode >> 6 & 0x1F | 0xC0;
				output[pos++] = charCode & 0x3F | 0x80;
			} else if (charCode <= 0xFFFF) {
				output[pos++] = charCode >> 12 & 0x0F | 0xE0;
				output[pos++] = charCode >> 6 & 0x3F | 0x80;
				output[pos++] = charCode & 0x3F | 0x80;
			} else {
				output[pos++] = charCode >> 18 & 0x07 | 0xF0;
				output[pos++] = charCode >> 12 & 0x3F | 0x80;
				output[pos++] = charCode >> 6 & 0x3F | 0x80;
				output[pos++] = charCode & 0x3F | 0x80;
			}
		}
		return output;
	}

	function parseUTF8(input, offset, length) {
		var output = "";
		var utf16;
		var pos = offset;

		while (pos < offset + length) {
			var byte1 = input[pos++];
			if (byte1 < 128)
				utf16 = byte1;
			else {
				var byte2 = input[pos++] - 128;
				if (byte2 < 0)
					throw new Error("Malformed UTF data:" + byte1.toString(16)
							+ " " + byte2.toString(16));
				if (byte1 < 0xE0) // 2 byte character
					utf16 = 64 * (byte1 - 0xC0) + byte2;
				else {
					var byte3 = input[pos++] - 128;
					if (byte3 < 0)
						throw new Error("Malformed UTF data:"
								+ byte1.toString(16) + " " + byte2.toString(16)
								+ " " + byte3.toString(16));
					if (byte1 < 0xF0) // 3 byte character
						utf16 = 4096 * (byte1 - 0xE0) + 64 * byte2 + byte3;
					else
						// longer encodings are not
						// supported
						throw new Error("Malformed UTF data: "
								+ byte1.toString(16) + " " + byte2.toString(16)
								+ " " + byte3.toString(16));
				}
			}
			output += String.fromCharCode(utf16);
		}
		return output;
	}

	/**
	 * Validate an object's parameter names to ensure they match a list of
	 * expected variables name for this option type. Used to ensure option
	 * object passed into the API don't contain erroneous parameters.
	 * 
	 * @param {Object}
	 *            obj User options object
	 * @param {key:type,
	 *            key2:type, ...} valid keys and types that may exist in obj.
	 * @throws {Error}
	 *             Invalid option parameter found.
	 * @private
	 */
	var validate = function(obj, keys) {
		for (key in obj) {
			if (obj.hasOwnProperty(key) && keys.hasOwnProperty(key)) {
				if (typeof obj[key] !== keys[key])
					throw new Error("InvalidType:" + typeof obj[key] + " for "
							+ key + " type should be " + keys[key]);
			} else {
				var errorStr = "Unknown property, " + key
						+ ". Valid properties are:";
				for (key in keys)
					if (keys.hasOwnProperty(key))
						errorStr = errorStr + " " + key;
				throw new Error(errorStr);
			}
		}
	};

	/*
	 * Internal implementation of the Cordova-based MQTT V3.1 client.
	 * 
	 * @name Messaging.ClientImpl @constructor @param {String} host the DNS name
	 * of the host. @param {Number} port the port number on the host. @param
	 * {String} clientId the MQ client identifier.
	 */
	var ClientImpl = function(host, port, clientId) {
		this._trace("Messaging.Client", host, port, clientId);

		this.host = host;
		this.port = port;
		this.clientId = clientId || generateClientId();

		this.__defineGetter__("trace", function() {
			return this.traceFunction;
		});
		this.__defineSetter__("trace", function(trace) {
			if (typeof trace === "function") {
				this.traceFunction = trace;
				this.enable_trace();
			} else if (trace == null) {
				this.traceFunction = null;
				this.disable_trace();
			} else
				throw new Error("Invalid argument:" + trace);
		});

		var context = this; // the callback may run in another scope, so we need
		// access to "this"
		var traceCallback = function(arg) {
			if (context.traceFunction) {
				context.traceFunction(arg);
			}
		};

		cordova.exec(traceCallback, traceCallback, "MqttPlugin",
				PLUGIN_ACTION.SET_TRACE_CALLBACK, []);
	};

	// generate a pseudo-random clientId of 23 characters
	var GENERATED_CLIENT_ID_LENGTH = 23;
	var generateClientId = function() {
		var lettersAndNumbers = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var result = "";
		for ( var i = 0; i < GENERATED_CLIENT_ID_LENGTH; i++) {
			result += lettersAndNumbers.charAt(Math.random() * 62);
		}
		return result;
	};

	// plugin actions - see MqttServiceContents.java
	var PLUGIN_ACTION = {
		SEND_ACTION : "send",
		ACKNOWLEDGE_RECEIPT_ACTION : "acknowledgeReceipt",
		UNSUBSCRIBE_ACTION : "unsubscribe",
		SUBSCRIBE_ACTION : "subscribe",
		DISCONNECT_ACTION : "disconnect",
		CONNECT_ACTION : "connect",
		GET_CLIENT_ACTION : "getClient",
		START_SERVICE_ACTION : "startService",
		STOP_SERVICE_ACTION : "stopService",
		MESSAGE_ARRIVED_ACTION : "messageArrived",
		MESSAGE_DELIVERED_ACTION : "messageDelivered",
		ON_CONNECTION_LOST_ACTION : "onConnectionLost",
		TRACE_ACTION : "trace",
		SET_ON_CONNECT_CALLBACK : "setOnConnectCallbackId",
		SET_ON_CONNECTIONLOST_CALLBACK : "setOnConnectionLostCallbackId",
		SET_ON_MESSAGE_ARRIVED_CALLBACK : "setOnMessageArrivedCallbackId",
		SET_ON_MESSAGE_DELIVERED_CALLBACK : "setOnMessageDeliveredCallbackId",
		SET_TRACE_CALLBACK : "setTraceCallbackId",
		SET_TRACE_ENABLED : "setTraceEnabled",
		SET_TRACE_DISABLED : "setTraceDisabled",
		SEND_SUCCESSFUL_CALLBACK_ID : "sendSuccessfulCallbackId"
	};

	// Messaging Client public instance members.
	ClientImpl.prototype.host;
	ClientImpl.prototype.port;
	ClientImpl.prototype.clientId;
	ClientImpl.prototype.clientHandle;

	// Messaging Client private instance members.
	ClientImpl.prototype.connectOptions;
	ClientImpl.prototype.serviceStarted = false;
	ClientImpl.prototype.connected = false;
	ClientImpl.prototype.clientHandle;

	// Messaging client callback functions
	ClientImpl.prototype.onConnectionLost;
	ClientImpl.prototype.onMessageDelivered;
	ClientImpl.prototype.onMessageArrived;
	ClientImpl.prototype.traceFunction;

	// convert a message as returned by the plugin to a Messaging message object
	// The plugin can't do this directly as the version of JSON available
	// doesn't
	// support typed arrays
	ClientImpl.prototype.messageFromPluginMessage = function(pluginMessage) {
		var returnMessage = new Message(new Uint8Array(pluginMessage.payload));
		returnMessage.qos = pluginMessage.qos;
		returnMessage.duplicate = pluginMessage.duplicate;
		returnMessage.retained = pluginMessage.retained;
		
		// destinationName isn't available in the onMessageDelivered case
		returnMessage.destinationName = pluginMessage.destinationName || "";
		return returnMessage;
	};

	ClientImpl.prototype.enable_trace = function() {
		cordova.exec(null, null, "MqttPlugin", PLUGIN_ACTION.SET_TRACE_ENABLED,
				[]);
	};

	ClientImpl.prototype.disable_trace = function() {
		cordova.exec(null, null, "MqttPlugin",
				PLUGIN_ACTION.SET_TRACE_DISABLED, []);
	};

	// Connect to the client using the specified options
	ClientImpl.prototype.connect = function(connectOptions) {
		this._trace("Client.connect", connectOptions, this.socket,
				this.connected);

		if (this.connected) {
			throw new Error("Invalid state, already connected");
		}

		this.connected = false;

		// The logic here is a little tricky, due to the asynchronous
		// nature of the APIs involved.
		// We first need to get a suitable clientHandle from the plugin
		// which in turn may need to start the relevant android service
		// We therefore chain these operations based on success callbacks.

		if (this.serviceStarted == false) {
			this.startService(connectOptions);
		} else {
			this.getClient(connectOptions);
		}
	};

	// call the plugin to start the service, chaining to getting a client handle
	ClientImpl.prototype.startService = function(connectOptions) {
		this._trace("Client.startService");
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var failureCallback = function() {
		};

		var successCallback = function() {
			context.serviceStarted = true;
			context.getClient(connectOptions);
		};
		cordova.exec(successCallback, failureCallback, "MqttPlugin",
				PLUGIN_ACTION.START_SERVICE_ACTION, []);
	};

	// The actual call to the plugin to connect to an mqtt server
	ClientImpl.prototype._connect = function(connectOptions) {
		this._trace("Client._connect", connectOptions, this.connected);
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var timeout = 30 * 1000; // 30 seconds, expressed in milliseconds
		if (connectOptions.timeout) {
			timeout = connectOptions.timeout;
		}

		var cleanSession = false;
		if (connectOptions.cleanSession) {
			cleanSession = connectOptions.cleanSession;
		}

		var userName = null;
		if (connectOptions.userName) {
			userName = connectOptions.userName;
		}

		var password = null;
		if (connectOptions.password) {
			password = connectOptions.password;
		}

		var keepAliveInterval = 60; // seconds
		if (connectOptions.keepAliveInterval) {
			keepAliveInterval = connectOptions.keepAliveInterval;
		}

		var willMessage = null;
		if (connectOptions.willMessage) {
			// message.payloadBytes may not be Uint8Array...
			// So we need a Uint8Array view on the underlying ArrayBuffer
			var payloadBytes;
			if (connectOptions.willMessage.payloadBytes instanceof Uint8Array) {
				payloadBytes = connectOptions.willMessage.payloadBytes;
			} else if (connectOptions.willMessage.payloadBytes instanceof ArrayBuffer) {
				payloadBytes = new Uint8Array(
						connectOptions.willMessage.payloadBytes);
			} else { // must be some other typed array
				payloadBytes = new Uint8Array(
						connectOptions.willMessage.payloadBytes.buffer);
			}

			willMessage = {
				payload : payloadBytes,
				destinationName : connectOptions.willMessage.destinationName,
				qos : connectOptions.willMessage.qos,
				retained : connectOptions.willMessage.retained,
				duplicate : connectOptions.willMessage.duplicate
			};
		}

		var useSSL = false;
		if (connectOptions.useSSL) {
			useSSL = connectOptions.useSSL;
		}

		var successCallback;
		if (connectOptions.onSuccess) {
			successCallback = function(response) {
				context.connected = true;
				connectOptions.onSuccess(response);
			};
		} else {
			successCallback = function(response) {
				context.connected = true;
				context._trace("connect - succeeded");
			};
		}

		var failureCallback;
		if (connectOptions.onFailure) {
			failureCallback = connectOptions.onFailure, this;
		} else {
			failureCallback = function(e) {
				context._trace("connect - failed : " + e);
			};
		}

		var sslProperties = connectOptions.sslProperties || {};

		var invocationContext = connectOptions.invocationContext || {};

		cordova
				.exec(successCallback, failureCallback, "MqttPlugin",
						PLUGIN_ACTION.CONNECT_ACTION, [ this.clientHandle,
								timeout, cleanSession, userName, password,
								keepAliveInterval, willMessage, useSSL,
								sslProperties, invocationContext ]);
	};

	// call to the plugin to allocate a java client object and return a "handle"
	// to it
	ClientImpl.prototype.getClient = function(connectOptions) {
		this._trace("Client.getClient");
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var successCallback = function(clientHandle) {
			// on success, we store the handle,
			// and set up our wrappers for the external
			// client's "unsolicited" callbacks
			context.clientHandle = clientHandle;
			context._trace("Client.getClient succeeded - " + clientHandle);

			var onConnectionLostImpl = function(why) {
				context._trace("onConnectionLost - " + why);
				context.connected = false;
				if (context.onConnectionLost) {
					context.onConnectionLost(why);
				}
			};

			var onMessageDeliveredImpl = function(message) {
				message = message || {};
				context._trace("onMessageDelivered {" + message.payload + "}");
				if (context.onMessageDelivered) {
					context.onMessageDelivered(context
							.messageFromPluginMessage(message));
				}
			};

			var onMessageArrivedImpl = function(message) {
				message = message || {};
				context._trace("onMessageArrived {" + message.payload + "}");
				if (context.onMessageArrived) {
					context.onMessageArrived(context
							.messageFromPluginMessage(message));
				}
				cordova.exec(null, null, "MqttPlugin",
						PLUGIN_ACTION.ACKNOWLEDGE_RECEIPT_ACTION, [
								clientHandle, message.messageId ]);
			};

			cordova.exec(onConnectionLostImpl, onConnectionLostImpl,
					"MqttPlugin", PLUGIN_ACTION.SET_ON_CONNECTIONLOST_CALLBACK,
					[ clientHandle ]);
			cordova.exec(onMessageDeliveredImpl, onMessageDeliveredImpl,
					"MqttPlugin",
					PLUGIN_ACTION.SET_ON_MESSAGE_DELIVERED_CALLBACK,
					[ clientHandle ]);
			cordova.exec(onMessageArrivedImpl, onMessageArrivedImpl,
					"MqttPlugin",
					PLUGIN_ACTION.SET_ON_MESSAGE_ARRIVED_CALLBACK,
					[ clientHandle ]);

			// Now actually attempt to connect
			context._connect(connectOptions);
		};

		var failureCallback = function(e) {
			context._trace("Client.getClient FAILED " + e + "!");
		};
		cordova.exec(successCallback, failureCallback, "MqttPlugin",
				PLUGIN_ACTION.GET_CLIENT_ACTION, [ this.host, this.port,
						this.clientId ]);

	};

	// call to the plugin to subscribe to a topic (possibly wildcarded)
	// with specific options
	ClientImpl.prototype.subscribe = function(filter, subscribeOptions) {
		var current_operation = "Client.subscribe";
		this._trace(current_operation, filter, subscribeOptions);
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var qos = 0;
		if (typeof subscribeOptions.qos !== "undefined") {
			qos = subscribeOptions.qos;
		}

		var successCallback;
		if (subscribeOptions.onSuccess) {
			successCallback = subscribeOptions.onSuccess;
		} else {
			successCallback = function(response) {
				context._trace(current_operation
						+ " succeeded - invocationContext {"
						+ response.invocationContext + "}");
			};
		}

		var failureCallback;
		if (subscribeOptions.onFailure) {
			failureCallback = subscribeOptions.onFailure;
		} else {
			failureCallback = function(e) {
				context._trace(current_operation + " Failed - response {" + e
						+ "}");
			};
		}

		if (!this.connected) {
			var errorMessage = "Invalid state, not connected";
			if (subscribeOptions.onFailure) {
				subscribeOptions.onFailure({
					invocationContext : subscribeOptions.invocationContext,
					errorMessage : errorMessage,
					errorCode : -1
				});
			}
			throw new Error(errorMessage);
		}

		var invocationContext = subscribeOptions.invocationContext;

		cordova.exec(successCallback, failureCallback, "MqttPlugin",
				PLUGIN_ACTION.SUBSCRIBE_ACTION, [ this.clientHandle, filter,
						qos, invocationContext ]);

	};

	// call to the plugin to unsubscribe from a topic (possibly wildcarded)
	// with specific options
	ClientImpl.prototype.unsubscribe = function(filter, unsubscribeOptions) {
		var current_operation = "Client.unsubscribe";
		this._trace(current_operation, filter, unsubscribeOptions);
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var successCallback;
		if (unsubscribeOptions.onSuccess) {
			successCallback = unsubscribeOptions.onSuccess;
		} else {
			successCallback = function() {
				context._trace(current_operation + " succeeded");
			};
		}

		var failureCallback;
		if (unsubscribeOptions.onFailure) {
			failureCallback = unsubscribeOptions.onFailure;
		} else {
			failureCallback = function(e) {
				context._trace(current_operation + " Failed - response {" + e
						+ "}");
			};
		}

		if (!this.connected) {
			var errorMessage = "Invalid state, not connected";
			if (unsubscribeOptions.onFailure) {
				unsubscribeOptions.onFailure({
					invocationContext : unsubscribeOptions.invocationContext,
					errorMessage : errorMessage,
					errorCode : -1
				});
				return;
			}
			throw new Error(errorMessage);
		}

		var invocationContext = unsubscribeOptions.invocationContext;

		cordova.exec(successCallback, failureCallback, "MqttPlugin",
				PLUGIN_ACTION.UNSUBSCRIBE_ACTION, [ this.clientHandle, filter,
						invocationContext ]);

	};

	// call to the plugin to send an message with specific options
	ClientImpl.prototype.send = function(message, sendOptions) {
		var current_operation = "Client.send";
		this._trace(current_operation, message, sendOptions);
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var successCallback;
		if (sendOptions.onSuccess) {
			successCallback = sendOptions.onSuccess;
		} else {
			successCallback = function() {
				context._trace(current_operation + " succeeded");
			};
		}

		var failureCallback;
		if (sendOptions.onFailure) {
			failureCallback = sendOptions.onFailure;
		} else {
			failureCallback = function(e) {
				context._trace(current_operation + " Failed - response {" + e
						+ "}");
			};
		}

		if (!this.connected) {
			var errorMessage = "Invalid state, not connected";
			if (sendOptions.onFailure) {
				sendOptions.onFailure({
					errorMessage : errorMessage,
					errorCode : -1
				});
				return;
			}
			throw new Error(errorMessage);
		}

		var invocationContext = sendOptions.invocationContext;

		// message.payloadBytes may not be Uint8Array...
		// So we need a Uint8Array view on the underlying ArrayBuffer
		var payloadBytes;
		if (message.payloadBytes instanceof Uint8Array) {
			payloadBytes = message.payloadBytes;
		} else if (message.payloadBytes instanceof ArrayBuffer) {
			payloadBytes = new Uint8Array(message.payloadBytes);
		} else { // must be some other typed array
			payloadBytes = new Uint8Array(message.payloadBytes.buffer);
		}
		// Converting longhand seems safest...
		var payloadArray = [];
		for ( var i = 0; i < payloadBytes.length; i++) {
			payloadArray[i] = payloadBytes[i];
		}
		var messageToPlugin = {
			// convert from typed array buffer
			payload : payloadArray,
			destinationName : message.destinationName,
			qos : message.qos,
			retained : message.retained,
			duplicate : message.duplicate
		};

		cordova.exec(successCallback, failureCallback, "MqttPlugin",
				PLUGIN_ACTION.SEND_ACTION, [ this.clientHandle,
						messageToPlugin, invocationContext ]);

	};

	// call to the plugin to disconnect from the server
	ClientImpl.prototype.disconnect = function(disconnectOptions) {
		var current_operation = "Client.disconnect";
		this._trace(current_operation);
		var context = this; // callbacks may run in another scope, so we need
		// access to "this"

		var successCallback;
		if (disconnectOptions.onSuccess) {
			successCallback = disconnectOptions.onSuccess;
		} else {
			successCallback = function() {
				context._trace("disconnect - succeeded");
			};
		}

		var failureCallback;
		if (disconnectOptions.onFailure) {
			failureCallback = disconnectOptions.onFailure;
		} else {
			failureCallback = function(e) {
				context._trace("disconnect - failed : " + e);
			};
		}

		var invocationContext = disconnectOptions.invocationContext || {};

		if (!this.connected) {
			successCallback({
				invocationContext : invocationContext
			});
			return;
		}

		cordova.exec(successCallback, failureCallback, "MqttPlugin",
				PLUGIN_ACTION.DISCONNECT_ACTION, [ this.clientHandle,
						invocationContext ]);

	};

	// tracing support
	ClientImpl.prototype._traceBuffer = null;
	ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;

	ClientImpl.prototype.getTraceLog = function() {
		if (this._traceBuffer !== null) {
			this._trace("Client.getTraceLog", new Date());
			return this._traceBuffer;
		}
		;
	};

	ClientImpl.prototype.startTrace = function() {
		if (this._traceBuffer === null) {
			this._traceBuffer = [];
		}
		this._trace("Client.startTrace", new Date());
	};

	ClientImpl.prototype.stopTrace = function() {
		delete this._traceBuffer;
	};

	ClientImpl.prototype._trace = function() {
		if (this._traceBuffer !== null) {
			for ( var i = 0, max = arguments.length; i < max; i++) {
				if (this._traceBuffer == this._MAX_TRACE_ENTRIES) {
					this._traceBuffer.shift();
				}
				if (i === 0)
					this._traceBuffer.push(arguments[i]);
				else if (typeof arguments[i] === "undefined")
					this._traceBuffer.push(arguments[i]);
				else
					this._traceBuffer.push("  " + JSON.stringify(arguments[i]));
			}
			;
		}
		;
	};

	// ------------------------------------------------------------------------
	// Public Programming interface.
	// ------------------------------------------------------------------------

	/**
	 * The Javascript application communicates to the server using a
	 * Messaging.Client object. Most applications will create just one Client
	 * object and then call its connect() method, however applications can
	 * create more than one Client object if they wish. In this case the
	 * combination of host, port and clientId attributes must be different for
	 * each Client object.
	 * <p>
	 * The send, subscribe and unsubscribe methods are implemented as
	 * asynchronous Javascript methods (even though the underlying protocol
	 * exchange might be synchronous in nature). This means they signal their
	 * completion by calling back to the application, via Success or Failure
	 * callback functions provided by the application on the method in question.
	 * Such callbacks are called at most once per method invocation and do not
	 * persist beyond the lifetime of the script that made the invocation.
	 * <p>
	 * In contrast there are some callback functions <i> most notably
	 * onMessageArrived</i> that are defined on the Messaging.Client object.
	 * These may get called multiple times, and aren't directly related to
	 * specific method invocations made by the client.
	 * 
	 * @name Messaging.Client
	 * 
	 * @constructor Creates a Messaging.Client object that can be used to
	 *              communicate with a Messaging server.
	 * 
	 * @param {string}
	 *            host the address of the messaging server, as a DNS name or
	 *            dotted decimal IP address.
	 * @param {number}
	 *            port the port number in the host to connect to.
	 * @param {string}
	 *            clientId the Messaging client identifier, between 1 and 23
	 *            characters in length.
	 * 
	 * @property {string} host <i>read only</i> the servers DNS hostname.
	 * @property {number} port <i>read only</i> the servers port.
	 * @property {string} clientId <i>read only</i> used when connecting to the
	 *           server.
	 * @property {function} onConnect called when a connection has been made.
	 * @property {function} onConnectionLost called when a connection has been
	 *           lost. Establish the call back used when a connection has been
	 *           lost. The connection may be lost because the client initiates a
	 *           disconnect or because the server or network cause the client to
	 *           be disconnected. The disconnect call back may be called without
	 *           the connectionComplete call back being invoked if, for example
	 *           the client fails to connect.
	 * @property {function} onMessageDelivered called when a message has been
	 *           delivered.
	 * @property {function} onMessageArrived called when a message has arrived
	 *           in this Messaging.client.
	 */
	var Client = function(host, port, clientId) {
		if (typeof host !== "string")
			throw new Error("Invalid argument:" + host);
		if (typeof port !== "number" || port <= 0)
			throw new Error("Invalid argument:" + port);
		if ((typeof clientId !== "undefined")
				&& (typeof clientId !== "string" || clientId.length > 23))
			throw new Error("Invalid argument:" + clientId);

		var clientIdWasBlank = ((typeof clientId === "undefined") || (clientId
				.trim() == ""));

		var client = new ClientImpl(host, port, clientId);

		this.__defineGetter__("host", function() {
			return client.host;
		});
		this.__defineSetter__("host", function() {
			throw new Error("Unsupported operation.");
		});

		this.__defineGetter__("port", function() {
			return client.port;
		});
		this.__defineSetter__("port", function() {
			throw new Error("Unsupported operation.");
		});

		this.__defineGetter__("clientId", function() {
			return client.clientId;
		});
		this.__defineSetter__("clientId", function() {
			throw new Error("Unsupported operation.");
		});

		this.__defineGetter__("onConnectionLost", function() {
			return client.onConnectionLost;
		});
		this.__defineSetter__("onConnectionLost",
				function(newOnConnectionLost) {
					if (typeof newOnConnectionLost === "function")
						client.onConnectionLost = newOnConnectionLost;
					else
						throw new Error("Invalid argument:"
								+ newOnConnectionLost);
				});

		this.__defineGetter__("onMessageDelivered", function() {
			return client.onMessageDelivered;
		});
		this.__defineSetter__("onMessageDelivered", function(
				newOnMessageDelivered) {
			if (typeof newOnMessageDelivered === "function")
				client.onMessageDelivered = newOnMessageDelivered;
			else
				throw new Error("Invalid argument:" + newOnMessageDelivered);
		});

		this.__defineGetter__("onMessageArrived", function() {
			return client.onMessageArrived;
		});
		this.__defineSetter__("onMessageArrived",
				function(newOnMessageArrived) {
					if (typeof newOnMessageArrived === "function")
						client.onMessageArrived = newOnMessageArrived;
					else
						throw new Error("Invalid argument:"
								+ newOnMessageArrived);
				});

		this.__defineGetter__("trace", function() {
			return client.trace;
		});
		this.__defineSetter__("trace", function(trace) {
			if ((typeof trace === "function") || (trace == null))
				client.trace = trace;
			else
				throw new Error("Invalid argument:" + trace);
		});

		/**
		 * Connect this Messaging client to its server.
		 * 
		 * @name Messaging.Client#connect
		 * @function
		 * @param {Object}
		 *            [connectOptions] attributes used with the connection.
		 *            <p>
		 *            Properties of the connect options are:
		 * @config {object} [context] passed to the onSuccess callback or
		 *         onFailure callback.
		 * @config {number} [timeout] If the connect has not succeeded within
		 *         this number of seconds, it is deemed to have failed. The
		 *         default is 30 seconds.
		 * @config {string} [userName] Authentication username for this
		 *         connection.
		 * @config {string} [password] Authentication password for this
		 *         connection.
		 * @config {Messaging.Message} [willMessage] sent by the server when the
		 *         client disconnects abnormally.
		 * @config {Number} [keepAliveInterval] the server disconnects this
		 *         client if there is no activity for this number of seconds.
		 *         The default value of 60 seconds is assumed by the server if
		 *         not set.
		 * @config {boolean} [cleanSession] if true(default) the client and
		 *         server persistent state is deleted on succesful connect.
		 * @config {boolean} [useSSL] if present and true, use an SSL
		 *         connection.
		 */
		this.connect = function(connectOptions) {
			connectOptions = connectOptions || {};
			validate(connectOptions, {
				invocationContext : "object",
				timeout : "number",
				userName : "string",
				password : "string",
				willMessage : "object",
				keepAliveInterval : "number",
				cleanSession : "boolean",
				useSSL : "boolean",
				sslProperties : "object",
				onSuccess : "function",
				onFailure : "function"
			});
			if (connectOptions.willMessage) {
				if (!(connectOptions.willMessage instanceof Message)) {
					var errorMessage = "Invalid argument:"
							+ connectOptions.willMessage;
					if (connectOptions.onFailure) {
						connectOptions.onFailure({
							errorMessage : errorMessage,
							errorCode : -1
						});
						return;
					} else {
						throw new Error(errorMessage);
					}
				}
				// The will message must have a payload that can be represented
				// as a string.
				// Cause the willMessage to throw an exception if this is not
				// the case.
				connectOptions.willMessage.stringPayload;

				if (typeof connectOptions.willMessage.destinationName === "undefined") {
					var errorMessage = "Invalid parameter connectOptions.willMessage.destinationName:"
							+ connectOptions.willMessage.destinationName;
					if (connectOptions.onFailure) {
						connectOptions.onFailure({
							errorMessage : errorMessage,
							errorCode : -1
						});
						return;
					} else {
						throw new Error(errorMessage);
					}
				}
			}
			if (connectOptions.sslProperties) {
				validate(connectOptions.sslProperties, {
					keyStore : "string",
					keyStoreType : "string",
					keyStorePassword : "string",
					trustStore : "string",
					trustStoreType : "string",
					trustStorePassword : "string"
				});
			}
			if (typeof connectOptions.cleanSession === "undefined")
				connectOptions.cleanSession = true;

			if (clientIdWasBlank && !connectOptions.cleanSession) {
				var errorMessage = "Invalid argument:"
						+ connectOptions.cleanSession;
				if (connectOptions.onFailure) {
					connectOptions.onFailure({
						errorMessage : errorMessage,
						errorCode : -1
					});
					return;
				} else {
					throw new Error(errorMessage);
				}
			}

			client.connect(connectOptions);
		};

		/**
		 * Subscribe for messages, request receipt of a copy of messages sent to
		 * the destinations described by the filter.
		 * 
		 * @name Messaging.Client#subscribe
		 * @function
		 * @param {string}
		 *            filter describing the destinations to receive messages
		 *            from. <br>
		 * @param {object}
		 *            [subscribeOptions] used to control the subscription, as
		 *            follows:
		 * @config {object} [context] passed to the onSuccess callback or
		 *         onFailure callback.
		 * @config {function} [onSuccess] called when the subscribe reqtest has
		 *         been received and processed by the server.
		 * @config {function} [onFailure] called when the subscribe request has
		 *         failed or timed out.
		 */
		this.subscribe = function(filter, subscribeOptions) {
			subscribeOptions = subscribeOptions || {};
			validate(subscribeOptions, {
				qos : "number",
				invocationContext : "object",
				onSuccess : "function",
				onFailure : "function"
			});

			if (typeof subscribeOptions.qos !== "undefined"
					&& !(subscribeOptions.qos === 0
							|| subscribeOptions.qos === 1 || subscribeOptions.qos === 2)) {
				var errorMessage = "Invalid option:" + qos;
				if (subscribeOptions.onFailure) {
					subscribeOptions.onFailure({
						invocationContext : subscribeOptions.invocationContext,
						errorMessage : errorMessage,
						errorCode : -1
					});
					return;
				} else {
					throw new Error(errorMessage);
				}
			}

			if ((typeof filter !== "string") || (filter == "")) {
				var errorMessage = "Invalid argument: '" + filter + "'";
				if (subscribeOptions.onFailure) {
					subscribeOptions.onFailure({
						invocationContext : subscribeOptions.invocationContext,
						errorMessage : errorMessage,
						errorCode : -1
					});
					return;
				} else {
					throw new Error(errorMessage);
				}
			}

			client.subscribe(filter, subscribeOptions);
		};

		/**
		 * Unsubscribe for messages, stop receiving messages sent to
		 * destinations described by the filter.
		 * 
		 * @name Messaging.Client#unsubscribe
		 * @function
		 * @param {string}
		 *            filter describing the destinations to receive messages
		 *            from.
		 * @param {object}
		 *            [unsubscribeOptions] used to control the subscription, as
		 *            follows:
		 *            <p>
		 * @config {object} [context] passed to the onSuccess callback or
		 *         onFailure callback.
		 * @config {function} [onSuccess] called when the unsubscribe has been
		 *         received and processed by the server.
		 * @config {function} [onFailure] called when the unsubscribe request
		 *         has failed or timed out.
		 */
		this.unsubscribe = function(filter, unsubscribeOptions) {
			unsubscribeOptions = unsubscribeOptions || {};
			validate(unsubscribeOptions, {
				invocationContext : "object",
				onSuccess : "function",
				onFailure : "function"
			});

			if ((typeof filter !== "string") || (filter == "")) {
				var errorMessage = "Invalid argument: '" + filter + "'";
				if (unsubscribeOptions.onFailure) {
					unsubscribeOptions.onFailure({
						invocationContext : unsubscribeOptions.invocationContext,
						errorMessage : errorMessage,
						errorCode : -1
					});
					return;
				} else {
					throw new Error(errorMessage);
				}
			}
			client.unsubscribe(filter, unsubscribeOptions);
		};

		/**
		 * Send a message to the consumers of the destination in the Message.
		 * 
		 * @name Messaging.Client#send
		 * @function
		 * @param {object}
		 *            [sendOptions] used to control the subscription, as
		 *            follows:
		 *            <p>
		 * @config {object} [context] passed to the onSuccess callback or
		 *         onFailure callback.
		 * @config {function} [onSuccess] called when the unsubscribe has been
		 *         received and processed by the server.
		 * @config {function} [onFailure] called when the unsubscribe request
		 *         has failed or timed out.
		 */
		this.send = function(message, sendOptions) {
			sendOptions = sendOptions || {};
			validate(sendOptions, {
				invocationContext : "object",
				onSuccess : "function",
				onFailure : "function"
			});

			if (!(message instanceof Message)) {
				var errorMessage = "Invalid argument:" + typeof message;
				if (sendOptions.onFailure) {
					sendOptions.onFailure({
						invocationContext : sendOptions.invocationContext,
						errorMessage : errorMessage,
						errorCode : -1
					});
					return;
				} else {
					throw new Error(errorMessage);
				}
			}

			if ((typeof message.destinationName === "undefined")
					|| (message.destinationName == "")) {
				var errorMessage = "Invalid parameter Message.destinationName:"
						+ message.destinationName;
				if (sendOptions.onFailure) {
					sendOptions.onFailure({
						invocationContext : sendOptions.invocationContext,
						errorMessage : errorMessage,
						errorCode : -1
					});
					return;
				} else {
					throw new Error(errorMessage);
				}
			}
			client.send(message, sendOptions);
		};

		/**
		 * Normal disconnect of this Messaging client from its server.
		 * 
		 * @name Messaging.Client#disconnect
		 * @function
		 */
		this.disconnect = function(disconnectOptions) {
			disconnectOptions = disconnectOptions || {};
			validate(disconnectOptions, {
				invocationContext : "object",
				onSuccess : "function",
				onFailure : "function"
			});

			client.disconnect(disconnectOptions);
		};

		/**
		 * Get the contents of the trace log.
		 * 
		 * @name Messaging.Client#getTraceLog
		 * @function
		 * @return {Object[]} tracebuffer containing the time ordered trace
		 *         records.
		 */
		this.getTraceLog = function() {
			return client.getTraceLog();
		};

		/**
		 * Start tracing.
		 * 
		 * @name Messaging.Client#startTrace
		 * @function
		 */
		this.startTrace = function() {
			client.startTrace();
		};

		/**
		 * Stop tracing.
		 * 
		 * @name Messaging.Client#stopTrace
		 * @function
		 */
		this.stopTrace = function() {
			client.stopTrace();
		};
	};

	/**
	 * An application message, sent or received. All attributes may be null,
	 * which implies the default values.
	 * 
	 * @name Messaging.Message
	 * @constructor
	 * @param {String|ArrayBuffer}
	 *            payload The message data to be sent.
	 *            <p>
	 * @property {string} stringPayload <i>read only</i> The payload as a
	 *           string if the payload consists of valid UTF-8 characters.
	 * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an
	 *           ArrayBuffer.
	 *           <p>
	 * @property {string} destinationName <b>mandatory</b> The name of the
	 *           destination to which the message is to be sent (for messages
	 *           about to be sent) or the name of the destination from which the
	 *           message has been received. (for messages received by the
	 *           onMessage function).
	 *           <p>
	 * @property {number} qos The Quality of Service used to deliver the
	 *           message.
	 *           <dl>
	 *           <dt>0 Best effort (default).
	 *           <dt>1 At least once.
	 *           <dt>2 Exactly once.
	 *           </dl>
	 *           <p>
	 * @property {Boolean} retained If true, the message is to be retained by
	 *           the server and delivered to both current and future
	 *           subscriptions. If false the server only delivers the message to
	 *           current subscribers, this is the default for new Messages. A
	 *           received message has the retained boolean set to true if the
	 *           message was published with the retained boolean set to true and
	 *           the subscrption was made after the message has been published.
	 *           <p>
	 * @property {Boolean} duplicate <i>read only</i> If true, this message
	 *           might be a duplicate of one which has already been received.
	 *           This is only set on messages received from the server.
	 */
	var Message = function(newPayload) {
		var payload;
		if (typeof newPayload === "string" || newPayload instanceof ArrayBuffer
				|| newPayload instanceof Int8Array
				|| newPayload instanceof Uint8Array
				|| newPayload instanceof Int16Array
				|| newPayload instanceof Uint16Array
				|| newPayload instanceof Int32Array
				|| newPayload instanceof Uint32Array
				|| newPayload instanceof Float32Array
				|| newPayload instanceof Float64Array) {
			payload = newPayload;
		} else {
			throw ("Invalid argument:" + newPayload);
		}

		this.__defineGetter__("payloadString", function() {
			if (typeof payload === "string")
				return payload;
			else
				return parseUTF8(payload, 0, payload.length);
		});

		this.__defineGetter__("payloadBytes", function() {
			if (typeof payload === "string") {
				var buffer = new ArrayBuffer(UTF8Length(payload));
				var byteStream = new Uint8Array(buffer);
				stringToUTF8(payload, byteStream, 0);

				return byteStream;
			} else {
				return payload;
			}
			;
		});

		var destinationName = "";
		this.__defineGetter__("destinationName", function() {
			return destinationName;
		});
		this.__defineSetter__("destinationName", function(newDestinationName) {
			if (typeof newDestinationName === "string")
				destinationName = newDestinationName;
			else
				throw new Error("Invalid argument:" + newDestinationName);
		});

		var qos = 0;
		this.__defineGetter__("qos", function() {
			return qos;
		});
		this.__defineSetter__("qos", function(newQos) {
			if (newQos === 0 || newQos === 1 || newQos === 2)
				qos = newQos;
			else
				throw new Error("Invalid argument:" + newQos);
		});

		var retained = false;
		this.__defineGetter__("retained", function() {
			return retained;
		});
		this.__defineSetter__("retained", function(newRetained) {
			if (typeof newRetained === "boolean")
				retained = newRetained;
			else
				throw new Error("Invalid argument:" + newRetained);
		});

		var duplicate = false;
		this.__defineGetter__("duplicate", function() {
			return duplicate;
		});
		this.__defineSetter__("duplicate", function(newDuplicate) {
			duplicate = newDuplicate;
		});
	};

	// Module contents.
	return {
		Client : Client,
		Message : Message,
	};
})(window);