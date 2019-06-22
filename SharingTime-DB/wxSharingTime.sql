-- 微信小程序 共享时间 数据库文件

/**
	创建数据库
	数据库名称：wx_SharingTime
	数据库排序规则：utf8_general_ci
 */
CREATE DATABASE IF NOT EXISTS `wx_SharingTime`;

/**
	创建数据库用户
	用户名：wx_SharingTime
	密码：xxxxxx
	将数据库wx_SharingTime授予次用户所有权限
*/
CREATE USER 'wx_SharingTime'@'%' IDENTIFIED WITH mysql_native_password AS '***';GRANT USAGE ON *.* TO 'wx_SharingTime'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;CREATE DATABASE IF NOT EXISTS `wx_SharingTime`;GRANT ALL PRIVILEGES ON `wx\_SharingTime`.* TO 'wx_SharingTime'@'%';

/**
	创建用户表 user
	字段
		openid			varchar(40)		小程序用户唯一标识
*/

/**
	创建行程表 trip
	字段
		tripId			int				行程id 				auto_increment
		name			varchar(20)		行程名称
		count			int 			行程人数
		date 			varchar(10)		行程日期
		description		varchar(300)	行程描述
*/


/**
	创建行程用户匹配表 tripuser
	字段
		tripUserId		int 			唯一标识				auto_increment
		tripId 			int
		openid			varchar(40)
		isOwner			int 			用户是否拥有次行程 	0标识不拥有，1表示拥有
*/


/**
	创建数据表 data
	字段
		dataId			int 			唯一标识				auto_increment
		tripUserId		int
		startTime		varchar(6)
		endTime			varchar(6)
*/


/**
	创建数据库 result
	字段
		tripId 			int
		startTime		varchar(6)
		endTime			varchar(6)
		userCount		int 			用户数量
*/


/**
	创建数据库 message
	字段
		id 				int 			唯一标识				auto_increment
		message			varchar(300)
		contact			varchar(40)
*/


/**

自增sql语句
alter table cc change id id int primary key auto_increment;
 
*/