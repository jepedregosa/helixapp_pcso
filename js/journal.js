function journallist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=journal&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/journal/journal.html', ignoreCache:true,
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

function journaldetaillist(obj){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=journal&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			$$.ajax({
				url: SERVER_ADDRESS + "/tranlist?module=journal&option=detail&SeqID="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/journal/journaldetail.html', ignoreCache:true,
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