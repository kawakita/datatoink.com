<!DOCTYPE html>
<html lang="en">
<head>
	<title><?=@$title; ?></title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	
	
	<!-- CSS libraries -->
	<link href="/css/bootstrap.css" rel="stylesheet" media="screen">
	<script src="/js/jquery-1.8.2.js"></script>
	<script src="/js/bootstrap.min.js"></script>

	<!-- responsive CSS -->
  <!--
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="/css/bootstrap-responsive.css" rel="stylesheet">
  -->
  <!-- CSS -->
  <link href="/css/homepg.css" rel="stylesheet">
  <script src="/js/users.js"></script>

	<!-- Controller Specific JS/CSS -->
	<?php echo @$client_files; ?>
	
</head>

<body>	
  <!-- navbar container -->
	<div class="navbar navbar-inverse navbar-fixed-top">
	  <div class="navbar-inner">
	    <div class="container">

        <!-- logo -->
	      <a class="brand logo" href="/">Data to Ink</a>

          <!-- navbar content -->
          <ul class="nav">
            <li class="brand"></li>
            <a href="/learn">
              <li class="brand">Learn</li>
            </a>
            <a href="/visualize">
              <li class="brand">Visualize</li>
            </a>
            <a href="/present">
              <li class="brand">Present</li>
            </a>
          </ul>

	        <ul class="nav pull-right">

			  		<!-- for users not logged in -->
            <? if(!$user): ?>
              <a href="#loginmodal" data-toggle="modal">
                <li class="brand rightside">Log In</li>
              </a>
              <a href="#signupmodal" data-toggle="modal">
                <li class="brand rightside">Sign Up</li></a>
              </a>

            <!-- for users logged in -->
            <? else: ?>
              <li class="brand rightside" style="color:#999999;">Hi, <?=$user->first_name;?>!</li>
              <a href="/users/logout" id="logout"><li class="brand rightside">Log Out</li></a>

            <? endif; ?>

          </ul>
          <!-- navbar content end -->
      </div>
	  </div>
	</div>
  <!-- navbar container end -->

  <div id="loginmodal" class="modal fade hide">
    <div class="modal-header">  
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
        ×
      </button>
      <br>
    </div>
    <div class="modal-body">
      <p style="font-size: 18px;">Log in to <b>Data to Ink</b></p>
      <form method='POST' action='/users/p_login' id="loginform">
        <input class="span3" type="text" placeholder="Email" name="email">
        <br>
        <input class="span3" type="password" placeholder="Password" name="password">
        <br>
        <a><p>Forgot your password?</p></a>
        <p class="error"></p>
        <button type="submit" class="btn">Log in</button>
      </form>
    </div>
  </div>

  <div id="signupmodal" class="modal fade hide">
    <div class="modal-header">  
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
        ×
      </button>
      <br>
    </div>
    <div class="modal-body">
      <p style="font-size: 18px;">Sign up for <b>Data to Ink</b></p>
      <p>Get more out of <b>Data to Ink</b> by
        <br>saving your visualizations and presentations.
      </p>
      <form method='POST' action='/users/p_signup' id="signupform" onsubmit="return false">
        <input class="span3" type="text" placeholder="First Name" name="first_name">  
        <br>
        <input class="span3" type="text" placeholder="Last Name" name="last_name">
        <br>
        <input class="span3" type="text" placeholder="Email" name="email">
        <br>
        <input class="span3" type="password" placeholder="Password" name="password">
        <br>
        <p class="error"></p>
        <button type="submit" class="btn" id="signup">Sign Up</button>
      </form>
    </div>
  </div>

  <div class="largebuffer">
  </div>

  <div class="container">
      <?=$content;?>
  </div>  

  <div class="buffer">
  </div>

  <!-- footer -->
  <footer>
    <div class="wrapper">
      <div class="container">
        <div class="about pull-left">
          <p class="brand">
            <span class="brand logo">Data to Ink</span>, better data visualization for all.
          </p>
        </div>
        <div class="about pull-right">
          © 2012 Data to Ink
        </div>
        <div class="clear">
        </div>
      </div>
    </div>
  </footer>

</body>
</html>