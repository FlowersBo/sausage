import * as mClient from 'utils/customClient';

App({
  data: {

  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    if (options.referrerInfo && options.referrerInfo.extraData) {
      console.log(options);
      // this.globalData.backMerchantUrl = options.referrerInfo.extraData.backMerchantUrl;
      wx.redirectTo({
        url: '/pages/bankCard/bankCard'
      });
    }
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    console.log('卸载');
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})