<div class="smallbuffer">
</div>  
<div class="row">
 
  <div class="span12" style="text-align: center;">
    <h3 class="center">Saved Visualizations</h3>
    <table class="table">
      <? if($saves != NULL): ?>
        <? foreach($saves as $save): ?>
          <tr>
            <td>
              <div class="title">
                <a href="/visualize/<?=$save['type']?>/<?=$save['save_id']?>"><?=$save['title']?></a>
              </div>
              <div class="timestamp">
                Created: <?=Time::display($save['created'])?> | 
                Modified: <?=Time::display($save['modified'])?>
              </div>   
              <br>     
              <p>
                <?=$save['columnname_array']?>
                <br>
                <?=$save['series_array']?>
              </p>
            </td>
          </tr>
            
        <? endforeach; ?>
      <? elseif (!$user): ?>
        <tr>
          <td>
            <br>
            <p class="center">
              You need to be signed in to save visualizations. 
            </p>
          </td>
        </tr>
      <? else: ?>
        <tr>
          <td>
            You do not have any saved visualizations. 
          </td>
        </tr>      
      <? endif; ?>
    </table>
  
  </div>

 
  <div class="span12" style="height: 30px;">
    <hr>
  </div>
  
  <div class="span6">
    <h3 class="center">Bar Chart</h3>
    <a href="/visualize/bar/"><img src="/img/bar.png"></a>
  </div>
  <div class="divider">
  </div>
  <div class="span6">
    <h3 class="center">Line Chart</h3>
    <a href="/visualize/line/"><img src="/img/line.png"></a>
 </div>


</div>
<div class="largebuffer">
</div>  