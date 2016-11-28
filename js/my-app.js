//var SERVER_ADDRESS = "http://192.168.0.104:8080/helixapp_pcso";
var SERVER_ADDRESS = "http://localhost:8080/helixapp_pcso";
//var SERVER_ADDRESS = "http://116.93.120.29:8080/helixapp";
//var SERVER_ADDRESS = "https://cas.pcso.gov.ph/helixapp_pcso";
var USERNAME;

var TODAY = new Date();
var dd = TODAY.getDate();
var mm = TODAY.getMonth() + 1;
var yyyy = TODAY.getFullYear();
TODAY = yyyy + '-' + mm + '-' + dd;

// Export selectors engine
var $$ = Dom7;
var virtualList;
var curAction;

// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
    // Code for About page
    if (page.name === 'index') {
	   try{
	   $$('.navbar').hide();   
	   var storedData = window.localStorage['f7form-'+ 'form-login-pcso'];
	   if(storedData) {
			console.log(JSON.stringify(storedData));
			$$.ajax({
					url: SERVER_ADDRESS + "/loginservlet?option=AUTHLOGIN",
					contentType: 'jsonp',
					method: 'POST',
					type: 'POST',
					dataType : 'jsonp',
					crossDomain: true,
					xhrFields: {withCredentials: true},
					data: storedData,
					success: function( response ) {
					var r = JSON.parse(response);
					var username;
					if(r.success){
						 $$.ajax({
								url: SERVER_ADDRESS + "/infolist",
								contentType: 'jsonp',
								method: 'POST',
								type: 'POST',
								dataType : 'jsonp',
								crossDomain: true,
								xhrFields: {withCredentials: true},
						 success: function( response1 ) {
							 myApp.alert(response1, 'DEBUG');
							 var r1 = JSON.parse(response1);
								username = r1.name;
								sessionStorage.setItem("username",r1.name);
								sessionStorage.setItem("connection",r1.connection);
								sessionStorage.setItem("dbname",r1.dbname);
								sessionStorage.setItem("UserID",r1.UserID);
								//sessionStorage.setItem("UserClass",r1.UserClass);
								//sessionStorage.setItem("branchid",r1.branchid);
								//sessionStorage.setItem("whseid",r1.whseid);
								sessionStorage.setItem("clientid",r1.clientid);
								sessionStorage.setItem("companyid",r1.companyid);
								sessionStorage.setItem("companyname",r1.companyname);
								sessionStorage.setItem("clientdbtype",r1.clientdbtype);
								sessionStorage.setItem("reportpath",r1.reportpath);
								sessionStorage.setItem("imagepath",r1.imagepath);
								//sessionStorage.setItem("theme",r1.theme);
								//sessionStorage.setItem("fiscalperiod",r1.fiscalperiod);
								sessionStorage.setItem("rsplink",r1.rsplink);
								sessionStorage.setItem("isadmin",r1.isadmin);
							 $$('.navbar').show();
							 mainView.router.loadPage({url:'./main.html?username='+username, ignoreCache:true, reload:true});
							 
						 }});
					}else{
						myApp.alert(r.message,'Error');
					}
				}
			});
		}
	   }catch(e){
		   alert(e);
	   }
    }else{
		$$('.speed-dial-opened').removeClass('speed-dial-opened');
	}
});

// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    template7Data: {
        // Will be applied for page with "forapproval.html" url
    },
	showToolbar: false,
	// Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr){
        myApp.hideIndicator();
    },
	uniqueHistoryIgnoreGetParameters: true,
	preloadPreviousPage: true,
	tapHold: true
	/*,
	smartSelectBackOnSelect: true,
	smartSelectOpenIn:'picker'*/
});

function validate(){
   var formData = myApp.formToJSON('#form-login-pcso');
   formData.companyid = "pcso";
   formData.clientid = "pcso_prod";
   //alert(formData.clientid);
	 $$.ajax({
		url: SERVER_ADDRESS + "/loginservlet?option=AUTHLOGIN",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		xhrFields: {withCredentials: true},
		data: JSON.stringify(formData),
		success: function( response ) {
			var r = JSON.parse(response);
			var username;
			if(r.success){
				 $$.ajax({
						url: SERVER_ADDRESS + "/infolist",
						contentType: 'jsonp',
						method: 'POST',
						type: 'POST',
						dataType : 'jsonp',
						crossDomain: true,
						xhrFields: {withCredentials: true},
				 success: function( response1 ) {
					 var r1 = JSON.parse(response1);
						username = r1.name;
						sessionStorage.setItem("username",r1.name);
						sessionStorage.setItem("connection",r1.connection);
						sessionStorage.setItem("dbname",r1.dbname);
						sessionStorage.setItem("UserID",r1.UserID);
						sessionStorage.setItem("UserClass",r1.UserClass);
						//sessionStorage.setItem("branchid",r1.branchid);
						//sessionStorage.setItem("whseid",r1.whseid);
						sessionStorage.setItem("clientid",r1.clientid);
						sessionStorage.setItem("companyid",r1.companyid);
						sessionStorage.setItem("companyname",r1.companyname);
						sessionStorage.setItem("clientdbtype",r1.clientdbtype);
						sessionStorage.setItem("reportpath",r1.reportpath);
						sessionStorage.setItem("imagepath",r1.imagepath);
						//sessionStorage.setItem("theme",r1.theme);
						//sessionStorage.setItem("fiscalperiod",r1.fiscalperiod);
						sessionStorage.setItem("rsplink",r1.rsplink);
						sessionStorage.setItem("isadmin",r1.isadmin);
					 myApp.formStoreData('form-login-pcso', formData);
					 $$('.navbar').show();
					 mainView.router.loadPage({url:'./main.html?username='+username, ignoreCache:true, reload:true});
				 }});
				
			}else{
				myApp.alert(r.message, 'Error');
			}
		}
	});
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false,
	showToolbar: false,
	uniqueHistoryIgnoreGetParameters: true,
	preloadPreviousPage: true
});

try{
	var myCalendar = myApp.calendar({
		input: '#calendar-input'
	});
}catch(e){
	alert(e);
}

function doLogout(){
	
	myApp.closePanel('right');
	
	myApp.confirm('Are you sure you want to logout?', 'Logout Helix', 
		function () {
			
			$$.ajax({
				url: SERVER_ADDRESS + "/logoutservlet",
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				/*data: {
					q: "select title,abstract,url from search.news where query=\"cat\"",
					format: "json",
					callback:function(){
					   return true;
					}
				},*/
				success: function( response ) {
					myApp.formDeleteData('form-login-pcso');
					//mainView.router.back({url:mainView.history[0],ignoreCache:true, reload:true});
					//mainView.history = [];
					mainView.router.loadPage({url:'index.html',ignoreCache:true, reload:true, force:true});
				},
				failure: function(){
					myApp.alert('Failed to logout current session', 'Error');
				}
			});
		}
	);
}

function maintenance(){
	mainView.router.loadPage({url:'./maintenance.html', ignoreCache:true});	
}
	
function approval(){
	mainView.router.loadPage({url:'./approval.html', ignoreCache:true});	
}