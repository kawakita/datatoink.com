<h2>Account Settings</h2>
<h5>Change email:</h5>
<form action="/users/email_reset" method="post">
	<input class="span3" type="text" placeholder="New Email" name="new_email">
	<input type="submit" class="btn">
</form>
<hr>
<h5>Change password:</h5>
<? if($result=="password_reset_fail"): ?>
	<div class="error">
		Old password does not match. Please try again.
	</div>
	<br>
<? endif; ?>
<form action="/users/password_reset" method="post">
	<input class="span3" type="password" placeholder="Old Password" name="old_password">	
	<input class="span3" type="password" placeholder="New Password" name="new_password">
	<input type="submit" class="btn">
</form>