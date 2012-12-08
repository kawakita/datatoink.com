<h2>My Posts</h2>

<table class="table">

<? foreach($posts as $post): ?>
	
	<tr>
		<td>
			<div class="username">
				<?=$post['first_name']?> <?=$post['last_name']?>
			</div>
			<div class="timestamp">
				<?=Time::display($post['created'])?>
			</div>				
			<br>
			<p>
				<?=$post['content']?>
			</p>
		</td>
	</tr>
		
<? endforeach; ?>

</table>