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

import java.util.Arrays;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import android.os.Bundle;

/**
 * A java representation of the Messaging.Message class from javascript
 * 
 */
public class MessagingMessage {

	private String destinationName;
	private byte[] payload;
	private int qos;
	private boolean retained;
	private boolean duplicate;
	private String messageId;

	/**
	 * Constructor based on an MqttMessage object
	 * 
	 * @param destinationName
	 * @param msg
	 * @throws MqttException
	 */
	public MessagingMessage(String destinationName, MqttMessage msg)
			throws MqttException {
		this(destinationName, msg.getPayload(), msg.getQos(), msg.isRetained(),
				false);
	}

	/**
	 * "From scratch" constructor
	 * 
	 * @param destinationName
	 * @param payload
	 * @param qos
	 * @param retained
	 * @param duplicate
	 */
	public MessagingMessage(String destinationName, byte[] payload, int qos,
			boolean retained, boolean duplicate) {
		this.destinationName = destinationName;
		this.payload = payload;
		this.qos = qos;
		this.retained = retained;
		this.duplicate = duplicate;
	}

	/**
	 * Dump the message into an Android bundle,<br>
	 * so it can be passed back in an Intent
	 * 
	 * @return Bundled message
	 */
	public Bundle toBundle() {
		Bundle result = new Bundle();
		result.putString(MqttServiceConstants.CALLBACK_MESSAGE_ID, messageId);
		result.putByteArray(MqttServiceConstants.CALLBACK_PAYLOAD, payload);
		result.putString(MqttServiceConstants.CALLBACK_DESTINATION_NAME,
				destinationName);
		result.putInt(MqttServiceConstants.CALLBACK_QOS, qos);
		result.putBoolean(MqttServiceConstants.CALLBACK_RETAINED, retained);
		result.putBoolean(MqttServiceConstants.CALLBACK_DUPLICATE, duplicate);
		return result;
	}

	public String getDestinationName() {
		return destinationName;
	}

	public byte[] getPayload() {
		return payload;
	}

	public int getQos() {
		return qos;
	}

	public boolean isRetained() {
		return retained;
	}

	public boolean isDuplicate() {
		return duplicate;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	@Override
	public int hashCode() {
		return safeHash(destinationName) + //
				31 * safeHash(payload) + //
				37 * qos + //
				((retained) ? 43 : 0) + //
				((duplicate) ? 47 : 0);
	}

	private int safeHash(Object o) {
		return (o == null) ? 0 : o.hashCode();
	}

	private int safeHash(byte[] b) {
		return (b == null) ? 0 : Arrays.hashCode(b);
	}

	@Override
	public boolean equals(Object o) {
		if (o == null) {
			return false;
		}
		if (!(o instanceof MessagingMessage)) {
			return false;
		}
		MessagingMessage that = (MessagingMessage) o;
		return safeEquals(this.destinationName, that.destinationName) && //
				safeEquals(this.payload, that.payload) && //
				(this.qos == that.qos) && //
				(this.duplicate == that.duplicate) && //
				(this.retained == that.retained);
	}

	private boolean safeEquals(Object o1, Object o2) {
		if ((o1 == null) && (o2 == null)) { // both null - OK
			return true;
		}
		if ((o1 == null) || (o2 == null)) { // only one null
			return false;
		}
		return o1.equals(o2);
	}

	private boolean safeEquals(byte[] b1, byte[] b2) {
		if ((b1 == null) && (b2 == null)) { // both null - OK
			return true;
		}
		if ((b1 == null) || (b2 == null)) { // only one null
			return false;
		}
		return Arrays.equals(b1, b2);
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("DestinationName: {");
		builder.append(destinationName);
		builder.append('}');
		builder.append(" Payload hash: {");
		builder.append(safeHash(payload));
		builder.append('}');
		builder.append(" Quality of Service :");
		builder.append(qos);
		builder.append(" Retained : ");
		builder.append(retained);
		builder.append(" Duplicate : ");
		builder.append(duplicate);
		builder.append('}');
		return builder.toString();
	}
}
