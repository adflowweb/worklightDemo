/*
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/*******************************************************************************
 * Implementation code for procedure - 'procedure1'
 * 
 * 
 * @return - invocationResult
 */
 
var procedure1Statement = WL.Server.createSQLStatement("select COLUMN1, COLUMN2 from TABLE1 where COLUMN3 = ?");
function procedure1(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : procedure1Statement,
		parameters : [param]
	});
}


/*******************************************************************************
 * Implementation code for procedure - 'procedure2'
 * 
 * 
 * @return - invocationResult
 */
 
function procedure2(param) {
	return WL.Server.invokeSQLStoredProcedure({
		procedure : "storedProcedure2",
		parameters : [param]
	});
}


/*******************************************************************************
 * Functions that correspond to JSONStore client operations
 * 
 */

var selectStatement = WL.Server.createSQLStatement("select * from STOCKREQ where REQID=? AND APPRVD <> 'Y'");

function getStockReqs(reqID) {
		
	return WL.Server.invokeSQLStatement({
		preparedStatement : selectStatement,
		parameters : [reqID]
	});
}

var selectStatementList = WL.Server.createSQLStatement("select REQID, REQSTORE, RDELDATE from STOCKREQ ORDER BY REQID ASC");
    
function getStockReqList() {
		
	return WL.Server.invokeSQLStatement({
		preparedStatement : selectStatementList,
		parameters : []
	});
}

var addStatement = WL.Server.createSQLStatement("insert into TABLE1 (COLUMN1, COLUMN2) values (?, ?)");

function addStockReq(param1) {
		
	return WL.Server.invokeSQLStatement({
		preparedStatement : addStatement,
		parameters : [param1]
	});
}
	
var updateStatement = WL.Server.createSQLStatement("update STOCKREQ set APPRVD='Y' where REQID=?");

function updateStockReq(reqID) {
		
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateStatement,
		parameters : [reqID]
	});
}

var deleteStatement = WL.Server.createSQLStatement("delete from TABLE1 where COLUMN1=?");

function deleteStockReq(param1) {
		
	return WL.Server.invokeSQLStatement({
		preparedStatement : deleteStatement,
		parameters : [param1]
	});
}