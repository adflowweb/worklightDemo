/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * WL.Server.invokeCastIron(parameters) accepts the following json object as an
 * argument: { // Mandatory method : 'get' or 'post', path: value, appName:
 * value, // Optional requestType: 'http', returnedContentType: any known
 * mime-type or one of "json", "css", "csv", "javascript", "plain", "xml",
 * "html" returnedContentEncoding : 'encoding', parameters: {name1: value1, ... },
 * headers: {name1: value1, ... }, cookies: {name1: value1, ... }, body: {
 * contentType: 'text/xml; charset=utf-8' or similar value, content: stringValue },
 * transformation: { type: 'default', or 'xslFile', xslFile: fileName } }
 */

// orchestrationName ==> "ADFlowContact";
function startOrchestration(orchestrationName) {

	var input = {
		method : 'get',
		appName : 'myApp',
		requestType : 'http',
		path : orchestrationName,
		returnedContentType : 'json'

	};
	return WL.Server.invokeCastIron(input);
}

function startOrchestrationFiltered(orchestrationName) {

	var input = {
		method : 'get',
		appName : 'myApp',
		requestType : 'http',
		path : orchestrationName,
		returnedContentType : 'xml',
		transformation : {
			type : 'xslFile',
			xslFile : 'ci-filtered.xsl'
		}

	};
	return WL.Server.invokeCastIron(input);
}

function startOrchestration_post(param, orchestrationName) {
	// var jsonData = '{"act":"'+param+'"}';
	var jsonData = param;
	var input = {
		method : 'post',
		appName : 'myApp',
		requestType : 'http',
		path : orchestrationName,
		returnedContentType : 'json',
		body : {
			contentType : 'application/json',
			content : jsonData
		}

	};
	return WL.Server.invokeCastIron(input);
}
