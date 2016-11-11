
function procurementlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=procurement&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/procurement/procurement.html', ignoreCache:true,
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

function procurementdetaillist(obj){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=procurement&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			$$.ajax({
				url: SERVER_ADDRESS + "/tranlist?module=procurement&option=detail&SeqID="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/procurement/procurementdetail.html', ignoreCache:true,
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

myApp.onPageAfterAnimation('procurement', function (page) {
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=procurement&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/procurement/procurement.html', ignoreCache:true,reload:true,
				context:{
					forapproval: JSON.parse(response)
				}
			});
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
});