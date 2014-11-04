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

	if(!empty($_POST['mail']) && !empty($_POST['pwd'])){

		$mail = $_POST['mail'];

		$query = $bdd->query("SELECT * FROM users WHERE mail = '$mail'");

		if($query->rowCount() == 1){   //si la requete renvoi une ligne, l'utilisateur est dans la base

			$response = $query->fetch();

			if($_POST['pwd'] == $response['password']){
			//l'utilisateur s'est connecté avec success
?>
	"statut": "success",
	"id": "<?= $response['id']; ?>",
	"username": "<?= $response['username']; ?>",
	"role": "<?= $response['role']; ?>",
	"avatar": "<?= $response['avatar']; ?>"
<?php
			}else{
?>
	"statut": "error",
	"desc": "pwd error"
<?php
			}
			

		}else{  //
?>
	"statut": "error",
	"desc": "user unknown"
<?php
		}
	}else{
?>
	"statut": "error",
	"desc": "no data"
<?php } ?>
}