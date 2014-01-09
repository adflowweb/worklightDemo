////////////////////
// author: nadir93
// date: 2013.12.18
////////////////////
// Uncomment the initialization options as required. For advanced initialization options please refer to IBM Worklight Information Center 

var wlInitOptions = {

	// # Should application automatically attempt to connect to Worklight Server
	// on application start up
	// # The default value is true, we are overriding it to false here.
	connectOnStartup : false,

	// # The callback function to invoke in case application fails to connect to
	// Worklight Server
	// onConnectionFailure : function() {

	// },

	// # Worklight server connection timeout
	// timeout: 30000,

	// # How often heartbeat request will be sent to Worklight Server
	// heartBeatIntervalInSecs: 20 * 60,

	// # Enable FIPS 140-2 for data-in-motion (network) and data-at-rest
	// (JSONStore) on iOS or Android.
	// Requires the FIPS 140-2 optional feature to be enabled also.
	// enableFIPS : false,

	// # Application Logger, see documentation under WL.Logger for more details.
	// - enabled - Determines if log messages are shown (true) or not (false)
	// - level - Logging level, most to least verbose: 'debug', 'log', 'info',
	// 'warn', 'error'
	// - stringify - Turn arguments into strings before printing to the console
	// (true) or not (false)
	// - pretty - Turns JSON Objects into well spaced and formated strings.
	// - tag.level - Append a level tag (e.g. [DEBUG] Message) to the message.
	// - tag.package - Append the package tag (e.g. [my.pkg] Message) to the
	// message if there is one
	// - whitelist - Array of package names to show (e.g ['my.pkg'])
	// - blacklist - Array of package names to ignore (e.g ['my.pkg'])
	logger : {
		enabled : true,
		level : 'error',
		stringify : true,
		pretty : false,
		tag : {
			level : false,
			pkg : true
		},
		whitelist : [],
		blacklist : []
	},

	// #Application Analytics
	// - enabled - Determines if analytics messages are sent to the server
	// - url - server that receives the analytics data (default:
	// [worklight-server]/analytics)
	analytics : {
		enabled : false
	// url : ''
	}

// # The options of busy indicator used during application start up
// busyOptions: {text: "Loading..."}
};

ADF = {};
ADF.view = {};
ADF.model = {};
ADF.collection = {};

if (window.addEventListener) {
	window.addEventListener('load', function() {
		WL.Client.init(wlInitOptions);
	}, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', function() {
		WL.Client.init(wlInitOptions);
	});
}

// Add a script element as a child of the body
function dashBoardJSAtOnload() {
	var element = document.createElement("script");
	element.src = "js/views/dashBoard.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", dashBoardJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", dashBoardJSAtOnload);
else
	window.onload = dashBoardJSAtOnload;

// Add a script element as a child of the body
function loginJSAtOnload() {
	var element = document.createElement("script");
	element.src = "js/views/login.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", loginJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", loginJSAtOnload);
else
	window.onload = loginJSAtOnload;

// Add a script element as a child of the body
function detailJSAtOnload() {
	var element = document.createElement("script");
	element.src = "js/views/detail.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", detailJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", detailJSAtOnload);
else
	window.onload = detailJSAtOnload;

// Add a script element as a child of the body
function iscrollJSAtOnload() {
	var element = document.createElement("script");
	// element.src = "js/iscroll/iscroll-lite.js";
	element.src = "js/iscroll/iscroll.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", iscrollJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", iscrollJSAtOnload);
else
	window.onload = iscrollJSAtOnload;

// Add a script element as a child of the body
function iscrollViewJSAtOnload() {
	var element = document.createElement("script");
	element.src = "js/views/test/iscroll.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", iscrollViewJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", iscrollViewJSAtOnload);
else
	window.onload = iscrollViewJSAtOnload;

// //////////////////////////////////////////////////////////////////////////////
// add scheduler by eylee

function schedulerJSAtOnload() {
	WL.Logger
			.debug("schedulerJSAtOnload schedulerJSAtOnload inside................");
	var element = document.createElement("script");
	element.src = "js/views/scheduler.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", schedulerJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", schedulerJSAtOnload);
else
	window.onload = schedulerJSAtOnload;

// add contactList by kicho
function contactListJSAtOnload() {
	WL.Logger.debug("contactListJSAtOnload inside................");
	var element = document.createElement("script");
	element.src = "js/views/contactList.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", contactListJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", contactListJSAtOnload);
else
	window.onload = contactListJSAtOnload;

// add input scheduler form by eylee

function addschedulerJSAtOnload() {
	WL.Logger.debug("addschedulerJSAtOnload inside................");
	var element = document.createElement("script");
	element.src = "js/views/addscheduler.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", addschedulerJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", addschedulerJSAtOnload);
else
	window.onload = addschedulerJSAtOnload;

// add contactList by kicho
function contactDetailJSAtOnload() {
	WL.Logger.debug("contactDetailJSAtOnload inside................");
	var element = document.createElement("script");
	element.src = "js/views/contactDetail.js";
	document.body.appendChild(element);
}

// Check for browser support of event handling capability
if (window.addEventListener)
	window.addEventListener("load", contactDetailJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", contactDetailJSAtOnload);
else
	window.onload = contactDetailJSAtOnload;
