<h2>Add Post</h2>
<form method='POST' action='/posts/p_add'>

	<? if($result=="added"): ?>
		<div class='result'>
			Your post was added!
		</div>
		<br>
	<? endif; ?>

	<textarea name='content'></textarea>

	<br>
	<input type='submit' class="btn">

</form>