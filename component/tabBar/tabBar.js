// component/tabBar/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    childSelected: app.globalData.childSelected,
    list: [{
        pagePath: "/pages/childDetail/childIndex/childIndex",
        text: "报表",
        iconPath: "/assets/tabbar/baobiao.png",
        selectedIconPath: "/assets/tabbar/baobiao-h.png"
      },
      {
        pagePath: "/pages/childDetail/childOrderList/childOrderList",
        text: "订单",
        iconPath: "/assets/tabbar/order.png",
        selectedIconPath: "/assets/tabbar/order-h.png"
      },
      {
        pagePath: "/pages/childDetail/childDeviceList/childDeviceList",
        text: "设备",
        iconPath: "/assets/tabbar/equipment.png",
        selectedIconPath: "/assets/tabbar/equipment-h.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: { //切换tabbar
    switchTab(e) {
      if (e.currentTarget.dataset.index === app.globalData.childSelected) {
        return
      }
      wx.reLaunch({
        url: e.currentTarget.dataset.path
      })
    }
  }
})