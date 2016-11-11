/* ===== Virtual List ===== */
myApp.onPageInit('goodsreceipt', function (page) {
 	myApp.showIndicator();
	
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=goodsreceipt&limitindex=0&limitcount=10000",
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
			var test = "goodsreceipt";	
			var moduleList = test+"detaillist(this)";	
			// Create virtual list
			virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
				// Pass array with items
				items: JSON.parse(response),
				// Custom search function for searchbar
				searchAll: function (query, items) {
					var found = [];
					for (var i = 0; i < items.length; i++) {
						if (items[i].TranID.trim().toLowerCase().indexOf(query) >= 0 || query.trim().toLowerCase() === ''){ found.push(i);}
						else if (items[i].VendorName.trim().toLowerCase().indexOf(query) >= 0){ found.push(i);}
						else if (items[i].CurCode.trim().toLowerCase().indexOf(query) >= 0){ found.push(i);}
						else if (items[i].DocAmount.trim().toLowerCase().indexOf(query) >= 0){ found.push(i);}
						else if (items[i].Memo.trim().toLowerCase().indexOf(query) >= 0){ found.push(i);}
						else{}
					}
					return found; //return array with mathced indexes
				},
				// List item Template7 template
				template: '<li title={{SeqID}} class="item-content" onclick="'+moduleList+'">'+
					'<div class="item-inner">'+
						'<div class="item-media">'+
							'<div class="item-title tranIDMaster">{{TranID}}</div>'+
						'</div>'+
						'<div class="item-title-row">'+
							'<div class="vendorNameMaster">{{VendorName}}</div>'+
						'</div>'+
						'<div class="amountMaster">{{CurCode}} {{DocAmount}}</div>'+
						'<div class="item-subtitle">{{TranDate}}</div>'+
						'<div class="item-subtitle">{{Memo}}</div>'+
						'<!--<span class="badge">Vendor: {{VendorName}}</span>-->'+
					'</div>'+
				  '</li>',
				  height: 150
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

function goodsreceiptlist(){
	mainView.router.loadPage({url:'./modules/goodsreceipt/goodsreceipt.html', ignoreCache:true});
}

function goodsreceiptdetaillist(obj){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=goodsreceipt&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			$$.ajax({
				url: SERVER_ADDRESS + "/tranlist?module=goodsreceipt&option=detail&SeqID="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/goodsreceipt/goodsreceiptdetail.html', ignoreCache:true,
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