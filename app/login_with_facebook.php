<?php

	header('Access-Control-Allow-Origin: *');  

	try
	{
		$bdd = new PDO('mysql:host=db405508102.db.1and1.com;dbname=db405508102', 'dbo405508102','Dbnight');
		//$bdd = new PDO('mysql:host=localhost;dbname=artfinder', 'root', 'root');
	}
	catch (Exception $e)
	{
	        die('Erreur : ' . $e->getMessage());
	}
?>
{
<?php

	if(!empty($_POST['mail']) && !empty($_POST['facebook_id']) && !empty($_POST['username'])){

		$mail = $_POST['mail'];
		$facebook_id = $_POST['facebook_id'];
		$username = $_POST['username'];
		$avatar = $_POST['avatar'];

		$query = $bdd->query("SELECT * FROM artfinder_users WHERE facebook_id = '$facebook_id'");

		if($query->rowCount() == 1){   //si la requete renvoi une ligne, l'utilisateur est dans la base

			$response = $query->fetch();

			
			//l'utilisateur s'est connecté avec success
?>
	"statut": "success",
	"id": "<?= $response['id']; ?>",
	"username": "<?= $response['username']; ?>",
	"role": "<?= $response['role']; ?>",
	"avatar": "<?= $response['avatar']; ?>"
<?php			

		}else{ 
			$query->closeCursor();
			$query = $bdd->prepare('INSERT INTO artfinder_users(username, mail, facebook_id, avatar) VALUES(:username, :mail, :facebook_id, :avatar)');
			$query->execute(array(
				'username' => $username,
				'mail' => $mail,
				'facebook_id' => $facebook_id,
				'avatar' => $avatar
			));
			$query->closeCursor();
			//recuperer l'id du nouvel user dans $userId
			$userId = $bdd->lastInsertId();

			$query = $bdd->query("SELECT * FROM artfinder_users WHERE id = '$userId'");


			$response = $query->fetch();
			//l'utilisateur s'est connecté avec success
?>
	"statut": "success",
	"id": "<?= $response['id']; ?>",
	"username": "<?= $response['username']; ?>",
	"role": "<?= $response['role']; ?>",
	"avatar": "<?= $response['avatar']; ?>"
	
<?php
			$query->closeCursor();
		} //end else

	}else{
?>
	"statut": "error",
	"desc": "no data"
<?php } ?>
}