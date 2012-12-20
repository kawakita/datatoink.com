<?php

class visualize_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	}
	
	public function visualize() {

			$this->template->content = View::instance('v_visualize');

		# Now set the <title> tag
			$this->template->title = "Visualize";
	
		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
			$client_files = Array(
						"/css/homepg.css",
						"/css/line.css", 
						"/js/users.js"
	                    );

	    	$this->template->client_files = Utils::load_client_files($client_files);

		# Render the view
			echo $this->template;


	}

	public function bar() {

		$this->template->content = View::instance('v_visualize_bar');

		# Now set the <title> tag
			$this->template->title = "Visualize - Bar Chart";
	
		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
			$client_files = Array(
						"/css/homepg.css",
						"/css/visualize.css", 
						"/js/raphael-min.js",
						"/js/g.raphael.js",
						"/js/g.bar.js",
						"/js/bar.js",
						"/js/jquery.csv-0.71.js",
						"/js/users.js"
	                    );

	    	$this->template->client_files = Utils::load_client_files($client_files);

		# Render the view
			echo $this->template;		
	}

	public function line() {

			$this->template->content = View::instance('v_visualize_line');

		# Now set the <title> tag
			$this->template->title = "Visualize - Line Chart";
	
		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
			$client_files = Array(
						"/css/homepg.css",
						"/css/line.css", 
						"/js/raphael-min.js",
						"/js/g.raphael.js",
						"/js/g.line.js",
						"/js/line.js",
						"/js/jquery.csv-0.71.js",
						"/js/jquery-ui-1.9.2.custom.js",
						"/js/users.js"
	                    );

	    	$this->template->client_files = Utils::load_client_files($client_files);

		# Render the view
			echo $this->template;

	}

	public function save() {
			
		# Associate this post with this user
		$_POST['user_id']  = $this->user->user_id;
		
		# Unix timestamp of when this post was created / modified
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		
		# Insert
		# Note we didn't have to sanitize any of the $_POST data because we're using the insert method which does it for us
		DB::instance(DB_NAME)->insert('posts', $_POST);
		
		$returnArray = Array("success", 0);
        echo json_encode($returnArray);           


		# Redirect
		//Router::redirect("/posts/add/added"); 
	
	}

	public function load() {

		# Set up view
		$this->template->content = View::instance('v_posts_me');
		$this->template->title   = "My Posts";
		
		# Grab all my posts	
		$q = "SELECT posts.content, posts.created, users.user_id, users.first_name, users.last_name
			FROM posts 
			JOIN users USING (user_id) 
			WHERE posts.user_id = (".$this->user->user_id.")
			ORDER BY posts.created DESC";

		$posts = DB::instance(DB_NAME)->select_rows($q);

		$this->template->content->posts = $posts;

		echo $this->template;
	}
}