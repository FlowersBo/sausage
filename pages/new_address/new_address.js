// pages/new_address/new_address.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';

Page({
  data: {
    userIndex:'',
    opreationGenre: '',
    userInfo: {
      name: '',
      gender: '',
      phoneNumber: '',
      address: '',
      detaillyAddress: '',
      isDefaultAddress: false
    },
    items: [{
        name: '先生',
        checked: true
      },
      {
        name: '女士',
        checked: false
      }
    ],
  },

  onLoad: function(option){
    console.log(option)
    let index=option.index;
    let generic = option.generic;
    this.setData({
      userIndex: index,
      opreationGenre: generic
    })
    if(generic === '1'){
      this.renderUserInfo();
    }
  },

  renderUserInfo: function(){
    let that = this;
    let userInfo = that.data.userInfo;
    let userIndex = that.data.userIndex;
    let data = {
      isdefault: false
    }
    mClient.get(api.userContactInfo,data).then(resp=>{
      let userInfos =resp.data.data.list;
      userInfo.name = userInfos[userIndex].name;
      userInfo.phoneNumber = userInfos[userIndex].mobile;
      userInfo.isDefaultAddress = userInfos[userIndex].isdefault;
      userInfo.address = userInfos[userIndex].address;
      userInfo.id = userInfos[userIndex].id;
      console.log(userInfo)
      this.setData({
        userInfo: userInfo
      })
    })
  },

  bindUserName: function(e) {
    let that = this;
    let userInfo = that.data.userInfo;
    let userName = e.detail.value;
    userInfo.name = userName;

    this.setData({
      userInfo: userInfo
    })
  },

  bindUserPhoneNumber: function(e){
    let that = this;
    let userInfo = that.data.userInfo;
    let phoneNumber = e.detail.value;
    userInfo.phoneNumber = phoneNumber;

    this.setData({
      userInfo: userInfo
    })
  },

  bindDetaillAddress: function(e) {
    let that = this;
    let userInfo = that.data.userInfo;
    let detaillyAddress = e.detail.value;
    userInfo.detaillyAddress = detaillyAddress;

    this.setData({
      userInfo: userInfo
    })
  },

  bindChangeDefalutAddress: function(e) {
    let that = this;
    let userInfo = that.data.userInfo;
    let isDefaultAddress = e.detail.value;
    userInfo.isDefaultAddress = isDefaultAddress;

    this.setData({
      userInfo: userInfo
    })
  },
  
  bindSelectAddress: function () {
    let that = this;
    let userInfo = that.data.userInfo;

    wx.chooseLocation({
      success: function (res) {
        userInfo.address = res.address;
        that.setData({
          userInfo: userInfo
        })
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },

  bindSaveUserInfo: function(){
    let that = this;
    let userInfo = that.data.userInfo;
    let opreationGenre = that.data.opreationGenre;
    let url = '';
    
    let data = {
      name: userInfo.name,
      mobile: userInfo.phoneNumber,
      address: userInfo.address + userInfo.detaillyAddress, 
      isdefault: userInfo.isDefaultAddress
    };
    
    if (opreationGenre==='1') {
      url = api.UserUpdateContactInfo;
      data.contactid = userInfo.id;
    } else {
      url = api.UserAddContactInfo;
    }
    mClient.post(url, data).then(resp=>{
      let result = resp.data.data.result;
      if(result === true){
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 1000
        })
      }
    });
  },
  
  bindCancelSavaUserInfo: function(){
    wx.navigateBack({
      delta: 1
    })
  },
})