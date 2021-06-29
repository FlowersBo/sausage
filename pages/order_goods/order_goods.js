// pages/mine/mine.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
const watch = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsCategroy: [],
    shelvesGoodsInfos: [],
    goodsCategroyIndex: 0,
    goodsCategroyId: 0,
    shoppingCartGoodsCount: 0,

    buygoodsCount: '0',
    globalData: {}, // 保存屏幕的宽高
    hide_good_box: true, // 是否隐藏添加购物车时的圆点
    hidden: false,
    // isAuthor: false,
    // result: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderGoodsCategroy();
    watch.setWatcher(this);
    // this.setData({
    //   isAuthor:true,
    //   result: 2
    // })
  },

  cartWwing: function () {
    var animation = wx.createAnimation({
      duration: 100, //动画持续时间
      timingFunction: 'ease-in', //动画以低速开始
    })
    animation.translateX(6).rotate(21).step()
    animation.translateX(-6).rotate(-21).step()
    animation.translateX(0).rotate(0).step()
    this.setData({
      ani: animation.export()
    })
  },

  //监听data里的数据
  watch: {
    isAuthor: function (newValue, oldValue) {
      console.log(newValue, oldValue, '查看data里数据的变化');
    },
    result: function (newValue, oldValue) {
      console.log(newValue, oldValue, '查看data里数据的变化');
    },
  },

  onShow: function () {
    let that = this;
    let goodsCategroy = that.data.goodsCategroy;
    let goodsCategroyIndex = that.data.goodsCategroyIndex;

    if (goodsCategroy.length === 0) {
      return;
    };
    this.renderGoodsList(goodsCategroyIndex);
  },

  bindAppendShoppingCart: function (e) {
    let that = this;
    let goodsId = e.target.dataset.id;
    let goodsCount = e.target.dataset.count;

    if (goodsCount > 1000) {
      return;
    };

    if (goodsCount === undefined) {
      goodsCount = 0;
    };

    let data = {
      goodsid: goodsId,
      count: goodsCount + 1,
    };

    mClient.post(api.AppendShoppingCart, data)
      .then(resp => {
        let result = resp.data.data.result;
        if (result === true) {
          that.renderBuyCar();
          that.cartWwing();
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 1000
          });
        };
      });
  },

  bindDecreaseShoppingCart: function (e) {
    let that = this;
    let goodsCount = e.target.dataset.count;
    let cartid = e.target.dataset.cartid;
    let index = e.target.dataset.index;
    let shelvesGoodsInfos = that.data.shelvesGoodsInfos;

    if (goodsCount < 1) {
      return;
    }

    if (goodsCount === 1) {
      let data = {
        cartid: cartid,
      };

      mClient.post(api.RemoveShoppingCart, data)
        .then(resp => {
          let result = resp.data.data.result;
          if (result === true) {
            shelvesGoodsInfos[index].goodsCount = 0;

            this.setData({
              shelvesGoodsInfos: shelvesGoodsInfos,
            });
            that.renderBuyCar();
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none',
              duration: 1000
            });
          };
        });

      return;
    };

    let data = {
      cartid: cartid,
      count: goodsCount - 1,
    };

    mClient.post(api.ModificationShoppingCart, data)
      .then(resp => {
        let result = resp.data.data.result;
        if (result === true) {
          that.renderBuyCar();;
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          });
        };
      });
  },

  //select goods cattegroy
  bindSelectGoodsCategroy: function (e) {
    let index = parseInt(e.target.dataset.index);

    this.renderGoodsList(index);
    this.setData({
      goodsCategroyIndex: index
    })
  },

  //render goods categroy
  renderGoodsCategroy: function () {
    let that = this;
    let goodsCategroyIndex = that.data.goodsCategroyIndex;

    mClient.get(api.GoodsCategroy)
      .then(resp => {
        let goodsCategroy = resp.data.data.list;
        this.setData({
          goodsCategroy: goodsCategroy,
        });
        this.renderGoodsList(goodsCategroyIndex);
      });
  },

  //render goods list
  renderGoodsList: function (index) {
    let that = this;
    let categroy = that.data.goodsCategroy[index];
    let data = {
      goodstypeid: categroy.id,
      name: '',
    };

    mClient.get(api.ShelvesGoodsInfo, data)
      .then(resp => {
        let shelvesGoodsInfos = resp.data.data.list;

        this.setData({
          shelvesGoodsInfos: shelvesGoodsInfos,
        });
        this.renderBuyCar();
      });
  },

  //look goods detailly
  bindLookGoodsDetailly: function (e) {
    let GoodsId = e.target.dataset.id;
    wx.navigateTo({
      url: '../details/details?goodsId=' + GoodsId
    })
  },

  //渲染购物车
  renderBuyCar: function () {
    let that = this;
    let shelvesGoodsInfos = that.data.shelvesGoodsInfos;

    mClient.get(api.ShoppingCart)
      .then(resp => {
        let shoppingCartList = resp.data.data.list;
        let shoppingCartGoodsCount = 0;

        // 新增/初始化 商品列表属性
        //防止商品列表中已在购物车中商品数量混乱
        for (let index = 0; index < shelvesGoodsInfos.length; index++) {
          shelvesGoodsInfos[index].isCart = false;
        };

        for (const key in shoppingCartList) {
          if (shoppingCartList.hasOwnProperty(key)) {
            const element = shoppingCartList[key];
            shoppingCartGoodsCount += element.count;

            for (let index = 0; index < shelvesGoodsInfos.length; index++) {
              if (shelvesGoodsInfos[index].id === element.goodsid) {
                shelvesGoodsInfos[index].goodsCount = element.count;
                shelvesGoodsInfos[index].cartid = element.id;
                shelvesGoodsInfos[index].isCart = true;
              }
            }
          }
        }

        for (let index = 0; index < shelvesGoodsInfos.length; index++) {
          if (shelvesGoodsInfos[index].isCart === false) {
            shelvesGoodsInfos[index].goodsCount = 0;
          }
        }

        console.log(shoppingCartGoodsCount);
        this.setData({
          shoppingCartGoodsCount: shoppingCartGoodsCount,
          shelvesGoodsInfos: shelvesGoodsInfos,
        });
      });
  },

  bindLookBuyCar: function () {
    wx.navigateTo({
      url: '../shopping_cart/shopping_cart'
    })
  },

  onPullDownRefresh: function () {
    console.log('显示');
    this.setData({
      hidden: !this.data.hidden
    });
    wx.stopPullDownRefresh();
  }
})