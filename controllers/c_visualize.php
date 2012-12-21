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
						"/js/users.js",
						"/css/save.css"
	                    );

    		$this->template->client_files = Utils::load_client_files($client_files);

		# Build a query of the users this user is following - we're only interested in their posts
			$saves = NULL;

		if ($this->user) {
			$q = "SELECT save_id, type, title, created, modified, series_array, columnname_array
				FROM saves
				WHERE user_id = (".$this->user->user_id.")";
		
			# Execute our query, storing the results in a variable $connections
				$saves = DB::instance(DB_NAME)->select_rows($q);
		}
		# Pass data to the view
			$this->template->content->saves = $saves;

		# Render the view
			echo $this->template;

	}

	public function bar($save_id = NULL) {

		$this->template->content = View::instance('v_visualize_bar');

		# Now set the <title> tag
			$this->template->title = "Visualize - Bar Chart";
	
		# Now set save_id
			if (!$save_id) {
				$save_id = 0;
			}

			$this->template->content->save_id = $save_id;

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

	public function line($save_id = NULL) {

			$this->template->content = View::instance('v_visualize_line');

		# Now set the <title> tag
			$this->template->title = "Visualize - Line Chart";

		# Now set save_id
			if (!$save_id) {
				$save_id = 0;
			}

			$this->template->content->save_id = $save_id;
	
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
	
		if(!$this->user) {
			Router::redirect("/"); 
		}	
		else {
			# Associate this post with this user
			$_POST['user_id']  = $this->user->user_id;
			
			# Unix timestamp of when this post was created / modified
			$_POST['created']  = Time::now();
			$_POST['modified'] = Time::now();
			
			# Insert
			# Note we didn't have to sanitize any of the $_POST data because we're using the insert method which does it for us
			DB::instance(DB_NAME)->insert('saves', $_POST);
			
			$returnArray = Array("success", 0);
	        echo json_encode($returnArray);           
		}	
	}

	public function load($save_id = NULL) {

		if(!$this->user || !$save_id) {
			Router::redirect("/visualize"); 
		}	
		else {

			# check that save_id belongs to user, if not redirect
			$q = "SELECT user_id
				FROM saves 
				WHERE saves.save_id = (".$save_id.")";

			$save_user_id = DB::instance(DB_NAME)->select_field($q);

			if (!$save_user_id)
				Router::redirect("/visualize"); 
			else
			{
				if ($save_user_id != $this->user->user_id)
					Router::redirect("/visualize"); 	
				else {
					$data = Array();

					# Grab necessary data	
					$q = "SELECT type
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['type'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT series_array
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['series_array'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT columnname_array
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['columnname_array'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT header
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['header'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT title
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['title'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT subtitle
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['subtitle'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT numcol
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['numcol'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT numseries
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['numseries'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT structure
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['structure'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT seriesx_array
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['seriesx_array'] = DB::instance(DB_NAME)->select_field($q);

					$q = "SELECT seriesy_array
						FROM saves WHERE saves.save_id = (".$save_id.")";
					$data['seriesy_array'] = DB::instance(DB_NAME)->select_field($q);

					array_walk_recursive($data, function (&$value, $key) {
					    if ($key == 'header' || $key == 'numcol' || $key == 'numseries' || $key == 'structure') {
					        $value = (int)$value;
					    } 
					    if ($key == 'series_array') {
					        $value = str_replace("[[", "", $value);					    	
					        $value = str_replace("]]", "", $value);	
					        $count = substr_count($value, "],[");
					        $temp = NULL;
					        if ($count > 0) 
					        {
					        	$temp = explode('],[', $value);
						        for ($i = 0; $i < ($count+1); $i++)
						        {
						        	$temp[$i] = array_map('floatval', explode(',', $temp[$i]));
						        }	
					        	$value = $temp;
						    }
						    else {
						    	$value = array( array_map('floatval', explode(',', $value)) );
						    }
					    }
					    if ($key == 'columnname_array') {
					        $value = str_replace("]", "", $value);						    	
					        $value = str_replace("[", "", $value);	
					        $value = explode(",",$value);					    	
					    }
					});
					echo json_encode($data);
				}			
			}
		}
	}
}