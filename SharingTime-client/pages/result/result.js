// pages/result/result.js

const app = getApp();
const config = require("../../config/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripId: null,
    isJoin: 0,
    name: '',
    count: null,
    currentCount: null,
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options', options);
    let that = this;

    if (!wx.getStorageSync("userOpenid")) {
      app.doLogin();
      // console.log('userOpenid', wx.getStorageSync("userOpenid"));
    }

    that.setData({
      tripId: options.tripId
    });
    
    that.isJoin();

  },

  isJoin: function() {
    let that = this;
    wx.request({
      url: config.resultUrl,
      data: {
        code: 0,
        tripId: that.data.tripId,
        openid: wx.getStorageSync('userOpenid')
      },
      success(res) {
        // console.log('successRes', res);
        if(res.data.code == 0) {
          that.setData({
            isJoin: 1,
            name: res.data.name,
            count: res.data.count,
            currentCount: res.data.currentCount,
            result: res.data.result
          })
        }
      }
    })
  },

  joinTrip: function() {
    let that = this;
    wx.redirectTo({
      url: '../joinTrip/joinTrip?tripId=' + that.data.tripId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;

    return {
      title: that.data.name,
      path: 'pages/result/result?tripId=' + that.data.tripId
    }
  }
})