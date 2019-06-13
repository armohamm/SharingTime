// pages/createTrip/createTrip.js
const app = getApp();
const config = require("../../config/config.js");
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: '',
    tip: '',
    name: '',
    count: '',
    tripDate: '',
    description: ''
  },

  formSubmit: function (e) {
    // console.log(e);
    
    let that = this;

    // 获取表单数据
    let info = e.detail.value;
    let tipT = '';
    if (info.name == '' || info.count == '' || info.tripDate == '' || info.description == '') {
      tipT = '提示：' + ((info.name == '') ? '名称、' : '') + ((info.count == '') ? '人数、' : '') + ((info.tripDate == '') ? '日期、' : '') + ((info.description == '') ? '描述' : '') + '不能为空';
    }
    if(tipT == '') {
      if(info.name.length > 10) {
        tipT += '提示：行程名称长度不要超过10';
      } else if(isNaN(info.count)){
        tipT += '提示：行程人数不是一个数字';
      } else if (info.count > 20){
        tipT += '提示：行程人数不超过20';
      } else if(info.tripDate.length > 10){
        tipT += '提示：行程日期有误';
      } else if (info.description.length > 120) {
        tipT += '提示：行程描述长度不超过120';
      }
    }
    that.setData({
      tip: tipT
    })
    let flag = true;
    if (tipT == '') {
      wx.request({
        url: config.createTripUrl,
        data: {
          openid: app.globalData.userOpenid,
          name: info.name,
          count: info.count,
          tripDate: info.tripDate,
          description: info.description
        },
        success: function(res) {
          // console.log(res);

          if(res.data.code == '0'){
            wx.redirectTo({
              url: '../shareTrip/shareTrip',
              data: {
                tripId: res.data.tripId,
                tripUserId: res.data.tripUserId,
                name: info.name,
                count: info.count,
                tripDate: info.tripDate,
                description: info.description
              }
            })
          } else {
            that.showInfo(res.data.code + res.data.errmsg);
          }
        },
        fail: function() {
          // flag
        }
      })

    }
  },

  formReset: function (e) {
    console.log(e)
    let that = this;
    that.setData({
      tip: '',
      name: '',
      count: '',
      tripDate: '',
      description: ''
    })
  },

  // 响应行程日期改变事件
  getTripDate: function (e) {
    this.setData({
      tripDate: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    // 获取设置当前时间
    that.setData({
      nowDate: util.formatTimeYMD
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})