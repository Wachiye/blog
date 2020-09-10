$(document).ready( function(){
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
	$('#signup-btn').on('click', function(evt){
		evt.preventDefault();
		var $this = $(this);
		var form = $('#form-signup');
		var action = '/signup';
		var username = $('#uname').val();
		var fullname = $('#fname').val();
		var email = $('#email').val();
		var password = $('#pass').val();
		var password2 = $('#confirmPass').val();
		// check password
		if(password2 != password){
			form.prepend(alertDiv("danger","Passwords don't match. Try again."));
			$('#password').val('');
			$('#confirmPassword').val('');
		}
		//create payload
		var data = {
			"username": username,
			"fullname": fullname,
			"email": email,
			"password": password,
			"new":true
		}
		//do ajax  POST request
		$.ajax({
			url: action,
			type:"POST",
			contentType:'application/json',
			dataType: 'json',
			data: JSON.stringify(data),
			success: function(data){
				if(data.type == 'success'){
					//successful signup
					form.prepend(alertDiv("success","Account Created..Redirecting to login page."))
					setTimeout( ()=>{
						window.location("/login")
					}, 3000)
				}
				if(data.type == 'danger'){
					//error signing up
					form.prepend(alertDiv("danger", data.message.ERR))
					return false
				}
			},
			error: function(e){
				//error signing up
				form.prepend(alertDiv("danger", "Server error. Please try again later"))
				return false;
			}
		})
		return false;
	});
})