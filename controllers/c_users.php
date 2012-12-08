<?php
class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	public function index() {
		if(!$this->user) {
			Router::redirect("/users/login/restricted"); 
		}
		else {
			Router::redirect("/"); 			
		}
	}
	
	public function signup() {
		# Setup view
		$this->template->content = View::instance('v_users_signup');
		$this->template->title   = "Sign Up";

		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
		$client_files = Array(
							"/css/homepg.css"
	                    	);
		$this->template->client_files = Utils::load_client_files($client_files); 

		# Render template
		echo $this->template;
	}

	public function p_signup() {
		# Dump out the results of POST to see what the form submitted
		// print_r($_POST);
			
		# Encrypt the password	
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);	

		# More data we want stored with the user	
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		//$_POST['token']    = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());
		
		# Insert this user into the database 
		$user_id = DB::instance(DB_NAME)->insert("users", $_POST);
		
		# For now, just confirm they've signed up - we can make this fancier later
	    Router::redirect("/users/login/signup");

	}	

	public function login($result = NULL) {
		
		# Set up the view
		$this->template->content = View::instance("v_users_login");
		$this->template->title   = "Log In";

		# Pass data to the view
		$this->template->content->result = $result;

		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
		$client_files = Array(
							"/css/homepg.css"
	                    	);

		$this->template->client_files = Utils::load_client_files($client_files); 

		# Render the view
		echo $this->template;
		
	}

	public function p_login() {
	    
	    # Hash submitted password so we can compare it against one in the db
	    $_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
	    
	    # Sanitize the user entered data to prevent any funny-business (re: SQL Injection Attacks)
	    $_POST = DB::instance(DB_NAME)->sanitize($_POST);
	    
	    # Search the db for this email and password
	    # Retrieve the token if it's available
	    $q = "SELECT token 
	        FROM users 
	        WHERE email = '".$_POST['email']."' 
	        AND password = '".$_POST['password']."'";

	    $token = DB::instance(DB_NAME)->select_field($q);   
	                
	    # If we didn't get a token back, login failed
	    if($token == "") {
	            
	        $returnArray = Array("failure");
	        echo json_encode($returnArray); 

		}	
	    # But if we did, login succeeded! 
	    else {   

	        # Store this token in a cookie
	        @setcookie("token", $token, strtotime('+1 year'), '/');

	        $q = "SELECT first_name 
		        FROM users 
		        WHERE email = '".$_POST['email']."' 
		        AND password = '".$_POST['password']."'";

		    $first_name = DB::instance(DB_NAME)->select_field($q);
	        
	        $returnArray = Array("success", $first_name);

	        echo json_encode($returnArray);           
	    }
	}

	public function logout() {
		# Generate and save a new token for next login
		$new_token = sha1(TOKEN_SALT.$this->user->email.Utils::generate_random_string());
		
		# Create the data array we'll use with the update method
		# In this case, we're only updating one field, so our array only has one entry
		$data = Array("token" => $new_token);
		
		# Do the update
		DB::instance(DB_NAME)->update("users", $data, "WHERE token = '".$this->user->token."'");
		
		# Delete their token cookie - effectively logging them out
		setcookie("token", "", strtotime('-1 year'), '/');
		
		//echo "You have been logged out.";
		# Send them to the main page
	    Router::redirect("/");
	}

	public function profile($result = NULL) {

		# If user is blank, they're not logged in, show message and don't do anything else
		if(!$this->user) {
			Router::redirect("/users/login/restricted"); 
			
			# Return will force this method to exit here so the rest of 
			# the code won't be executed and the profile view won't be displayed.
			return false;
		}
		
		# Setup view
		$this->template->content = View::instance('v_users_profile');
		$this->template->title   = "Profile of".$this->user->first_name;
			
		$this->template->content->result = $result;
			
		# Render template
		echo $this->template;		

	}

	public function settings($result = NULL) {
		
		# If user is blank, they're not logged in, show message and don't do anything else
		if(!$this->user) {
			Router::redirect("/users/login/restricted"); 
			
			# Return will force this method to exit here so the rest of 
			# the code won't be executed and the profile view won't be displayed.
			return false;
		}

		# Set up the view
		$this->template->content = View::instance("v_users_settings");
		$this->template->title   = "Account Settings";

		$this->template->content->result = $result;

		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
		$client_files = Array(
							"/css/homepg.css"
	                    	);

		$this->template->client_files = Utils::load_client_files($client_files); 

		# Render the view
		echo $this->template;
		
	}

	public function email_reset() {

		# If user is blank, they're not logged in, show message and don't do anything else
		if(!$this->user) {
			Router::redirect("/users/login/restricted"); 
			
			# Return will force this method to exit here so the rest of 
			# the code won't be executed and the profile view won't be displayed.
			return false;
		}

		$q = "SELECT *
			FROM users
			WHERE user_id = '".$this->user->user_id."'";

		$data = Array('email' => $_POST['new_email']);
		DB::instance(DB_NAME)->update("users", $data, "WHERE user_id = '".$this->user->user_id."'");

	    Router::redirect("/users/profile/email_reset_success");

	}

	public function password_reset() {

		# If user is blank, they're not logged in, show message and don't do anything else
		if(!$this->user) {
			Router::redirect("/users/login/restricted"); 
			
			# Return will force this method to exit here so the rest of 
			# the code won't be executed and the profile view won't be displayed.
			return false;
		}

		# Check old password entered and actual old password match
		$q = "SELECT *
			FROM users
			WHERE user_id = '".$this->user->user_id."'
			AND password = '".sha1(PASSWORD_SALT.$_POST['old_password'])."'";
		$password_check = DB::instance(DB_NAME)->select_field($q);

		# If match, reset password
		if(isset($password_check)) {
			$data = Array('password' => sha1(PASSWORD_SALT.$_POST['new_password']));
			DB::instance(DB_NAME)->update("users", $data, "WHERE user_id = '".$this->user->user_id."'");
	    	Router::redirect("/users/profile/password_reset_success");
		} else {
	    	Router::redirect("/users/settings/password_reset_fail");
		}

	}
		
} # end of the class