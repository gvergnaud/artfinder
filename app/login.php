<?php

	header('Access-Control-Allow-Origin: *');  

	try
	{
<<<<<<< HEAD
		//$bdd = new PDO('mysql:host=db405508102.db.1and1.com;dbname=db405508102', 'dbo405508102','Dbnight');
		$bdd = new PDO('mysql:host=localhost;dbname=artfinder', 'root', '');
=======
		$bdd = new PDO('mysql:host=db405508102.db.1and1.com;dbname=db405508102', 'dbo405508102','Dbnight');
		//$bdd = new PDO('mysql:host=localhost;dbname=artfinder', 'root', 'root');
>>>>>>> c5d7ca90b2b802bcf16f2a5b2bb633b36e6feb5e
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

		$query = $bdd->query("SELECT * FROM artfinder_users WHERE mail = '$mail'");

		if($query->rowCount() == 1){   //si la requete renvoi une ligne, l'utilisateur est dans la base

			$response = $query->fetch();

			if(md5($_POST['pwd']) == $response['password']){
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