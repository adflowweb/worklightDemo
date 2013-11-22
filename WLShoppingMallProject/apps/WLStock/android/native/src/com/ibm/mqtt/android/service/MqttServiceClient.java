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
package com.ibm.mqtt.android.service;

import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.cordova.api.PluginResult.Status;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttClientPersistence;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttDefaultFilePersistence;
import org.eclipse.paho.client.mqttv3.MqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttTopic;

import android.app.Service;
import android.os.Bundle;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.util.Log;

/**
 * This does the mqtt operations for a specific client {host,port,clientId}
 * 
 */
class MqttServiceClient implements MqttCallback {

	// Strings for Intents etc..
	private static final String TAG = "MqttServiceClient";
	// Error status messages
	private static final String NOT_CONNECTED = "not connected";
	private static final String NOT_ONLINE = "not online";
	private static final String TIMED_OUT = "Timed out";

	// fields for the connection definition
	private String host;
	private int port;
	private String clientId;
	private MqttConnectOptions connectOptions;
	private boolean cleanSession;

	// Client handle, used for callbacks...
	private String clientHandle;

	// our client object - instantiated on connect
	private MqttClient myClient = null;

	// our (parent) service object
	private MqttService service = null;

	// timeout
	private int timeout = 30 * 1000;

	// a way to recognise when we have been disconnected
	// in the mqtt context, as opposed to losing Android
	// connectivity
	private boolean disconnected = true;

	// A way to queue blocking options into the background
	private ExecutorService executorService = Executors.newCachedThreadPool();

	// Saved sent messages and their corresponding activityTokens and
	// invocationContexts, so we can handle "deliveryComplete" callbacks
	// from the mqttClient
	private Map<MqttDeliveryToken, MqttMessage> savedSentMessages = new HashMap<MqttDeliveryToken, MqttMessage>();
	private Map<MqttDeliveryToken, String> savedActivityTokens = new HashMap<MqttDeliveryToken, String>();
	private Map<MqttDeliveryToken, String> savedInvocationContexts = new HashMap<MqttDeliveryToken, String>();

	/**
	 * constructor
	 * 
	 */
	MqttServiceClient(MqttService service, String host, int port,
			String clientId, String clientHandle) {
		this.service = service;
		this.host = host;
		this.port = port;
		this.clientId = clientId;
		this.clientHandle = clientHandle;
	}

	// The major API implementation follows :-

	/**
	 * 
	 * @param timeout
	 *            in milliseconds
	 * @param cleanSession
	 *            - whether to start with no preserved state
	 * @param userName
	 *            (optional)
	 * @param passWord
	 *            (optional)
	 * @param keepAliveInterval
	 *            in seconds
	 * @param willMessage
	 *            (optional) message to be sent by service if the client
	 *            disconnects abnormally
	 * @param useSSL
	 *            - if true, use SSL/TLS
	 * @param sslProperties
	 *            properties configuring the SSL/TLS connection
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	void connect(int timeout, boolean cleanSession, String userName,
			String passWord, int keepAliveInterval,
			MessagingMessage willMessage, boolean useSSL,
			Properties sslProperties, String invocationContext,
			String activityToken) {

		if ((myClient != null) && (myClient.isConnected())) {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.CONNECT_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
					activityToken);
			dataBundle.putString(
					MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
					invocationContext);
			if (cleanSession == this.cleanSession) {
				// backstop processing - treat as success
				service.callbackToActivity(clientHandle, Status.OK, dataBundle);
				return;
			} else {
				// change in cleanSession value - disallow it
				// (we could try to disconnect and reconnect,
				// but I'd rather reject the call)
				dataBundle.putInt(MqttServiceConstants.CALLBACK_ERROR_NUMBER, MqttServiceConstants.DEFAULT_ERROR_NUMBER);
				dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE, "incompatible CleanSession values");
				service.callbackToActivity(clientHandle, Status.ERROR, dataBundle);
				return;
			}
		}

		// don't trace passwords!
		String passWordToTrace = ((passWord == null) || (passWord.trim()
				.length() == 0)) ? "" : "XXXXXXXXX";

		service.traceDebug(TAG, "connect(" + timeout + "," + cleanSession
				+ ",{" + userName + "},{" + passWordToTrace + "},"
				+ keepAliveInterval + ",{" + willMessage + "}," + useSSL
				+ ", {" + invocationContext + "},{" + activityToken + "}");

		this.timeout = timeout;
		this.cleanSession = cleanSession;

		if (cleanSession) {
			service.messageStore.clearArrivedMessages(clientHandle);
		}

		if (service.isOnline()) {
			String serverURI = (useSSL ? "ssl:" : "tcp:") + "//" + host + ":"
					+ port;
			service.traceDebug(TAG, "Connecting {" + serverURI + "} as {"
					+ clientId + "}");
			try {
				// ask Android where we can put files
				File myDir = service.getExternalFilesDir(null);

				if (myDir == null) {
					Bundle dataBundle = new Bundle();
					dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
							MqttServiceConstants.CONNECT_ACTION);
					dataBundle.putString(
							MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
							activityToken);
					dataBundle.putString(
							MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
							invocationContext);
					dataBundle.putString(
							MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
							"No external storage available");
					dataBundle.putInt(
							MqttServiceConstants.CALLBACK_ERROR_NUMBER,
							MqttServiceConstants.DEFAULT_ERROR_NUMBER);
					service.callbackToActivity(clientHandle, Status.ERROR,
							dataBundle);
					return;
				}

				// use that to setup mqtt client persistence storage
				MqttClientPersistence persistence = new MqttDefaultFilePersistence(
						myDir.getAbsolutePath());

				// Get the client, set ourselves as the callback
				myClient = new MqttClient(serverURI, clientId, persistence);
				myClient.setCallback(this);

				// store details of any pending send messages
				for (MqttDeliveryToken token : myClient
						.getPendingDeliveryTokens()) {
					try {
						MqttMessage msg = token.getMessage();
						if (msg != null) {
							savedSentMessages.put(token, msg);
						}
					} catch (MqttException e) {
						// ignore it
					}
				}

				connectOptions = new MqttConnectOptions();
				connectOptions.setKeepAliveInterval(keepAliveInterval);
				connectOptions.setCleanSession(cleanSession);
				if ((userName != null) && (userName.trim().length() != 0)) {
					connectOptions.setUserName(userName);
				}
				if ((passWord != null) && (passWord.trim().length() != 0)) {
					connectOptions.setPassword(passWord.toCharArray());
				}
				if (willMessage != null) {
					connectOptions
							.setWill(myClient.getTopic(willMessage
									.getDestinationName()), willMessage
									.getPayload(), willMessage.getQos(),
									willMessage.isRetained());
				}
				connectOptions.setSSLProperties(sslProperties);
				doConnect(invocationContext, activityToken, false);
				if (!cleanSession) {
					deliverBacklog();
				}
			} catch (MqttException e) {
				service.traceException(TAG, "connect", e);
			}
		} else {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.CONNECT_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
					activityToken);
			dataBundle.putString(
					MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
					invocationContext);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					NOT_ONLINE);
			dataBundle.putInt(MqttServiceConstants.CALLBACK_ERROR_NUMBER,
					MqttServiceConstants.DEFAULT_ERROR_NUMBER);
			service.callbackToActivity(clientHandle, Status.ERROR, dataBundle);
			service.traceError(TAG, NOT_ONLINE);
		}
	}

	/**
	 * Attempt to deliver any outstanding messages we've received but which the
	 * application hasn't acknowledged
	 */
	private void deliverBacklog() {
		Iterator<MessagingMessage> backlog = service.messageStore
				.getAllArrivedMessages(clientHandle);
		while (backlog.hasNext()) {
			MessagingMessage msgArrived = backlog.next();
			Bundle dataBundle = msgArrived.toBundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.MESSAGE_ARRIVED_ACTION);
			service.callbackToActivity(clientHandle, Status.OK, dataBundle);
		}
	}

	/**
	 * Do the connection operation itself in a separate thread
	 * 
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 * @param autoReconnect
	 *            whether this is a automatic reconnection, due to a change in
	 *            Android state
	 */
	private void doConnect(String invocationContext, String activityToken,
			boolean autoReconnect) {
		BlockingOp connectOp = new BlockingOp(new OperationWrapper() {

			public void doit() throws MqttException {
				try {
					myClient.connect(connectOptions);
					disconnected = false;
				} catch (MqttException e) {
					if (e.getReasonCode() == MqttException.REASON_CODE_CLIENT_ALREADY_CONNECTED) {
						// ignore the duplicate connection attempt
						disconnected = false;
					} else {
						throw e;
					}
				}
			}

			public String getName() {
				return MqttServiceConstants.CONNECT_ACTION;
			}

		});
		runBlockingOp(connectOp, MqttServiceConstants.CONNECT_ACTION,
				invocationContext, activityToken, autoReconnect);
	}

	/**
	 * Disconnect from the server
	 * 
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	void disconnect(String invocationContext, String activityToken) {
		service.traceDebug(TAG, "disconnect()");
		disconnected = true;
		BlockingOp disconnectOp = new BlockingOp(new OperationWrapper() {

			public void doit() throws MqttException {
				myClient.disconnect();
			}

			public String getName() {
				return MqttServiceConstants.DISCONNECT_ACTION;
			}
		});
		runBlockingOp(disconnectOp, MqttServiceConstants.DISCONNECT_ACTION,
				invocationContext, activityToken);

		// stop listening...
		try {
			myClient.setCallback(null);
		} catch (MqttException e) {
			// ignore this
		}

		if (connectOptions.isCleanSession()) {
			// assume we'll clear the stored messages at this point
			service.messageStore.clearArrivedMessages(clientHandle);
			savedSentMessages.clear();
			savedActivityTokens.clear();
			savedInvocationContexts.clear();
		}
	}

	/**
	 * Send (publish) a message
	 * 
	 * @param msg
	 *            message to send
	 * @param invocationContext
	 *            identifier passed by the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	void send(MessagingMessage msg, String invocationContext,
			String activityToken) {
		service.traceDebug(TAG, "send({" + msg + "}, {" + invocationContext
				+ "}, {" + activityToken + "})");
		if (service.isOnline()) {
			if ((myClient != null) && (myClient.isConnected())) {
				String topicFilter = msg.getDestinationName();
				MqttTopic topic = myClient.getTopic(topicFilter);
				doSend(topic, msg, invocationContext, activityToken);
			} else {
				Bundle dataBundle = new Bundle();
				dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
						MqttServiceConstants.SEND_ACTION);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
						activityToken);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
						invocationContext);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
						NOT_CONNECTED);
				service.traceError(MqttServiceConstants.SEND_ACTION,
						NOT_CONNECTED);
				service.callbackToActivity(clientHandle, Status.ERROR,
						dataBundle);
			}
		} else {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.SEND_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
					activityToken);
			dataBundle.putString(
					MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
					invocationContext);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					NOT_ONLINE);
			service.traceError(MqttServiceConstants.SEND_ACTION, NOT_ONLINE);
			service.callbackToActivity(clientHandle, Status.ERROR, dataBundle);
		}
	}

	/**
	 * Do the actual send in a separate thread
	 * 
	 * @param topic
	 *            the topic to which we are publishing
	 * @param msg
	 *            message to send
	 * @param invocationContext
	 *            identifier passed by the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	private void doSend(final MqttTopic topic, final MessagingMessage msg,
			final String invocationContext, final String activityToken) {
		BlockingOp sendOp = new BlockingOp(new OperationWrapper() {

			public void doit() throws MqttException {
				MqttDeliveryToken messageToken = topic.publish(
						msg.getPayload(), msg.getQos(), msg.isRetained());
				if (msg.getQos() != 0) { // Remember for subsequent notification
					storeSendDetails(messageToken.getMessage(), messageToken,
							invocationContext, activityToken);
				}
			}

			public String getName() {
				return MqttServiceConstants.SEND_ACTION;
			}
		});

		Future<Object[]> future = executorService.submit(sendOp);
		String opResultString = null;
		int opError = 0;
		try {
			Object[] opResultArray = future.get();
			opResultString = (String) opResultArray[0];
			opError = (Integer) opResultArray[1];
		} catch (InterruptedException e) {
			opResultString = e.getMessage();
		} catch (ExecutionException e) {
			opResultString = e.getMessage();
		}

		Bundle dataBundle = new Bundle();
		dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
				MqttServiceConstants.SEND_ACTION);
		dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
				activityToken);
		dataBundle.putString(MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
				invocationContext);
		if (opResultString == null) {
			if (msg.getQos() == 0) {
				service.callbackToActivity(clientHandle, Status.OK, dataBundle);

				// Trigger messageDelivered as well
				dataBundle = msg.toBundle();
				dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
						MqttServiceConstants.MESSAGE_DELIVERED_ACTION);
				// No activity token in this case - the receiver must determine it from the action
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
						invocationContext);
				service.callbackToActivity(clientHandle, Status.OK, dataBundle);
			} else {
				service.callbackToActivity(clientHandle, Status.NO_RESULT,
						dataBundle);
			}
		} else {
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					opResultString);
			dataBundle.putInt(MqttServiceConstants.CALLBACK_ERROR_NUMBER,
					opError);
			service.callbackToActivity(clientHandle, Status.ERROR, dataBundle);
		}
	}

	/**
	 * Subscribe to a (possibly wildcarded) topic
	 * 
	 * @param topicFilter
	 *            (possibly wildcarded) topic name
	 * @param qos
	 *            Quality of service requested
	 * @param invocationContext
	 *            identifier passed by the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	void subscribe(String topicFilter, int qos, String invocationContext,
			String activityToken) {
		service.traceDebug(TAG, "subscribe({" + topicFilter + "}," + qos + ",{"
				+ invocationContext + "}, {" + activityToken + "}");
		if (service.isOnline()) {
			if ((myClient != null) && (myClient.isConnected())) {
				doSubscribe(topicFilter, qos, invocationContext, activityToken);
			} else {
				Bundle dataBundle = new Bundle();
				dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
						MqttServiceConstants.SUBSCRIBE_ACTION);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
						activityToken);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
						invocationContext);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
						NOT_CONNECTED);
				service.traceError("subscribe", NOT_CONNECTED);
				service.callbackToActivity(clientHandle, Status.ERROR,
						dataBundle);
			}
		} else {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.SUBSCRIBE_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
					activityToken);
			dataBundle.putString(
					MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
					invocationContext);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					NOT_ONLINE);
			service.traceError("subscribe", NOT_ONLINE);
			service.callbackToActivity(clientHandle, Status.ERROR, dataBundle);

		}
	}

	/**
	 * Do the actual subscribe work in a separate thread
	 * 
	 * @param topicFilter
	 *            (possibly wildcarded) topicname
	 * @param qos
	 *            Quality of service requested
	 * @param invocationContext
	 *            identifier passed by the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	private void doSubscribe(final String topicFilter, final int qos,
			final String invocationContext, String activityToken) {
		BlockingOp subscribeOp = new BlockingOp(new OperationWrapper() {

			public void doit() throws MqttException {
				myClient.subscribe(topicFilter, qos);
			}

			public String getName() {
				return MqttServiceConstants.SUBSCRIBE_ACTION;
			}

		});
		runBlockingOp(subscribeOp, MqttServiceConstants.SUBSCRIBE_ACTION,
				invocationContext, activityToken);
	}

	/**
	 * Unsubscribe from a (possibly wildcarded) topic
	 * 
	 * @param topicFilter
	 *            (possibly wildcarded) topic name
	 * @param invocationContext
	 *            identifier passed by the application
	 * @param activityToken
	 *            arbitrary string to be passed back to the activity
	 */
	void unsubscribe(final String topicFilter, String invocationContext,
			String activityToken) {
		service.traceDebug(TAG, "unsubscribe({" + topicFilter + "},{"
				+ invocationContext + "}, {" + activityToken + "})");
		if (service.isOnline()) {
			if ((myClient != null) && (myClient.isConnected())) {
				BlockingOp unsubscribeOp = new BlockingOp(
						new OperationWrapper() {

							public void doit() throws MqttException {
								myClient.unsubscribe(topicFilter);
							}

							public String getName() {
								return MqttServiceConstants.UNSUBSCRIBE_ACTION;
							}

						});
				runBlockingOp(unsubscribeOp,
						MqttServiceConstants.UNSUBSCRIBE_ACTION,
						invocationContext, activityToken);

			} else {
				Bundle dataBundle = new Bundle();
				dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
						MqttServiceConstants.UNSUBSCRIBE_ACTION);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
						activityToken);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
						invocationContext);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
						NOT_CONNECTED);

				service.traceError("subscribe", NOT_CONNECTED);
				service.callbackToActivity(clientHandle, Status.ERROR,
						dataBundle);
			}
		} else {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.UNSUBSCRIBE_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
					activityToken);
			dataBundle.putString(
					MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
					invocationContext);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					NOT_ONLINE);
			service.traceError("subscribe", NOT_ONLINE);
			service.callbackToActivity(clientHandle, Status.ERROR, dataBundle);

		}
	}

	// Implement MqttCallback

	/**
	 * Callback for connectionLost
	 * 
	 * @param why
	 *            the exeception causing the break in communications
	 */
	public void connectionLost(Throwable why) {
		service.traceDebug(TAG, "connectionLost(" + why.getMessage() + ")");
		if (!service.isOnline()) {
			service.traceDebug(TAG,
					"connectionLost - not online, waiting till online to attempt reconnect");
			return;
		}

		// we protect against the phone switching off
		// by requesting a wake lock - we request the minimum possible wake
		// lock - just enough to keep the CPU running until we've finished
		PowerManager pm = (PowerManager) service
				.getSystemService(Service.POWER_SERVICE);
		WakeLock wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
				"MQTT - connectionLost");
		wl.acquire();

		disconnected = true;

		Bundle dataBundle = new Bundle();
		dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
				MqttServiceConstants.ON_CONNECTION_LOST_ACTION);
		if (why != null) {
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					why.getMessage());
			if (why instanceof MqttException) {
				dataBundle.putInt(MqttServiceConstants.CALLBACK_ERROR_NUMBER,
						((MqttException) why).getReasonCode());
			}
			dataBundle.putString(MqttServiceConstants.CALLBACK_EXCEPTION_STACK,
					Log.getStackTraceString(why));
		}
		service.callbackToActivity(clientHandle, Status.OK, dataBundle);

		// we're finished - if the phone is switched off, it's okay for the CPU
		// to sleep now
		wl.release();
	}

	/**
	 * Callback to indicate a message has been delivered (the exact meaning of
	 * "has been delivered" is dependent on the QOS value)
	 * 
	 * @param messageToken
	 *            the messge token provided when the message was originally sent
	 */
	public void deliveryComplete(MqttDeliveryToken messageToken) {
		service.traceDebug(TAG, "deliveryComplete(" + messageToken + ")");

		MqttMessage msg = savedSentMessages.remove(messageToken);
		if (msg != null) { // If I don't know about the message, it's irrelevant
			String activityToken = savedActivityTokens.remove(messageToken);
			String invocationContext = savedInvocationContexts
					.remove(messageToken);

			try {
				MessagingMessage msgDelivered = new MessagingMessage(null, msg);
				if (msgDelivered.getQos() != 0) {
					Bundle dataBundle = msgDelivered.toBundle();
					if (activityToken != null) {
						dataBundle.putString(
								MqttServiceConstants.CALLBACK_ACTION,
								MqttServiceConstants.SEND_ACTION);
						dataBundle.putString(
								MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
								activityToken);
						dataBundle
								.putString(
										MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
										invocationContext);

						service.callbackToActivity(clientHandle, Status.OK,
								dataBundle);
					}
					dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
							MqttServiceConstants.MESSAGE_DELIVERED_ACTION);
					dataBundle
							.remove(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN);
					dataBundle
							.remove(MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT);
					service.callbackToActivity(clientHandle, Status.OK,
							dataBundle);
				}
			} catch (MqttException e) {
				// there's little we can do...
			}
		}

	}

	/**
	 * Callback when a message is received
	 * 
	 * @param topic
	 *            the topic on which the message was received
	 * @param msg
	 *            the message itself
	 */
	public void messageArrived(MqttTopic topic, MqttMessage msg)
			throws Exception {
		// we protect against the phone switching off
		// by requesting a wake lock - we request the minimum possible wake
		// lock - just enough to keep the CPU running until we've finished
		PowerManager pm = (PowerManager) service
				.getSystemService(Service.POWER_SERVICE);
		WakeLock wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
				"MQTT - messageArrived");
		wl.acquire();
		service.traceDebug(TAG, "messageArrived(" + topic.getName() + ",{"
				+ msg.toString() + "}");

		MessagingMessage msgArrived = new MessagingMessage(topic.getName(), msg);

		String messageId = service.messageStore.storeArrived(clientHandle,
				msgArrived);
		Bundle dataBundle = msgArrived.toBundle();
		dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
				MqttServiceConstants.MESSAGE_ARRIVED_ACTION);
		dataBundle.putString(MqttServiceConstants.CALLBACK_MESSAGE_ID,
				messageId);
		service.callbackToActivity(clientHandle, Status.OK, dataBundle);

		// we're finished - if the phone is switched off, it's okay for the CPU
		// to sleep now
		wl.release();
	}

	/**
	 * reconnect<br>
	 * Only appropriate if cleanSession is false and we were connected
	 */
	void reconnect() {
		if (!disconnected && !cleanSession) {
			doConnect(null, null, true);
		}
	}

	/**
	 * receive notification that we are offline<br>
	 * if cleanSession is true, we need to regard this as a disconnection
	 */
	void offline() {
		if (!disconnected && cleanSession) {
			Exception e = new Exception("Android offline");
			connectionLost(e);
		}
	}

	// Code to make it easy to use "Futures" to move operations out of the main
	// thread

	private interface OperationWrapper {
		public void doit() throws MqttException;

		public String getName();
	}

	private class BlockingOp implements Callable<Object[]> {
		private static final int INITIAL_STATE = 0;
		private static final int RUNNING = 1;
		private static final int COMPLETE = 2;
		private static final int CANCELLED = 3;
		private volatile int state = INITIAL_STATE;

		private OperationWrapper operation;
		private String result;

		BlockingOp(OperationWrapper operation) {
			this.operation = operation;
		}

		// Attempt to cancel the operation (this may not be totally successful)
		void cancel() {
			if (state != COMPLETE) {
				state = CANCELLED;
				result = TIMED_OUT;
			}
		}

		public Object[] call() {
			int errorNumber = 0;
			try {
				state = RUNNING;
				operation.doit();
				if (state != CANCELLED) {
					state = COMPLETE;
				} else {
					service.traceError(TAG, operation.getName() + "-"
							+ TIMED_OUT);
				}
			} catch (MqttException e) {
				service.traceException(TAG, operation.getName(), e);
				if (state != CANCELLED) {
					result = e.getMessage();
					errorNumber = e.getReasonCode();
				}
			}
			return new Object[] { result, errorNumber };
		}
	}

	private void runBlockingOp(BlockingOp blockingOp, String action,
			String invocationContext, String activityToken) {
		runBlockingOp(blockingOp, action, invocationContext, activityToken,
				false);
	}

	private void runBlockingOp(BlockingOp blockingOp, String action,
			String invocationContext, String activityToken,
			boolean autoReconnect) {
		Future<Object[]> future = executorService.submit(blockingOp);
		String opResultString = null;
		int opError = 0;
		try {
			Object[] opResultArray = future.get(timeout, TimeUnit.MILLISECONDS);
			opResultString = (String) opResultArray[0];
			opError = (Integer) opResultArray[1];
		} catch (InterruptedException e) {
			opResultString = e.getMessage();
		} catch (ExecutionException e) {
			opResultString = e.getMessage();
		} catch (TimeoutException e) {
			blockingOp.cancel();
			future.cancel(false);
			opResultString = TIMED_OUT;
		}

		Bundle dataBundle = new Bundle();
		dataBundle.putString(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
				activityToken);
		dataBundle.putString(MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT,
				invocationContext);

		if (autoReconnect) {
			// for auto reconnect, we treat success silently
			// and failure becomes a connectionLost event
			if (opResultString != null) {
				disconnected = true;
				dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
						MqttServiceConstants.ON_CONNECTION_LOST_ACTION);
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
						opResultString);
				dataBundle.putInt(MqttServiceConstants.CALLBACK_ERROR_NUMBER,
						opError);
				service.callbackToActivity(clientHandle, Status.ERROR,
						dataBundle);
			}
		} else {
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION, action);
			if (opResultString == null) {
				service.callbackToActivity(clientHandle, Status.OK, dataBundle);
			} else {
				dataBundle.putString(
						MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
						opResultString);
				dataBundle.putInt(MqttServiceConstants.CALLBACK_ERROR_NUMBER,
						opError);
				service.callbackToActivity(clientHandle, Status.ERROR,
						dataBundle);
			}
		}

	}

	/**
	 * Store details of sent messages so we can handle "deliveryComplete"
	 * callbacks from the mqttClient
	 * 
	 * @param msg
	 * @param messageToken
	 * @param invocationContext
	 * @param activityToken
	 */
	private void storeSendDetails(final MqttMessage msg,
			final MqttDeliveryToken messageToken,
			final String invocationContext, final String activityToken) {
		savedSentMessages.put(messageToken, msg);
		savedActivityTokens.put(messageToken, activityToken);
		savedInvocationContexts.put(messageToken, invocationContext);
	}
}
