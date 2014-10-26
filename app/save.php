<?php

	if(isset($_POST['posts'])){
		
		$posts = json_decode($_POST['posts']);

		
		$posts = json_encode($posts, JSON_PRETTY_PRINT);

		echo $posts;
	
		$posts_json = fopen('server/posts.json', 'w+');

        fwrite($posts_json, $posts); // On ecrit le nouveau contenu

        fclose($posts_json);
	}else{
		echo "no data";
	}