<h2>Following</h2>
<form method='POST' action='/posts/p_follow'>
		
	<table class="table">

	<? foreach($users as $user): ?>
	
		<tr>
			<td>
				<!-- Print this user's name -->
				<strong>
					<?=$user['first_name']?> <?=$user['last_name']?>
				</strong>
			</td>

			<td>
				<!-- If there exists a connection with this user, show a unfollow link -->
				<? if(isset($connections[$user['user_id']])): ?>
					<a href='/posts/unfollow/<?=$user['user_id']?>'>Unfollow</a>
				
				<!-- Otherwise, show the follow link -->
				<? else: ?>
					<a href='/posts/follow/<?=$user['user_id']?>'>Follow</a>
				<? endif; ?>
			</td>
		</tr>
		
	<? endforeach; ?>

	</table>

</form>