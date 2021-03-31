// pages/address/address.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfos: [],
    startX: 0,
    endX: 0,
    startX:0,
    delBtnWidth:160,
    isScroll: false,
    userid:0,

  },

  onLoad: function (options) {
    let userid=options.userid;
    this.setData({
      userid: userid
    })
    this.renderUserInfoList();
  },
  
  onShow: function () {
    this.renderUserInfoList();
  },

  renderUserInfoList: function () {
    let that = this;
    let userid=that.data.userid;
    let data = {
      isdefault: false
    }
    mClient.get(api.userContactInfo, data).then(resp => {
      let userInfos = resp.data.data.list;
      for(var index in userInfos) {
        var userInfo = userInfos[index]
        userInfo.right = 0
        
        if(userInfo.id == userid){
          userInfo.usedStatus = true;
        } else{
          userInfo.usedStatus =false;
        }
      }
      this.setData({
        userInfos: userInfos
      })
    })
  },

//滑动事件
drawStart: function (e) {
    // console.log("drawStart");  
    var touch = e.touches[0]
    let that = this;
    let userInfos = that.data.userInfos;

    for (let index = 0; index < userInfos.length; index++) {
      userInfos[index].right = 0;
    }

    this.setData({
      userInfos: userInfos,
      startX: touch.clientX,
    })
  },

  drawMove: function (e) {
    let that = this;
    let userInfos = that.data.userInfos;
    let delBtnWidth = that.data.delBtnWidth;
    let touch = e.touches[0];
    let itemIndex = e.currentTarget.dataset.index;
    let disX = this.data.startX - touch.clientX;
    if (disX >= 20) {
      if (disX > delBtnWidth) {
        disX = delBtnWidth
      }
      userInfos[itemIndex].right = disX

      this.setData({
        userInfos: userInfos,
        isScroll: false
      })
    } else {
      userInfos[itemIndex].right = 0
      this.setData({
        userInfos: userInfos,
        isScroll: false
      })
    }
  },  

  drawEnd: function (e) {
    let that = this;
    let userInfos = that.data.userInfos;
    let delBtnWidth = that.data.delBtnWidth;
    let itemIndex = e.currentTarget.dataset.index;

    if (userInfos[itemIndex].right >= delBtnWidth/2) {
      userInfos[itemIndex].right = delBtnWidth
      this.setData({
        userInfos: userInfos,
        isScroll: true
      })
    } else {
      userInfos[itemIndex].right = 0
      this.setData({
        userInfos: userInfos,
        isScroll: false
      })
    }
  },

  bindAddNewAddress: function () {
    wx.navigateTo({
      url: '../new_address/new_address?index=0&generic=0',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  bindDeleteAddress: function (e) {
    let addressCode = e.currentTarget.dataset.addresscode;
    let data = {
      contactid: addressCode
    }
    mClient.post(api.UserRemoveContactInfo, data).then(resp=>{
       let result=resp.data.data.result;
       if(result === true){
        wx.showToast({
          title: '删除地址成功',
          icon: 'success',
          duration: 2000
        })
       } else {
        wx.showToast({
          title: '删除地址失败，请稍后再试',
          icon: 'fail',
          duration: 2000
        })
       }
       this.renderUserInfoList();
    })
  },

  bindEditUserInfo: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../new_address/new_address?index=' + index + '&generic=1'
    })
  },
  bindChangeDefalutAddress: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userInfo = that.data.userInfos[index];
    let data = {
      name: userInfo.name,
      contactid: userInfo.id,
      mobile: userInfo.mobile,
      address: userInfo.address,
      isdefault: true
    }

    mClient.post(api.UserUpdateContactInfo, data).then(resp => {
      let result = resp.data.data.result;
      if (result === true) {
        this.renderUserInfoList();
      } else {
        wx.showToast({
          title: '选择地址失败，请稍后再试',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },

  bindSettingTop: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userInfos = that.data.userInfos;

    [userInfos[0], userInfos[index]]=[userInfos[index], userInfos[0]]
    this.setData({
      userInfos: userInfos
    })
  },
  bindSettingUsedInfo: function(e){
    let userid = e.currentTarget.dataset.id;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {userid});
    this.setData({
      userid: userid
    })
    this.renderUserInfoList();
  }
})