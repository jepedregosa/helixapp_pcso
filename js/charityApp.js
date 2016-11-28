function charityApprovalList(){
	mainView.router.loadPage({url:'./modules/charity/approval/charity.html', ignoreCache:true});
}

function charitydetailApprovalList(obj){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=charity&username="+sessionStorage.getItem('username')+"&BatNbr="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			$$.ajax({
				url: SERVER_ADDRESS + "/tranlist?module=charity&option=detail&BatNbr="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/charity/approval/charitydetail.html', ignoreCache:true,
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

var testString = "";
var testString2 = "";

myApp.onPageAfterAnimation('charityApp', function (page) {
	myApp.showIndicator();
	var goToDetails; 
	var limitindex = 0;
	var limitcount = 20;

	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=charity&username="+sessionStorage.getItem('username')+"&dolimit=true&limitindex="+limitindex+"&limitcount="+limitcount,
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
			var test = "charity";	
			var moduleList = test+"detailApprovalList(this)";

			// Create virtual list
			virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
				// Pass array with items
				items: JSON.parse(response),
				// Custom search function for searchbar
				searchAll: function (query, items) {
					var found = [];
					for (var i = 0; i < items.length; i++) {
						found.push(i);
						/*if (items[i].TranID&&items[i].TranID.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0 || query.trim().toLowerCase() === ''){ found.push(i);}
						else if (items[i].TranDate&&items[i].TranDate.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0){ found.push(i);}
						else if (items[i].VendorName&&items[i].VendorName.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0){ found.push(i);}
						else if (items[i].Details&&items[i].Details.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0){ found.push(i);}
						else if (items[i].DocAmount&&items[i].DocAmount.trim().toLowerCase().indexOf(query.trim().toLowerCase()) >= 0){ found.push(i);}
						else{}*/
					}
					return found; //return array with mathced indexes
				},
				// List item Template7 template
				template: '<li title={{BatNbr}}>'+
					'<label class="label-checkbox item-content" >'+
					'<input type="checkbox" name="my-checkbox">'+
					'<div class="item-media">'+
							'<i class="icon icon-form-checkbox" style="display:none;"></i>'+
						'</div>'+
					'<div class="item-inner">'+
						'<div class="item-title-row">'+
							'<div class="item-title tranIDMaster" >{{TranID}}</div>'+
						'</div>'+
						'<div class="item-subtitle vendorNameMaster">{{VendorName}}</div>'+
						'<div class="item-subtitle 	amountMaster">{{CurCode}} {{DocAmount}}</div>'+
						'<div class="item-subtitle">{{TranDate}}</div>'+
						'<div class="item-subtitle">{{Details}}</div>'+
						'<!--<span class="badge">Vendor: {{VendorName}}</span>-->'+
					'</div>'+
					'</label>'+
				  '</li>',
				  height: 115,
				  onItemsAfterInsert: function(list, fragment){
					//myApp.alert(virtualList.items,'Debug');
					goToDetails = function(){
						charitydetailApprovalList(this);
					};
					if($$('.remove').css('display')=="block"){
						$$('.virtual-list-charity').find('li').off('click',goToDetails);
						$$('.virtual-list-charity').find('li').find('.icon-form-checkbox').css('display','block');
						var isChecked = $$('.checkall').find('input:checked').length > 0;
						$$('.virtual-list-charity').find('li').each(
							function(){
								$$(this).find('input').prop('checked',isChecked? true:false).trigger('change');
							}
						);
					}else{
						$$('.virtual-list-charity').find('li').on('click',goToDetails);
						$$('.virtual-list-charity').find('li').find('.icon-form-checkbox').css('display','none');	
					}
					
					$$('.virtual-list-charity').find('li').on('taphold',function(){
						$$('.back').css('display','none');
						$$('.remove').css('display','block');
						$$('.checkall').css('display','block');
						$$('.virtual-list-charity').css('margin-top','0px');
						$$('.virtual-list-charity').find('li').off('click',goToDetails);
						$$('.virtual-list-charity').find('li').find('.icon-form-checkbox').css('display','block');				
					});
				  }
			});
			
			
			}catch(e){
				//myApp.alert(e,'Debug');
			}		
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
			
	var charitySearchBar = myApp.searchbar('.searchbar',{
		customSearch: true,
		onSearch: function(s){
			if(testString == ''){
				testString = s.query;
				search();
			}else{
				testString2 = s.query;
			}
		}	
	});	
	var lastIndex = $$('.virtual-list li').length;
	var loading = false;
	/*$$('.infinite-scroll').on('infinite',function(){
		if(loading){return;}
		loading = true;
		try{
			myApp.showIndicator();
		}catch(e){
			myApp.alert(e,'Debug');
		}
		setTimeout(function(){
			loading=false;
			try{
				myApp.hideIndicator();
			}catch(e){
				myApp.alert(e,'Debug');
			}
			var html = '';
			for(var i=lastIndex+1; i<=lastIndex+limitcount; i++){
				html += '<li class="item-content"><div class="item-innder"><div class="item-title">Item '+i+'</div></div></li>';
			}
			$$('.virtual-list ul').append(html);
			lastIndex = $$('.virtual-list li').length;
		},1000);
	});*/
});

function search(){

	var limitindex = 0;
	var limitcount = 20;
	
	try{
		myApp.showIndicator();
	}catch(e){
		myApp.alert(e,'Debug');
	}
	
	var request = $$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=charity&username="+sessionStorage.getItem('username')+"&q="+testString+"&dolimit=true&limitindex="+limitindex+"&limitcount="+limitcount,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			var result = JSON.parse(response);
			console.log(result);
			virtualList.replaceAllItems(result);
			virtualList.update();
			console.log(virtualList.items);
			myApp.hideIndicator();
			
			if(testString != testString2){
				testString = testString2;
				search();
			}else{
				testString = '';
			}
			
			
		}
	});
	
}

function hideCheckBox(){
	var goToDetails = function(){
		charitydetailApprovalList(this);
	};
	$$('.back').css('display','block');
	$$('.checkall').css('display','none');
	$$('.back').find('.icon-back').css('float','left');
	$$('.back').find('.icon-back').css('margin-top','10px');
	$$('.remove').css('display','none');
	$$('.virtual-list-charity').css('margin-top','10px');
	$$('.virtual-list-charity').find('li').on('click',goToDetails);
	$$('.virtual-list-charity').find('li').find('.icon-form-checkbox').css('display','none');				
}

function checkAllFunction(){
	//$$('.back').css('display','block');
	//$$('.back').find('.icon-back').css('float','left');
	//$$('.back').find('.icon-back').css('margin-top','10px');
	//$$('.remove').css('display','none');
	//$$('.virtual-list-charity').find('li').on('click',goToDetails);
	//$$('.virtual-list-charity').find('li').find('.icon-form-checkbox').css('display','none');
	var isChecked = $$('.checkall').find('input:checked').length > 0;
	$$('.virtual-list-charity').find('li').each(
		function(){
			$$(this).find('input').prop('checked',isChecked? true:false).trigger('change');
		}
	);
}



