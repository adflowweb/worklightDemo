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

import android.os.Binder;

/**
 * what the Service passes to the Activity on binding
 * <ul>
 * <li>a reference to the Service
 * <li>the activityToken provided when the Service was started
 * </ul>
 * 
 */
public class MqttServiceBinder extends Binder {

	private MqttService mqttService;
	private String activityToken;

	public MqttServiceBinder(MqttService mqttService) {
		this.mqttService = mqttService;
	}

	public MqttService getService() {
		return mqttService;
	}

	public void setActivityToken(String activityToken) {
		this.activityToken = activityToken;
	}

	public String getActivityToken() {
		return activityToken;
	}

}
