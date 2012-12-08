<h2>Profile</h2>
<table class="table">
<tr>
	<td><strong>First Name:</strong></td>
	<td><?=$user->first_name?></td>
</tr>
<tr>
	<td><strong>Last Name:</strong></td>
	<td><?=$user->last_name?></td>
</tr>
<tr>
	<td><strong>Email:</strong></td>
	<td><?=$user->email?></td>
</tr>
</table>
<? if($result=="email_reset_success"): ?>
	<div class='error'>
		<em>Email successfully changed.</em>
	</div>
	<br>
<? endif; ?>
<? if($result=="password_reset_success"): ?>
	<div class='error'>
		<em>Password successfully changed.</em>
	</div>
	<br>
<? endif; ?>
<a class="pull-right" href="/users/settings">Account Settings</a>

