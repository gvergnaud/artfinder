<?php
	

	header('Access-Control-Allow-Origin: *');  



			$handle = fopen('server/posts.json', 'r');

			if (!is_resource($handle)) { // Test if PHP could open the file
			    echo "Could not open file";
			    exit;
			}else{

				$posts = fread($handle, filesize('server/posts.json'));
				echo $posts;
	        	fclose($handle);

			}
			

