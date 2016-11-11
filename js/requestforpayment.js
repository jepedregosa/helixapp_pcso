function paymentrequestlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=paymentrequest&username="+sessionStorage.getItem('username'),
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			console.log(response);
			mainView.router.loadPage({url:'./modules/paymentrequest/paymentrequest.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response)
				}
			});
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
}

function paymentrequestdetaillist(obj){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=paymentrequest&username="+sessionStorage.getItem('username')+"&BatNbr="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			$$.ajax({
				url: SERVER_ADDRESS + "/tranlist?module=paymentrequest&option=detail&BatNbr="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/paymentrequest/paymentrequestdetail.html', ignoreCache:true,
					context:{
						forapproval: JSON.parse(response),
						forapprovaldetail: JSON.parse(response2),
						username: sessionStorage.getItem("username")
					}
					});
				},
				failure: function(){
					myApp.alert('Failed to load approval list detail', 'Error');
			}});
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

myApp.onPageAfterAnimation('paymentrequest', function (page) {
	myApp.showIndicator();
	
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=paymentrequest&username="+sessionStorage.getItem('username'),
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			try{
				myApp.hideIndicator();
			}catch(e){
				myApp.alert(e,'Debug');
			}
			
			try{
			var test = "paymentrequest";	
			var moduleList = test+"detaillist(this)";	
			// Create virtual list
			virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
				// Pass array with items
				items: JSON.parse(response),
				// Custom search function for searchbar
				searchAll: function (query, items) {
					var found = [];
					for (var i = 0; i < items.length; i++) {
						if (items[i].TranID&&items[i].TranID.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0 || query.trim().toLowerCase() === ''){ found.push(i);}
						else if (items[i].TranDate&&items[i].TranDate.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0){ found.push(i);}
						else if (items[i].Details&&items[i].Details.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0){ found.push(i);}
						else{}
					}
					return found; //return array with mathced indexes
				},
				// List item Template7 template
				template: '<li title={{BatNbr}} class="item-content" onclick="'+moduleList+'">'+
					'<div class="item-inner">'+
						'<div class="item-media">'+
							'<div class="item-title tranIDMaster">{{TranID}}</div>'+
						'</div>'+
						'<div class="item-title-row">'+
							'<div class="item-subtitle vendorNameMaster">{{VendorName}}</div>'+
						'</div>'+
						'<div class="item-subtitle 	amountMaster">{{CurCode}} {{DocAmount}}</div>'+
						'<div class="item-subtitle">{{TranDate}}</div>'+
						'<div class="item-subtitle">{{Details}}</div>'+
						'<!--<span class="badge">Vendor: {{VendorName}}</span>-->'+
					'</div>'+
				  '</li>',
				  height: 115
			});
			//myApp.alert(virtualList.items,'Debug');
			}catch(e){
				//myApp.alert(e,'Debug');
			}		
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
});