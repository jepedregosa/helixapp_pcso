
//dashboard
function dashboardmenu(){
	mainView.router.loadPage({url:'./modules/dashboard/dashboardmenu.html', ignoreCache:true});	
}

function dashboard(module){
		mainView.router.loadPage({url:'./modules/dashboard/dashboard.html?module='+module, ignoreCache:true});			
}

myApp.onPageAfterAnimation('dashboard', function (page) {
    var s2;
	var ticks2;
	var s1;
	var s1List = [];
	var ticks = [];
	var url1;
	var plot1;
	if(page.query.module=="All"){
		url1 = SERVER_ADDRESS + "/forapprovallist?operation=GET_CHART";
	}else{
		url1 = SERVER_ADDRESS + "/forapprovallist?operation=GET_CHART&module="+page.query.module;
	}
		
	$$.ajax({
		url: url1,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			console.log(response);
			var rec = JSON.parse(response);
			
			for(var j =0; j<rec.data1.length; j++){
				s1List.push(parseFloat(rec.data1[j]));
			}
			
			//s1 = rec.data1;
			ticks = rec.data;

			console.log(s1);
			console.log(ticks);
			$.jqplot.config.enablePlugins = true;
			plot1 = $.jqplot('chartdiv', [s1List], {
				// Only animate if we're not using excanvas (not in IE 7 or IE 8)..
				animate: !$.jqplot.use_excanvas,
				seriesDefaults:{
					renderer:$.jqplot.BarRenderer,
					pointLabels: { show: true }
				},
				legend: {
					show: false,
					location: 'n',
					placement: 'outside'
				},
				axes: {
					xaxis: {
						renderer: $.jqplot.CategoryAxisRenderer,
						ticks: ticks,
					    tickOptions:{ 
						  angle: -30
						},
						tickRenderer:$.jqplot.CanvasAxisTickRenderer	
					}
				},
				highlighter: { show: true }
			});
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
	}});
	
	$('#chartdiv').bind('jqplotDataClick', 
		function (ev, seriesIndex, pointIndex, data) {
			plot1.destroy();
			var newMonth = ticks[pointIndex];
			if(ticks[pointIndex].indexOf('-')==-1){
				url1 = url1+"&detail="+newMonth;	
			}else{
				if(page.query.module=="All"){
					url1 = SERVER_ADDRESS + "/forapprovallist?operation=GET_CHART";
				}else{
					url1 = SERVER_ADDRESS + "/forapprovallist?operation=GET_CHART&module="+page.query.module;
				}	
			}
			
			
			s1List = [];
			ticks = [];
			$$.ajax({
				url: url1,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response ) {
					console.log(response);
					var rec = JSON.parse(response);
					
					for(var j =0; j<rec.data1.length; j++){
						s1List.push(parseFloat(rec.data1[j]));
					}
					//s1 = rec.data1;
					ticks = rec.data;

					console.log(s1);
					console.log(ticks);
					$.jqplot.config.enablePlugins = true;
					plot1 = $.jqplot('chartdiv', [s1List], {
						// Only animate if we're not using excanvas (not in IE 7 or IE 8)..
						animate: !$.jqplot.use_excanvas,
						seriesDefaults:{
							renderer:$.jqplot.BarRenderer,
							pointLabels: { show: true }
						},
						legend: {
							show: false,
							location: 'n',
							placement: 'outside'
						},
						axes: {
							xaxis: {
								renderer: $.jqplot.CategoryAxisRenderer,
								ticks: ticks,
								tickOptions:{ 
								  angle: -30
								},
								tickRenderer:$.jqplot.CanvasAxisTickRenderer	
							}
						},
						highlighter: { show: true }
					});
					plot1.replot();
				},
				failure: function(){
					myApp.alert('Failed to load approval list detail', 'Error');
			}});
		}
	);
	
});