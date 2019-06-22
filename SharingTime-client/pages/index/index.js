const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripButtonText: '+创建行程',
    shareButtonText: '分享小程序',
    demoImageSrc: '../../images/demo.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync("userOpenid")) {
      app.doLogin();
      // console.log('userOpenid', wx.getStorageSync("userOpenid"));
    }
  },

  // 跳转到 创建行程 页面
  toCreateTrip: function () {
    wx.navigateTo({
      url: '../createTrip/createTrip'
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
  onShareAppMessage: function (options) {
    // console.log('options', options);
    return {
      title: '共享时间',
      path: 'pages/index/index',
      imageUrl: '../../images/sharingTime.png'
    }
  }
})