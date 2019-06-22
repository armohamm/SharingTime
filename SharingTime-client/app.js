const config = require("./config/config.js");

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    let that = this;

    that.doLogin();
    // console.log('userOpenid', wx.getStorageSync("userOpenid"));
  },

  // 封装登录方法
  doLogin: function () {
    let that = this;
    wx.login({
      success: function(res) {
        // console.log(res);
        if(res.code){
          wx.request({
            url: config.loginUrl,
            data: {
              code: res.code
            },
            success: function(res) {
              // console.log(res);
              if(res.data.code == '0'){
                wx.setStorageSync('userOpenid', res.data.openid);
                // console.log('userOpenid', wx.getStorageSync('userOpenid'));
              } else {
                that.showInfo(res.data.code + res.data.errmsg);
              }
            }
          })
        } else {
          that.showInfo("F102:登录失败");
        }
      },
      fail: function() {
        that.showInfo("F101:登录失败");
      }
    })
  },

  // 封装 wx.showToast 方法
  showInfo: function (info = 'error', icon = 'none') {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

  globalData: {
    userOpenid: null
  }
})
