$(document).ready(function() {
	$('#loginform').submit(function() {
		var action = $('#loginform').attr('action');
		var form_data = {
			email: $('input[name=email]').val(),
			password: $('input[name=password]').val()
		};

		// check if fields empty before ajax
		if (form_data.email=="" || form_data.password=="")
		{
			$('.modal-body p.error').text('Invalid log in. Please try again.');
			return false;
		}

		$.ajax({
			type: "POST",
			url: action,
			data: form_data,
			dataType: "json",
			success: function(response)
			{
				if (response[0] == "success")
				{
					$('#loginmodal').modal('hide');
					$('.nav.pull-right').html("<li class='brand rightside' style='color:#999999;''>Hi, " + response[1] + "!</li><a href=''><li class='brand rightside'>Log Out</li></a>");
					var pathname = window.location.pathname;
					console.log(pathname);
					if (pathname=="/visualize" || pathname=="/visualize/")
					{
						window.location.reload();
					}
					if (pathname=="/visualize/bar" || pathname=="/visualize/bar/")
					{
						console.log("yes");
						$('#save .tab-content').html("<br><form method='POST' action='/visualize/save' id='saveform'><span class='fieldname'>Save Title As</span><input type='text' name='title' placeholder='Name'><button class='btn' type='submit' id='save'>Save</button></form>");
					}
				}
				else {
					$('.modal-body p.error').text('Invalid log in. Please try again.');
				}
			}
		});
		return false;
	});

	$('#signupform').submit(function() {
		var action = $('#signupform').attr('action');

		var form_data = {
			first_name: $('input[name=first_name]').val(),
			last_name: $('input[name=last_name]').val(),
			email: $('#signupform input[name=email]').val(),
			password: $('#signupform input[name=password]').val()
		};

		console.log(form_data);

		// validate signup form before ajax
		var incorrect_count = 0;

		// check for missing form data
		for (var form in form_data) {
			if (form_data.hasOwnProperty(form) && form_data[form]=="") {
				$('#signupform input[name='+form+']').css('background-color', '#FFE5E5').css('border', '1px solid #FF7E7E');
				$('.modal-body p.error').text('Please complete your information.');
				incorrect_count++;
			}
			else 
			{
				$('#signupform input[name='+form+']').css('background-color', 'white').css('border', '1px solid #CCC');									
				$('.modal-body p.error').text('');	
			}
		}

		// check for valid email address
		var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
		if (!pattern.test(form_data.email))
		{
			$('#signupform input[name=email]').css('background-color', '#FFE5E5').css('border', '1px solid #FF7E7E');
			$('.modal-body p.error').text('Please provide a valid email.');
			incorrect_count++;
		}
		else
		{
			$('#signupform input[name=email]').css('background-color', 'white').css('border', '1px solid #CCC');									
			$('.modal-body p.error').text('');	
		}
		console.log($('.modal-body p.error').text(),'\n');

		// check for appropriate password length
		if (form_data.password.length < 6)
		{
			$('#signupform input[name=password]').css('background-color', '#FFE5E5').css('border', '1px solid #FF7E7E');									
			$('.modal-body p.error').text('Please provide a password at least 6 characters long.');
			incorrect_count++;
		}	
		else 
		{
			$('#signupform input[name=password]').css('background-color', 'white').css('border', '1px solid #CCC');									
			$('.modal-body p.error').text('');	
		}	

		// return false if any fields incorrect
		if (incorrect_count > 0)
			return false;

		$.ajax({
			type: "POST",
			url: action,
			data: form_data,
			dataType: "json",
			success: function(response)
			{
				if (response[0] == "success")
				{
					$('#signupmodal').modal('hide');
					$('#loginmodal').modal('show');

				}
				else {
					$('.modal-body p.error').text('That account already exists. Please try again.');
				}
			}
		});
		return false;
	});

	$('a#savelogin').click(function() {
		$('#loginmodal').modal('show');
	});


	$('a#savesignup').click(function() {
		$('#signupmodal').modal('show');
	});


	/*$('#logout').live('click', function() {
		var action = $('#logout').attr('href');
		console.log("here");

		$.ajax({
			url: action,
			success: function(response)
			{
				$('#loginmodal').modal('hide');
				$('.nav.pull-right').html('<a href="#loginmodal" data-toggle="modal"><li class="brand rightside">Log In</li></a><a href="#signupmodal" data-toggle="modal"><li class="brand rightside">Sign Up</li></a></a>');
			}
		});
		return false;
	});*/
});