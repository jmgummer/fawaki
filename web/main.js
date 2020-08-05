// Get clip times
function clip_selector(start, end, filename){
	//Send data via ajax
	$.ajax({
      	url: script_php,
      	data:{
      		'start':start,
      		'end':end,
      		'filename':filename
      	},
      	error: function() {
        	$('#info').html('<p>An error has occurred</p>');
      	},
      	success: function(data) {
      		$('#clip-list').find('tbody:last').append(data);
      	},
      	type: 'POST'
   });
}
function play_anvil_clip(clip_id){
	
	$.ajax({
      	url: 'qc.php',
      	data:{
      		'play_clip':'true',
      		'clip_id':clip_id      		
      	},
      	error: function() {
        	$('.play_clip').html('<p>An error has occurred</p>');
      	},
      	success: function(data) {
      		$('.play_clip').html(data);
      	},
      	type: 'POST'
   });
}
function play_anvil_inc(inc_id){
	
	$.ajax({
      	url: 'qc.php',
      	data:{
      		'play_incantation':'true',
      		'inc_id':inc_id      		
      	},
      	error: function() {
        	$('.play_clip').html('<p>An error has occurred</p>');
      	},
      	success: function(data) {
      		$('.play_clip').html(data);
      	},
      	type: 'GET'
   });
}
// Set cookie
function setCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();

    if (!nDays)
        nDays=1;

    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString();
}

// Get cookie
function getCookie(key){
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

// Ajax action to insert data
function insertData(clip_name,clip_start_time,clip_end_time,id){
	//Send data via ajax
	var entry_type = $('#selType-'+id);
	var info_span = $('#span-info-'+id);

	if(entry_type.val() == 'new_inc_ad' || entry_type.val() == 'existing_inc_ad'){
		var e_type = 'ad';
	} else{
		var e_type = 'news';
	}

	if(entry_type.val() === ''){
		$(entry_type).notify("Please select an entry type",{className: 'error',position:"bottom"});
	} else{
		$('#insert-'+id).prop('disabled',true); // disable on click

		$.ajax({
	      	url: script_php,
	      	data:{
	      		'insert':true,
	      		'clip_name':clip_name,
	      		'clip_start_time':clip_start_time,
	      		'clip_end_time':clip_end_time,
	      		'entry_type':e_type		//entry_type.val()
	      	},
	      	error: function() {
	        	$('#span-info-'+id).html('<p>An error has occurred</p>');
	        	$('#insert-'+id).prop('enabled',true);
	        	$('#insert-'+id).html('Save'); // rename back to save
	      	},
	      	success: function(data) {
	         	// enable analyze only on news
	         	if(entry_type.val() == 'news'){
	         		$('#analyze-'+id).show();
	         		$('#analyze-'+id).attr('data-clip-insert-id',data);
	         	}

	         	// Change button text
	         	$('#insert-'+id).html('Saved'); // fix for button text
	         	info_span.text('');
	         	//alert(data);

	         	// show list entries
	         	var station = $('#station').val();
	         	var date = $('#date-picker').val();
	         	//window.getListEntries(entry_type.val(),station,date);

	         	// window.getListEntries(e_type,station,date); //joe

	         	if(entry_type.val() == 'existing_inc_ad'){
	         		$('#myModal').removeData('bs.modal');
				    //$('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
				    $('#myModal').modal({remote: script_php+'?anvil_clip_id=' + data,backdrop:'static',keyboard:false});
				    $('#myModal').modal('show');
				    Mousetrap.pause();

	         	} else if(entry_type.val() == 'new_inc_ad'){
	         		$('#myModal').removeData('bs.modal');
				    $('#myModal').modal({remote: script_php+'?add_new_spot=true&comment_form&this_clip_id=' + data, backdrop:'static',keyboard:false});
				    // $('#myModal').modal({remote: script_php+'?add_new_spot=true'});
				    $('#myModal').modal('show');
				    Mousetrap.pause();

	         	}
	         	window.getListEntries(e_type,station,date);

	      	},
	      	type: 'POST'
	   	});
	}

   	//Prevent default action
   	return false;
}

// Get time from timestamp
function timestamp_to_time(timestamp){
	var date = new Date(timestamp*1000);
	// hours part from the timestamp
	var hours = date.getHours();
	// minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// seconds part from the timestamp
	var seconds = "0" + date.getSeconds();
	// will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return formattedTime;
}

// split companies list into list
function companies_list(str){
	if(str !== null){
		var str_array = str.split(',');
		var str_td;
		for(var i = 0; i < str_array.length; i++) {
		   // Trim the excess whitespace.
		   str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		   str_td = str_array[i].split('-'); // split based on -
		   str_array[i] = '<tr><td>'+str_td[0]+'</td><td>'+str_td[1]+'</td></tr>';
		}
		str_array.unshift("<table class='table table-condensed table-bordered'>","<thead><th>Company</th><th>Tonality</th></thead>"); // add to beginning of array
		str_array.push('</table>'); // add to end of array
		return str_array.join("");
	} else{
		return str;
	}
}

// Document ready
$(document).ready(function() {
	// Load modal data via ajax
	/*$(document).on('click', '.analyze', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?clip_id=' + $(this).data('clip-insert-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	});*/


	// Load modal for print media upload
	/*$(document).on('click', '#modalUploadPrint', function(){
		//var url = $(this).attr('href');
		$('#myModal').removeData('bs.modal');
		//$('#myModal .modal-content').html('<center>dfjbvhjkbhvdbhj</center>');
		$('#myModal').modal({remote: 'public/_print_media_upload.php'});
		$('#myModal').modal('show');
	    //Mousetrap.pause();
	});*/

	// Load modal data via ajax
	$(document).on('click', '.analyze-anvil', function() {
	    $('#myModal').removeData('bs.modal');
	    //$('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?anvil_clip_id=' + $(this).data('clip-insert-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	});

	// Load modal data via ajax
	$(document).on('click', '.analyze-anvil-spot', function() {
		var station = $('#station').val();
     	var date = $('#date-picker').val();
	    $('#myModal').removeData('bs.modal');
	    // $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?anvil_spot=true&anvil_spot_date='+date+'&anvil_spot_station='+station,backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	});

	// Load modal data via ajax
	$(document).on('click', '.analyze-edit', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?story_id=' + $(this).data('clip-edit-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	});

	// Load modal data via ajax
	$(document).on('click', '.analyze-edit-print', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?story_id=' + $(this).data('clip-edit-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	});

	// Load modal data via ajax
	$(document).on('click', '.analyze-edit-print-anvil', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?advert_id=' + $(this).data('advert-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	});

	// Load modal data via ajax
	$(document).on('click', '.analyze-repeat', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?repeat-play='+$(this).data('clip-repeat-id')+'&type='+$(this).data('repeat-type'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	$(document).on('click', '.analyze-replace', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?replace-play='+$(this).data('clip-replace-id')+'&type='+$(this).data('replace-type'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	// Reelmedia analysis form processing
	$(document).on('submit','form.analyze-form', function() {
		$('.btn-insert').prop('disabled',true); // disable button on click
		var station = $('#station').val();
     	var date = $('#date-picker').val();
        $.ajax({
            url:$(this).attr('action'),
            type:$(this).attr('method'),
            data:$(this).serialize(),
            success:function(data) {
               $('.info-message').html(data);

                // refresh print
                if(script_php === 'print.php'){
                	window.getListStoryEntriesPrint('news',station,date);
	                window.getListStoryEntriesPrintAnvil(station,date);
                }else{
                	// refresh radio or tv stories
		     		window.getListStoryEntries('news',station,date);
		     		window.getListStoryEntriesElectronicAnvil(station,date);
                }

            },
            error:function(xhr,err) {
                alert('Error! Please try again');
                $('.btn-insert').prop('enabled',true);  // enable button if ajax fails
            }
        });
        return false;
    });

	// Anvil analysis form processing from clipped entry

    $(document).on('submit','form.analyze_form_anvil', function() {
		// $('.btn-insert-anvil').prop('disabled',true); // disable button on click
		var station = $('#station').val();
     	var date = $('#date-picker').val();
        $.ajax({
            url:$(this).attr('action'),
            type:$(this).attr('method'),
            data:$(this).serialize(),
            success:function(data) {
               	$('.anvil_info_message').html(data);
                // refresh print
                if(script_php === 'print.php'){
                	window.getListStoryEntriesPrint('news',station,date);
	                window.getListStoryEntriesPrintAnvil(station,date);
                }else{
                	// refresh radio or tv stories
		     		window.getListStoryEntries('news',station,date);
		     		window.getListStoryEntriesElectronicAnvil(station,date);
                }

            },
            error:function(xhr,err) {
                alert('Error! Please try again');
                $('.btn-insert-anvil').prop('enabled',true);  // enable button if ajax fails
                $('.anvil_info_message').html('There was an error processing your request!!	' + err);
            }
        });
        return false;
    });

    // Get data via Ajax for list entries
    window.getListEntries = function(entry_type,station,date){
    	$.getJSON(script_php,
	    	{'entry_type':entry_type,'station':station,'date':date},function(data) {
		  	var items = [];
		  	var style;
		  	var analyze;
		  	var count = 1;
		  	var repeat;
		  	var repeat_txt;
		  	
		  	items.push('<table class="table table-condensed"><form>');
		  	if(entry_type == 'ad'){
			  	table_head = "<thead><th>#</th><th>Play</th><th>Clip Time</th><th>Start</th><th>End</th><th>Analyze</th><th>Entry Type</th><th>State</th><th>Merge</th></thead>";
		  	}else{
		  		table_head ="<thead><th>#</th><th>Play</th><th>Clip Time</th><th>Start</th><th>End</th><th>Analyze</th><th>Repeat</th><th>Replace</th><th>Merge</th></thead>" ;
		  	}
		  	items.push(table_head);
		  	items.push('<tbody>');
		  	$.each(data,function(key,val) {
		  		row_class = '';
		  		analyze = '';
		  		repeat = '';
		  		replace = '';
		  		analyze_trigger = '';
		  		edit_color = '';
		  		row_color = ''

		  			if(val.new_ad == 0 ){
	  				row_color = '';
	  				ad_entry_type = 'Manual';
	  				state = 'Raw';
	  				analyze_trigger = ' data-clip-insert-id='+key+' class="analyze-anvil" ';
	  				repeat = ad_entry_type;
	  				replace = state;
	  			}else if(val.new_ad == 1){
	  				row_color = '#f0ad4e';
	  				//edit_color = 'style="color:#000;"'
	  				ad_entry_type = 'Auto';
	  				state = 'Pending';	
	  				repeat = ad_entry_type;
	  				replace = state;	  				
	  			}else if(val.new_ad == 2){
	  				row_color = '#BBDE5B';
	  				//edit_color = 'style="color:#000;"'
	  				ad_entry_type = 'Auto';
	  				state = 'Approved';	
	  				repeat = ad_entry_type;
	  				replace = state;	  				
	  			}else if(val.new_ad == 3){
	  				row_color = '#FFCDD2';
	  				//edit_color = 'style="color:#000;"'
	  				ad_entry_type = 'Auto';
	  				state = 'Rejected';	
	  				repeat = ad_entry_type;
	  				replace = state;	  				
	  			}else if(val.new_ad == 4){
	  				row_color = '#5bc0de';
	  				//edit_color = 'style="color:#000;"'
	  				ad_entry_type = 'Auto';
	  				state = 'Existing';	
	  				repeat = ad_entry_type;
	  				replace = state;	  				
	  			}
	  			if(val.analyzed == '1' && entry_type == 'ad'){
	  				state = "Analyzed";
	  				// ad_entry_type = "Analyzed";
	  				row_color = '';
	  				row_class = 'class="info"';
	  				analyze_trigger = '';
	  				disable_input = 'disabled="disabled"';	
	  				edit_color = 'style="color:#000;"'
	  				repeat = ad_entry_type;
	  				replace = state;	  
	  			}
		  		
				analyze = '<a href="#'+key+'" '+analyze_trigger+'><i class="fa fa-pencil-square-o" '+edit_color+' ></i></a>';
		  		var disable_input='';
		  		if(val.analyzed == 1){
		  			row_class = 'class="info"';
		  		}else if(val.analyzed == '0' && entry_type == 'news' && val.merged == '0'){
		  			analyze = '<a href="index.php?clip_id='+key+'" target="_blank" data-clip-insert-id='+key+' class="analyze"><i class="fa fa-pencil-square-o"></i></a>';
		  			//analyze = '<a href="#" data-clip-insert-id='+key+' class="analyze"><i class="fa fa-pencil-square-o"></i></a>';
		  			repeat = '<a href="#" data-clip-repeat-id='+key+' data-repeat-type='+entry_type+' class="analyze-repeat"><i class="fa fa-repeat"></i></a>';
		  			replace = '<a href="#" data-clip-replace-id='+key+' data-replace-type='+entry_type+' class="analyze-replace"><i class="fa fa-clipboard" aria-hidden="true"></i></a>';
		  		}else if(val.analyzed == '0' && entry_type == 'ad' && val.merged == '0'){
		  			
		  			enabled = 'disabled';
		  			//edit_color = 'style="color:#000;"';	
		  			analyze = '<a href="#" data-clip-insert-id='+key+' class="analyze-anvil" ><i class="fa fa-pencil-square-o"></i></a>';		  			
		  		}
		  		if(val.analyzed != '1' && entry_type == 'ad' ){
		  			//analyze = '<a href="index.php?clip_id='+key+'" target="_blank" data-clip-insert-id='+key+' class="analyze-anvil" ><i class="fa fa-pencil-square-o"></i></a>';
		  			//analyze_trigger = ' data-clip-insert-id='+key+' class="analyze-anvil" ';
		  		}
		  		
		  	
		  		if(val.merged == 1){
		  			row_class = 'class="danger"';
		  			disable_input = 'disabled="disabled"';
		  		}//if
		  		
		  		var this_clip_file = val.filename;
		  		var file_part = this_clip_file.substring(0, 2);
		  		
		  		if(file_part == 'm_' || val.analyzed == '1'){
		  			disable_input = 'disabled="disabled"';
		  		}
		  		items.push('<tr '+row_class+' style="background-color:'+row_color+';"><td>'+count+'</td><td><a href="#" data-play-id="'+key+'" data-play-type="'+entry_type+'" class="play-clip"><i class="fa fa-play-circle"></i></a></td><td>'+val.clip_time+'</td><td>'+val.start+'</td><td>'+val.end+
		    		'</td><td class="text-center">'+analyze+'</td><td>'+repeat+'</td><td>'+replace+'</td><td class="text-center"><input name="clip_id_'+entry_type+'[]" type="checkbox" value="'+key+'" '+disable_input+'></td></tr>');
		  		count++;
		  	}); //end for each
		  	items.push('</tbody></form></table>');

		  	if(entry_type == 'news'){
		  		$('#list-entries-reelmedia').html(items.join(""));
		  	} else{
		  		$('#list-entries-anvil').html(items.join(""));
		  	}
		});
    };

    // Get data via Ajax for list story entries
    window.getListStoryEntries = function(entry_type,station,date){
    	$.getJSON(script_php,
	    	{'stories':'true','story_type':entry_type,'station':station,'date':date},function(data) {
		  	var items = [];
		  	var style;
		  	var analyze;
		  	var content;
		  	var count = 1;
		  	items.push('<input class="form-control search" placeholder="Search by Title,Keyword,Company or Summary"/><table class="table table-condensed"><form>');
		  	items.push('<thead><th>#</th><th>Play</th><th>Title</th><th>Time</th><th>Duration</th><th>Edit</th></thead>');
		  	items.push('<tbody class="list">');
		  	$.each(data,function(key,val) {
		  		content = '<p><b>Editor:</b>'+val.editor+'</p><p>'+window.companies_list(val.clients)+'</p><p><b>Keywords:</b> '+val.mentioned+'</p><p><b>Summary:</b> '+val.Story+'</p><p><b>Entry time:</b> '+window.timestamp_to_time(val.entrytime1)+'</p>';
		  		analyze = '<a href="#" data-clip-edit-id='+val.Story_ID+' class="analyze-edit" ><i class="fa fa-pencil-square-o"></i></a>';
		    	items.push('<tr><td>'+count+'</td><td><a href="#" data-play-id="'+val.Story_ID+'" data-play-type="'+entry_type+
		    		'" class="play-clip-story"><i class="fa fa-play-circle"></i></a></td><td class="title"><span data-toggle="popover" title="'+val.Title+
		    		'" data-placement="top" data-content="'+content+'">'+val.Title+
		    		'</span></td><td>'+val.StoryTime+'</td><td>'+val.StoryDuration+'</td><td>'+analyze+'</td></tr>');
		  		count++;
		  	});
		  	items.push('</form></table>');
		  	if(entry_type == 'news'){
		  		$('#list-entries-story-reelmedia').html(items.join(""));
		  	} else{
		  		$('#list-entries-story-anvil').html(items.join(""));
		  	}

		  	var options = {
			  valueNames: ['title']
			};
			var userList = new List('list-entries-story-reelmedia', options);
			$('[data-toggle="popover"]').popover({trigger: "hover",html:"true"});
		});
    };

     // Get data via Ajax for list story entries
    window.getListStoryEntriesPrint = function(entry_type,station,date){
    	$.getJSON(script_php,
	    	{'stories':'true','story_type':entry_type,'station':station,'print_date':date},function(data) {
		  	var items = [];
		  	var style;
		  	var analyze;
		  	var content;
		  	var count = 1;
		  	var continues_from;
		  	var continues_to;
		  	items.push('<input class="form-control search" placeholder="Search by Title,Keyword,Company or Summary"/><table class="table table-condensed"><form>');
		  	items.push('<thead><th>#</th><th>Title</th><th>Page</th><th>Edit</th></thead>');
		  	items.push('<tbody class="list">');
		  	$.each(data,function(key,val) {
		  		content = '<p><b>Editor:</b>'+val.editor+'</p><p>'+window.companies_list(val.clients)+'</p><p><b>Keywords:</b> '+val.mentioned+'</p><p><b>Summary:</b> '+val.Story+'</p><p><b>Entry time:</b> '+window.timestamp_to_time(val.entrytime1)+'</p>';
		  		analyze = '<a href="#" data-clip-edit-id='+val.Story_ID+' class="analyze-edit-print" ><i class="fa fa-pencil-square-o"></i></a>';
		    	if(val.cont_on !== null){
		    		continues_to = ' (continues on page '+val.cont_on+')';
		    	}else{
		    		continues_to = '';
		    	}
		    	if(val.cont_from !== null){
		    		continues_from = ' (continues from page '+val.cont_from+')';
		    	}else{
		    		continues_from = '';
		    	}
		    	items.push('<tr><td>'+count+'</td><td class="title"><span data-toggle="popover" title="'+val.Title+
		    		'" data-placement="top" data-content="'+content+'">'+val.Title+' '+continues_to+continues_from+
		    		'</span></td><td class="page">'+val.StoryPage+'</td><td>'+analyze+'</td></tr>');
		  		count++;
		  	});
		  	items.push('</form></table>');
		  	if(entry_type == 'news'){
		  		$('#list-entries-story-reelmedia').html(items.join(""));
		  	} else{
		  		$('#list-entries-story-anvil').html(items.join(""));
		  	}

		  	var options = {
			  valueNames: ['title','page']
			};
			var userList = new List('list-entries-story-reelmedia', options);
			$('[data-toggle="popover"]').popover({trigger: "hover",html:"true"});
		});
    };

    // Get data via Ajax for list entries
    window.getListPages = function(station,date){
    	$.getJSON(script_php,
	    	{'station':station,'date':date},function(data) {
		  	var items = [];
		  	var count = 0;
		  	items.push('<nav><ul class="pagination pagination-sm">');
		  	$.each(data,function(key,val) {
		    	items.push('<li><a class="page-element" data-link-id="'+val.link_id+'" href="'+val.url+'">'+val.page+'</li>');
		    	count++;
		  	});
		  	items.push('</ul></nav>');
		  	if(count === 0){ // show no paper available
		  		$.notify("No pages available","error");
		  	}
		  	$('#page-list').html(items.join(""));
		});
    };

    var getLastPartOfUrl =function($url) {
	    var url = $url;
	    var urlsplit = url.split("/");
	    var lastpart = urlsplit[urlsplit.length-1];
	    if(lastpart===''){
	        lastpart = urlsplit[urlsplit.length-2];
	    }
	    return lastpart;
	}

	var fileExists = function(url){
	    $.ajax({
	        url: url,
	        error: function(){
	           return false;
	        },
	        success: function(){
	            return true;
	        }
	    });
	}

	// Get data via Ajax for Page list entries (Manage Print)
    window.getListPagesManage = function(station,date){
    	$.getJSON('manage_print.php',
	    	{'station':station,'date':date},function(data) {
		  	var items = [];
		  	var count = 0;
		  	items.push('<table class="table table-stripped table-condensed" id="prnt_mngr" style="border: none !important; width: 100%;"><tbody><tr style="font-weight: bold !important">'+
		  				'<td><input id="check_all" type="checkbox" onclick="checkAll(this);"/></td>'+
		  				'<td>Page</td><td>File name</td><td>Actions</td></strong></tr>');
		  	$.each(data,function(key,val) {
		  		//exists = fileExists(val.url);
		  		fileName = getLastPartOfUrl(val.url);
		  		if(val.exists_err == 'not' && val.txt_error == 'not'){
		  			err = 'not';
		  			tooltp  = 'No errors';
		  		} else if(val.exists_err == 'not' && val.txt_error == 'yes'){
		  			err = 'yes';
		  			tooltp = 'Content not captured!';
		  		} else if(val.exists_err == 'yes' && val.txt_error == 'not'){
		  			err = 'yes';
		  			tooltp = 'File not found!';
		  		} else if(val.exists_err == 'yes' && val.txt_error == 'yes'){
		  			err = 'yes';
	  				tooltp = "File not found and no content captured!";
	  			}

		    	items.push('<tr class="'+err+'">'+
		    					'<td><input class="mycheck_bx" type="checkbox" value="'+val.link_id+'" /></td>'+
		    					'<td>'+val.page+'</td><td title="'+tooltp+'"><a class="page-element" data-link-id="'+val.link_id+'" href="'+val.url+'">'+fileName+'</a></td><td>'+
		    					'<button class="btn btn-xs btn-success" onclick="EditFile('+val.link_id+');" title="Replace File"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button> | '+
								'<button class="btn btn-xs btn-danger" onclick="DeleteFile('+val.link_id+', '+station+', \''+date+'\');" title="Delete File"><i class="fa fa-times" aria-hidden="true"></i></button>'+
		    					'</td></tr>');
		    	count++;
		  	});
		  	items.push('</tbody></table>');
		  	if(count === 0){ // show no paper available
		  		$.notify("No pages available","error");
		  	}
		  	$('#page-list-manage').html(items.join(""));


		});

		jQuery.ajax({
		    url:'manage_print.php',
		    type:'POST',
		    data:{'stationid':station},
		    cache:false,
		    success:function(result){
		    	data = jQuery.parseJSON(result);
		    	var media_code;
				var media_name;
		    	$.each(data, function(k, v) {
				    media_code = v.media_code;
				    media_name = v.Media_House_List;
				});
		    	var btn = "<button class='btn btn-primary btn-xs' onclick=\"runScript('"+media_code+"', '"+date+"');\" id='run_script'>Run Print Indexing</button> &nbsp;";
		    	var btn_dlt = "<button type='submit' class='btn btn-danger btn-xs' onclick=\"DeleteMultiple('"+station+"', '"+date+"');\" id='btn_delete_mult'> Delete Selected</button>";
		    	content = media_name +' - ['+ date +'] <div class="pull-right">' + btn + btn_dlt + '</div>';
		      	$("#sttn").html(content);
		    }
		});
    };

    // Get data via Ajax for list entries
    window.getListCompanies = function(link,date){
    	$.getJSON(script_php,
	    	{'link_id':link,'date':date},function(data) {
		  	var items = [];
		  	var count = 1;
		  	items.push('<table class="table table-condensed table-bordered">');
		  	items.push('<thead><th>#</th><th>Company</th><th>Keywords</th></thead>');
		  	$.each(data,function(key,val) {
		    	items.push('<tr><td>'+count+'</td><td>'+val.company_name+'</td><td>'+val.keywords_found+
		   		'</td></tr>');
		    	count++;
		  	});
		  	items.push('</table>');

		  	$('#listing').html(items.join(""));
		  	$('.add-print-story').attr('data-link-id',link); // set this so we can do retrive
		  	//the value from the click action
		});
    };

     // Get data via Ajax for list story entries
    window.getListStoryEntriesPrintAnvil = function(station,date){
    	$.getJSON(script_php,
	    	{'anvil_stories':'true','anvil_station':station,'print_date':date},function(data) {
		  	var items = [];
		  	var style;
		  	var analyze;
		  	var content;
		  	var count = 1;
		  	items.push('<input class="form-control search" placeholder="Search by Company, Brand or Page"/><table class="table table-condensed"><form>');
		  	items.push('<thead><th>#</th><th>Company</th><th>Brand</th><th>Page</th><th>Edit</th></thead>');
		  	items.push('<tbody class="list">');
		  	$.each(data,function(key,val) {
		  		analyze = '<a href="#" data-advert-id='+val.auto_id+' class="analyze-edit-print-anvil" ><i class="fa fa-pencil-square-o"></i></a>';
		    	items.push('<tr><td>'+count+'</td><td class="company">'+val.company_name+'</td><td class="brand">'+val.brand_name+'</td><td class="page">'+val.page+'</td><td>'+analyze+'</td></tr>');
		  		count++;
		  	});
		  	items.push('</form></table>');
		  	$('#list-entries-story-anvil').html(items.join(""));

		  	var options = {
			  valueNames: ['company','brand','page']
			};
			var userList = new List('list-entries-story-anvil', options);
		});
    };

     // Get data via Ajax for list story entries for anvil electronic
    window.getListStoryEntriesElectronicAnvil = function(station, date){
    	$.getJSON(script_php,
	    	{'anvil_electronic_stories':'true','anvil_electronic_station':station,'anvil_electronic_date':date},
	    	function(data) {
		  	var items = [];
		  	var style;
		  	var analyze;
		  	var content;
		  	var count = 1;
		  	items.push('<input class="form-control search" placeholder="Search by Brand,Time,Entry Type,Ad Type"/><table class="table table-condensed"><form>');
		  	items.push('<thead><th>#</th><th>Play</th><th>Brand</th><th>Time</th><th>Entry Type</th><th>Ad Type</th><th>Edit</th></thead>');
		  	items.push('<tbody class="list">');
		  	$.each(data,function(key,val) {
		  		analyze = '<a href="#" data-advert-id='+val.id+' data-type-id="'+val.type+'" class="analyze-edit-electronic-anvil" ><i class="fa fa-pencil-square-o"></i></a>';
		    	content = '<p><b>Length (secs):</b> '+val.length+'</p><p><b>Comment:</b> '+val.comment+'</p><p><b>Score:</b> '+val.score+'</p>';
		    	items.push('<tr><td>'+count+'</td><td><a href="#" data-story-id="'+val.id+'" data-type-id="'+val.type+'" class="play-story-electronic"><i class="fa fa-play-circle"></i></a></td><td class="brand"><span data-toggle="popover" title="'+val.adname+
		    		'" data-placement="top" data-content="'+content+'">'+val.brand_name+'</span></td><td class="time">'+val.time+'</td><td class="entry">'+val.entry_type+'</td><td class="adtype">'+val.adtype+'</td><td>'+analyze+'</td></tr>');
		  		count++;
		  	});
		  	items.push('</form></table>');
		  	$('#list-entries-story-anvil').html(items.join(""));

		  	var options = {
			  valueNames: ['brand','time','entry','adtype']
			};
			var userList = new List('list-entries-story-anvil', options);
			$('[data-toggle="popover"]').popover({trigger: "hover",html:"true"});
		});
    };

    // get clips list
    window.getClips = function(station,date){
		$.ajax({
            url:script_php+'?cliplist=true',
            type:'POST',
            data:{
            	'station':station,
            	'date':date
            },
            success:function(data) {
            	// alert(data);
            	if(data === ''){
            		$.notify("No clips available","error");
            		$('#clip-list-video-wrapper').html('');
            	}else{	
            		$('#clip-list-video-wrapper').html('');
	                $('#clip-list-video-wrapper').html(data);
	                var width = $(window).width();
	                var items;
	                if (width >= 1280){
	                	items = 6;
	                }else{
	                	items = 3;
	                }

	                $("#clip-list-video").als({
						visible_items: items
					});

					// scroll to begining
					var container = $('.als-viewport');

					container.animate({
			            scrollLeft: 0
			        }, 800);

					$.notify("Clips loaded","success");
                }
            },
            error:function(xhr,err) {
                alert('Error! Please try again');
            }
        });
    };


    // date picker initialization
    $('#date-picker').datepicker({
    	todayHighlight:true,
	    format:'yyyy-mm-dd'
	    //endDate:'0d'
	});
	 $('#date-picker-s, #date-picker-e').datepicker({
    	todayHighlight:true,
	    format:'yyyy-mm-dd'
	    //endDate:'0d'
	});

	// on select station and date
	$('.btn-select').on('click',function() {
	  	// Check if form been filled
	  	var info_span = $('.info_span');
	  	var station = $('#station').val();
     	var date = $('#date-picker').val();

	  	if(station === ''){
			$(this).notify("Please select a station.",{className: 'error',position:"right"});
    	}
    	if(date === ''){
			$(this).notify("Please select a date.",{className: 'error',position:"right"});
    	}

    	if(station !== '' &&  date !== ''){
     		window.getClips(station,date); // Get recordings

			info_span.text('');
    		window.getListEntries('news',station,date); // Get Reelmedia Clippings
     		window.getListEntries('ad',station,date); // Get Anvil Clippings
     		window.getListStoryEntries('news',station,date); // Get Reelmedia Stories
     		window.getListStoryEntriesElectronicAnvil(station,date); // Get Anvil Ads
    	}
	});

	$('.btn-select-print').on('click',function() {
	  	// Check if form been filled
	  	var info_span = $('.info_span');
	  	var station = $('#station').val();
     	var date = $('#date-picker').val();

	  	if(station === ''){
			$(this).notify("Please select a station.",{className: 'error',position:"right"});
    	}
    	if(date === ''){
			$(this).notify("Please select a date.",{className: 'error',position:"right"});
    	}

    	if(station !== '' &&  date !== ''){
			info_span.text('');
    		window.getListPages(station,date); // list page
    		window.getListStoryEntriesPrint('news',station,date);
    		window.getListStoryEntriesPrintAnvil(station,date);
    	}
	});

	$('.btn-select-print-manage').on('click',function() {
	  	// Check if form been filled
	  	var info_span = $('.info_span-manage');
	  	var station = $('#station-manage').val();
     	var date = $('#date-picker').val();

	  	if(station === ''){
			$(this).notify("Please select a station.",{className: 'error',position:"right"});
    	}
    	if(date === ''){
			$(this).notify("Please select a date.",{className: 'error',position:"right"});
    	}

    	if(station !== '' &&  date !== ''){
			info_span.text('');
    		window.getListPagesManage(station,date); // list page
    		//window.getListStoryEntriesPrint('news',station,date);
    		//window.getListStoryEntriesPrintAnvil(station,date);
    	}
	});

	// reelmedia merge
	$('.btn-merge-reelmedia').on('click',function() {
		//check if clip_id has value
		var atLeastOneIsChecked = $('input[name="clip_id_news[]"]:checked').length > 1;
		if(atLeastOneIsChecked){
			var confirm = window.confirm("Are you sure you want to merge these clips?");
        	if(confirm){
				// Send this to merge
				var data = [];
				$('input[name="clip_id_news[]"]:checked').each(function() {
				   data.push($(this).val());
				});
				$.ajax({
		            url:script_php+'?merge=true',
		            type:'POST',
		            data:{
		            	'clip_ids':data,
		            	'type':'news'
		            },
		            success:function(data) {
		                $('.merge-info-reelmedia').html(data);
		                $('input[name="clip_id_news[]"]:checked').each(function() {
						   window.setCookie('merge-'+$(this).val(),$(this).val(),1);
						});
		                var station = $('#station').val();
         				var date = $('#date-picker').val();
		                window.getListEntries('news',station,date);
		            },
		            error:function(xhr,err) {
		                alert('Error! Please try again');
		            }
		        });
			}
		} else{
			$(this).notify("Please select at least two clips to merge.",{className: 'error',position:"left"});
		}
	});

	// Anvil merge
	$('.btn-merge-anvil').on('click',function() {
		//check if clip_id has value
		var atLeastOneIsChecked = $('input[name="clip_id_ad[]"]:checked').length > 1;
		if(atLeastOneIsChecked){
			var confirm = window.confirm("Are you sure you want to merge these clips?");
        	if(confirm){
				// Send this to merge
				var data = [];
				$('input[name="clip_id_ad[]"]:checked').each(function() {
				   data.push($(this).val());
				});
				$.ajax({
		            url:script_php+'?merge=true',
		            type:'POST',
		            data:{
		            	'clip_ids':data,
		            	'type':'ad'
		            },
		            success:function(data) {
		                $('.merge-info-anvil').html(data);
		                $('input[name="clip_id_ad[]"]:checked').each(function() {
						   window.setCookie('merge-'+$(this).val(),$(this).val(),1);
						});
		                var station = $('#station').val();
         				var date = $('#date-picker').val();
		                window.getListEntries('ad',station,date);
		            },
		            error:function(xhr,err) {
		                alert('Error! Please try again');
		            }
		        });
			}
		} else{
			$(this).notify("Please select at least two clips to merge.",{className: 'error',position:"left"});
		}
	});

	// Load modal data via ajax
	$(document).on('click', '.play-clip', function() {
	    $('#myModal').removeData('bs.modal');
	    $('#myModal').modal({remote: script_php+'?play='+$(this).data('play-id')+'&type='+$(this).data('play-type'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	// Load modal data via ajax
	$(document).on('click', '.play-incantation', function() {
	    $('#myModal').removeData('bs.modal');
	    $('#myModal').modal({remote: script_php+'?play_incantation='+$(this).data('play-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	// Load modal data via ajax for stories
	$(document).on('click', '.play-clip-story', function() {
	    $('#myModal').removeData('bs.modal');
	    $('#myModal').modal({remote: script_php+'?play_story='+$(this).data('play-id')+'&type='+$(this).data('play-type'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	// Load modal data via ajax for electronic stories
	$(document).on('click', '.play-story-electronic', function() {
	    $('#myModal').removeData('bs.modal');
	    $('#myModal').modal({remote: script_php+'?play_story_electronic='+$(this).data('story-id')+'&electronic_type='+$(this).data('type-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	// electronic edit
	$(document).on('click', '.analyze-edit-electronic-anvil', function() {
	    $('#myModal').removeData('bs.modal');
	    $('#myModal').modal({remote: script_php+'?edit_anvil_electronic='+$(this).data('advert-id')+'&edit_type='+$(this).data('type-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	    return false;
	});

	$(document).on('click', '.page-element', function() {
		var url = $(this).attr('href');
		var link_id = $(this).data('link-id');
		var date = $('#date-picker').val();
		var string_to_replace = 'http://www.reelforge.com/'; //madness
		var new_string = server_path; // more madness
		var new_url = url.replace(string_to_replace,new_string);
		var newpage = 'public/web/viewer.html?file='+new_url;
		$('#pdf-viewer').attr('src',newpage);
		window.getListCompanies(link_id,date); //trigger companies list
		// make parent li active
		$('ul.pagination > li').removeClass('active');
		$(this).parent().addClass('active');
	    return false;
	});

	// Load modal data via ajax for stories
	$(document).on('click', '.add-print-story', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?add_story=true&paper_date='+$('#date-picker').val()+'&link='+$(this).attr('data-link-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    return false;
	});

	// load modal for print add-print-anvil-story
	$(document).on('click', '.add-print-anvil-story', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?add_anvil_story=true&paper_date='+$('#date-picker').val()+'&link='+$('.add-print-story').attr('data-link-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    return false;
	});

	// load modal for new ad tagging by supervisor
	$(document).on('click', '.btn-tag-new', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?tag='+$(this).attr('data-clip-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    return false;
	});

	// load modal for Rejected ad tagging by supervisor
	$(document).on('click', '.btn-tag-rej', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?rejected='+$(this).attr('data-clip-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    return false;
	});
	// load modal for new incantation
	$(document).on('click', '.btn-new-incantation', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?new=true',backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    return false;
	});

	// load modal for edit incantation
	$(document).on('click', '.btn-tag-edit', function() {
	    $('#myModal').removeData('bs.modal');
	  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
	    $('#myModal').modal({remote: script_php+'?edit='+$(this).attr('data-clip-id'),backdrop:'static',keyboard:false});
	    $('#myModal').modal('show');
	    return false;
	});

// load cropped image with form for analysis
	$(document).on('click', '.save-crop', function() {
		var crop_data = $('#crop-image-div > img').cropper('getData');
		crop_data.url = $('#crop-image-div > img').attr('src');
		crop_data.natural_width = $('#crop-image-div > img').cropper('getImageData').naturalWidth;
		crop_data.natural_height = $('#crop-image-div > img').cropper('getImageData').naturalHeight;
		crop_data.date = $('#date-picker').val();
		crop_data.station = $('#station').val();
		crop_data.link_id = $('.add-print-story').attr('data-link-id');

		if(crop_data.x == 0 && crop_data.y == 0){
			$('#crop_error').html("<strong><font color='red'>There was an error cropping file, please try again !</font></strong>")
		} else{
			$('#myModal').removeData('bs.modal');
			$('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
			$.ajax({
	            url:script_php+'?crop=true',
	            type:'POST',
	            data:crop_data,
	            success:function(data) {
				   $('#myModal .modal-content').html(data);
	            },
	            error:function(xhr,err) {
	                alert('Error! Please try again');
	            }
	        });
		}
	    return false;

	});

	// load cropped image with form for analysis
	$(document).on('click', '.save-anvil-crop', function() {
		var crop_data = $('#crop-image-div > img').cropper('getData');
		crop_data.url = $('#crop-image-div > img').attr('src');
		crop_data.natural_width = $('#crop-image-div > img').cropper('getImageData').naturalWidth;
		crop_data.natural_height = $('#crop-image-div > img').cropper('getImageData').naturalHeight;
		crop_data.date = $('#date-picker').val();
		crop_data.station = $('#station').val();
		crop_data.link_id = $('.add-print-story').attr('data-link-id');

		if(crop_data.x == 0 && crop_data.y == 0){
			$('#crop_error').html("<strong><font color='red'>There was an error cropping file, please try again !</font></strong>")
		} else{
			$('#myModal').removeData('bs.modal');
			$('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
			$.ajax({
	            url:script_php+'?add_anvil_story=true',
	            type:'POST',
	            data:crop_data,
	            success:function(data) {
				   $('#myModal .modal-content').html(data);
	            },
	            error:function(xhr,err) {
	                alert('Error! Please try again');
	            }
	        });
		}
        return false;
	});

	// load cropped image with form for profile analysis
	$(document).on('click', '.save-profile-crop', function() {
		var crop_data = $('#crop-image-div > img').cropper('getData');
		crop_data.url = $('#crop-image-div > img').attr('src');
		crop_data.natural_width = $('#crop-image-div > img').cropper('getImageData').naturalWidth;
		crop_data.natural_height = $('#crop-image-div > img').cropper('getImageData').naturalHeight;
		crop_data.date = $('#date-picker').val();
		crop_data.station = $('#station').val();
		crop_data.link_id = $('.add-print-story').attr('data-link-id');

		if(crop_data.x == 0 && crop_data.y == 0){
			$('#crop_error').html("<strong><font color='red'>There was an error cropping file, please try again !</font></strong>")
		} else{
			$('#myModal').removeData('bs.modal');
			$('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
			$.ajax({
	            url:script_php+'?crop_profile=true',
	            type:'POST',
	            data:crop_data,
	            success:function(data) {
				   $('#myModal .modal-content').html(data);
	            },
	            error:function(xhr,err) {
	                alert('Error! Please try again');
	            }
	        });
		}
        return false;
	});
	
	// mark-new-spot mark as new
	// $(document).on('click', '.mark-new-spot', function() {
	// 	var clip_id = $(this).data('clip-id');
	// 	$.ajax({
 //            url:script_php+'?add_new_spot=true',
 //            type:'POST',
 //            data:{
 //            	'clip_id':clip_id
 //            },
 //            success:function(data) {
	// 		   	$('.mark-new-spot[data-clip-id="'+clip_id+'"]').html(data); // madness
	// 		   	// disable
 //            },
 //            error:function(xhr,err) {
 //                alert('Error! Please try again');
 //            }
 //        });
 //        return false;
	// });

	$(document).on('click', '.mark-new-spot', function() {
	    $('#myModal').removeData('bs.modal');
	    $('#myModal').modal({remote: script_php+'?add_new_spot=true&comment_form&this_clip_id=' + $(this).data('clip-id'),backdrop:'static',keyboard:false});
	    // $('#myModal').modal({remote: script_php+'?add_new_spot=true'});
	    $('#myModal').modal('show');
	    Mousetrap.pause();
	});


	// Load modal data via ajax
	$(document).on('click', '.new_story', function() {
		var sel_station = $('#station').find(':selected').val();
		if(sel_station == '' || sel_station == '0'){
			$('.new_story').notify("Please select a station first!!",{className: 'error',position:"left"});
		}else{
		    $('#myModal').removeData('bs.modal');
		  //  $('#myModal .modal-content').html('<center><i class="fa fa-3x fa-refresh fa-spin"></i></center>');
		    $('#myModal').modal({remote: script_php+'?new_story=true&station='+$('#station').val(),backdrop:'static',keyboard:false});
		    $('#myModal').modal('show');
		    Mousetrap.pause();
		    return false;
		}		
	});

	// Load modal data via ajax
	$(document).on('click', '.new_anvil', function() {
		
		var cur_file_time =  player.currentTime;
		var rec_file = player.getAttribute('src');
		var sel_station = $('#station').find(':selected').val();
		// alert(cur_file_time + ' ' + rec_file);
		if(sel_station == '' || sel_station == '0'){
			$('.new_anvil').notify("Please select a station first!!",{className: 'error', position:"left"});
		}else if(rec_file == 'null' || cur_file_time == '0'){
			$('.new_anvil').notify("Please select a recording to play first, then navigate to Ad start position!!",{className: 'error', position:"left"});
		}else{
		    $('#myModal').removeData('bs.modal');
		    $('#myModal').modal({remote: script_php+'?new_anvil=true&station='+$('#station').val() + '&cur_time='+ cur_file_time + '&rec_file='+rec_file ,backdrop:'static',keyboard:false});
		    $('#myModal').modal('show');
		    Mousetrap.pause();
		    return false;
		}
	});

	// enable keyboard keys on modal load
	$('#myModal').on('hidden.bs.modal', function (e) {
	  	Mousetrap.unpause(); // unpause mousetrap
	});


	$('#selCompany').on('change',function(){
    	$.getJSON('index.php',
	    	{'company':$(this).val()},function(data) {
		  	var items = [];
		  	items.push('<option value="">--Please select--</option>');
		  	// data.sort( function(a,b){ return a.brand_name - b.brand_name } );

		  	$.each(data,function(key,val) {
		    	items.push('<option value="'+key+'">'+val.brand_name+'</option>');
		  	});

		  	$('#selBrand').html(items.join(""));
		});
    });
});

function fetch_c_brands(co_id){
	jQuery.ajax({
    url:'public/qc_actions.php',
    type:'POST',
    
    data:{
    	'co_id':co_id, 
    	'type': 'comp_brands'    	
    },
    cache:false,
    success:function(data){
    	$('#comp_brands').html(data);
    },
    error:function(){
      load.html = 'Error Updating Entry, Please try again!!!';
    }
  });
}

function fetch_f_brands(co_id){
	jQuery.ajax({
    url:'public/qc_actions.php',
    type:'POST',
    
    data:{
    	'co_id':co_id, 
    	'type': 'comp_brands'    	
    },
    cache:false,
    success:function(data){
    	$('#form_brands').html('<option value="all">-- All Brands --</option>');
    	$('#form_brands').append(data);
    },
    error:function(){
      load.html = 'Error Updating Entry, Please try again!!!';
    }
  });
}
// Video JS implementation
var time;
var values = [0];
var start = 0;
while(start < 100){
    values.push(start+=5);
}

function filter5(value,type){
    return value % 60 ? 2 : 1;
}
function skip(value) {
    //vid.currentTime += value;
    var timetoskip = player.currentTime;
    timetoskip += value;
    player.currentTime = timetoskip;
}

// video play/pause functions
function vidplay() {
   var button = document.getElementById("play");
   // var j_cur_time =  player.currentTime;
   // var j_file = player.getAttribute('src');
   // alert(j_cur_time + ' ' + j_file);
   	if (player.paused) {
      	player.play();
      	$.notify("Clip playing","success");
      	button.innerHTML = '<i class="fa fa-pause"></i>';
   	} else {
      	player.pause();
      	$.notify("Clip paused","success");
	  	button.innerHTML = "<i class='fa fa-play'></i>";
   	}
   	logaction('play/pause');
}

function restart() {
    player.currentTime = 0; // set time to zero
}

function logaction(uaction){
	var selectedstation = $('#station').val();
    var selecteddate = $('#date-picker').val();
    var filename = player.getAttribute('src');
	var vidtime = player.currentTime;
	// $.notify("Logging "+vidtime+" action - "+uaction+" station - "+selectedstation+" date - "+selecteddate+" file - "+filename,"warning");
	$.ajax({
	    url: 'logger.php',
	    type:'POST',
	    data:{
	    	'selectedstation':selectedstation,
	    	'selecteddate':selecteddate,
	    	'filename':filename,
	    	'uaction':uaction,
	    	'vidtime':vidtime
	    },
	    error: function(){
	       return false;
	    },
	    success: function(){
	        return true;
	    }
	});
}

function seek(time) {
    player.currentTime = time;
    return false;
}

function loadvideo(link, id){
	// if audio load wave form
	player.setAttribute("src", link);
	player.load();  // if HTML source element is used
	vidplay(); // auto play

	var a_id = "file-load-id-" + id; 
	//alert(a_id);
    // clear start and end
    $("#start-txt").val(null);
	$("#end-txt").val(null);
    $("#current").text(0);

    // reset marker
    slider.noUiSlider.set(0);

    // delete clip entries table rows
    $("#clip-list > tbody").empty();

    // clear time line
    $("#timeline").html(null);

    // set player play
    var button = document.getElementById("play");
	button.innerHTML = "<i class='fa fa-play'></i>";

	// remove all previous instance of fa-spin
	var videolist = document.getElementById('clip-list-video-wrapper');
	var els = videolist.getElementsByTagName("i");
	for (var i = 0, l = els.length; i < l; i++) {
	    var el = els[i];
	    if (el.getAttribute('class') == 'fa fa-circle-o-notch fa-spin fa-5x') {
	    	el.setAttribute("class","fa fa-5x fa-file-video-o");
	    }
	}

	// change playing icon
	var link_anchor = document.getElementById("file-load-id-" + id);
	link_anchor.innerHTML = "<i class='fa fa-circle-o-notch fa-spin fa-5x'></i>";

	// enable_next_clip(id);

	var next_id = Number(id) + Number(1);
	var clip_icon_id = "clip-icon-id-" + next_id; 
	var file_icon_id = "file-load-id-" + next_id; 
	var div_icon_id = "div-icon-id-" + next_id; 
	
	//alert(next_id + " " + clip_icon_id + " " + file_icon_id);


	document.getElementById(clip_icon_id).classList.remove('clip_disabled');
	document.getElementById(file_icon_id).classList.remove('clip_disabled');
	// document.getElementById(div_icon_id).classList.remove('clip_disabled');

	document.getElementById(clip_icon_id).classList.add('clip_enabled');
	document.getElementById(file_icon_id).classList.add('clip_enabled');
	// document.getElementsByClassName(div_icon_id).style.cursor="not-allowed";
	// document.getElementById(div_icon_id).classList.add('clip_enabled');

	$.notify("Clip loaded","success");
}

// enable function only on vid.load
function save_clip(){
	// take start and end
	var start = $("#start-txt").val();
	var end = $("#end-txt").val();
	var length = $("#duration").text();
	var percentage,width;
	var file = player.getAttribute('src'); //player.currentSrc();

	// if start is zero and end is zero
	if(file === null){
		$.notify("Please select a clip","error");
	}else if(start == '0' && end == '0'){
		$.notify("Start clip time and end time cannot be zero","error");
	}else if(start === '' || end === ''){
		$.notify("Start clip time or end time cannot be empty","error");
	}else if(start == end){
		$.notify("Start clip time and end time cannot be equal","error");
	}else if(parseFloat(start) > parseFloat(end)){
		$.notify("Start clip time cannot be greater than end time","error");
	}else{
		// get percentage
		percentage = (start * 100)/length;
		width = ((end-start) * 100)/length;

		var timeline_id = start.replace('.','');

		var div = document.getElementById('timeline');
		div.innerHTML = div.innerHTML + "<a id='timeline-insert-"+timeline_id+"' onclick='seek("+start+");' class='child' style='left:"+percentage+"%;width:"+width+"%;'></a>";

		var filename = file.substring((file.lastIndexOf('/')+1));
		clip_selector(start,end,filename); // build insert form

		$("#start-txt").val(null);
		$("#end-txt").val(null);

		$.notify("Marked section for clipping","success");
	}
}

var slider = document.getElementById('slider');
if(typeof noUiSlider !== 'undefined') {
	noUiSlider.create(slider, {
	    start: [0],
	    connect:'lower',
	    tooltips:false,
	    range: {
	        'min': 0,
	        'max': 600
	    },
	    pips: {
	        mode: 'positions',
	        values: values,
	        filter: filter5,
	        density: 2,
	        format:{to:function(value){
	            return value % 60 ? 30 : value / 60;
	        }}
	    }
	});

	slider.noUiSlider.on('change', function(){
	    time = slider.noUiSlider.get();
	    //vid.currentTime = time;
	    //player.currentTime(time); // set clip time
	    player.currentTime = time;
	    logaction('seeking');
	});

	player.addEventListener("timeupdate", function(){
	    $("#current").text(player.currentTime);
	    $("#duration").text(player.duration);
	    slider.noUiSlider.set(player.currentTime);
	    // logaction();
	});

	player.addEventListener('pause', function(){
	   var button = document.getElementById("play");
	   button.innerHTML = "<i class='fa fa-play'></i>";
	});

	player.addEventListener('play', function(){
	   var button = document.getElementById("play");
	   button.innerHTML = "<i class='fa fa-pause'></i>";
	});

	player.addEventListener('ended',function(){
		// change the link back or mark as played
		var link = player.getAttribute("src"); //player.currentSrc(); //vid.getAttribute("src");
		var videolist = document.getElementById('clip-list-video-wrapper');
		var els = videolist.getElementsByTagName("a");
		for (var i = 0, l = els.length; i < l; i++) {
		    var el = els[i];
		    if (el.getAttribute('href') == link) {
		    	el.innerHTML = "<i class='fa fa-repeat fa-5x'></i>";
		    }
		}
		$.notify("Clip finished","success");
		logaction('finished');
	});
}

$('.start').on('mousedown', function(event){
	switch (event.which) {
        case 1:
    		$("#start-txt").val(player.currentTime);
    		$.notify("Start time picked.",{className:'success'});
    		break;
    	default:
    		$.notify("Only mouse left click is permitted",{className:'error'});
    		break;
    }
    return false;
});

$('.end').on('mousedown', function(event){
	switch (event.which) {
        case 1:
		    $("#end-txt").val(player.currentTime);
		    $.notify("End time picked.",{className:'success'});
		    break;
		default:
    		$.notify("Only mouse left click is permitted",{className:'error'});
    		break;
    }
    return false;
});

if(typeof Mousetrap !== 'undefined') {
	// build range picker of length
	Mousetrap.bind('left', function() {
	    skip(-1);
	    return false;
	});
	Mousetrap.bind('right', function() {
	    skip(1);
	    return false;
	});
	Mousetrap.bind('space', function() {
	    vidplay();
	    return false;
	});
	Mousetrap.bind('ctrl+s', function() {
	    $("#start-txt").val(player.currentTime);
	    $.notify("Start time picked.",{className:'success'});
	    return false;
	});
	Mousetrap.bind('ctrl+e', function() {
	    $("#end-txt").val(player.currentTime);
	    $.notify("End time picked.",{className:'success'});
	    return false;
	});
	Mousetrap.bind('enter', function() {
		save_clip();
		return false;
	});
}

// save
$('.save').on('mousedown', function(event){
	switch (event.which) {
        case 1:
			save_clip();
			break;
		default:
			$.notify("Only left mouse click is permitted",{className:'error'});
			break;
	}
	return false;
});

// remove tr
function removeTr(id){
   $('#clip-insert-'+id).remove(); // clear tr for clipping
   $('#timeline-insert-'+id).remove();// clear slider
   $.notify("Cleared","success");
}

// Trap session timeout on ajax errors
$(document).ajaxError(function (event, jqxhr, settings, exception) {
    if (jqxhr.status === 401) {
        alert('Session is expired. Login again');
        window.location.href = 'login.php';
    }
});


/**
 * MULTIPLE PRINT MEDIA FILES UPLOAD AJAX
 */
$('.btn-import').on('click', function (e) {
	$('#qcModal').modal();
	//var load = document.getElementById('queryresults');
	var action = 'public/_print_media_upload_action.php';

	jQuery.ajax({
		url:'public/_print_media_upload_action.php',
		type:'POST',
		data:{'action': action},
		cache:false,
		success:function(data){
			//$("#modal_result").html("File successfully Uploaded");
		},
		error:function(){
			console.log("Error");
		}
	});
})

/**
 * CHECK ALL ITEMS
 */
function checkAll(source){
    checkboxes = $('input.mycheck_bx');
	for(var i=0, n=checkboxes.length;i<n;i++) {
		checkboxes[i].checked = source.checked;
	}
}

/**
 * EDIT PRINT MEDIA FILES
 * Delete Item
 */
function DeleteFile(link_id, station, date){
	var link = 'public/_manage_print.php';
    var r = confirm("Are You Sure you want to delete this item?");
    if (r == true) {
        jQuery.ajax({
            url:link,
            type:'POST',
            data:{'linkID':link_id, 'type':'delete', 'deleteDate':date},
            cache:false,
            success:function(data){
            	window.getListPagesManage(station,date);
            	var result = $.parseJSON(data);
            	$.each(result, function(index, value){
            		$('#delete_status').append(value + '<br>');
            	});
            	//$('#delete_status').html(result);
            },
            error:function(){
                return false;
            }
        });
    }
}

function DeleteMultiple(station, date){
	//this.preventDefault();
	var checked = $('.mycheck_bx').prop('checked');
	var linkIDs = $("#prnt_mngr input.mycheck_bx:checkbox:checked").map(function(){
      	return $(this).val();
    }).get(); 

	var link = 'public/_manage_print.php';
	var r = confirm("Are You Sure you want to delete all checked items?");
	if (r == true) {
        jQuery.ajax({
            url:link,
            type:'POST',
            data:{'linkID':linkIDs, 'type':'delete', 'deleteDate':date},
            cache:false,
            success:function(data){
            	window.getListPagesManage(station,date);
            	var result = $.parseJSON(data);
            	$.each(result, function(index, value){
            		$('#delete_status').append(value + '<br>');
            	});
            	//$('#delete_status').html(result);
            },
            error:function(){
                return false;
            }
        });
    }

}


/**
 * Edit media content
 */
function EditFile(link_id){
	$('#manageModal').modal();
	var link = 'public/_manage_print_upload_action.php';
	//var action = 'public/_manage_print.php'
	jQuery.ajax({
		url: link,
		type: 'POST',
		data:{'linkID':link_id},
		cache:false,
		success:function(data){
			//$("#modal_result-manage").html(data);
		},
		error:function(){
			console.log("Error");
		}
	});
}

function runScript(media_code, date){
	jQuery.ajax({
		url: 'manage_print.php',
		type: 'POST',
		data: {'media_code':media_code, 'date':date, 'type':'background'},
		cache: false,
		success: function(data){
			//
		}
	});
}

function pageNav(letter){
	var load = document.getElementById('load_companies');
    jQuery.ajax({
    url:'public/companies/companies_' + letter + '.php',
    cache:false,
    success:function(data){
				$("#load_companies").fadeOut(500).hide(function()
				{
					$("#load_companies").fadeIn(500).html(data);				
				});
    },
    error:function(){
      load.html = 'Error Loading, please Try Later!';
    }
  });
}
// Functionality for tr checkbox


//$.fn.select2.defaults.set("theme", "bootstrap");

jQuery(function ($){
	    $(document).ajaxStop(function(){
        	$("#ajax_loader").hide();        	
         });
         $(document).ajaxStart(function(){
            $("#ajax_loader").show();
          });    
    });  

$(document).ready(function(){	
	$(document).on('submit', '#inc_form', function(e){
		//e.preventDefault();
		var data = $(this).serialize();
		$.ajax({
			type : 'POST',
			url  : 'qc.php',
			data : data,
			success :  function(data){		
				$("#inc_data").fadeOut(500).hide(function(){
					$("#inc_data").html(data);	
				$("#inc_data").fadeIn(500).html(data);
				});

				// $('#inc_count').html('joe');
			}
		});
		return false;
	});
});

$(document).ready(function(){	
	$(document).on('submit', '#inc_edit', function(e){
		e.preventDefault();
		var data = $(this).serialize();
		$.ajax({
			type : 'POST',
			url  : 'qc.php',
			data : data,
			success :  function(data){		
				$("#inc_edit_msg").html(data);
				$('#inc_update').prop('disabled',true);	
			}
		});
		return false;
	});
});

$(document).ready(function(){	
	$(document).on('submit', '#clippings_form', function(e){
		//e.preventDefault();
		var data = $(this).serialize();
		$.ajax({
			type : 'POST',
			url  : 'qc.php',
			data : data,
			success :  function(data){		
				$("#clippings_data").fadeOut(500).hide(function(){
					$("#clippings_data").html(data);	
				$("#clippings_data").fadeIn(500).html(data);
				});
			}
		});
		return false;
	});
});

// $(document).ready(function(){	
// 	$(document).on('submit', '#mark_new_ad_form', function(e){
// 		e.preventDefault();
// 		var data = $(this).serialize();
// 		$.ajax({
// 			type : 'POST',
// 			url  : 'index.php?add_new_spot=true&mark_new=true',
// 			data : data,
// 			success :  function(data){		
// 				$("#new_ad_info_message").html(data);	
// 			}
// 		});
// 		return false;
// 	});
// });
$(document).on('submit','form.mark_new_ad', function() {
	// $('.btn-mark-new').prop('disabled',true); // disable button on click
    $.ajax({
        url:$(this).attr('action'),
        type:$(this).attr('method'),
        data:$(this).serialize(),
        success:function(data) {
           $('#new_ad_info_message').html(data);
           $('.btn-mark-new').prop('disabled',true);  // enable button if ajax fails
			var station = $('#station').val();
			var date = $('#date-picker').val();
			var ad = 'ad';
			window.getListEntries(ad,station,date);
        },
        error:function(xhr,err) {
            alert('Error! Please try again');
            $('.btn-mark-new').prop('enabled',true);  // enable button if ajax fails
        }
    });
    return false;
});

// $(document).on('submit','form.new_inc_form', function() {
//     $.ajax({
//         url:$(this).attr('action'),
//         type:$(this).attr('method'),
//         data:$(this).serialize(),
//         success:function(data) {
//            $('#new_inc_info_message').html(data);
//            $('.btn-insert-inc').prop('disabled',true);  // enable button if ajax fails
			
//         },
//         error:function(xhr,err) {
//             alert('Error! Please try again');
//             $('.btn-insert-inc').prop('enabled',true);  // enable button if ajax fails
//         }
//     });
//     return false;
// });

$(document).ready(function(){	
	$(document).on('submit', '#new_inc_form', function(e){
		//e.preventDefault();
		var data = $(this).serialize();
		$.ajax({
			type : 'POST',
			url  : 'qc.php',
			data : data,
			success :  function(data){		
				$('#new_inc_info_message').html(data);
         		$('.btn-insert-inc').prop('disabled',true);  // enable button if ajax fails
			
			},
       		error:function(xhr,err) {
            	alert('Error! Please try again');
            	$('.btn-insert-inc').prop('enabled',true);  // enable button if ajax fails
        	}
		});
		return false;
	});
});


/**
 * Manual Upload Incantation
 */
$(document).ready(function(){	
	$(document).on('submit', '#inc_upload_form', function(e){
		//e.preventDefault();
		var data = $(this).serialize();
		$.ajax({
			type : 'POST',
			url  : 'qc.php',
			data : data,
			success :  function(data){		
				$('#message_upload_inc').html(data);
         		$('#btn_manual_upload').prop('disabled',true);  // enable button if ajax fails
			
			},
       		error:function(xhr,err) {
            	alert('Error! Please try again');
            	$('#btn_manual_upload').prop('enabled',true);  // enable button if ajax fails
        	}
		});
		return false;
	});
});


$(document).ready(function(){	
	$(document).on('submit', '#reject_clip_form', function(e){
		//e.preventDefault();
		var data = $(this).serialize();
		$.ajax({
			type : 'POST',
			url  : 'qc.php',
			data : data,
			success :  function(data){		
				$('#new_inc_info_message').html(data);
         		$('.btn-insert-inc').prop('disabled',true);  // enable button if ajax fails
			
			},
       		 error:function(xhr,err) {
            	alert('Error! Please try again');
            	$('.btn-insert-inc').prop('enabled',true);  // enable button if ajax fails
        }
		});
		return false;
	});
});



$(".modal").on("hidden.bs.modal", function(){
    $(".modal-body").html("");
   	
   	$("#ajax_loader").hide();  
   	// $("#upload-drop")[0].reset("");  
   	var this_div = document.getElementById("upload-drop");
   	if(this_div){
   		this_div.reset();
   }
});


function edit_compliance(auto_id){
    $('#qcModal').modal();
	// var load = document.getElementById('queryresults');

  jQuery.ajax({
    url:'public/qc_actions.php',
    type:'POST',
    data:{'auto_id': auto_id, 'type': 'edit_comp'},
    cache:false,
    success:function(data){
      $("#modal_results").html(data);
    },
    error:function(){
      load.html = 'Error Generating Report, please Try Later!';
    }
  });
}

