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
package com.ibm.mqtt.android.cordova.plugin;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import com.ibm.mqtt.android.service.MessagingMessage;
import com.ibm.mqtt.android.service.MqttService;
import com.ibm.mqtt.android.service.MqttServiceBinder;
import com.ibm.mqtt.android.service.MqttServiceConstants;

/**
 * Cordova plugin to support mqtt usage on Android
 * 
 */
public class MqttPlugin extends Plugin {

	// Identifier for use in log messages, etc.
	private static final String TAG = "MqttPlugin";

	// android.content.Context used for working with intents and services
	// passed into us by Cordova
	private Context context;

	// Android service to actually execute mqtt operations
	private MqttService mqttService;

	// two-layer mapping to track callback ids used for "unsolicited" callbacks
	// Essentially a lookup table from client handle and action to a callback id
	private Map<String/* clientHandle */, Map<String/* Action */, String /* callbackId */>> callbackMap = new HashMap<String, Map<String, String>>();

	// callback id for tracing
	private String traceCallbackId = null;
	// state of tracing
	private boolean traceEnabled = false;

	/**
	 * Receive callbacks from the service giving results of operations. These
	 * results are then converted into a suitable form (a JSONOBject) to pass
	 * back to the javascript code via the Cordova success() or error() calls
	 * 
	 * This is admittedly a long method, but it doesn't seem to naturally break
	 * into multiple methods and it falls into neat "sections" based on the
	 * callback being handled.
	 */
	private BroadcastReceiver callbackListener = new BroadcastReceiver() {
		private static final String TAG = "callbackListener";

		public void onReceive(Context context, Intent intent) {
			JSONObject callbackResult = new JSONObject();
			String action = intent
					.getStringExtra(MqttServiceConstants.CALLBACK_ACTION);
			Status status = (Status) intent
					.getSerializableExtra(MqttServiceConstants.CALLBACK_STATUS);
			if (!action.equals(MqttServiceConstants.TRACE_ACTION)) {
				// Don't trace calls which are themselves trace...
				traceDebug(TAG, "onReceive action {" + action + "}, status {"
						+ status + "}");
			}
			String invocationContextString = intent
					.getStringExtra(MqttServiceConstants.CALLBACK_INVOCATION_CONTEXT);

			JSONObject invocationContext = null;
			if (invocationContextString != null) {
				try {
					invocationContext = new JSONObject(invocationContextString);
				} catch (JSONException je) {
					// ignore it for now...
				}
			}

			if (action.equals(MqttServiceConstants.TRACE_ACTION)) {
				String message = intent
						.getStringExtra(MqttServiceConstants.CALLBACK_ERROR_MESSAGE);
				int errorNumber = intent.getIntExtra(
						MqttServiceConstants.CALLBACK_ERROR_NUMBER,
						MqttServiceConstants.DEFAULT_ERROR_NUMBER);
				String severity = intent
						.getStringExtra(MqttServiceConstants.CALLBACK_TRACE_SEVERITY);
				makeTraceCallback(status, message, errorNumber, severity);
				return;
			}

			// All callbacks other than trace will have an associated client
			// handle

			String clientHandle = intent
					.getStringExtra(MqttServiceConstants.CALLBACK_CLIENT_HANDLE);

			// The callback id will either be explicitly passed in the intent
			String callbackId = intent
					.getStringExtra(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN);
			// or, for "unsolicited" actions, held in the lookup table
			if (callbackId == null) {
				callbackId = getCallback(clientHandle, action);
			}

			if (callbackId == null) {
				traceError(TAG,
						"onReceive - can't find callback for clientHandle{"
								+ clientHandle + "} action {" + action + "}");
				return;
			}

			traceDebug(TAG, "onReceive - callback for clientHandle{"
					+ clientHandle + "} action {" + action + "} is {"
					+ callbackId + "}");

			if ((action.equals(MqttServiceConstants.SEND_ACTION))
					|| (action.equals(MqttServiceConstants.GET_CLIENT_ACTION))
					|| (action
							.equals(MqttServiceConstants.START_SERVICE_ACTION))
					|| (action.equals(MqttServiceConstants.STOP_SERVICE_ACTION))
					|| (action.equals(MqttServiceConstants.CONNECT_ACTION))
					|| (action
							.equals(MqttServiceConstants.ACKNOWLEDGE_RECEIPT_ACTION))
					|| (action.equals(MqttServiceConstants.UNSUBSCRIBE_ACTION))
					|| (action.equals(MqttServiceConstants.SUBSCRIBE_ACTION))) {
				// These actions all are passed back in the same way
				try {
					callbackResult.put("invocationContext", invocationContext);
				} catch (JSONException e) {
					traceException(TAG, "failed to build callback result", e);
				}
				if (status.equals(Status.ERROR)) {
					String message = intent
							.getStringExtra(MqttServiceConstants.CALLBACK_ERROR_MESSAGE);
					int errorNumber = intent.getIntExtra(
							MqttServiceConstants.CALLBACK_ERROR_NUMBER,
							MqttServiceConstants.DEFAULT_ERROR_NUMBER);
					try {
						callbackResult.put("errorMessage", message);
						callbackResult.put("errorCode", errorNumber);
					} catch (JSONException e) {
						traceException(TAG, "failed to build callback result",
								e);
					}
					PluginResult pluginResult = new PluginResult(status,
							callbackResult);
					error(pluginResult, callbackId);
				} else {
					PluginResult pluginResult = new PluginResult(status,
							callbackResult);
					success(pluginResult, callbackId);
				}

			} else if (action.equals(MqttServiceConstants.SUBSCRIBE_ACTION)) {
				// Theoretically we should return the QOS which was negotiated
				// but the java client code doesn't give us that
				// We'll leave it as undefined but keep a separate branch for it
				try {
					callbackResult.put("invocationContext", invocationContext);
				} catch (JSONException e) {
					traceException(TAG, "failed to build callback result", e);
				}
				if (status.equals(Status.ERROR)) {
					String message = intent
							.getStringExtra(MqttServiceConstants.CALLBACK_ERROR_MESSAGE);
					int errorNumber = intent.getIntExtra(
							MqttServiceConstants.CALLBACK_ERROR_NUMBER,
							MqttServiceConstants.DEFAULT_ERROR_NUMBER);
					try {
						callbackResult.put("errorMessage", message);
						callbackResult.put("errorCode", errorNumber);
					} catch (JSONException e) {
						traceException(TAG, "failed to build callback result",
								e);
					}
					PluginResult pluginResult = new PluginResult(status,
							callbackResult);
					error(pluginResult, callbackId);
				} else {
					PluginResult pluginResult = new PluginResult(status,
							callbackResult);
					success(pluginResult, callbackId);
				}
			} else if (action.equals(MqttServiceConstants.DISCONNECT_ACTION)) {
				try {
					callbackResult.put("invocationContext", invocationContext);
				} catch (JSONException e) {
					traceException(TAG, "failed to build callback result", e);
				}
				if (status.equals(Status.OK)) {
					// disconnect needs two callbacks - the success callback for
					// disconnect
					// and the "unsolicited" onConnectionLost callback
					PluginResult pluginResult = new PluginResult(status,
							callbackResult);
					success(pluginResult, callbackId);

					String onConnectionLostCallbackId = getCallback(
							clientHandle,
							MqttServiceConstants.ON_CONNECTION_LOST_ACTION);
					if (onConnectionLostCallbackId != null) {
						pluginResult.setKeepCallback(false);
						success(pluginResult, onConnectionLostCallbackId);
					}

					// get cordova to discard the "unsolicited" callback
					// functions
					// for this client by making a "NO_RESULT" callback on each,
					// without keepCallback set to true...
					PluginResult result = new PluginResult(Status.NO_RESULT);
					Map<String, String> callbacks = callbackMap
							.remove(clientHandle);
					for (String obsoleteCallbackId : callbacks.values()) {
						success(result, obsoleteCallbackId);
					}
				} else if (status.equals(Status.ERROR)) {
					String message = intent
							.getStringExtra(MqttServiceConstants.CALLBACK_ERROR_MESSAGE);
					int errorNumber = intent.getIntExtra(
							MqttServiceConstants.CALLBACK_ERROR_NUMBER,
							MqttServiceConstants.DEFAULT_ERROR_NUMBER);
					try {
						callbackResult.put("errorMessage", message);
						callbackResult.put("errorCode", errorNumber);
					} catch (JSONException e) {
						traceException(TAG, "failed to build callback result",
								e);
					}
					PluginResult pluginResult = new PluginResult(status,
							callbackResult);
					error(pluginResult, callbackId);
				}
			} else if ((action
					.equals(MqttServiceConstants.MESSAGE_ARRIVED_ACTION))
					|| (action
							.equals(MqttServiceConstants.MESSAGE_DELIVERED_ACTION))) {

				// We have to build a message object to pass back to the
				String messageId = intent
						.getStringExtra(MqttServiceConstants.CALLBACK_MESSAGE_ID);

				// There doesn't seem to be a better way to convert the
				// payload into a javascript array
				// - the version of org.json supported doesn't accept a
				// byte array argument to the constructor
				// - putting a byte array directly fails
				// - Arrays.asList doesn't play well with primitive arrays

				JSONArray jsPayload = new JSONArray();
				byte[] payload = intent
						.getByteArrayExtra(MqttServiceConstants.CALLBACK_PAYLOAD);
				if (payload != null) {
					for (int i = 0; i < payload.length; i++) {
						jsPayload.put(payload[i]);
					}
				}
				String destinationName = intent
						.getStringExtra(MqttServiceConstants.CALLBACK_DESTINATION_NAME);
				int qos = intent.getIntExtra(MqttServiceConstants.CALLBACK_QOS,
						0);
				boolean retained = intent.getBooleanExtra(
						MqttServiceConstants.CALLBACK_RETAINED, false);
				boolean duplicate = intent.getBooleanExtra(
						MqttServiceConstants.CALLBACK_DUPLICATE, false);
				JSONObject jsMsg = new JSONObject();
				try {
					jsMsg.put(MqttServiceConstants.MESSAGE_ID, messageId);
					jsMsg.put(MqttServiceConstants.PAYLOAD, jsPayload);

					// destination isn't available in
					// onMessageDelivered callbacks
					jsMsg.put(MqttServiceConstants.DESTINATION_NAME,
							(destinationName != null) ? destinationName : "");
					jsMsg.put(MqttServiceConstants.QOS, qos);
					jsMsg.put(MqttServiceConstants.RETAINED, retained);
					jsMsg.put(MqttServiceConstants.DUPLICATE, duplicate);
				} catch (JSONException e) {
					traceException(TAG, "failed to build result message", e);
				}
				PluginResult pluginResult = new PluginResult(status, jsMsg);
				pluginResult.setKeepCallback(true);
				success(pluginResult, callbackId);

			} else if (action
					.equals(MqttServiceConstants.ON_CONNECTION_LOST_ACTION)) {
				String message = intent
						.getStringExtra(MqttServiceConstants.CALLBACK_ERROR_MESSAGE);
				int errorNumber = intent.getIntExtra(
						MqttServiceConstants.CALLBACK_ERROR_NUMBER,
						MqttServiceConstants.DEFAULT_ERROR_NUMBER);
				try {
					callbackResult.put("errorMessage", message);
					callbackResult.put("errorCode", errorNumber);
				} catch (JSONException e) {
					traceException(TAG, "failed to build callback result", e);
				}
				PluginResult pluginResult = new PluginResult(status,
						callbackResult);
				pluginResult.setKeepCallback(true);
				success(pluginResult, callbackId);
			}
		}
	};

	@Override
	// Part of the Cordova plugin interface
	public void setContext(CordovaInterface ctx) {
		super.setContext(ctx);

		context = this.ctx.getContext();
		// We could move to LocalBroadcastManager
		// when we can guarantee v4 and upwards.
		context.registerReceiver(callbackListener, new IntentFilter(
				MqttServiceConstants.CALLBACK_TO_ACTIVITY));
	}

	// Listener for when the service is connected or disconnected
	private ServiceConnection serviceConnection = new ServiceConnection() {
		private static final String TAG = "MqttServiceConnection";

		public void onServiceConnected(ComponentName name, IBinder binder) {
			traceDebug(TAG, "onServiceConnected - " + name);
			mqttService = ((MqttServiceBinder) binder).getService();
			if (traceCallbackId != null) {
				mqttService.setTraceCallbackId(traceCallbackId);
			}
			mqttService.setTraceEnabled(traceEnabled);
			String callbackId = ((MqttServiceBinder) binder).getActivityToken();
			PluginResult pluginResult = new PluginResult(Status.OK);
			success(pluginResult, callbackId);
		}

		public void onServiceDisconnected(ComponentName name) {
			mqttService = null;
		}
	};

	private Intent serviceIntent;

	@Override
	/**
	 * This method takes the data passed through from javascript via "cordova.exec" and
	 * makes appropriate method calls to the service.
	 * Most calls will respond by broadcasting intents which our callbacklistener handles
	 * 
	 * This is a large method, but falls naturally into sections based on the action being
	 * processed, so it doesn't seem necessary to split it into multiple methods.
	 * 
	 * @param action the action to be performed (see MqttServiceConstants)
	 * @param args the parameters specified by the javascript code
	 * @param callbackId 
	 * 		the callbackId which can be used to invoke to the success/failure callbacks
	 * 		provide to the cordova.execute call
	 */
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		traceDebug(TAG, "execute(" + action + ",{" + args + "}," + callbackId
				+ ")");
		try {
			if (action.equals(MqttServiceConstants.START_SERVICE_ACTION)) {
				if (mqttService != null) {
					traceDebug(TAG, "execute - service already started");
					return new PluginResult(Status.OK);
				}
				serviceIntent = new Intent(context, MqttService.class);
				serviceIntent.putExtra(
						MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN,
						callbackId);
				ComponentName serviceComponentName = context
						.startService(serviceIntent);

				if (serviceComponentName == null) {
					traceError(TAG, "execute() - could not start "
							+ MqttService.class);
					return new PluginResult(Status.ERROR);
				}

				if (context.bindService(serviceIntent, serviceConnection, 0)) {
					// we return Status.NO_RESULT and setKeepCallback(true)
					// so that the callbackListener can use this callbackId
					// when it receives a connected event
					PluginResult result = new PluginResult(Status.NO_RESULT);
					result.setKeepCallback(true);
					return result;
				}
				return new PluginResult(Status.ERROR);
			}

			if (action.equals(MqttServiceConstants.SET_TRACE_CALLBACK)) {
				// This is a trifle inelegant
				traceCallbackId = callbackId;
				if (mqttService != null) {
					mqttService.setTraceCallbackId(callbackId);
				}
				PluginResult result = new PluginResult(Status.NO_RESULT);
				result.setKeepCallback(true);
				return result;
			}

			if (action.equals(MqttServiceConstants.SET_TRACE_ENABLED)) {
				traceEnabled = true;
				if (mqttService != null) {
					mqttService.setTraceEnabled(traceEnabled);
				}
				PluginResult result = new PluginResult(Status.OK);
				return result;
			}

			if (action.equals(MqttServiceConstants.SET_TRACE_DISABLED)) {
				traceEnabled = false;
				if (mqttService != null) {
					mqttService.setTraceEnabled(traceEnabled);
				}
				PluginResult result = new PluginResult(Status.OK);
				return result;
			}

			if (mqttService == null) {
				return new PluginResult(Status.ERROR, "Service not started yet");
			}

			if (action.equals(MqttServiceConstants.STOP_SERVICE_ACTION)) {
				Intent serviceIntent = new Intent(context, MqttService.class);
				context.stopService(serviceIntent);
				mqttService = null;
				return new PluginResult(Status.OK);
			}

			if (action.equals(MqttServiceConstants.GET_CLIENT_ACTION)) {
				// This is a simple operation and we do it synchronously
				String clientHandle;
				try {
					String host = args.getString(0);
					int port = args.getInt(1);
					String clientId = args.getString(2);
					clientHandle = mqttService.getClient(host, port, clientId);

					// Set up somewhere to hold callbacks for this client
					callbackMap
							.put(clientHandle, new HashMap<String, String>());
				} catch (JSONException e) {
					traceException(TAG, "execute()", e);
					return new PluginResult(Status.ERROR, e.getMessage());
				}
				// We return a clientHandle to the javascript client,
				// which it can use to identify the client on subsequent calls
				return new PluginResult(Status.OK, clientHandle);
			}

			// All remaining actions have a clientHandle as their first arg
			String clientHandle = args.getString(0);

			if (action.equals(MqttServiceConstants.CONNECT_ACTION)) {
				int timeout = args.getInt(1);
				boolean cleanSession = args.getBoolean(2);
				String userName = args.optString(3);
				String passWord = args.optString(4);
				int keepAliveInterval = args.getInt(5);
				JSONObject jsMsg = args.optJSONObject(6);
				MessagingMessage willMessage = (jsMsg == null) ? null
						: messageFromJSON(jsMsg);
				boolean useSSL = args.getBoolean(7);
				Properties sslProperties = null;
				JSONObject jsSslProperties = args.getJSONObject(8);
				if (jsSslProperties.length() != 0) {
					sslProperties = new Properties();
					Iterator<?> sslPropertyIterator = jsSslProperties.keys();
					while (sslPropertyIterator.hasNext()) {
						String propertyName = (String) sslPropertyIterator
								.next();
						String propertyValue = jsSslProperties
								.getString(propertyName);
						sslProperties.put("com.ibm.ssl." + propertyName,
								propertyValue);
					}
				}
				String invocationContext = args.optString(9);
				mqttService.connect(clientHandle, timeout, cleanSession,
						userName, passWord, keepAliveInterval, willMessage,
						useSSL, sslProperties, invocationContext, callbackId);
				PluginResult result = new PluginResult(Status.NO_RESULT);
				result.setKeepCallback(true);
				return result;
			}

			if (action.equals(MqttServiceConstants.DISCONNECT_ACTION)) {
				String invocationContext = args.optString(1);
				mqttService.disconnect(clientHandle, invocationContext,
						callbackId);
				PluginResult result = new PluginResult(Status.NO_RESULT);
				result.setKeepCallback(true);
				return result;
			}

			if (action.equals(MqttServiceConstants.SEND_ACTION)) {
				JSONObject jsMsg = args.getJSONObject(1);
				MessagingMessage msg = messageFromJSON(jsMsg);
				String invocationContext = args.optString(2);
				mqttService.send(clientHandle, msg, invocationContext,
						callbackId);
				// we return Status.NO_RESULT and setKeepCallback(true)
				// so that the callbackListener can use this callbackId
				// at an appropriate time - what time that is depends on
				// the qos value specified.
				PluginResult result = new PluginResult(Status.NO_RESULT);
				result.setKeepCallback(true);
				return result;
			}

			if (action.equals(MqttServiceConstants.SUBSCRIBE_ACTION)) {
				String topicFilter = args.getString(1);
				int qos = args.getInt(2);
				String invocationContext = args.optString(3);
				mqttService.subscribe(clientHandle, topicFilter, qos,
						invocationContext, callbackId);
				// we return Status.NO_RESULT and setKeepCallback(true)
				// so that the callbackListener can use this callbackId
				// when it receives an event from the subscribe operation
				PluginResult result = new PluginResult(Status.NO_RESULT);
				result.setKeepCallback(true);
				return result;
			}

			if (action.equals(MqttServiceConstants.UNSUBSCRIBE_ACTION)) {
				String topicFilter = args.getString(1);
				String invocationContext = args.optString(2);
				mqttService.unsubscribe(clientHandle, topicFilter,
						invocationContext, callbackId);
				// we return Status.NO_RESULT and setKeepCallback(true)
				// so that the callbackListener can use this callbackId
				// when it receives an event from the unsubscribe operation
				PluginResult result = new PluginResult(Status.NO_RESULT);
				result.setKeepCallback(true);
				return result;
			}

			if (action.equals(MqttServiceConstants.ACKNOWLEDGE_RECEIPT_ACTION)) {
				// This is a synchronous operation
				String id = args.getString(1);
				return mqttService.acknowledgeMessageArrival(clientHandle, id);
			}

			// The remaining actions are used to register callbacks for
			// "unsolicited" events
			if (action
					.equals(MqttServiceConstants.SET_ON_CONNECTIONLOST_CALLBACK)) {
				return setCallback(clientHandle,
						MqttServiceConstants.ON_CONNECTION_LOST_ACTION,
						callbackId);
			}
			if (action
					.equals(MqttServiceConstants.SET_ON_MESSAGE_DELIVERED_CALLBACK)) {
				return setCallback(clientHandle,
						MqttServiceConstants.MESSAGE_DELIVERED_ACTION,
						callbackId);
			}
			if (action
					.equals(MqttServiceConstants.SET_ON_MESSAGE_ARRIVED_CALLBACK)) {
				PluginResult setCallbackResult = setCallback(clientHandle,
						MqttServiceConstants.MESSAGE_ARRIVED_ACTION, callbackId);
				return setCallbackResult;
			}

		} catch (JSONException e) {
			return new PluginResult(Status.JSON_EXCEPTION, e.getMessage());
		} catch (IllegalArgumentException e) {
			return new PluginResult(Status.ERROR, e.getMessage());
		}

		return new PluginResult(Status.ERROR, "Unrecognised action '" + action
				+ "'");
	}

	// Setup a mapping {clientHandle,action} -> callbackId
	private PluginResult setCallback(String clientHandle, String action,
			String callbackId) {
		Map<String /* action */, String /* callbackId */> clientCallbacks = callbackMap
				.get(clientHandle);
		if (clientCallbacks == null) {
			return new PluginResult(Status.ERROR, "Invalid clientHandle {"
					+ clientHandle + "}");
		}
		clientCallbacks.put(action, callbackId);
		PluginResult result = new PluginResult(Status.NO_RESULT);
		result.setKeepCallback(true); // keep it around
		return result;
	}

	// get the callbackId for a specific {clientHandle,action} pair
	private String getCallback(String clientHandle, String action) {
		Map<String /* action */, String /* callbackId */> clientCallbacks = callbackMap
				.get(clientHandle);
		if (clientCallbacks != null) {
			return clientCallbacks.get(action);
		}
		return null;
	}

	// Create a message from the JSONObject we've been passed
	private MessagingMessage messageFromJSON(JSONObject jsMsg) {
		MessagingMessage result = null;
		try {
			// There seems no good way to turn a JSONArray (of number)
			// into a Java byte array, so use brute force
			JSONArray jsPayload = jsMsg
					.getJSONArray(MqttServiceConstants.PAYLOAD);
			byte[] payload = new byte[jsPayload.length()];
			for (int i = 0; i < jsPayload.length(); i++) {
				payload[i] = (byte) jsPayload.getInt(i);
			}
			String destination = jsMsg
					.getString(MqttServiceConstants.DESTINATION_NAME);
			int qos = jsMsg.optInt(MqttServiceConstants.QOS, 0);
			boolean retained = jsMsg.optBoolean(MqttServiceConstants.RETAINED,
					false);
			boolean duplicate = jsMsg.optBoolean(
					MqttServiceConstants.DUPLICATE, false);
			result = new MessagingMessage(destination, payload, qos, retained,
					duplicate);
		} catch (JSONException e) {
			traceException(TAG, "messageFromJSON", e);
		}

		return result;
	}

	// Methods for tracing by making a callback to javascript

	private void traceDebug(String tag, String message) {
		makeTraceCallback(Status.OK, tag + " " + message, -1, "debug");
	}

	private void traceError(String tag, String message) {
		makeTraceCallback(Status.ERROR, tag + " " + message, -1, "error");
	}

	private void traceException(String tag, String message, Throwable tr) {
		makeTraceCallback(Status.ERROR,
				tag + " " + message + ":" + Log.getStackTraceString(tr), -1,
				"error");
	}

	private void makeTraceCallback(Status status, String message,
			int errorCode, String severity) {
		if ((traceCallbackId != null) && (traceEnabled)) {
			JSONObject callbackResult = new JSONObject();
			try {
				callbackResult.put("severity", severity);
				callbackResult.put("message", message);
				callbackResult.put("errorCode", errorCode);
			} catch (JSONException e) {
				Log.e(TAG, "failed to build callback result", e);
			}
			PluginResult pluginResult = new PluginResult(status, callbackResult);
			pluginResult.setKeepCallback(true);
			success(pluginResult, traceCallbackId);
		}
	}

}
