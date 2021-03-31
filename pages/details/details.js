// pages/details/details.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
Page({
  data: {
    goodsId:0,
    shoppingCartGoodsCount: 0,
    goodsDetaillyInfo: {},
    goodsDescriptivePicture: [],
    cartGoodsInfo: {}
  },
  
  onLoad(options) {
    let goodsId = options.goodsId;
    this.setData({
      goodsId: goodsId
    })
    this.renderBuyCar();
    this.renderGoodsInfo();
    this.renderGoodsImages();
  },

renderGoodsInfo:function(){
  let that = this;
  let goodsId = that.data.goodsId;
  let data = {
    goodsid: goodsId,
  };
  mClient.get(api.GoodsDetaillyInfo, data)
  .then(resp => {
    let goodsDetaillyInfo = resp.data.data.detail;
    this.setData({
      goodsDetaillyInfo: goodsDetaillyInfo,
    });
  });
},

renderGoodsImages:function(){
  let that = this;
  let goodsId = that.data.goodsId;
  let data = {
    goodsid: goodsId,
  };
  mClient.get(api.GoodsDescriptivePicture, data)
  .then(resp => {
    let goodsDescriptivePicture = resp.data.data.pics;
    this.setData({
      goodsDescriptivePicture: goodsDescriptivePicture,
    });
  });
},

renderBuyCar: function () {
  let that = this;
  let goodsId = that.data.goodsId;
  mClient.get(api.ShoppingCart)
    .then(resp => {
      let shoppingCartList = resp.data.data.list;
      let shoppingCartGoodsCount = 0;
      
      for (const key in shoppingCartList) {
          const cartGoodsInfo = shoppingCartList[key];
          shoppingCartGoodsCount += cartGoodsInfo.count;
          if(cartGoodsInfo.goodsid == goodsId){
            this.setData({
              cartGoodsInfo: cartGoodsInfo
            })
          }
      }  
      this.setData({
        shoppingCartGoodsCount: shoppingCartGoodsCount
      });
    });
},

bindAddGoodsNum: function () {
  let that = this;
  let goodsId = that.data.goodsId;
  let cartGoodsInfo = that.data.cartGoodsInfo;
  let goodsCount = 1;
  if(cartGoodsInfo.count != undefined){
    goodsCount = cartGoodsInfo.count+1
  }
  let data = {
    goodsid: goodsId,
    count: goodsCount,
  };

  mClient.post(api.AppendShoppingCart, data)
    .then(resp => {
      let result = resp.data.data.result;
      if (result === true) {
        that.renderBuyCar();
      } else {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 1000
        });
      };
    });
},

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})