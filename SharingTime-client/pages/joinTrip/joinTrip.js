// pages/joinTrip/joinTrip.js
const app = getApp();
const config = require("../../config/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isJoin: 0,
    tripId: null,
    startTime: [],
    endTime: [],
    arr: [],
    tip: ''
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

    // console.log('options', options);
    that.setData({
      tripId: options.tripId
    });

    // 取消右上角分享功能
    wx.hideShareMenu();

    that.isJoin();

    that.init();
  },

  isJoin: function () {
    let that = this;

    wx.request({
      url: config.joinTripUrl,
      data: {
        code: 1, //获取已参与行程的数据
        openid: wx.getStorageSync('userOpenid'),
        tripId: that.data.tripId
      },
      success(res) {
        // console.log('successRes', res);
        if (res.data.code == 0) {
          that.setData({
            isJoin: 1,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            arr: res.data.arr
          })
        }
      }
    })
  },

  init: function() {
    let that = this;

    if(that.data.isJoin == 0){
      let startTimeT = [];
      let endTimeT = [];
      let arrT = [];

      startTimeT.push('');
      endTimeT.push('');
      arrT.push(0);

      that.setData({
        startTime: startTimeT,
        endTime: endTimeT,
        arr: arrT
      })

    }
  },

  modifyData: function() {
    let that = this;

    that.setData({
      isJoin: 0
    });
  },

  getTime: function(options) {
    let that = this;

    // 获取数据
    let id = options.currentTarget.id;
    let value = options.detail.value;

    // 设置数据
    if(id%2 == 0){
      that.data.startTime[id/2] = value;
    } else {
      that.data.endTime[(id-1)/2] = value;
    }
    that.setData({
      startTime: that.data.startTime,
      endTime: that.data.endTime
    });
    // console.log(that.data);
  },

  addTime: function() {
    let that = this;

    let flag = true;
    for(let i = 0; i < that.data.arr.length && flag; i++) {
      if (that.data.startTime[i] == '' && that.data.endTime[i] == ''){
        flag = false;
        that.setTip('第' + (i + 1) + '组数据未填写.');
      } else if (that.data.startTime[i] == ''){
        flag = false;
        that.setTip('第' + (i + 1) + '组开始时间未填写.');
      } else if (that.data.endTime[i] == '') {
        flag = false;
        that.setTip('第' + (i + 1) + '组结束时间未填写.');
      }
    }

    if(flag && that.data.arr.length >= 10) {
      that.setTip("超过10组数据");
    }

    if(flag) {
      that.data.arr.push(that.data.arr.length);
      that.data.startTime.push('');
      that.data.endTime.push('');
      that.setData({
        arr: that.data.arr,
        startTime: that.data.startTime,
        endTime: that.data.endTime
      });
      that.clearTip();
      // console.log(that.data);
    }
  },

  submit: function() {
    let that = this;

    // 检查数据是否合格
    // 发生请求
    if (that.checkData()) {
      that.clearTip();
      let timeDataT = [];
      for(let i = 0; i < that.data.startTime.length; i++){
        if (i + 1 == that.data.startTime.length && that.data.startTime[i] == '')
          break;
        timeDataT.push(Array(that.data.startTime[i], that.data.endTime[i]));
      }
      // console.log('timeDataT', timeDataT);

      wx.request({
        url: config.joinTripUrl,
        data: {
          code: 0, // code 为 0, 表示参与行程请求
          openid: wx.getStorageSync('userOpenid'),
          tripId: that.data.tripId,
          timeData: timeDataT
        },
        success(res) {
          // console.log('successRes', res);
          if(res.data.code == '0'){
            wx.redirectTo({
              url: '../result/result?tripId=' + that.data.tripId,
            })
          } else {
            app.showInfo('提交失败，请重试');
          }
          
        },
        fail(res) {
          // console.log('failRes', res);
          app.showInfo('提交失败，请重试');
        }
      })
    }

  },

  // 清楚提示
  clearTip: function() {
    this.setData({
      tip: ''
    })
  },

  // 设置提示
  setTip: function(tipT) {
    this.setData({
      tip: tipT
    })
  },

  checkData: function() {
    let that = this;

    // 检查数据是否合格
    let flag = true;

    // 检查是否存在未填数据
    let i = 1;
    if(flag) {
      for (i = 1; i < that.data.arr.length && flag; i++) {
        if (that.data.startTime[i-1] == '' && that.data.endTime[i-1] == '') {
          flag = false;
          that.setTip('第' + i + '组数据未填写.');
        } else if (that.data.startTime[i-1] == '') {
          flag = false;
          that.setTip('第' + i + '组开始时间未填写.');
        } else if (that.data.endTime[i-1] == '') {
          flag = false;
          that.setTip('第' + i + '组结束时间未填写.');
        }
      }
      if (flag && i == 1 && that.data.startTime[i - 1] + that.data.endTime[i - 1] == '') {
        flag = false;
        that.setTip('第' + i + '组数据未填写.');
      }
      if (flag && that.data.startTime[i - 1] + that.data.endTime[i - 1] != '' && (that.data.startTime[i - 1] == '' || that.data.endTime[i - 1] == '') ) {
        flag = false;
        that.setTip('第' + i + '组数据未填写.');
      }
    }
    if (flag && that.data.startTime[i - 1] + that.data.endTime[i - 1] == '') {
      // 获得有效长度
      i = i - 1;
    }

    // 排序
    // 查看是否存在冲突
    if (flag) {
      that.timeSort(i);
      let time = that.data;
      let start = 0, end = 0;
      for (let j = 0; j < i && flag; j++) {
        start = that.timeCalc(time.startTime[j]);
        end = that.timeCalc(time.endTime[j]);
        // console.log(start, end);
        if(start >= end){
          flag = false;
          that.setTip("第" + (j+1) + '组的开始时间晚于结束时间.');
        }
        if (flag && j != 0 && start <= that.timeCalc(time.endTime[j-1])){
          flag = false;
          that.setTip("第" + j + '组与第' + (j+1) + '组数据有重叠部分.');
        }
      }
    }

    return flag;

  },

  timeSort: function(length) {
    // console.log('length', length);
    let that = this;
    let startTimeT = that.data.startTime;
    let endTimeT = that.data.endTime;

    // console.log('startTimeT1', startTimeT);

    let startTimeC = [];
    for(let i = 0; i < length; i++){
      startTimeC.push(that.timeCalc(startTimeT[i]));
    }
    // console.log('startTimeC', startTimeC);
    for(let i = 0; i < length; i++){
      // console.log('i',i);
      let min = i;
      for (let j = i + 1; j < length; j++) {
        if (startTimeC[j] < startTimeC[min]) {
          // console.log('j', j);
          min = j;
        }
      }
      if (i != min) {
        // console.log('min', min);
        let temp = startTimeT[i];
        startTimeT[i] = startTimeT[min];
        startTimeT[min] = temp;
        temp = endTimeT[i];
        endTimeT[i] = endTimeT[min];
        endTimeT[min] = temp;
        temp = startTimeC[i];
        startTimeC[i] = startTimeC[min];
        startTimeC[min] = temp;
        
      }
    }

    // console.log('startTimeT2', startTimeT);

    that.setData({
      startTime: startTimeT,
      endTime: endTimeT
    })
  },

  timeCalc: function(s) {
    if(s == undefined || s == '' || s.length != 5){
      return -1;
    }
    // return s[0]*600 + s[1]*60 + s[3]*10 + s[4];
    return parseInt(s[0]) * 600 + parseInt(s[1]) * 60 + parseInt(s[3]) * 10 + parseInt(s[4]);
  },

})