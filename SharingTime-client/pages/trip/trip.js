// pages/trip/trip.js

const app = getApp();
const config = require("../../config/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ['创建的行程', '参与的行程'],
    currentShow: 0,
    trip: []
  },

  // 响应导航栏点击事件
  activeNav(e) {
    // console.log(e.target.dataset.index);
    this.setData({
      currentShow: e.target.dataset.index
    })
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
    let userOpenid = wx.getStorageSync("userOpenid");

    //向服务端获取用户行程数据
    wx.request({
      url: config.tripUrl,
      data: {
        openid: userOpenid
      },
      success(res) {
        // console.log('successRes', res);
        that.setData({
          trip: res.data
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '共享时间',
      path: 'pages/index/index',
      imageUrl: '../../images/sharingTime.png'
    }
  }
})