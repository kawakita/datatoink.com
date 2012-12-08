<form method='POST' action='/users/p_login'>

	<? if($result=="signup"): ?>
		<div class='error'>
			You've signed up!  Please log in.
		</div>
		<br>
	<? endif; ?>

	<? if($result=="error"): ?>
		<div class='error'>
			Login failed. Please double check your email and password.
		</div>
		<br>
	<? endif; ?>

	<? if($result=="restricted"): ?>
		<div class='error'>
			Members only. Please log in.
		</div>
		<br>
	<? endif; ?>

	<input class="span2" type="text" placeholder="Email" name="email">
	<input class="span2" type="password" placeholder="Password" name="password">
	<button type="submit" class="btn" id="login">Log in</button>

</form>