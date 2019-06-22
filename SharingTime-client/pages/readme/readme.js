// pages/readme/readme.js
const app = getApp();
const config = require("../../config/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip: '',
    message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit: function(options) {
    // console.log('options', options);
    let that = this;
    
    let value = options.detail.value;
    if(value.message != '') {
      if(that.data.message == value.message)
        that.setTip("重复提交.");
      else if(value.message.length > 280)
        that.setTip("留言字数太长.");
      else if(value.contact == '')
        that.setTip("联系方式为空.");
      else {
        wx.request({
          url: config.messageUrl,
          data: {
            message: value.message,
            contact: value.contact
          },
          success(res) {
            if(res.data.code == 0) {
              that.setTip("提交成功");
              that.setData({
                message: value.message
              })
            } else {
              that.setTip("提交失败");
            }
          }
        })
      }
    }
  },

  clearTip: function() {
    this.setData({
      tip: ''
    })
  },

  setTip: function(tipT) {
    this.setData({
      tip: tipT
    })
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