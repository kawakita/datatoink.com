<?php

class learn_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	}
	
	public function learn() {

		$this->template->content = View::instance('v_learn');

		# Now set the <title> tag
			$this->template->title = "Learn";
	
		# If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
			$client_files = Array(
						"/css/learn.css", 
						"/css/homepg.css"
	                    );
	    
	    	$this->template->client_files = Utils::load_client_files($client_files);   
	      	
	    	$principles = array("Scale Distortions",
	    						"Size Distortions",
	    						"Chart Junk",
	    						"Negative Space",
	    						"Sorting",
	    						"Proximity",
	    						"Contrast",
	    						"Visual Encodings",
	    						"Color",
	    						"Interactivity"
	    					);

	    	$this->template->content->principles = $principles;

		# Render the view
			echo $this->template;
	}
}