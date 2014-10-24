<?php
	try
	{
		//$bdd = new PDO('mysql:host=db405508102.db.1and1.com;dbname=db405508102', 'dbo405508102','Dbnight');
		$bdd = new PDO('mysql:host=localhost;dbname=artfinder', 'root', '');
	}
	catch (Exception $e)
	{
	        die('Erreur : ' . $e->getMessage());
	}
?>
{
<?php

	if(!empty($_POST['mail']) && !empty($_POST['pwd']) && !empty($_POST['username'])){

		$mail = trim($_POST['mail']);
		$pwd = trim($_POST['pwd']);
		$username = trim($_POST['username']);

		$query = $bdd->query("SELECT * FROM users WHERE mail = '$mail'");
		if($query->rowCount() == 1){ 
?>
	"statut": "error",
	"desc": "email taken"
<?php 
			$query->closeCursor();
		}else{
			$query->closeCursor();
			$query = $bdd->query("SELECT * FROM users WHERE username = '$username'");
			if($query->rowCount() == 1){
?>
	"statut": "error",
	"desc": "username taken"
<?php 
				$query->closeCursor();
			}else{
				$query->closeCursor();
				$query = $bdd->prepare('INSERT INTO users(username, password, mail) VALUES(:username, :password, :mail)');
				$query->execute(array(
					'username' => $username,
					'password' => $pwd,
					'mail' => $mail
				));
				$query->closeCursor();
				//recuperer l'id du nouvel user dans $userId
				$userId = $bdd->lastInsertId();

				$query = $bdd->query("SELECT * FROM users WHERE id = '$userId'");


				$response = $query->fetch();
				//l'utilisateur s'est connecté avec success
?>
	"statut": "success",
	"id": "<?= $response['id']; ?>",
	"username": "<?= $response['username']; ?>",
	"role": "<?= $response['role']; ?>"
	
<?php
			}

		}

	}else{
?>
	"statut": "error",
	"desc": "no data"
<?php 
	} 
	$query->closeCursor();
?>
}

		