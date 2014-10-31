<?php

	if(isset($_POST['posts'])){
		
		$posts = json_decode($_POST['posts']);
		
		$posts = json_encode($posts, JSON_PRETTY_PRINT);

		if (is_writable('server/posts.json')){
			
			$handle = fopen('server/posts.json', 'w');

			if (!is_resource($handle)) { // Test if PHP could open the file
			    echo "Could not open file for writting.";
			    exit;
			}
			
			echo $posts;
        	
        	fwrite($handle, $posts); // On ecrit le nouveau contenu
        	fclose($handle);

		}else{
			echo "file isnt writable";
		}

	}else{
		echo "no data";
	}