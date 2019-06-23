// pages/shareTrip/shareTrip.js
const app = getApp();
const config = require("../../config/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if (!wx.getStorageSync("userOpenid")) {
      app.doLogin();
      // console.log('userOpenid', wx.getStorageSync("userOpenid"));
    }

    // 获取创建行程的数据
    that.setData({
      info: JSON.parse(options.data)
    });
  },

  /**
   * 参与行程
   * 跳转 参与行程 页面
   */
  joinTrip: function () {
    let that = this;

    wx.navigateTo({
      url: '../joinTrip/joinTrip?tripId=' + that.data.info.tripId,
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;

    return {
      title: that.data.info.name,
      path: 'pages/tripContent/tripContent?tripId=' + that.data.info.tripId
    }
  }
})