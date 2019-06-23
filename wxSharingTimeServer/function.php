<?php

require './db.php';

/**
 * 获取配置信息
 */
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

/**
 * 发生HTTP请求
 * 使用 curl 方法
 * get方式
 * 返回 请求响应结果
 */
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

/**
 * 发生HTTP请求
 * 使用 file_get_contents 方法
 * get方式
 * 返回 请求响应结果
 */
function do_get2($url, $params) {
    $url = "{$url}?".http_build_query($params);
    $result = file_get_contents($url);

    return $result;
}

/**
 * 发生HTTP请求
 * 使用 curl 方法
 * post方式
 * 返回 请求响应结果
 */
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

/**
 * 插入用户 openid
 * 无返回值
 */
function insertUser($openid) {
    // 查询是否已经注册
    $sql1 = "select count(openid) from `user` where openid = '{$openid}'";
    $result1 = db_fetch(DB_COLUMN, $sql1);
    if($result1 == 0){
        $sql2 = "insert into `user` values('{$openid}')";
        $result2 = db_exec(DB_AFFECTED, $sql2);
    }
}


/**
 * 插入行程
 * 返回行程id tripId
 */
function insertTrip($name, $count, $date, $description) {
    $sql = "insert into `trip` values(null, '{$name}', {$count}, '{$date}', '{$description}') ";
    $result = db_exec(DB_AFFECTED, $sql);
    $sql = "select max(tripId) from `trip` ";
    return db_fetch(DB_COLUMN, $sql);
}

/**
 * 插入tripUser
 * 返回 tripUserId
 */

 function insertTripuser($tripId, $openid, $isOwner = 0) {
    $sql = "insert into `tripuser` values(null, {$tripId}, '{$openid}', {$isOwner}) ";
    $result = db_exec(DB_AFFECTED, $sql);
    $sql = "select max(tripUserId) from `tripuser` ";
    return db_fetch(DB_COLUMN, $sql);
}

/**
 * 插入行程data
 * 返回 插入数据的行数，即受影响行数
 */
function insertData($tripUserId, $data) {
    // 批处理
    $sql = "insert into `data` values(null, {$tripUserId}, ?, ?) ";
    $result = db_exec(DB_AFFECTED, $sql, 'ss', $data);
    return $result;
}

/**
 * 删除行程数据
 * 返回受影响行数
 */
function deleteData($tripUserId) {
    $sql = "delete from `data` where tripUserId = {$tripUserId} ";
    $result = db_exec(DB_AFFECTED, $sql);
    return $result;
}

/**
 * 插入行程结果data
 * @param $tripId 行程id
 * @param $data 插入数据
 * @return 插入数据的行数，即受影响行数
 */
function insertResultData($tripId, $data) {
    $sql = "insert into `result` values({$tripId}, ?, ?, ?) ";
    $result = db_exec(DB_AFFECTED, $sql, 'ssi', $data);
    return $result;
}

/**
 * 删除行程结果数据
 */
function deleteResultData($tripId) {
    $sql = "delete from `result` where tripId = {$tripId} ";
    $result = db_exec(DB_AFFECTED, $sql);
    return $result;
}

/**
 * 获取用户行程数据
 */
function getData($tripUserId) {
    $sql = "select startTime, endTime from `data` where tripUserId = '{$tripUserId}' ";

    $result = db_fetch(DB_ALL, $sql);

    return $result;
}

/**
 * 查询是否存在相应的tripUserId
 * 不存在则进行创建
 * 返回 相应的 tripUserId
 */
function getTripUserId($openid, $tripId){
    // 查询是否存在
    $sql = "select tripUserId from `tripuser` where openid = '{$openid}' and tripId = {$tripId} ";
    $tripUserId = db_fetch(DB_COLUMN, $sql);
    if($tripUserId == false) {
        $tripUserId = insertTripuser($tripId, $openid);
    }
    return $tripUserId;
}

function getTrip($tripId) {
    $sql = "select name, count, date, description from `trip` where tripId = {$tripId}";

    return db_fetch(DB_ROW, $sql);
}

/**
 * 获取行程数据
 * tripId一定会获取的
 * 当$name, $count, $date, $description的值为1时，则获得此数据
 * $data = 0 表示获取此用户参与的行程
 * $data = 1 表示获取此用户创建的行程
 * $data = 2 表示获得此用户的全部行程
 * 返回结果集
 */
function getTrips($openid, $name = 0, $count = 0,  $date = 0, $description = 0, $data = 2) {
    
    // 创建相应的sql语句
    $sql = "select tripId";
    if($name == 1)
        $sql .= ", name";
    if($count == 1)
        $sql .= ", count";
    if($date == 1)
        $sql .= ", date";
    if($description == 1)
        $sql .= ", description";
    
    $sql .= " from `trip` where tripId in ( select tripId from `tripuser` where openid = '{$openid}' ";

    if($data == 0)
        $sql .= " and isOwner = 0";
    else if($data == 1)
        $sql .= " and isOwner = 1";

    $sql .= " )";

    // 向数据进行查询
    $result = db_fetch(DB_ALL, $sql);

    return $result;

}

/**
 * 获取已经参与行程的人数
 */
function getCurrentCount($tripId) {

    $sql = "select count(distinct(tripUserId)) from `data` where tripUserId in (select tripUserId from `tripuser` where tripId = '{$tripId}') ";

    $result = db_fetch(DB_COLUMN, $sql);

    return $result;
}

/**
 * 获取isOwner值
 * @param int $tripId 行程id
 * @param string $openid 用户id
 * @return int 0表示不拥有，1表示拥有
 */
function getIsOwner($tripId, $openid) {
    $sql = "select isOwner from `tripuser` where openid = '{$openid}' and tripId = {$tripId} ";

    $result = db_fetch(DB_COLUMN, $sql);

    if($result == 1) {
        return 1;
    }
    return 0;
}

/**
 * 获取行程数据
 * @param $tripId 行程id
 * @return 结果集
 */
function getTripData($tripId) {
    $sql = "select startTime, endTime from `data` where tripUserId in (select tripUserId from `tripuser` where tripId = {$tripId}) ";
    $result = db_fetch(DB_ALL, $sql);
    return $result;
}

/**
 * 获取结果数据
 * @param $tripId 行程id
 * @return 结果集
 */
function getResult($tripId) {
    $sql = "select startTime, endTime, userCount from `result` where tripId = {$tripId} ";
    return db_fetch(DB_ALL, $sql);
}

/**
 * 时间time转换为数字num
 */
function timeToNum($time) {
    // return intval($time[0])*600 + intval($time[1])*60 + intval($time[3])*10 + intval($time[4]);
    return (int)($time[0])*600 + (int)($time[1])*60 + (int)($time[3])*10 + (int)($time[4]);
}

/**
 * 数字num转为时间time
 */
function numToTime($num) {
    $time = "";
    $time .= (string)(($num - $num%600) / 600);
    $time .= (string)(($num%600 - $num%60) / 60);
    $time .= ":";
    $time .= (string)(($num%60 - $num%10) / 10);
    $time .= (string)($num % 10);
    return $time;
}

/**
 * 进行时间num排序，选择排序
 * @param $dataNum 时间num数据
 */
function timeNumSort($dataNum) {
    $data = $dataNum;
    for($i = 0; $i < count($data); $i ++) {
        $min = $i;
        for($j = $i + 1; $j < count($data); $j ++){
            if(($data[$min][0] > $data[$j][0]) || ($data[$min][0] == $data[$j][0] && $data[$min][1] > $data[$j][1])) {
                $min = $j;
            }
        }
        if($min != $i) {
            $temp = $data[$min];
            $data[$min] = $data[$i];
            $data[$i] = $temp;
        }
    }
    return $data;
}

/**
 * 获取时间的端点
 */
function getTimePort($dataNum) {
    $datatemp = array();
    foreach($dataNum as &$time) {
        $datatemp[] = $time[0];
        $datatemp[] = $time[1];
    }
    sort($datatemp);
    $dataPort = array($datatemp[0]);
    for($i = 1; $i < count($datatemp); $i ++) {
        if($datatemp[$i] != $datatemp[$i - 1]) {
            $dataPort[] = $datatemp[$i];
        }
    }
    return $dataPort;
}


/**
 * 计算行程结果
 * @param $tripId 行程id
 */
function doTripResult($tripId) {
    // 获取行程数据
    $tripData = getTripData($tripId);
    // time转换为num
    $dataNum = array();
    foreach($tripData as &$time) {
        $dataNum[] = array(timeToNum($time['startTime']), timeToNum($time['endTime']));
    }

    // 进行时间排序
    // $dataNum = timeNumSort($dataNum);

    // 获取时间端点
    $dataPort = getTimePort($dataNum);

    $result = array();  // startTime, endTime, count
    // 进行行程结果计算
    for($i = 1; $i < count($dataPort); $i ++) {
        $startTime = $dataPort[$i - 1]; // 时间段 开始时间端
        $endTime = $dataPort[$i]; // 时间段 结束时间端
        $userCount = 0; // 此时间段的用户数
        foreach($dataNum as &$time) {
            if($time[0] <= $startTime && $time[1] >= $endTime)
                $userCount ++;
        }
        if($userCount != 0)
            $result[] = array(numToTime($startTime), numToTime($endTime), $userCount);
    }

    deleteResultData($tripId);
    insertResultData($tripId, $result);
}

/**
 * 插入message
 */
function insertMessage($message, $contact) {
    $sql = "insert into `message` values(null, '{$message}', '{$contact}') ";
    return db_exec(DB_AFFECTED, $sql);
}

?>