// pages/mine/mine.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
const watch = require('../../utils/util');
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFlag: true,
    goodsCategroy: [],
    shelvesGoodsInfos: [],
    goodsCategroyIndex: 0,
    goodsCategroyId: 0,
    shoppingCartGoodsCount: 0,

    buygoodsCount: '0',
    globalData: {}, // 保存屏幕的宽高
    hide_good_box: true, // 是否隐藏添加购物车时的圆点
    hidden: false,
    page: 1,
    pageSize: 10,
    // isAuthor: false,
    // result: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: app.data.selected
      })
    }
    let goodsCategroy = that.data.goodsCategroy;
    let goodsCategroyIndex = that.data.goodsCategroyIndex;

    if (goodsCategroy.length === 0) {
      return;
    };
    this.renderGoodsList(goodsCategroyIndex);
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

    mClient.get(api.GoodsCategory)
      .then(resp => {
        console.log(resp)
        let goodsCategroy = resp.data.data;
        this.setData({
          goodsCategroy: goodsCategroy,
        });
        this.renderGoodsList(goodsCategroyIndex);
        that.cartNumFn();
      });
  },

  //render goods list
  renderGoodsList: function (index, page = 1) {
    let that = this;
    let {
      categoryId
    } = that.data.goodsCategroy[index];
    if (categoryId) {
      let data = {
        categoryId,
        userId: wx.getStorageSync('userID'),
        page,
        pageSize: that.data.pageSize
      };

      mClient.wxRequest(api.GoodsList, data)
        .then(resp => {
          console.log('商品列表', resp)
          this.setData({
            shelvesGoodsInfos: resp.data.list,
          });
          // this.renderBuyCar();
        });
    }
  },

  cartNumFn() {
    mClient.get(api.CartCount, {
        userId: wx.getStorageSync('userID')
      })
      .then(res => {
        that.setData({
          shoppingCartGoodsCount: res.data.data.count
        })
      })
  },

  bindAppendShoppingCart: function (e) {
    let goodsId = e.target.dataset.id;
    let goodsCount = e.target.dataset.count;
    let shelvesGoodsInfos = that.data.shelvesGoodsInfos;
    if (goodsCount > 1000) {
      return;
    };

    if (goodsCount === undefined) {
      goodsCount = 0;
    };

    let data = {
      userId: wx.getStorageSync('userID'),
      goodsId,
      quantity: goodsCount + 1,
    };

    mClient.wxRequest(api.AddCart, data)
      .then(resp => {
        let result = resp.data;
        if (resp.code == 200) {
          // that.renderBuyCar();
          shelvesGoodsInfos.forEach(element => {
            if (element.id === goodsId) {
              element.cartNum = element.cartNum + 1;
              that.renderBuyCar(1);
            }
          });
          that.setData({
            shelvesGoodsInfos: shelvesGoodsInfos
          })
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
    let goodsCount = e.target.dataset.count;
    let goodsId = e.target.dataset.id;
    let shelvesGoodsInfos = that.data.shelvesGoodsInfos;
    // let cartid = e.target.dataset.cartid;
    // let index = e.target.dataset.index;
    console.log(goodsCount)
    // if (goodsCount === 1) {
    //   let data = {
    //     cartid: cartid,
    //   };

    //   mClient.post(api.RemoveShoppingCart, data)
    //     .then(resp => {
    //       let result = resp.data.data.result;
    //       if (result === true) {
    //         shelvesGoodsInfos[index].goodsCount = 0;

    //         this.setData({
    //           shelvesGoodsInfos: shelvesGoodsInfos,
    //         });
    //         // that.renderBuyCar();
    //         that.cartWwing();
    //       } else {
    //         wx.showToast({
    //           title: '操作失败',
    //           icon: 'none',
    //           duration: 1000
    //         });
    //       };
    //     });

    //   return;
    // };

    if (goodsCount > 0) {
      let data = {
        userId: wx.getStorageSync('userID'),
        goodsId,
        quantity: goodsCount - 1,
      };

      mClient.wxRequest(api.AddCart, data)
        .then(resp => {
          let result = resp.data;
          if (result === "添加成功") {
            // that.renderBuyCar();
            shelvesGoodsInfos.forEach(element => {
              if (element.id === goodsId) {
                element.cartNum = element.cartNum - 1;
                that.renderBuyCar(-1);
              }
            });
            that.setData({
              shelvesGoodsInfos: shelvesGoodsInfos
            })
          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 1000
            });
          };
        });
    }
  },

  renderBuyCar(num) {
    that.setData({
      shoppingCartGoodsCount: that.data.shoppingCartGoodsCount + num
    })
  },

  //look goods detailly
  bindLookGoodsDetailly: function (e) {
    let GoodsId = e.target.dataset.id;
    wx.navigateTo({
      url: '../details/details?goodsId=' + GoodsId
    })
  },
  //渲染购物车
  // renderBuyCar: function () {
  //   let that = this;
  //   let shelvesGoodsInfos = that.data.shelvesGoodsInfos;
  //   mClient.get(api.CartList,{userId:wx.getStorageSync('userID')})
  //     .then(resp => {
  //       let shoppingCartList = resp.data.data.list;
  //       let shoppingCartGoodsCount = 0;

  //       // 新增/初始化 商品列表属性
  //       //防止商品列表中已在购物车中商品数量混乱
  //       for (let index = 0; index < shelvesGoodsInfos.length; index++) {
  //         shelvesGoodsInfos[index].isCart = false;
  //       };

  //       for (const key in shoppingCartList) {
  //         if (shoppingCartList.hasOwnProperty(key)) {
  //           const element = shoppingCartList[key];
  //           shoppingCartGoodsCount += element.count;

  //           for (let index = 0; index < shelvesGoodsInfos.length; index++) {
  //             if (shelvesGoodsInfos[index].id === element.goodsid) {
  //               shelvesGoodsInfos[index].goodsCount = element.count;
  //               shelvesGoodsInfos[index].cartid = element.id;
  //               shelvesGoodsInfos[index].isCart = true;
  //             }
  //           }
  //         }
  //       }

  //       for (let index = 0; index < shelvesGoodsInfos.length; index++) {
  //         if (shelvesGoodsInfos[index].isCart === false) {
  //           shelvesGoodsInfos[index].goodsCount = 0;
  //         }
  //       }

  //       console.log(shoppingCartGoodsCount);
  //       this.setData({
  //         shoppingCartGoodsCount: shoppingCartGoodsCount,
  //         shelvesGoodsInfos: shelvesGoodsInfos,
  //       });
  //     });
  // },

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