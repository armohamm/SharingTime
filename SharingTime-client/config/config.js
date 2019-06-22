// 服务器域名
const baseUrl = 'http://localhost/wxSharingTimeServer/';


// 登录接口
const loginUrl = baseUrl + 'login.php';
const createTripUrl = baseUrl + 'createTrip.php';
const joinTripUrl = baseUrl + 'joinTrip.php';
const tripUrl = baseUrl + 'trip.php';
const tripContentUrl = baseUrl + 'tripContent.php';
const resultUrl = baseUrl + 'result.php';
const messageUrl = baseUrl + 'message.php';

module.exports = {
  loginUrl: loginUrl,
  createTripUrl: createTripUrl,
  joinTripUrl: joinTripUrl,
  tripUrl: tripUrl,
  tripContentUrl: tripContentUrl,
  resultUrl: resultUrl,
  messageUrl: messageUrl
};
