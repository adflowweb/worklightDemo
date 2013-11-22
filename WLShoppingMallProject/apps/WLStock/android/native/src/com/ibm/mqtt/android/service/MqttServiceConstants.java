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

public interface MqttServiceConstants {

	public static final String ACTIVITY_TOKEN = "activityToken";
	public static final String INVOCATION_CONTEXT = "invocationContext";
	/**
	 * Attibutes of messages
	 * <p>
	 * Used for the column names in the database and for the property names in
	 * the javascript objects
	 */
	static final String DUPLICATE = "duplicate";
	static final String RETAINED = "retained";
	static final String QOS = "qos";
	static final String PAYLOAD = "payload";
	static final String DESTINATION_NAME = "destinationName";
	static final String CLIENT_HANDLE = "clientHandle";
	static final String MESSAGE_ID = "messageId";

	// plugin actions
	public static final String SEND_ACTION = "send";
	public static final String ACKNOWLEDGE_RECEIPT_ACTION = "acknowledgeReceipt";
	public static final String UNSUBSCRIBE_ACTION = "unsubscribe";
	public static final String SUBSCRIBE_ACTION = "subscribe";
	public static final String DISCONNECT_ACTION = "disconnect";
	public static final String CONNECT_ACTION = "connect";
	public static final String GET_CLIENT_ACTION = "getClient";
	public static final String START_SERVICE_ACTION = "startService";
	public static final String STOP_SERVICE_ACTION = "stopService";
	public static final String MESSAGE_ARRIVED_ACTION = "messageArrived";
	public static final String MESSAGE_DELIVERED_ACTION = "messageDelivered";
	public static final String ON_CONNECTION_LOST_ACTION = "onConnectionLost";
	public static final String TRACE_ACTION = "trace";

	public static final String SET_ON_CONNECTIONLOST_CALLBACK = "setOnConnectionLostCallbackId";
	public static final String SET_ON_MESSAGE_ARRIVED_CALLBACK = "setOnMessageArrivedCallbackId";
	public static final String SET_ON_MESSAGE_DELIVERED_CALLBACK = "setOnMessageDeliveredCallbackId";
	public static final String SET_TRACE_CALLBACK = "setTraceCallbackId";
	public static final String SET_TRACE_ENABLED = "setTraceEnabled";
	public static final String SET_TRACE_DISABLED = "setTraceDisabled";
	public static final String SEND_SUCCESSFUL_CALLBACK_ID = "sendSuccessfulCallbackId";

	// Identifies an Intent which calls back to the Activity
	public static final String CALLBACK_TO_ACTIVITY = MqttService.TAG
			+ ".callbackToActivity";

	// Identifiers for extra data on Intents broadcast to the Activity
	public static final String CALLBACK_ACTION = MqttService.TAG
			+ ".callbackAction";
	public static final String CALLBACK_STATUS = MqttService.TAG
			+ ".callbackStatus";
	public static final String CALLBACK_CLIENT_ID = MqttService.TAG
			+ ".clientId";
	public static final String CALLBACK_CLIENT_HANDLE = MqttService.TAG + "."
			+ CLIENT_HANDLE;
	public static final String CALLBACK_ERROR_MESSAGE = MqttService.TAG
			+ ".errorMessage";
	public static final String CALLBACK_ERROR_NUMBER = MqttService.TAG
			+ ".errorNumber";
	public static final int DEFAULT_ERROR_NUMBER = -1; // When we don't have an
														// Mqtt reason code...
	public static final String CALLBACK_EXCEPTION_STACK = MqttService.TAG
			+ ".exceptionStack";
	public static final String CALLBACK_INVOCATION_CONTEXT = MqttService.TAG
			+ "." + INVOCATION_CONTEXT;
	public static final String CALLBACK_ACTIVITY_TOKEN = MqttService.TAG + "."
			+ ACTIVITY_TOKEN;

	public static final String CALLBACK_DUPLICATE = MqttService.TAG + '.'
			+ DUPLICATE;
	public static final String CALLBACK_RETAINED = MqttService.TAG + '.'
			+ RETAINED;
	public static final String CALLBACK_QOS = MqttService.TAG + '.' + QOS;
	public static final String CALLBACK_PAYLOAD = MqttService.TAG + '.'
			+ PAYLOAD;
	public static final String CALLBACK_DESTINATION_NAME = MqttService.TAG
			+ '.' + DESTINATION_NAME;
	public static final String CALLBACK_MESSAGE_ID = MqttService.TAG + '.'
			+ MESSAGE_ID;

	public static final String CALLBACK_TRACE_SEVERITY = MqttService.TAG
			+ ".traceSeverity";

}