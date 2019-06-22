// pages/tripContent/tripContent.js
const app = getApp();
const config = require("../../config/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripId: null,
    name: '',
    count: null,
    tripDate: '',
    description: '',
    isOwner: 0,
    currentCount: 0
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
    // console.log('tripContent', 'options', options);
    that.setData({
      tripId: options.tripId
    });

    // 判断是否为行程的拥有者
    that.isOwner();

    that.init();
  },

  isOwner: function() {
    let that = this;

    wx.request({
      url: config.tripContentUrl,
      data: {
        code: 0,
        openid: wx.getStorageSync("userOpenid"),
        tripId: that.data.tripId
      },
      success(res) {
        // console.log('successRes', res);
        if(res.data.code == 0){
          that.setData({
            isOwner: res.data.isOwner
          })
        }
      }
    })
  },

  init: function() {
    let that = this;

    that.getData();

  },

  getData: function () {
    let that = this;

    wx.request({
      url: config.tripContentUrl,
      data: {
        code: 1,
        tripId: that.data.tripId,
        openid: wx.getStorageSync('userOpenid')
      },
      success(res) {
        // console.log('successRes', res);
        if(res.data.code == 0){
          that.setData({
            name: res.data.name,
            count: res.data.count,
            tripDate: res.data.tripDate,
            description: res.data.description
          });
          if(that.data.isOwner == 1){
            that.setData({
              currentCount: res.data.currentCount
            })
          }
        }

      }
    })
  },

  /**
   * 参与行程
   * 跳转 参与行程 页面
   */
  joinTrip: function () {
    let that = this;

    wx.navigateTo({
      url: '../joinTrip/joinTrip?tripId=' + that.data.tripId
    });
  },

  /**
   * 查看行程结果
   * 跳转 行程结果 页面
   */
  getResult: function() {
    let that = this;

    wx.navigateTo({
      url: '../result/result?tripId=' + that.data.tripId
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;

    return {
      title: that.data.name,
      path: 'pages/tripContent/tripContent?tripId=' + that.data.tripId
    }
  }
})