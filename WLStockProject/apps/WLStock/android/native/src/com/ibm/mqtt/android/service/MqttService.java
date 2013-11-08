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

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.util.Log;

/**
 * The android service which interfaces with an mqtt client implementation
 * 
 * To support multiple client connections, the bulk of the mqtt work is
 * delegated to MqttServiceClient objects. These are identified by "client
 * handle" strings, which is how the Activity, and the higher-level APIs refer
 * to them.
 * 
 */
public class MqttService extends Service implements MqttTraceHandler {

	// Identifier for Intents, log messages, etc..
	static final String TAG = "MqttService";

	// Identifiers for extra data on Intents passed into the service on Start up
	public static final String HOST = TAG + ".host";
	public static final String PORT = TAG + ".port";
	public static final String CLIENTID = TAG + ".client";
	public static final String CLIENT_HANDLE = TAG + ".clientHandle";

	// an intent receiver to deal with changes in network connectivity
	private NetworkConnectionIntentReceiver networkConnectionMonitor;

	// a receiver to recognise when the user changes the "background data"
	// preference
	// and a flag to track that preference
	// Only really relevant below android version ICE_CREAM_SANDWICH - see
	// android docs
	private BackgroundDataPreferenceReceiver backgroundDataPreferenceMonitor;
	private boolean backgroundDataEnabled = true;

	// callback id for making trace callbacks to the Activity
	// needs to be set by the activity as appropriate
	private String traceCallbackId;
	// state of tracing
	private boolean traceEnabled = false;
	
	// somewhere to persist received messages until we're sure
	// that they've reached the application
	MessageStore messageStore;

	// a way to pass ourself back to the activity
	private MqttServiceBinder mqttServiceBinder;

	// mapping from client handle strings to actual clients
	private Map<String/* clientHandle */, MqttServiceClient/* client */> clients = new HashMap<String, MqttServiceClient>();

	// support a basic "proof of concept" notification mechanism
	private static final int NOTIFICATION_ID = 1;
	private NotificationManager notificationManager;

	/**
	 * constructor - very simple!
	 * 
	 */
	public MqttService() {
		super();
	}

	/**
	 * pass data back to the Activity
	 * 
	 * @param clientHandle
	 *            source of the data
	 * @param status
	 *            OK or Error
	 * @param dataBundle
	 *            the data to be passed
	 */
	void callbackToActivity(String clientHandle, Status status,
			Bundle dataBundle) {
// Don't call traceDebug, as it will try to callbackToActivity leading to recursion.
		Intent callbackIntent = new Intent(
				MqttServiceConstants.CALLBACK_TO_ACTIVITY);
		if (clientHandle != null) {
			callbackIntent.putExtra(
					MqttServiceConstants.CALLBACK_CLIENT_HANDLE, clientHandle);
		}
		callbackIntent.putExtra(MqttServiceConstants.CALLBACK_STATUS, status);
		if (dataBundle != null) {
			callbackIntent.putExtras(dataBundle);
		}
		sendBroadcast(callbackIntent);
	}

	// The major API implementation follows :-

	/**
	 * get an MqttServiceClient object to represent a connection to a server
	 * 
	 * @param host
	 * @param port
	 * @param clientId
	 * @return a string to be used by the Activity as a "handle" for this
	 *         MqttServiceClient
	 */
	public String getClient(String host, int port, String clientId) {
		String clientHandle = host + ":" + port + ":" + clientId;
		if (!clients.containsKey(clientHandle)) {
			MqttServiceClient client = new MqttServiceClient(this, host, port,
					clientId, clientHandle);
			clients.put(clientHandle, client);
		}
		return clientHandle;
	}

	/**
	 * actually connect to the server
	 * 
	 * @param clientHandle
	 *            identifies the MqttServiceClient to use
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
	 *            - if true, use SSL/TLS (configured on the VM?)
	 * @param sslProperties
	 * 			  properties configuring the SSL/TLS connection
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary identifier to be passed back to the Activity
	 */
	public void connect(String clientHandle, int timeout, boolean cleanSession,
			String userName, String passWord, int keepAliveInterval,
			MessagingMessage willMessage, boolean useSSL, Properties sslProperties,
			String invocationContext, String activityToken) {

		MqttServiceClient client = clientFromHandle(clientHandle);
		client.connect(timeout, cleanSession, userName, passWord,
				keepAliveInterval, willMessage, useSSL, sslProperties, invocationContext,activityToken);
	}

	/**
	 * disconnect from the server
	 * 
	 * @param clientHandle
	 *            identifies the MqttServiceClient to use
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary identifier to be passed back to the Activity
	 */
	public void disconnect(String clientHandle, String invocationContext,
			String activityToken) {
		MqttServiceClient client = clientFromHandle(clientHandle);
		client.disconnect(invocationContext, activityToken);
		clients.remove(clientHandle);
	}

	/**
	 * Request all clients to reconnect if appropriate
	 */
	void reconnect() {
		for (MqttServiceClient client : clients.values()) {
			client.reconnect();
		}
	}
	
	/**
	 * Notify clients we're offline
	 */
	void notifyClientsOffline() {
		for (MqttServiceClient client : clients.values()) {
			client.offline();
		}
	}

	/**
	 * send a message
	 * 
	 * @param clientHandle
	 *            identifies the MqttServiceClient
	 * @param msg
	 *            the message to send
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary identifier to be passed back to the Activity
	 */
	public void send(String clientHandle, MessagingMessage msg,
			String invocationContext, String activityToken) {
		MqttServiceClient client = clientFromHandle(clientHandle);
		client.send(msg, invocationContext, activityToken);
	}

	/**
	 * subscribe to a topic
	 * 
	 * @param clientHandle
	 *            identifies the MqttServiceClient
	 * @param topicFilter
	 *            possibly wildcarded topic name
	 * @param qos
	 *            requested quality of service
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary identifier to be passed back to the Activity
	 */
	public void subscribe(String clientHandle, String topicFilter, int qos,
			String invocationContext, String activityToken) {
		MqttServiceClient client = clientFromHandle(clientHandle);
		client.subscribe(topicFilter, qos, invocationContext, activityToken);
	}

	/**
	 * unsubscribe from a topic
	 * 
	 * @param clientHandle
	 *            identifies the MqttServiceClient
	 * @param topicFilter
	 *            possibly wildcarded topic name
	 * @param invocationContext
	 *            arbitrary data to be passed back to the application
	 * @param activityToken
	 *            arbitrary identifier to be passed back to the Activity
	 */
	public void unsubscribe(String clientHandle, final String topicFilter,
			String invocationContext, String activityToken) {
		MqttServiceClient client = clientFromHandle(clientHandle);
		client.unsubscribe(topicFilter, invocationContext, activityToken);
	}

	/**
	 * @param clientHandle
	 * @return the MqttServiceClient identified by this handle
	 */
	private MqttServiceClient clientFromHandle(String clientHandle) {
		MqttServiceClient client = clients.get(clientHandle);
		if (client == null) {
			throw new IllegalArgumentException("Invalid ClientHandle");
		}
		return client;
	}

	/**
	 * Called by plugin when message has been passed back to the application
	 * 
	 * @param clientHandle
	 * @param messageId
	 */
	public PluginResult acknowledgeMessageArrival(String clientHandle, String id) {
		if (messageStore.discardArrived(clientHandle,id)) {
			return new PluginResult(Status.OK);
		} else {
			return new PluginResult(Status.ERROR);
		}
	}

	// show a notification string
	@SuppressWarnings("deprecation")
	void showNotification(String status) {
		traceDebug(TAG, "showNotification() new={" + status + "}");

		if (status == null) {
			notificationManager.cancel(NOTIFICATION_ID);
			return;
		}

	    int iconId = getResources().getIdentifier("icon", "drawable", getPackageName());
		CharSequence tickerText = status;
		CharSequence contentTitle = "MqttService";
		CharSequence contentText = status;

		Intent notificationIntent = new Intent(this, MqttService.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0,
				notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);

		// the next two lines initialize the Notification, using the
		// configurations above
		Notification notification = new Notification();
		notification.when = System.currentTimeMillis();
		notification.flags = Notification.FLAG_AUTO_CANCEL;

		notification.icon = iconId;
		notification.tickerText = tickerText;
		notification.setLatestEventInfo(getBaseContext(), contentTitle,
				contentText, contentIntent);
		notificationManager.notify(NOTIFICATION_ID, notification);
	}

	/**
	 * @return whether the android service can be regarded as online
	 */
	boolean isOnline() {
		ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
		if (cm.getActiveNetworkInfo() != null
				&& cm.getActiveNetworkInfo().isAvailable()
				&& cm.getActiveNetworkInfo().isConnected()
				&& backgroundDataEnabled) {
			return true;
		}

		return false;
	}

	// Extend Service

	public void onCreate() {
		super.onCreate();

		// create a binder that will let the Activity UI send
		// commands to the Service
		mqttServiceBinder = new MqttServiceBinder(this);

		// create somewhere to buffer received messages until
		// we know that they have been passed to the application
		messageStore = new DatabaseMessageStore(this, this);

		notificationManager = (NotificationManager) getApplicationContext()
				.getSystemService(Context.NOTIFICATION_SERVICE);

	}

	public void onDestroy() {
		super.onDestroy();

		// disconnect immediately
		for (MqttServiceClient client : clients.values()) {
			client.disconnect(null, null);
		}

		// clear down
		if (mqttServiceBinder != null) {
			mqttServiceBinder = null;
		}
	}

	public IBinder onBind(Intent intent) {
		// What we pass back to the Activity on binding -
		// a reference to ourself, and the activityToken
		// we were given when started
		String activityToken = intent
				.getStringExtra(MqttServiceConstants.CALLBACK_ACTIVITY_TOKEN);
		mqttServiceBinder.setActivityToken(activityToken);
		return mqttServiceBinder;
	}

	public int onStartCommand(final Intent intent, int flags, final int startId) {

		registerBroadcastReceivers();

		// run till explicitly stopped, restart when
		// process restarted
		return START_STICKY;
	}

	@SuppressWarnings("deprecation")
	private void registerBroadcastReceivers() {
		if (networkConnectionMonitor == null) {
			networkConnectionMonitor = new NetworkConnectionIntentReceiver();
			registerReceiver(networkConnectionMonitor, new IntentFilter(
					ConnectivityManager.CONNECTIVITY_ACTION));
		}

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
			// Support the old system for background data preferences
			ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
			backgroundDataEnabled = cm.getBackgroundDataSetting();
			if (backgroundDataPreferenceMonitor == null) {
				backgroundDataPreferenceMonitor = new BackgroundDataPreferenceReceiver();
				registerReceiver(
						backgroundDataPreferenceMonitor,
						new IntentFilter(
								ConnectivityManager.ACTION_BACKGROUND_DATA_SETTING_CHANGED));
			}
		}
	}

	/*
	 * Called in response to a change in network connection - after losing a
	 * connection to the server, this allows us to wait until we have a usable
	 * data connection again
	 */
	private class NetworkConnectionIntentReceiver extends BroadcastReceiver {

		public void onReceive(Context context, Intent intent) {
			// we protect against the phone switching off
			// by requesting a wake lock - we request the minimum possible wake
			// lock - just enough to keep the CPU running until we've finished
			PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
			WakeLock wl = pm
					.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MQTT");
			wl.acquire();

			if (isOnline()) {
				// we have an internet connection - have another try at
				// connecting
				reconnect();
			} else {
				notifyClientsOffline();
			}

			// we're finished - if the phone is switched off, it's okay for the
			// CPU
			// to sleep now
			wl.release();
		}
	}

	/**
	 * Detect changes of the Allow Background Data setting - only used below
	 * ICE_CREAM_SANDWICH
	 */
	private class BackgroundDataPreferenceReceiver extends BroadcastReceiver {

		@SuppressWarnings("deprecation")
		@Override
		public void onReceive(Context context, Intent intent) {
			ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
			if (cm.getBackgroundDataSetting()) {
				if (!backgroundDataEnabled) {
					backgroundDataEnabled = true;
					// we have an internet connection - have another try at
					// connecting
					reconnect();
				}
			} else {
				backgroundDataEnabled = false;
				notifyClientsOffline();
			}
		}
	}

	/**
	 * identify the callbackId to be passed when making tracing calls back into
	 * the Activity
	 * 
	 * @param traceCallbackId
	 */
	public void setTraceCallbackId(String traceCallbackId) {
		this.traceCallbackId = traceCallbackId;
	}

	/**
	 * turn tracing on and off
	 * @param traceEnabled
	 */
	public void setTraceEnabled(boolean traceEnabled) {
		this.traceEnabled = traceEnabled;
	}
	
	/**
	 * trace debugging information
	 * 
	 * @param tag
	 *            identifier for the source of the trace
	 * @param message
	 *            the text to be traced
	 */
	public void traceDebug(String tag, String message) {
		traceCallback("debug", message);
	}

	/**
	 * trace error information 
	 * 
	 * @param tag
	 *            identifier for the source of the trace
	 * @param message
	 *            the text to be traced
	 */
	public void traceError(String tag, String message) {
		traceCallback("error", message);
	}

	private void traceCallback(String severity, String message) {
		if ((traceCallbackId != null) && (traceEnabled)) {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.TRACE_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_TRACE_SEVERITY,
					severity);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					message);
			callbackToActivity(null, Status.ERROR, dataBundle);
		}
	}

	/**
	 * trace exceptions twice - once to the android logCat system, once to the
	 * application provided tracing
	 * 
	 * @param tag
	 *            identifier for the source of the trace
	 * @param message
	 *            the text to be traced
	 */
	public void traceException(String tag, String message, Exception e) {
		if (traceCallbackId != null) {
			Bundle dataBundle = new Bundle();
			dataBundle.putString(MqttServiceConstants.CALLBACK_ACTION,
					MqttServiceConstants.TRACE_ACTION);
			dataBundle.putString(MqttServiceConstants.CALLBACK_ERROR_MESSAGE,
					message);
			dataBundle.putString(MqttServiceConstants.CALLBACK_EXCEPTION_STACK,
					Log.getStackTraceString(e));
			callbackToActivity(null, Status.ERROR, dataBundle);
		}
	}

}
