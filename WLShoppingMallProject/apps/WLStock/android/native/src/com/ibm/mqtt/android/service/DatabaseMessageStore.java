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

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * implementation of the MessageStore interface, using a SQLite database
 * 
 */
public class DatabaseMessageStore implements MessageStore {

	// TAG used for indentify trace data etc.
	private static String TAG = "DatabaseMessageStore";

	// "private" database column names
	// The other database column names are defined in MqttServiceConstants
	private static final String MTIMESTAMP = "mtimestamp";

	// the names of the tables in the database which we will save messages to
	private static final String ARRIVED_MESSAGE_TABLE_NAME = "MqttArrivedMessageTable";

	// the database
	private SQLiteDatabase db = null;

	// a SQLiteOpenHelper specific for this database
	private MQTTDatabaseHelper mqttDb = null;

	// a place to send trace data
	private MqttTraceHandler traceHandler = null;

	private MqttService service;

	/**
	 * We need a SQLiteOpenHelper to handle database creation and updating
	 * 
	 */
	private static class MQTTDatabaseHelper extends SQLiteOpenHelper {
		// TAG used for indentify trace data etc.
		private static String TAG = "MQTTDatabaseHelper";

		private static final String DATABASE_NAME = "mqttService.db";

		// database version, used to recognise when we need to upgrade
		// (delete and recreate)
		private static final int DATABASE_VERSION = 9;

		// a place to send trace data
		private MqttTraceHandler traceHandler = null;

		/**
		 * Constructor.
		 * 
		 * @param traceHandler
		 * @param context
		 */
		public MQTTDatabaseHelper(MqttTraceHandler traceHandler, Context context) {
			super(context, DATABASE_NAME, null, DATABASE_VERSION);
			this.traceHandler = traceHandler;
		}

		/**
		 * When the database is (re)created, create our table
		 * 
		 * @param database
		 */
		public void onCreate(SQLiteDatabase database) {
			String createArrivedTableStatement = "CREATE TABLE "
					+ ARRIVED_MESSAGE_TABLE_NAME + "("
					+ MqttServiceConstants.MESSAGE_ID + " TEXT PRIMARY KEY, "
					+ MqttServiceConstants.CLIENT_HANDLE + " TEXT, "
					+ MqttServiceConstants.DESTINATION_NAME + " TEXT, "
					+ MqttServiceConstants.PAYLOAD + " BLOB, "
					+ MqttServiceConstants.QOS + " INTEGER, "
					+ MqttServiceConstants.RETAINED + " TEXT, "
					+ MqttServiceConstants.DUPLICATE + " TEXT, " + MTIMESTAMP
					+ " INTEGER" + ");";
			traceHandler.traceDebug(TAG, "onCreate {"
					+ createArrivedTableStatement + "}");
			try {
				database.execSQL(createArrivedTableStatement);
				traceHandler.traceDebug(TAG, "created the table");
			} catch (SQLException e) {
				traceHandler.traceException(TAG, "onCreate", e);
				throw e;
			}
		}

		/**
		 * To upgrade the database, drop and recreate our table
		 * 
		 * @param db
		 *            the database
		 * @param oldVersion
		 *            ignored
		 * @param newVersion
		 *            ignored
		 */

		public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
			traceHandler.traceDebug(TAG, "onUpgrade");
			try {
				db.execSQL("DROP TABLE IF EXISTS " + ARRIVED_MESSAGE_TABLE_NAME);
			} catch (SQLException e) {
				traceHandler.traceException(TAG, "onUpgrade", e);
				throw e;
			}
			onCreate(db);
			traceHandler.traceDebug(TAG, "onUpgrade complete");
		}
	}

	/**
	 * Constructor
	 * 
	 * @param service
	 *            our parent service
	 * @param context
	 *            a context to use for android calls
	 */
	public DatabaseMessageStore(MqttService service, Context context) {
		this.traceHandler = (MqttTraceHandler) service;
		this.service = service;
		// Open message database
		mqttDb = new MQTTDatabaseHelper(traceHandler, context);
		// Android documentation suggests that this perhaps
		// could/should be done in another thread, but as the
		// database is only one table, I doubt it matters...
		db = mqttDb.getWritableDatabase();
		traceHandler.traceDebug(TAG, "DatabaseMessageStore<init> complete");
	}

	/**
	 * store a message
	 * 
	 * @param clientHandle
	 *            identifier for the client storing the message
	 * @param msg
	 *            the message
	 * @return an identifier for the message, so that it can be removed when
	 *         appropriate
	 */
	public String storeArrived(String clientHandle, MessagingMessage msg) {
		traceHandler.traceDebug(TAG, "storeArrived{" + clientHandle + "}, {"
				+ msg.toString() + "}");

		String topicFilter = msg.getDestinationName();
		byte[] payload = msg.getPayload();
		int qos = msg.getQos();
		boolean retained = msg.isRetained();
		boolean duplicate = msg.isDuplicate();

		ContentValues values = new ContentValues();
		String id = java.util.UUID.randomUUID().toString();
		values.put(MqttServiceConstants.MESSAGE_ID, id);
		values.put(MqttServiceConstants.CLIENT_HANDLE, clientHandle);
		values.put(MqttServiceConstants.DESTINATION_NAME, topicFilter);
		values.put(MqttServiceConstants.PAYLOAD, payload);
		values.put(MqttServiceConstants.QOS, qos);
		values.put(MqttServiceConstants.RETAINED, retained);
		values.put(MqttServiceConstants.DUPLICATE, duplicate);
		values.put(MTIMESTAMP, System.currentTimeMillis());
		try {
			db.insertOrThrow(ARRIVED_MESSAGE_TABLE_NAME, null, values);
		} catch (SQLException e) {
			traceHandler.traceException(TAG, "onUpgrade", e);
			throw e;
		}
		int count = getArrivedRowCount(clientHandle);
		maintainNotification(count);
		traceHandler
				.traceDebug(
						TAG,
						"storeArrived: inserted message with id of {"
								+ id
								+ "} - Number of messages in database for this clientHandle = "
								+ count);
		return id;
	}

	/*
	 * Simple callback into the service to produce notifications showing the
	 * number of messages outstanding. This is basically a proof of concept,
	 * rather than intended to be useful in itself.
	 */
	private void maintainNotification(int count) {
		String statusText = (count == 0) ? null
				: (count + " messages outstanding");
		service.showNotification(statusText);
	}

	private int getArrivedRowCount(String clientHandle) {
		String[] cols = new String[1];
		cols[0] = "COUNT(*)";
		Cursor c = db.query(ARRIVED_MESSAGE_TABLE_NAME, cols,
				MqttServiceConstants.CLIENT_HANDLE + "='" + clientHandle + "'",
				null, null, null, null);
		int count = 0;
		if (c.moveToFirst()) {
			count = c.getInt(0);
		}
		c.close();
		return count;
	}

	/**
	 * Delete message.
	 * 
	 * @param id
	 *            the identifying string returned when the message was stored
	 * 
	 * @return true if the message was found and deleted
	 */
	public boolean discardArrived(String clientHandle, String id) {
		traceHandler.traceDebug(TAG, "discardArrived{" + clientHandle + "}, {"
				+ id + "}");
		int rows;
		try {
			rows = db.delete(ARRIVED_MESSAGE_TABLE_NAME,
					MqttServiceConstants.MESSAGE_ID + "='" + id + "' AND "
							+ MqttServiceConstants.CLIENT_HANDLE + "='"
							+ clientHandle + "'", null);
		} catch (SQLException e) {
			traceHandler.traceException(TAG, "discardArrived", e);
			throw e;
		}
		if (rows != 1) {
			traceHandler.traceError(TAG,
					"discardArrived - Error deleting message {" + id
							+ "} from database: Rows affected = " + rows);
			return false;
		}
		int count = getArrivedRowCount(clientHandle);
		maintainNotification(count);
		traceHandler
				.traceDebug(
						TAG,
						"discardArrived - Message deleted successfully. - messages in db for this clientHandle "
								+ count);
		return true;
	}

	/**
	 * get an iterator over all messages stored<br>
	 * (optionally for a specific client)
	 * 
	 * @param clientHandle
	 *            identifier for the client.<br>
	 *            If null, all messages are retrieved
	 * @return the iterator
	 */
	public Iterator<MessagingMessage> getAllArrivedMessages(
			final String clientHandle) {
		return new Iterator<MessagingMessage>() {
			private Cursor c;
			private boolean hasNext;

			{
				// anonymous initialiser to start a suitable query
				// and position at the first row, if one exists
				if (clientHandle == null) {
					c = db.query(ARRIVED_MESSAGE_TABLE_NAME, null, null, null,
							null, null, "mtimestamp ASC");
				} else {
					c = db.query(ARRIVED_MESSAGE_TABLE_NAME, null,
							MqttServiceConstants.CLIENT_HANDLE + "='"
									+ clientHandle + "'", null, null, null,
							"mtimestamp ASC");
				}
				hasNext = c.moveToFirst();
			}

			public boolean hasNext() {
				return hasNext;
			}

			public MessagingMessage next() {
				String messageId = c.getString(c
						.getColumnIndex(MqttServiceConstants.MESSAGE_ID));
				String destinationName = c.getString(c
						.getColumnIndex(MqttServiceConstants.DESTINATION_NAME));
				byte[] payload = c.getBlob(c
						.getColumnIndex(MqttServiceConstants.PAYLOAD));
				int qos = c.getInt(c.getColumnIndex(MqttServiceConstants.QOS));
				boolean retained = Boolean.parseBoolean(c.getString(c
						.getColumnIndex(MqttServiceConstants.RETAINED)));
				boolean duplicate = Boolean.parseBoolean(c.getString(c
						.getColumnIndex(MqttServiceConstants.DUPLICATE)));

				// build the result
				MessagingMessage result = new MessagingMessage(destinationName,
						payload, qos, retained, duplicate);
				result.setMessageId(messageId);

				// move on
				hasNext = c.moveToNext();
				return result;
			}

			public void remove() {
				throw new UnsupportedOperationException();
			}

		};
	}

	/**
	 * delete all messages (optionally for a specific client)
	 * 
	 * @param clientHandle
	 *            identifier for the client.<br>
	 *            If null, all messages are deleted
	 */
	public void clearArrivedMessages(String clientHandle) {
		int rows = 0;
		if (clientHandle == null) {
			traceHandler.traceDebug(TAG,
					"clearArrivedMessages: clearing the table");
			rows = db.delete(ARRIVED_MESSAGE_TABLE_NAME, null, null);
		} else {
			traceHandler.traceDebug(TAG,
					"clearArrivedMessages: clearing the table of "
							+ clientHandle + " messages");
			rows = db.delete(ARRIVED_MESSAGE_TABLE_NAME,
					MqttServiceConstants.CLIENT_HANDLE + "='" + clientHandle
							+ "'", null);
		}
		traceHandler.traceDebug(TAG, "clearArrivedMessages: rows affected = "
				+ rows);
		return;
	}

}