<?php
$data = file_get_contents('php://input');
$data = jsondecode($data, true);
//var_dump($data);

$message = 'Name: '.$data['name']."\n";
$message .= 'Phone: '.$data['phone']."\n";
$message .= '>>>>>>>>>>>>>>>>>>>>>'."\n";
foreach ($data['cart'] as $key => $value){
    $message .= 'id: '.$key."\n";
    $message .=' count: '.$value."\n";
    $message .='--------------------';
}

$mail = mail($data['email'], 'GoogleShop', $message);
if ($mail){
    echo 'yes';
}
else{
   echo 'no';
}
?>