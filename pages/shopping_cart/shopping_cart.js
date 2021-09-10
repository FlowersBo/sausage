import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartGoodsList: [],
    cartSettlement: {
      goodsSettlement: 0,
      goodsOutOfPocketExpenses: 0,
      economize: 0,
      goodsCount: 0,
      moneyPaid: 0,
    },
    isSelectAllGoods: false,
    cartGoodsPriceTotal: 0,
    cartGoodsEconomizeTotal: 0,
    cartGoodsNumberTotal: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    this.renderCartList();
  },

  renderCartList: function () {
    let that = this;
    let cartInfo = that.data.cartGoodsList;
    mClient.get(api.ShoppingCart)
      .then(resp => {
        let cartGoodsPriceTotal = resp.data.data.realamount;
        let cartGoodsEconomizeTotal = resp.data.data.discount;
        let cartGoodsList = resp.data.data.list;
        let cartGoodsNumberTotal = 0;

        for (const key in cartGoodsList) {
          if (cartGoodsList.hasOwnProperty(key)) {
            cartGoodsList[key].isChecked = false;
            cartGoodsNumberTotal += cartGoodsList[key].count;
          }
        }

        if (cartInfo != {}) {
          for (const key in cartInfo) {
            if (cartInfo.hasOwnProperty(key)) {
              for (let index = 0; index < cartGoodsList.length; index++) {
                if (cartGoodsList[index].goodsid === cartInfo[key].goodsid) {
                  cartGoodsList[index].isChecked = cartInfo[key].isChecked;
                }
              }
            }
          }
        }

        this.setData({
          cartGoodsEconomizeTotal: cartGoodsEconomizeTotal,
          cartGoodsPriceTotal: cartGoodsPriceTotal,
          cartGoodsList: cartGoodsList,
          cartGoodsNumberTotal: cartGoodsNumberTotal,
        });

        this.renderCartGoodsTotal();
      });
  },

  // 改变购物车中指定商品数量
  bindChangeGoodsNum: function (e) {
    let that = this;
    let goodsCount = e.value;
    let cartid = e.target.dataset.id;

    if (goodsCount < 1) {
      wx.showToast({
        title: '输入数量需大于等于1',
        icon: 'none',
        duration: 1000
      });
      return;
    };

    let data = {
      cartid: cartid,
      count: goodsCount,
    };

    mClient.post(api.ModificationShoppingCart, data)
      .then(resp => {
        let result = resp.data.data.result;
        if (result === true) {
          that.renderCartList();
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          });
        };
      });

  },

  // 增加购物车中指定商品数量
  bindAddGoods: function (e) {
    let that = this;
    let cartGoodsList = that.data.cartGoodsList;
    let index = e.currentTarget.dataset.index;
    let cartid = cartGoodsList[index].id;
    let goodsCount = cartGoodsList[index].count;

    let data = {
      cartid: cartid,
      count: goodsCount + 1,
    };

    mClient.post(api.ModificationShoppingCart, data)
      .then(resp => {
        let result = resp.data.data.result;
        if (result === true) {
          that.renderCartList();
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          });
        };
      });
  },

  bindReduceGoods: function (e) {
    let that = this;
    let cartGoodsList = that.data.cartGoodsList;
    let index = e.currentTarget.dataset.index;
    let cartid = cartGoodsList[index].id;
    let goodsCount = cartGoodsList[index].count - 1;

    //如果商品数量为0时将商品移出购物车
    if (goodsCount === 0) {
      let data = {
        cartid: cartid,
      };

      mClient.post(api.RemoveShoppingCart, data)
        .then(resp => {
          let result = resp.data.data.result;
          if (result === true) {
            this.renderCartList();
            wx.showToast({
              title: '移除商品操作成功',
              icon: 'none',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: '移除商品操作失败',
              icon: 'none',
              duration: 1000
            });
          };
        });
      return;
    }
    let data = {
      cartid: cartid,
      count: goodsCount,
    };

    mClient.post(api.ModificationShoppingCart, data)
      .then(resp => {
        let result = resp.data.data.result;
        if (result === true) {
          that.renderCartList();
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          });
        };
      });
  },

  // 移除购物车中选中商品
  bindDeleteGoods: function (e) {
    let that = this;
    let cartGoodsList = that.data.cartGoodsList;
    let index = e.currentTarget.dataset.index;
    let cartid = cartGoodsList[index].id;

    let data = {
      cartid: cartid,
    };

    mClient.post(api.RemoveShoppingCart, data)
      .then(resp => {
        let result = resp.data.data.result;
        if (result === true) {
          that.renderCartList();
        } else {
          wx.showToast({
            title: '移除商品操作失败',
            icon: 'none',
            duration: 1000
          });
        };
      });
  },

  renderCartGoodsTotal: function () {
    let that = this;
    let cartList = that.data.cartGoodsList;
    let cartSettlement = that.data.cartSettlement;
    let goodsCount = 0;
    let goodsSettlement = 0;
    let economizeTotal = 0;
    let SettlementTotal = 0;

    for (const key in cartList) {
      if (cartList.hasOwnProperty(key)) {
        const element = cartList[key];
        const price = element.price;
        const realprice = element.realprice;
        const count = element.count;
        const isChecked = element.isChecked;
        if (count != 0) {
          let goodsPriceTotal = realprice * count;
          let economize = Number((price * count - goodsPriceTotal).toFixed(2));
          console.log('单价', price);
          console.log('数量', count);
          console.log('单商品总金额', goodsPriceTotal);
          console.log('节省金额', economize);
          if (isChecked === true) {
            SettlementTotal += goodsPriceTotal;
            economizeTotal += economize;
            economizeTotal = Number(economizeTotal.toFixed(2));
            goodsCount += count;
            goodsSettlement += price * count;
            console.log('总金额', SettlementTotal);
            console.log('总节省金额', economizeTotal);
            console.log('总数量', goodsCount);
            console.log('商品结算', goodsSettlement);
          }
        };
      }
    }
    cartSettlement.goodsCount = goodsCount;
    cartSettlement.goodsSettlement = goodsSettlement;
    cartSettlement.goodsOutOfPocketExpenses = SettlementTotal;
    cartSettlement.economize = economizeTotal;

    if (cartSettlement.goodsSettlement === 0) {
      cartSettlement.moneyPaid = 0;
    } else {
      cartSettlement.moneyPaid = cartSettlement.goodsOutOfPocketExpenses.toFixed(2);
    }
    console.log(cartSettlement);
    this.setData({
      cartSettlement: cartSettlement,
    });
  },

  /**
   * 用户选择购物车商品
   */
  bindCheckboxChange: function (e) {
    let that = this;
    let cartList = that.data.cartGoodsList;
    let index = e.currentTarget.dataset.index;
    let goods = cartList[index];
    if (goods.isChecked === true) {
      goods.isChecked = false;
      that.setData({
        isSelectAllGoods: false
      })
    } else {
      goods.isChecked = true;
    };
    if (cartList.every(f => f.isChecked)) {
      that.setData({
        isSelectAllGoods: true
      })
    }

    console.log(cartList);
    that.setData({
      cartGoodsList: cartList,
    });

    that.renderCartGoodsTotal();
  },

  /**
   * 用户点击全选
   */
  bindSelectAllGoods: function () {
    let that = this;
    let cartGoodsList = that.data.cartGoodsList;
    let isSelectAll = that.data.isSelectAllGoods;
    let cartSettlement = that.data.cartSettlement;
    let cartGoodsPriceTotal = that.data.cartGoodsPriceTotal;
    let cartGoodsNumberTotal = that.data.cartGoodsNumberTotal;
    let cartGoodsEconomizeTotal = that.data.cartGoodsEconomizeTotal;

    if (isSelectAll === false) {
      isSelectAll = true;
      cartSettlement.goodsOutOfPocketExpenses = cartGoodsPriceTotal;
      cartSettlement.economize = cartGoodsEconomizeTotal;
      cartSettlement.moneyPaid = cartSettlement.goodsOutOfPocketExpenses;
      cartSettlement.goodsCount = cartGoodsNumberTotal;
    } else {
      isSelectAll = false;
      cartSettlement.goodsSettlement = 0;
      cartSettlement.goodsOutOfPocketExpenses = 0;
      cartSettlement.economize = 0;
      cartSettlement.moneyPaid = 0;
      cartSettlement.goodsCount = 0;
    };

    for (const key in cartGoodsList) {
      if (cartGoodsList.hasOwnProperty(key)) {
        cartGoodsList[key].isChecked = isSelectAll;
      }
    }

    this.setData({
      isSelectAllGoods: isSelectAll,
      cartGoodsList: cartGoodsList,
      cartSettlement: cartSettlement,
    });
  },

  //结算
  bindSettlementMoney: function () {
    let that = this;
    let cartSelectedGoodsIds = [];
    let cartList = that.data.cartGoodsList;
    let cartSettlement = that.data.cartSettlement;

    if (cartSettlement.goodsOutOfPocketExpenses == 0) {
      return;
    }

    for (let index = 0; index < cartList.length; index++) {
      if (cartList[index].isChecked === true) {
        cartSelectedGoodsIds.push(cartList[index].id)
      }
    }
    let cartSelectedGoodsIdsJson = JSON.stringify(cartSelectedGoodsIds);
    console.log(cartSelectedGoodsIds)
    wx.navigateTo({
      url: '../confirmation_order/confirmation_order?cartSelectedGoodsIds=' + cartSelectedGoodsIdsJson
    })
  },
})