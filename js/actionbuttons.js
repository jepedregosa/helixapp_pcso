$$(document).on('click', function(e){
  if (!$$(e.target).hasClass('floating-button')) {
		//$$('.speed-dial-opened').removeClass('speed-dial-opened');	
	}
});

$$(document).on('pageAfterAnimation', function (e) {
	$$('.speed-dial-opened').removeClass('speed-dial-opened');	
});
	
function toggleactionbuttons(obj, action){
	var clicked = $$(obj);
	
	if (clicked.hasClass('floating-button') && clicked.parent().hasClass('speed-dial')) {
		clicked.parent().toggleClass('speed-dial-opened');
	} else if(clicked.parent().hasClass('speed-dial-buttons')){
		clicked.parent().parent().toggleClass('speed-dial-opened');
	}else if (clicked.hasClass('close-speed-dial')) {
		$$('.speed-dial-opened').removeClass('speed-dial-opened');
	}else{
		$$('.speed-dial-opened').removeClass('speed-dial-opened');
	}
	
	if(action){
		if(action=="Approve"){
			var obj = $$('.dataToBePassed')[0];
			var BatNbr = obj.id;
			var Module = obj.title;
			
			myApp.modal({
			  title: 'Approval',
			  text: 'Enter Remarks',
			  afterText: '<textarea class="modal-text-input" style="width: 90%; height: 100px; overflow:auto; resize: none;"></textarea>',
			  buttons: [{
				text: 'OK',
				onClick: function() {
				  var rem = $$('.modal-text-input')[0].value; 	
				  if(rem){
					  $$.ajax({
							url: SERVER_ADDRESS + "/tranlist?module="+Module+"&username="+sessionStorage.getItem('username')+"&BatNbr="+BatNbr,
							contentType: 'jsonp',
							method: 'POST',
							type: 'POST',
							dataType : 'jsonp',
							crossDomain: true,
							success: function( response ) {
								var data = JSON.parse(response)[0];
								myApp.alert(response,'Debug');
								$$.ajax({
									url: SERVER_ADDRESS + "/transervlet?module="+Module+"&TranType="+data.TranType+"&username="+sessionStorage.getItem('username')+"&TranID="+data.TranID+"&TranDate="+data.TranDate+"&Memo="+data.Memo+"&BatNbr="+BatNbr+"&Action=APPROVED&Message="+rem,
									contentType: 'jsonp',
									method: 'POST',
									type: 'POST',
									dataType : 'jsonp',
									crossDomain: true,
									success: function( response2 ) {
										myApp.alert(BatNbr+' Approved', 'Notice');
										mainView.router.back({url:mainView.history[0],reload:true});
									},
									failure: function(){
										myApp.alert('Approval Failed', 'Error');
								}});
							},
							failure: function(){
								myApp.alert('Failed to load approval list', 'Error');
							}
						});
				  }else{
					  myApp.alert('Approval Failed. Remarks is required', 'Error');
				  }
				  
				}
			  }, {
				text: 'Cancel',
				onClick: function() {
				}
			  }]
			});
		}
		if(action=="Reject"){
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " has been rejected!", 'Test');
		}
		if(action=="Return To Maker"){
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " was returned to maker for editing!", 'Test');
		}
		if(action=="New"){
			var obj = $$('.floating-button')[0];
			var Module = obj.title;
			try{
				mainView.router.loadPage({url:'./modules/'+Module+'/'+Module+'editdetail.html', ignoreCache:true});	
			}catch(e){
				myApp.alert(e, 'Dubug');
			}
		}
		if(action=="Save"){
			var obj = $$('.floating-button')[0];
			var Module = obj.title;
			var formData = myApp.formToJSON('#masterForm');
			//var formData2 = myApp('#masterForm'));
			formData.data = virtualList.items;
			
			try{
				console.log(JSON.stringify(formData));
				
				$$.ajax({
					url: SERVER_ADDRESS + "/requisition?option=update",
					contentType: 'jsonp',
					method: 'POST',
					type: 'POST',
					dataType : 'jsonp',
					crossDomain: true,
					data: JSON.stringify(formData),
					success: function( response2 ) {
						var rec = JSON.parse(response2);
						if(rec.success){
							console.log(rec);
							
							if(formData.SeqID){
								myApp.alert('Sucessfully Updated!', 'Notice');
								mainView.history.splice(mainView.history.length-1,mainView.history.length);
								$$('.view-main .page-on-left, .view-main .navbar-on-left').remove();
							}else{
								myApp.alert('Sucessfully Created!', 'Notice');
							}
							
							formData.BatNbr = rec.BatNbr;
							formData.SeqID = rec.SeqID;
							formData.DocAmount = 0;
							
							var nf = new Intl.NumberFormat();
							
							for(var z=0; z<formData.data.length; z++){
								formData.data[z].Amount = parseFloat(parseFloat(formData.data[z].Qty.trim().replace(',','')) * parseFloat(formData.data[z].UnitCost.trim().replace(',',''))).toFixed(2);
								formData.DocAmount = parseFloat(parseFloat(formData.DocAmount) + parseFloat(formData.data[z].Amount)).toFixed(2);
								formData.data[z].Amount = nf.format(formData.data[z].Amount);
							}
							
							formData.DocAmount = nf.format(formData.DocAmount);
							console.log(formData);
						
							mainView.router.loadPage({url:'./modules/requisition/requisitiondetail.html', ignoreCache:true, reload:true,
								context:{
									header: {
										formData: formData
									},
									detail: formData.data,
									username: sessionStorage.getItem("username")
								}
							});
						}else{
							myApp.alert(rec.message, 'Error');
						}
					},
					failure: function(){
						myApp.alert('Approval Failed', 'Error');
					}
				});
				
				
				//mainView.router.loadPage({url:'./modules/'+Module+'/'+Module+'editdetail.html', ignoreCache:true});	
			}catch(e){
				myApp.alert(e, 'Dubug');
			}
		}
		if(action=="Delete"){
			var obj = $$('.dataToBePassed')[0];
			var SeqID = obj.id;
			myApp.showIndicator();
				
			$$.ajax({
			url: SERVER_ADDRESS + "/requisition?option=header&q="+SeqID,
			contentType: 'jsonp',
			method: 'POST',
			type: 'POST',
			dataType : 'jsonp',
			crossDomain: true,
			success: function( response ) {
				var rec = JSON.parse(response)[0];
				console.log(rec);
				$$.ajax({
					url: SERVER_ADDRESS + "/requisition?option=delete&SeqID="+SeqID+"&BatNbr="+rec.BatNbr,
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
						myApp.alert('Successfully Deleted','Notice');
						mainView.router.back();		
					},
					failure: function(){
						myApp.alert('Failed to load approval list', 'Error');
					}
				});
			},
			failure: function(){
				myApp.alert('Failed to load approval list', 'Error');
			}
			});	
		}
		
		if(action=="Cancel"){
			mainView.router.back();
		}
		}
}