<?php

// https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
// https://api.weixin.qq.com/sns/jscode2session?appid=wxee1b983eff18cad1&secret=3fe93c1551957fffebe6dae233d1c281&js_code=JSCODE&grant_type=authorization_code

return [
    'login' => [
        'APPID' => 'wxee1b983eff18cad1',
        'APPSECRET' => '3fe93c1551957fffebe6dae233d1c281',
        'url' => 'https://api.weixin.qq.com/sns/jscode2session',
        'grant_type' => 'authorization_code',
    ],
    
    'DB_CONNECT' => [
        'host' => 'localhost',
        'user' => 'wx_SharingTime',
        'psd' => 'gui!wxsharingtime2',
        'dename' => 'wx_SharingTime',
        'port' => '3306',
    ],
    'DB_CHARSET' => 'utf8',
]

?>