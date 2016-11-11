function requisitionlist(){
		
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/requisition/requisition.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
}

function requisitiondetaillist(obj){
	var seqid = obj.title;
	var action = obj.title;
	if(seqid==null||seqid=="Edit"||seqid==""){
		seqid = $$('.dataToBePassed')[0].id;
	}
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header&q="+seqid,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			var rec = JSON.parse(response)[0];
			console.log(rec);
			$$.ajax({
				url: SERVER_ADDRESS + "/requisition?option=detail&BatNbr="+rec.BatNbr,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
										
					//mainView.router.loadPage({url:'./modules/requisition/requisitioneditdetail.html?BatNbr=' + rec.BatNbr + '&SeqID=' + rec.SeqID, ignoreCache:true,
					if(action=="Edit"){
						var masterObj = JSON.parse(response);
						masterObj[0].DocAmount = 0;
						var detailList = JSON.parse(response2);
						var nf = new Intl.NumberFormat();
						
						for(var z=0; z<detailList.length; z++){
							detailList[z].Amount = parseFloat(parseFloat(detailList[z].Qty.trim().replace(',','')).toFixed(2) * parseFloat(detailList[z].UnitCost.trim().replace(',','')).toFixed(2)).toFixed(2);
							masterObj[0].DocAmount = masterObj[0].DocAmount + detailList[z].Amount;
							detailList[z].Amount = nf.format(detailList[z].Amount);
						}
						
						masterObj[0].DocAmount = nf.format(masterObj[0].DocAmount);
						
						mainView.router.loadPage({url:'./modules/requisition/requisitioneditdetail.html?BatNbr=' + rec.BatNbr + '&SeqID=' + rec.SeqID, ignoreCache:true,context:{
						header: masterObj,
						detail: detailList,
						username: sessionStorage.getItem("username")
						}
						});
					}else{
						var masterObj = JSON.parse(response);
						masterObj[0].DocAmount = 0;
						var detailList = JSON.parse(response2);
						
						console.log(masterObj);
						console.log(detailList);
						
						var nf = new Intl.NumberFormat();
						
						for(var z=0; z<detailList.length; z++){
							detailList[z].Amount = parseFloat(detailList[z].Qty.trim().replace(',','') * detailList[z].UnitCost.trim().replace(',','')).toFixed(2);
							masterObj[0].DocAmount = parseFloat(parseFloat(masterObj[0].DocAmount) + parseFloat(detailList[z].Amount)).toFixed(2);
							detailList[z].Amount = nf.format(detailList[z].Amount);
						}
						
						masterObj[0].DocAmount = nf.format(masterObj[0].DocAmount);								
						
						mainView.router.loadPage({url:'./modules/requisition/requisitiondetail.html?BatNbr=' + rec.BatNbr + '&SeqID=' + rec.SeqID, ignoreCache:true,
						context:{
							header: masterObj,
							detail: detailList,
							username: sessionStorage.getItem("username")
						}
						});	
					}
					
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

myApp.onPageInit('requisition', function (page) {
 	myApp.showIndicator();
	
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header",
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
			var test = "requsition";	
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
						else{}
					}
					return found; //return array with mathced indexes
				},
				// List item Template7 template
				template: '<li title={{SeqID}} class="item-content" onclick="requisitiondetaillist(this)">'+
					'<div class="item-inner">'+
						'<div class="item-media">'+
							'<div class="item-title tranIDMaster">{{TranID}}</div>'+
						'</div>'+
						'<div class="item-title-row">'+
							'<div class="vendorNameMaster">{{VendorName}}</div>'+
						'</div>'+
						'<div class="amountMaster">{{CurCode}} {{DocAmount}}</div>'+
						'<div class="item-subtitle">{{TranDate}}</div>'+
						'<div class="item-subtitle">{{Details}}</div>'+
						'<!--<span class="badge">Vendor: {{VendorName}}</span>-->'+
					'</div>'+
				  '</li>',
				  height: 105
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

myApp.onPageAfterAnimation('requisition', function (page) {
	myApp.showIndicator();
	
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header",
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
			var test = "requsition";	
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
				template: '<li title={{SeqID}} class="item-content" onclick="requisitiondetaillist(this)">'+
					'<div class="item-inner">'+
						'<div class="item-media">'+
							'<div class="item-title tranIDMaster">{{TranID}}</div>'+
						'</div>'+
						'<div class="item-title-row">'+
							'<div class="vendorNameMaster">{{VendorName}}</div>'+
						'</div>'+
						'<div class="amountMaster">{{CurCode}} {{DocAmount}}</div>'+
						'<div class="item-subtitle">{{TranDate}}</div>'+
						'<div class="item-subtitle">{{Details}}</div>'+
						'<!--<span class="badge">Vendor: {{VendorName}}</span>-->'+
					'</div>'+
				  '</li>',
				  height: 105
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

myApp.onPageInit('requisitioneditdetail', function (page) {
	
	console.log(page.query);
	
	myApp.showIndicator();
	if(page.query.SeqID){
		$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header&q="+page.query.SeqID,
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
			
			console.log(JSON.parse(response)[0]);
			var masterObj = JSON.parse(response)[0];
			masterObj.DocAmount = 0;
			
			$$.ajax({
				url: SERVER_ADDRESS + "/requisition?option=detail&BatNbr="+page.query.BatNbr,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					var detailList = JSON.parse(response2);
	
					for(var z=0; z<detailList.length; z++){
						detailList[z].Amount = parseFloat(detailList[z].Qty.trim().replace(',','')) * parseFloat(detailList[z].UnitCost.trim().replace(',','')).toFixed(2);
						var nf = new Intl.NumberFormat();
						detailList[z].Amount = nf.format(detailList[z].Amount);
						/*masterObj.DocAmount = masterObj.DocAmount + parseFloat(detailList[z].Amount.trim().replace(',','')).toFixed(2);*/
					}
					
					/*var nf1 = new Intl.NumberFormat();
					masterObj.DocAmount = nf1.format(parseFloat(masterObj.DocAmount.trim().replace(',','')).toFixed(2));*/
					
					virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
						items: detailList,
						// List item Template7 template
						template: '<li class="swipeout">'+
							'<div class="swipeout-content item-content">'+
								'<div class="item-inner">'+
								  '<div class="item-title">{{ItemID}}</div>'+	
								  '<div class="item-subtitle">{{ItemDescription}}</div>'+
								  '<div class="item-subtitle">{{Qty}} {{Unit}} X {{UnitCost}}</div>'+
								  '<div class="item-subtitle" style="display: none;">{{LineSeqID}}</div>'+
								  '<div class="item-subtitle" style="display: none;">{{SeqID}}</div>'+
								'</div>'+
								'<div class="item-after">{{Amount}}</div>'+
							'</div>'+
							'<div class="swipeout-actions-right">'+
								'<a href="#" onclick="openPopupEditDetail(this,{{LineSeqID}});"><i class="icon icon-pencil"></i></a>'+
								'<a href="#" onclick="removeDetailList(this,{{LineSeqID}});"><i class="icon icon-bin"></i></a>'+
							'</div>'+
						'</li>',
						height: 105
					});
					
					
					
					virtualList.update();
				},
				failure: function(){
					myApp.alert('Failed to load list detail', 'Error');
			}});
			
				myApp.formFromJSON('#masterForm', masterObj);

			},
			failure: function(){
				myApp.alert('Failed to load list', 'Error');
			}
		});	
	}else{
		$$.ajax({
			url: SERVER_ADDRESS + "/trantypelist?module=requisition",
			contentType: 'jsonp',
			method: 'POST',
			type: 'POST',
			dataType : 'jsonp',
			crossDomain: true,
			success: function( response ) {
				var data = JSON.parse(response);
				if(data.data.length == 0){
					myApp.alert('No available transaction ID!', 'Error');
				}else{
					var rec = data.data[0];
					var obj = new Object();
					obj.TranID = rec.NextRefNbr;
					obj.TranType = rec.JournalType;
					obj.TranDate = TODAY;
					obj.RequiredDate = TODAY;
					myApp.formFromJSON('#masterForm', obj);
				}
			}
		});
		
	
		virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
			items: [
			],
			// List item Template7 template
			template: '<li class="swipeout">'+
				'<div class="swipeout-content item-content">'+
					'<div class="item-inner">'+
					  '<div class="item-title">{{ItemID}}</div>'+	
					  '<div class="item-subtitle">{{ItemDescription}}</div>'+
					  '<div class="item-subtitle">{{Qty}} {{Unit}} X {{UnitCost}}</div>'+
					  '<div class="item-subtitle" style="display: none;">{{LineSeqID}}</div>'+
					  '<div class="item-subtitle" style="display: none;">{{SeqID}}</div>'+
					'</div>'+
					'<div class="item-after">{{Amount}}</div>'+
				'</div>'+
				'<div class="swipeout-actions-right">'+
					'<a href="#" onclick="openPopupEditDetail(this,{{LineSeqID}});"><i class="icon icon-pencil"></i></a>'+
					'<a href="#" onclick="removeDetailList(this,{{LineSeqID}});"><i class="icon icon-bin"></i></a>'+
				'</div>'+
			'</li>',
			height: 105
		});
		
		virtualList.update();
	}
});

function openPopupEditDetail(container,lineseqId){
	//alert(container +" - "+ seqId);
	var popuphtml = '<div class="popup"><div class="view view-popup"><center><h3>Item Detail Form</h3></center><div class="list-block">'+
				'<form id="popup"><ul><li style="display:none;">'+
				'<div class="item-content" >'+
					'<div class="item-inner">'+
					  '<!--<div class="item-title label">Item ID</div>-->'+
					  '<div class="item-input">'+
						'<input type="text" name="ItemID" placeholder="Item ID">'+
					  '</div>'+
					'</div>'+
				'</div></li>'+
				'<li><a href="#" class="item-link smart-select" data-virtual-list="true" data-virtual-list-height="55" data-open-in="picker" data-searchbar="true" data-back-on-select="true" data-searchbar-placeholder="Search items">'+
        '<select name="ItemID">'+
        '</select>'+
        '<div class="item-content" >'+
          '<div class="item-inner">'+
            '<div class="item-title">Item</div>'+
			'<div class="item-after smart-select-value1" name="ItemDescription" ></div>'+
          '</div>'+
        '</div></a></li>'+
				'<li style="display:none;"><div class="item-content" style="display:none;">'+
					'<div class="item-inner">'+
					  '<!--<div class="item-title label">Item Description</div>-->'+
					  '<div class="item-input">'+
						'<input type="text" name="ItemDescription" placeholder="Item Description">'+
					  '</div>'+
					'</div>'+
				'</div></li>'+
				'<li><div class="item-content">'+
					'<div class="item-inner">'+
						'<!--<div class="item-title label">Qty</div>-->'+
						'<div class="item-input">'+
							'<input type="text" name="Qty" placeholder="Quantity">'+
						'</div>'+
					'</div>'+
				'</div></li>'+
				'<li><div class="item-content">'+
					'<div class="item-inner">'+
						'<!--<div class="item-title label">Unit</div>-->'+
						'<div class="item-input">'+
							'<input type="text" name="Unit" placeholder="Unit">'+
						'</div>'+
					'</div>'+
				'</div></li>'+
				'<li><div class="item-content">'+
					'<div class="item-inner">'+
						'<!--<div class="item-title label">Unit Cost</div>-->'+
						'<div class="item-input">'+
							'<input type="text" name="UnitCost" placeholder="Unit Cost">'+
						'</div>'+
					'</div>'+
				'</div></li>'+
				'<li><div class="item-content">'+
					'<div class="item-inner">'+
						'<div class="item-input">'+
							'<input type="date" name="DeliveryDate" placeholder="Delivery Date">'+
						'</div>'+
					'</div>'+
				'</div></li>'+
				'<li style="display:none;"><div class="item-content" style="display: none;">'+
					'<div class="item-inner">'+
						'<div class="item-input">'+
							'<input type="text" hidden name="SeqID" placeholder="SeqID">'+
						'</div>'+
					'</div>'+
				'</div></li>'+
				'<li style="display:none;"><div class="item-content" style="display: none;">'+
					'<div class="item-inner">'+
						'<div class="item-input">'+
							'<input type="text" name="LineSeqID" placeholder="LineSeqID">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'</li></ul></form></div>'+
				'<p class="buttons-row">'+
				  '<a href="#" class="button button-round close-popup" onclick="updateDetailList();">Save</a>'+
				  '<a href="#" class="button button-round close-popup">Cancel</a>'+
				'</p>'+
				'</div></div>';
	myApp.popup(popuphtml);
		//var myList = $$(container).find('.virtual-list');
	 //myApp.f7.addView('.view-popup');
var popupView = myApp.addView('.view-popup', {
    // Enable dynamic Navbar
    //dynamicNavbar: false,
	//showToolbar: false,
	//uniqueHistoryIgnoreGetParameters: true,
	//preloadPreviousPage: true
});
		
	// Append option
//myApp.smartSelectAddOption('.smart-select select', '<option value="apple">Apple</option>');

	var rec;
	
	console.log(rec);
	
	console.log(lineseqId);
	
	if(lineseqId){
		for(var i=0; i<virtualList.items.length; i++){
			tmprec = virtualList.items[i];
			if(tmprec.LineSeqID == lineseqId){
				rec = tmprec;
				break;
			}
		}
	}
	
	console.log(rec);
	
	if(rec){
		myApp.formFromJSON('#popup', rec);
		if(rec.ItemDescription){
		$$('.smart-select-value1').text(rec.ItemDescription);	
		}
	}else{
		var lineseqid =  virtualList.items.length + 1;
		
		var obj = new Object();
		obj.LineSeqID = lineseqid;
		
		console.log(obj);
		
		myApp.formFromJSON('#popup', obj);
		
	}
	
	$$.ajax({
			url: SERVER_ADDRESS + "/itemlookup",
			contentType: 'jsonp',
			method: 'POST',
			type: 'POST',
			dataType : 'jsonp',
			crossDomain: true,
			success: function( response ) {
				var data = JSON.parse(response);
				//if(data.data.length == 0){
					if(rec==null){
						myApp.smartSelectAddOption('.smart-select select', '<option value="" selected disabled style="display:none;"></option>');
					}
					
					//alert(rec.ItemID);
					for(var j=0;j<data.data.length; j++){
						var rec1 = data.data[j];
						if(rec&&rec.ItemID==rec1.ItemID){
							//alert(rec1.ItemID);
							var addMe = '<option value="'+rec1.ItemID+'" selected>'+rec1.ItemDescription+'</option>';
						}else{
							var addMe = '<option value="'+rec1.ItemID+'">'+rec1.ItemDescription+'</option>';	
						}
						
						//alert(addMe);
						myApp.smartSelectAddOption('.smart-select select', addMe);
					}
					//myApp.alert('No available transaction ID!', 'Error');
				//}
				/*else{
					var rec = data.data[0];
					var obj = new Object();
					obj.TranID = rec.NextRefNbr;
					obj.TranType = rec.JournalType;
					obj.TranDate = TODAY;
					obj.RequiredDate = TODAY;
					myApp.formFromJSON('#masterForm', obj);
				}*/
			}
		});
	
	
	
}

function removeDetailList(vlist, lineseqid){
	
	console.log(lineseqid);
	
	myApp.confirm('Are you sure you want delete this record?', 'Confirm Delete', 
		function () {
			for(var i=0; i<virtualList.items.length; i++){
				var rec = virtualList.items[i];
				if(rec.LineSeqID == lineseqid){
					virtualList.deleteItem(i);
					virtualList.update();
					break;
				}
			}
			
			/*KELANGAN IUPDATE LAHAT NG LINESEQID*/
			for(var i=0; i<virtualList.items.length; i++){
				var rec = virtualList.items[i];
				console.log(rec);
				rec.LineSeqID = i+1;
				virtualList.replaceItem(i, rec);
				virtualList.update();
			}
		}
	);
	
	//virtualList.deleteItem(formData);
	
}

function updateDetailList(){
	
	var selectedOpt = $$('select').val();
	var formData = myApp.formToJSON($$('#popup')); 
	formData.ItemDescription = $$('select').find('option[value="'+selectedOpt+'"]').text();
	console.log(formData);
	console.log(formData.LineSeqID);
	var lineSeqId = formData.LineSeqID;
	var found = false;
	
	var nf = new Intl.NumberFormat();
	
	
	try{
		formData.Amount = parseFloat(parseFloat(formData.Qty.trim().replace(',',''))*parseFloat(formData.UnitCost.trim().replace(',',''))).toFixed(2);
		formData.Amount = nf.format(formData.Amount);		
	}catch(e){
		
	}
	
	
	for(var i=0; i<virtualList.items.length; i++){
		var rec = virtualList.items[i];
		if(rec.LineSeqID == lineSeqId){
			found = true;
			virtualList.replaceItem(i, formData);
			virtualList.update();
			break;
		}
	}
	
	if(!found){
		try{
			virtualList.appendItem(formData);
			virtualList.update();
			//alert(virtualList.items.length);
		}catch(e){
			myApp.alert(e,'Debug');	
		}
	}
	
}