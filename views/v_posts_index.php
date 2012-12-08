<h2>View Posts</h2>

<table class="table">

<? if($posts != NULL): ?>
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

<? else: ?>
	<tr>
		<td>
			You're not following any &#181;'s. 
			<a href="/posts/users">Follow one here.</a>
		</td>
	</tr>
<? endif; ?>
</table>