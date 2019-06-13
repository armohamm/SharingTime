<?php
// https://www.atotoro.com/wxSharingTimeServer/login.php?code=
require './function.php';

$code = $_GET['code'];
$login = C('login');

$params = array('appid' => $login['APPID'], 'secret' => $login['APPSECRET'], 'js_code' => $code, 'grant_type' => $login['grant_type']);
$result = do_get2($login['url'], $params);

$result = json_decode($result, true);

if(isset($result['openid'])) {

    // 查询用户，进行注册
    register($result['openid']);

    echo json_encode(array('code' => '0', 'openid' => $result['openid']));
} else {
    E('B203', '未查询到openid.');
}

?>