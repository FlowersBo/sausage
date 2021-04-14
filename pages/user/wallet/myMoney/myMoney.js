// pages/user/wallet/myMoney/myMoney.js
import * as api from '../../../../config/api';
import * as util from '../../../../utils/util';
import * as mClient from '../../../../utils/customClient';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadText: '点击加载',
    pageIndex: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let nowtime = new Date();
    if (options.time) {
      let startTime = options.time;
      that.setData({
        startDate: startTime,
      });
    }
    nowtime.setDate(nowtime.getDate())
    let endTime = util.customFormatTime(nowtime);

    that.setData({
      endDate: endTime,
    });
    let startPosition = that.data.pageIndex,
      queryNum = that.data.pageSize;
    that.incomeDetailFn(startPosition, queryNum);
  },

  incomeDetailFn: (startPosition, queryNum) => {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
      dateStart: that.data.startDate,
      dateEnd: that.data.endDate,
      startPosition,
      queryNum
    };
    mClient.PostIncludeData(api.InExpDetail, data)
      .then(resp => {
        console.log('收支详情', resp);
        if (resp.data.success) {
          let incomeDetail = resp.data.data.inExpDetail;
          console.log(incomeDetail)
          that.setData({
            incomeDetail: incomeDetail,
            totalNum: resp.data.data.totalNum,
            pageIndex: that.data.pageIndex + 1
          })
        } else {
          wx.showToast({
            title: resp.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(rej => {
        console.log('错误', rej)
      })
  },

  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
      loadText: '点击加载',
    })
    let pageIndex = 1;
    that.incomeDetailFn(pageIndex, that.data.pageSize);
  },

  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value,
      loadText: '点击加载',
    })
    let pageIndex = 1;
    that.incomeDetailFn(pageIndex, that.data.pageSize);
  },




  // 加载更多
  bindLoading: function () {
    console.log('加载');
    let pageIndex = that.data.pageIndex,
      pageSize = that.data.pageSize,
      totalNum = that.data.totalNum;
    if ((totalNum / pageSize) < pageIndex) {
      this.setData({
        loadText: '已经到底了',
      })
      return
    }

    if (((pageIndex * pageSize) - totalNum) > pageSize) {
      this.setData({
        loadText: '已经到底了',
      })
      return;
    };

    this.incomeDetailFn(pageIndex, that.data.pageSize);
    this.setData({
      pageIndex: pageIndex + 1,
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