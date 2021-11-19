import * as mClient from 'utils/customClient';

App({
  data: {

  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    const statusBar = wx.getSystemInfoSync();
    console.log(statusBar);
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.data.navHeight = res.statusBarHeight + 46;
        this.data.height = res.statusBarHeight;
        this.data.boundingClientRect = wx.getMenuButtonBoundingClientRect();
        console.log(this.data.boundingClientRect);
      },
      fail(err) {
        console.log(err);
      }
    })
    this.autoUpdate();
  },

  // 版本更新
  autoUpdate: function () {
    var self = this;
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      console.log(new Date())
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log("请求完新版本信息的回调", new Date())
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log("有新版本", new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {
                      self.autoUpdate()
                      return;
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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