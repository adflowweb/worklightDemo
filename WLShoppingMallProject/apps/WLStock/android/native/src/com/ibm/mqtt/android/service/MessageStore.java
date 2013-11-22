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

import java.util.Iterator;

/**
 * Mechanism for persisting messages until we know they have been received
 *
 */
public interface MessageStore {

	/**
	 * Store a message and return an identifier for it
	 * @param clientHandle identifier for the client
	 * @param msg message to be stored
	 * @return a unique identifier for it
	 */
	public String storeArrived(String clientHandle, MessagingMessage msg);


	/**
	 * Discard a message
	 * @param clientHandle identifier for the client
	 * @param id id of message to be discarded
	 */
	public boolean discardArrived(String clientHandle, String id);
	
	/**
	 * Get all the stored messages
	 * @param clientHandle identifier for the client
	 */
	public Iterator<MessagingMessage> getAllArrivedMessages(String clientHandle);
	
	/**
	 * Discard stored messages
	 * @param clientHandle identifier for the client
	 */
	public void clearArrivedMessages(String clientHandle);
	
}
