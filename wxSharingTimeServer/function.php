<?php

require './db.php';

function C($name) {
    static $config = null;
    if(!$config) {
        $config = require './config.php';
    }
    return isset($config[$name]) ? $config[$name] : '';
}

//遇到致命错误，输出错误信息并停止运行
function E($code, $msg = ''){
    echo json_encode(array('code' => $code, 'errmsg' => $msg));
	exit();
}

function do_get($url, $params) {
    $url = "{$url}?".http_build_query($params);
    // $result = file_get_contents($url);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // https请求 不验证证书和hosts
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

function do_get2($url, $params) {
    $url = "{$url}?".http_build_query($params);
    $result = file_get_contents($url);

    return $result;
}

function do_post($url, $params, $headers) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

function insertUser($openid) {
    // 查询是否已经注册
    $sql1 = "select count(openid) from `user` where openid = '{$openid}'";
    $result1 = db_fetch(DB_COLUMN, $sql1);
    if($result1 == 0){
        $sql2 = "insert into `user` values('{$openid}')";
        $result2 = db_exec(DB_AFFECTED, $sql2);
    }
}


function insertTrip($name, $count, $date, $description) {
    $sql = "insert into `trip` values(null, '{$name}', {$count}, '{$date}', '{$description}') ";
    $result = db_exec(DB_AFFECTED, $sql);
    $sql = "select max(tripId) from `trip` ";
    return db_fetch(DB_COLUMN, $sql);
}

function insertTripuser($tripId, $openid, $isOwner = 0) {
    $sql = "insert into `tripuser` values(null, {$tripId}, '{$openid}', $isOwner) ";
    $result = db_exec(DB_AFFECTED, $sql);
    $sql = "select max(tripUserId) from `tripuser` ";
    return db_fetch(DB_COLUMN, $sql);
}

function insertData($tripUserId, $data) {
    // 批处理
    $sql = "insert into `data` values(null, {$tripUserId}, ?, ?) ";
    $result = db_exec(DB_AFFECTED, $sql, 'ss', $data);
    return $result;
}

function register($openid) {
    insertUser($openid);
}

function createTrip($openid, $name, $count, $date, $description) {
    // 插入数据，获取tripId
    $tripId = insertTrip($name, $count, $date, $description);

    // 给创建者匹配行程
    $tripUserId = insertTripuser($tripId, $openid, 1);

    return json_encode(array('code' => '0', 'tripId' => $tripId, 'tripUserId' => $tripUserId));
}

?>