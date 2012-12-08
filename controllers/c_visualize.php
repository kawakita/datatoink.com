<?php

class visualize_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	}
	
	public function visualize() {

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
						"/js/jquery-ui-1.9.2.custom.js"
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
						"/js/jquery.csv-0.71.js"
	                    );

	    	$this->template->client_files = Utils::load_client_files($client_files);

		# Render the view
			echo $this->template;		
	}

	public function line() {

	
	}
}