<?php

header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Headers: Cache-Control, X-Requested-With, Access-Control-Allow-Headers');

$ds          = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = 'images' . $ds . 'uploads';   //2
 
if (!empty($_FILES)) {

	$infosfichier = pathinfo($_FILES['file']['name']);
	$extension_upload = $infosfichier['extension'];
	$extensions_autorisees = array('jpg', 'jpeg', 'png');

	if (in_array($extension_upload, $extensions_autorisees)){

	    $tempFile = $_FILES['file']['tmp_name'];          //3             
	      
	    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4

	    $fileNewName = time() . $_FILES['file']['name'];
	     
	    $targetFile =  $targetPath . $fileNewName;  //5
	 	
	 	echo $fileNewName;

	    move_uploaded_file($tempFile,$targetFile); //6
	}else{
        echo "not an image";
    }
     
} else {
  echo "nofiles";
}
?>
