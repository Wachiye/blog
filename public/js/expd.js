$(document).ready(function() {
	//remove the loading when page is loaded
	$('.loading').remove();
	// creating an alert div 
	var alertDiv = (type, message)=>{
		let div = `<div class='alert alert-`;
			div = div + type + ` alert-dismissible fade show' role='alert'>`;
			div = div + message;
			div = div + `<button type='button' class='close' data-dismiss='alert' aria-label='Close'>&times;</button></div>`;
		if($('.alert').length != 0){
			$('.alert').remove();
		}
		return div;
	}
	var unselectBtn = (selectName, selectedValue)=>{
		let btn =`<button class="btn btn-primary btn-sm mr-1 unselect-btn" data-select="${selectName}" data-values>
					<i class="fa fa-remove"></i>
					<span class="badge text-primary bg-light select-value">${selectedValue}</span>
				</button>`
		return btn;
	}
	// hiding/showing an element
	var showHide = (id)=>{
		
		if( $(`#${id}`).css("display","block")){
			$(`#${id}`).css("display","none");
		}
		else{
			$(`#${id}`).css("display","block");
		}
	}
	
	//selecting all item
	function selectAll(name , action = 'unselect'){
		var values = [], size = 0;
		var targetItems = $('inPOST[name="'+name+'"]:checkbox');
		if(action == 'select'){
			targetItems.each(function(a, b){
				$(this).attr('checked', true);
				values.push($(this).val());
			});
		}
		else{
			$(`inPOST[name='${name}']:checked`).each( function (i , e){
				$(this).attr('checked', false);
			});
		}
		var data = values.join() + ":"+ values.length;
		var dataField = $(`:hidden[name='${name}']`);
		dataField.val(values.join());
		return data;
	}

	//selecting
	$('button.select-btn').on('click', function(evt){
		evt.preventDefault();
		var selectName = $(this).attr('data-select');
		var data = selectAll(selectName,'select');
		$('button.unselect-btn .badge.select-value').text(data.split(":")[1]);
		$('button.unselect-btn').toggleClass('d-none');
		$('button.select-btn').toggleClass('d-none');
		// let btn = unselectBtn(selectName, data.length);
		// btn.bind('click' , function(evt){
		// 	evt.preventDefault();
		// 	var selectName = $(this).attr('data-select');
		// 	var data = selectAll(selectName)
		// 	$(this).remove();
		// 	$('button.select-btn .badge.select-value').text(0);
		// 	$('button.select-btn').toggleClass('d-none');
		// });
		//$(this).parent().prepend(btn);
	});
	// unselecting
	$('button.unselect-btn').on('click' , function(evt){
		evt.preventDefault();
		var selectName = $(this).attr('data-select');
		var data = selectAll(selectName)
		$(this).val(data.split(":")[0]);
		console.log($(this).val())
		$('button.select-btn .badge.select-value').text(0);
		$('button.select-btn').toggleClass('d-none');
		$('button.unselect-btn').toggleClass('d-none');
	});
	function addSelectValue(inPOST){ 
		var selectBtn = $('button.select-btn');
		var unselectBtn = $('button.unselect-btn');
		var currentValue = $('button.unselect-btn .badge.select-value').text();
		currentValue = parseInt(currentValue);
		if(unselectBtn.hasClass('d-none')){
			unselectBtn.toggleClass('d-none');
		}
		if(!selectBtn.hasClass('d-none')){
			selectBtn.toggleClass('d-none');
		}
		currentValue += 1;
		$('button.unselect-btn .badge.select-value').text(currentValue);
		inPOST.addClass('unselect-item');
		inPOST.removeClass('select-item');
	}
	function subSelectValue(inPOST){
		var selectBtn = $('button.select-btn');
		var unselectBtn = $('button.unselect-btn');
		var currentValue = $('button.unselect-btn .badge.select-value').text();
		currentValue = parseInt(currentValue);
		currentValue -= 1 ;
		if(currentValue == 0){
			selectBtn.toggleClass('d-none');
			unselectBtn.toggleClass('d-none');
			$('.select-btn .badge.select-value').text(currentValue);
		}
		else
			$('.unselect-btn .badge.select-value').text(currentValue);
		inPOST.addClass('select-item');
		inPOST.removeClass('unselect-item');
	}
	// showing selected items on individual clicks
	$('.select-item').toggle('click', addSelectValue($(this)), subSelectValue($(this)));
	// showing/hiding the aside nav
	$('#close-menu').on('click', function(evt){
		$('#aside-menu').toggleClass('active');
	});
	$('#burger').on('click', function(evt){
		$('#aside-menu').toggleClass('active');
	})
	//show/hide comment form
	$('#toggle-comment').on('click', function(evt){
		evt.preventDefault();
		$('#form-comment').toggleClass('d-none')
	});
	$('button[data-collapse]').on('click', function(evt){
		evt.preventDefault();
		var toggleId = '#' + $(this).attr('data-collapse');
		$(toggleId).toggleClass('d-none');
	});
	//login
	$('#login-form').on('submit', function(evt){
		evt.preventDefault();
		var action = $(this).attr('action');
		var loginBtn = $('#login-btn');
		var username = $('#username').val();
		var password = $('#password').val();
		var formData = {
			"username":username,
			"password":password
		};
		loginBtn.attr('disabled', true);
		$.ajax({
			url: action,
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(formData),
			success: function(data){
				if(data.loggedIn){
					if(data.user.category == 'Administrator'){
						window.location = '/dashboard';
					}
					else{
						window.location = '/';
					}
				}
				else
					$('#login-form').prepend(alertDiv("danger", data.message.ERR));
			},
			error: function(e){
				$('#login-form').prepend(alertDiv("danger", "Server error. Try again later."));
			}
		});
		loginBtn.attr('disabled', false);
	});
	// details form on profile link
	$('#details-form').on('submit', function(evt){
		evt.preventDefault();
		var action = $(this).attr('action');
		var fullname = $('#fullname').val();
		var website = $('#website').val();
		var data = {
			"fullname" :fullname,
			"website" : website
		};

		if(fullname == '' || fullname == undefined){
			$('#details-form').prepend(alertDiv('danger','Fullname can\'t be null, please provide your first and lass names and try again'));
			return false;
		}
		$.ajax({
			url : action,
			type : 'POST',
			data : JSON.stringify(data),
			contentType: 'application/json',
			success: function(data){
				// window.alert(alertDiv(data.type , data.message));
				$('#details-form').prepend(alertDiv(data.type , data.message));
			},
			error: function(){
				$('#details-form').prepend(alertDiv('danger','There was a problem while accessing the server.Try again leter.'));
			}
		});
	});
	
	$('#password-form').on('submit', function(evt){
		evt.preventDefault();
		var password = $("#password").val();
		var newPassword = $("#new_password").val();
		var action = $(this).attr('action');
		var confirmPassword = $("#confirm_password").val();
		if(confirmPassword != newPassword)
		{
			$('#password-form').prepend(
				alertDiv("danger", "Passwords don't match. Try again.")
			);
			return false;
		}
		var data = {
			"password" : password,
			"new_password": newPassword
		};
		$.ajax({
			url : action,
			type: "POST",
			dataType: 'json',
			data: JSON.stringify(data),
			contentType : "application/json",
			success : function(data) {
				$('#password-form').prepend(
						alertDiv(data.type, data.message)
					);

				if(data.type == 'success'){
					$('#password-form').reset();
				}
			},
			error : function(){
				$('#password-form').prepend(
					alertDiv("danger", "Server error. Try again later")
				);
			}
		});
	});
	//(updating site views from links)
	$('a').on('click', function(evt){
		evt.preventDefault();
		var current = $(this);
		var action = current.attr('href');
		if(current.attr('data-addview')){
			var addview = current.attr('data-addview');
			var id = (addview.split(" "))[0];
			var type = (addview.split(" "))[1];
			var name = (addview.split(" "))[2];
			var data = JSON.stringify({
				"name":name,
				"id":id,
				"type":type
			});
			$.ajax({
				url: "/addview",
				data: data,
				dataType:"json",
				contentType: "application/json",
				type: "POST"
			});
		}
		window.location = action
	});
	//post functions
	// creating a post
	$('form #newpost-form').on('submit' , function(evt){
		evt.preventDefault();
		var action = $(this).attr('action');
		// var title = $('#title').val();
		// var content = $('#content').val();
		// var image = $('#imagePreview').attr('src');
		// var excerpt = $('#excerpt').val();
		// var formData = {
		// 	"title": title,
		// 	"content": content,
		// 	"excerpt": excerpt,
		// 	"image": files
		// };
		var formData = new FormData();
		var files = $('#image')[0].files[0];
		// formData = JSON.stringify(formData);
		formData.append("image", files);
		$.ajax({
			url : action,
			type: "POST",
			// dataType:"json",
			// contentType: "application/json",
			data : formData,
			success : function(data){
				$('#newpost-form').prepend(
					alertDiv(data.type,data.message)
				);
				// clear fields if success
				if(data.type == 'success'){
					$(':inPOST').val('');
				}
			},
			error: function(){
				$('#newpost-form').prepend(
					alertDiv("danger", "Server error. Try again later")
				);
			}
		});
	});
	
	//commenting on a post
	$('form#comment-form').on('submit', function(evt){
		evt.preventDefault();
		var action = $(this).attr('action');
		var username = $('#username').val();
		var email = $('#email').val();
		var website = $('#website').val();
		var addme = $('#addme').val();
		var message = $('#message').val();
		var formData = {
			"username":username,
			"email":email,
			"website":website,
			"addme":addme,
			"message":message
		};
		$.ajax({
			url: action,
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data : JSON.stringify(formData),
			success:function(data){
				$('#comment-form').prepend(
					alertDiv(data.type, data.message)
				);
			},
			error:function(){
				$('#comment-form').prepend(
					alertDiv("danger","Server error. Try again later")
				);
			}
		});
	});
	//toggle between unread and all items
	$('#view-unread').on('click', function(evt){
		evt.preventDefault();
		var count = 0;
		var items = $(this).attr('data-group');
		$(`.${items}`).each( function(){
			if($(this).hasClass('unread') || $(this).hasClass('Unread')){
				count += 1;
			}
		});
		if(count > 0){
			$(`.${items}.read`).each( function(){
				$(this).hide()
			});
		}
	});
	$('#view-all').on('click', function(evt){
		evt.preventDefault();
		var items = $(this).attr('data-group');
		$(`.${items}`).show();
		return true;
	});
	//marking a .unread as read on hover
	$('.unread').mouseover( function(evt){
		evt.preventDefault();
		var $this = $(this);
		var itemId = $(this).attr('id');
		var itemGroup = $(this).attr('data-group');
		var action = itemGroup + 's/'+ itemId+'/read';
		var data ={
			"id":itemId
		};
		var itemText = $('#'+ itemGroup + '-text-' + itemId);
		alert(action)
		$.ajax({
			url: action,
			type:"POST",
			data: JSON.stringify(data),
			contentType:'application/json',
			dataType:"json",
			success: function(data){
				if(data.read){
					itemText.removeClass('text-bold');
					$this.unbind('mouseover');
					$this.removeClass('unread');
				}
				else
				{
					$('.' + itemGroup + '#' + itemId + ' .card-body').prepend(
						alertDiv("danger", data.message.ERR)
					);
				}
			},
			error:  function(e){
				console.log(e)
				$('.' + itemGroup + '#' + itemId + ' .card-body').prepend(
					alertDiv("danger", "Server error. Try again later"+ e)
				);
			}
		});
		return false;
	});

	// marking comments as read in bulk
	$('#comments-read').click( function(evt){
		evt.preventDefault();
		var $this = $(this);
		$this.attr("disabled", true);
		var commentIds = $('#comment-ids[]').val();
		var action = 'comments/read';
		var data ={
			"ids":comment-ids
		};
		var commentText = $('#comment-text-'+commentId);
		
		$.ajax({
			url: action,
			type:"POST",
			data: JSON.stringify(data),
			contentType:'application/json',
			dataType:"json",
			success: function(data){
				if(data.read){
					commentText.removeClass('text-bold');
					$this.unbind('mouseover');
					$this.removeClass('unread');
				}
				else
				{
					$('.comment#'+commentId + ' .card-body').prepend(
						alertDiv("danger", data.message.ERR)
					);
				}
			},
			error:  function(e){
				$('.comment#'+commentId + ' .card-body').prepend(
					alertDiv("danger", "Server error. Try again later")
				);
			}
		});
	});
	//subscription functions
	$('#subscriber-form').on('submit', function(evt){
		evt.preventDefault();
		var $this = $(this);
		var action = $(this).attr('action');
		var name = $('#name').val();
		var email = $('#email').val();
		// validation
		if (name == '' || email == '') {
			$this.prepend(
				alertDiv("danger", "Please provide your name and email address.")
			);
			return false;
		}
		var data = {
			"username" : name,
			"email" : email
		}
		$.ajax({
			url: action,
			type: "POST",
			data : JSON.stringify(data),
			dataType : "json",
			contentType : "application/json",
			success: function(data){
				
				if(data.type == 'success'){
					$this.prepend(
				alertDiv('success', "Thank you for subscribing. We value you."));
					$('#name').val('');
					$('#email').val('');
				}
				else
				{
					$this.prepend(
				alertDiv(data.type, data.message.ERR));
				}
			},
			error: function(e){
				console.log(e)
				$('#subscriber-form').prepend(
					alertDiv("danger", "Server error. Try again later")
				);
			}
		});
	});

	$('.select-all').click(
		function(){ //select all
			$('.select-all span').html(selectAll('post', 'select').length);
		},
		function(){ //unselect
			$('.select-all span').html(selectAll('post', 'select').length);
		}
	);
	// performing an action in bulk
	$('.bulk-action[data-select]').on('click', function(evt){
		evt.preventDefault();
		$this = $(this);
		var selectName = $(this).attr('data-select');
		var dataField = $(`:hidden[name='${selectName}[]']`);
		var values = [];
		if(dataField.val() == ''){
			$(`inPOST[name='${selectName}[]']:checked`).each(function(a, b){
				values.push($(this).val());
			});
			values = values.join();
		}
		else{
			values = dataField.val();
		}
		var link = $(this).attr('data-link');
		var data = {
			"ids":values
		}
		var action = `/${selectName}/${link}/${values}`;
		$.ajax({
			url : action,
			type: 'POST',
			dataType:"json",
			contentType:"application,json",
			data: JSON.stringify(data),
			success: function(datain){
				console.log(data)
				if(datain.type == 'success'){
					$('#main').prepend(
					alertDiv("success", "Operation successful."));
				}
				else
				{
					$('#main').prepend(
					alertDiv(datain.type, datain.message.ERR));
				}
			},
			error: function(e){
				$('#main').prepend(
					alertDiv("danger", "Server error. Try again later")
				);
			}
		});
	});

	// team settings
	$('form #teams-form').on('submit', function(evt){
		evt.preventDefault();
		var $this = $(this);
		var action = $this.attr('action');
		var name = $('#name').val();
		var description = $('#description').val();
		if(name == '' || description == ''){
			$('teams-form').prepend(
				alertDiv("danger","Please include name/description and try again.")
			);
		}
		var formData = new FormData();
		$.ajax({
			url: action,
			type:  "POST",
			dataType : "json",
			contentType: "application/json",
			data : formData,
			success: function(data){
				$this.prepend(
					alertDiv(data.type, data.message)
				);
				if(data.type == 'success'){
					$this.reset();
				}
			},
			error: function(){
				$('#teams-form').prepend(
					alertDiv("danger", "Server error. Please try again later")
				);
			}
		});
	});
	$('#a-teams-form').click( function(evt){
		evt.preventDefault();
		var $teamsForm = $('form #teams-form');
		var nameField = `<inPOST type="text" name="name" id="name" class="form-control form-control-sm" placeholder="Add new Team Name">`;
		var existingNameField = $('#name');
		existingNameField.remove();
		var toggleItems = $('#toggle-items');
		toggleItems.append(nameField);
		$teamsForm.attr('action','/teams');
		$('#addteam-btn').attr('disabled', false);
		$('#updateteam-btn').hide();
		return true;
	})
	$('#e-teams-form').click( function(evt){
		evt.preventDefault();
		var $teamsForm = $('form #teams-form');
		$('#addteam-btn').attr('disabled', true);
		$('#updateteam-btn').show();
	})

	//services description setting
	$('#services-btn').on('click', function(evt){
		evt.preventDefault();
		var $this = $(this);
		var action = '/settings/services/description';
		var description = $('#services-description').val();
		var data = {
			"description" : description
		}
		$.ajax({
			url:action,
			type:"POST",
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(data),
			success: function(data){
				$this.parent().parent().prepend(
					alertDiv(data.type, data.message.ERR || 'Saved')
				);
			},
			error: function(){
				$this.parent().parent().prepend(
					alertDiv("danger", "Server error. Try again later.")
				);
			}
		})
	});
	//mission statement setting
	$('#mission-btn').on('click', function(evt){
		evt.preventDefault();
		var $this = $(this);
		var action = '/settings/mission';
		var mission = $('#mission').val();
		var data = {
			"mission" : mission
		}
		$.ajax({
			url:action,
			type:"POST",
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(data),
			success: function(data){
				$this.parent().parent().prepend(
					alertDiv(data.type, data.message.ERR || 'Saved')
				);
			},
			error: function(){
				$this.parent().parent().prepend(
					alertDiv("danger", "Server error. Try again later.")
				);
			}
		})
	});
	//teams description statement setting
	$('#teams-desc-btn').on('click', function(evt){
		evt.preventDefault();
		var $this = $(this);
		var action = '/settings/teams/description';
		var description = $('#teams_description').val();
		var data = {
			"teams_description" : description
		}
		$.ajax({
			url:action,
			type:"POST",
			dataType:'json',
			contentType:'application/json',
			data: JSON.stringify(data),
			success: function(data){
				$this.parent().parent().prepend(
					alertDiv(data.type, data.message || 'Saved')
				);
			},
			error: function(){
				$this.parent().parent().prepend(
					alertDiv("danger", "Server error. Try again later.")
				);
			}
		})
	});

});

