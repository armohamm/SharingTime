<?php

require './function.php';

$message = $_GET['message'];
$contact = $_GET['contact'];

if(insertMessage($message, $contact) > 0){
    echo json_encode(array('code' => 0));
}
else {
    echo json_encode(array('code' => 1));
}

?>