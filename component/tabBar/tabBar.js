// component/tabBar/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached() {
      setTimeout(function () {
        console.log(app.globalData.childSelected)
        this.setData({
          childSelected: app.globalData.childSelected,
        })
      }.bind(this), 100)
    }, //在组件实例进入页面节点树时执行
    detached() {} //在组件实例被从页面节点树移除时执行
  },

  /**
   * 组件的初始数据
   */
  data: {
    childSelected: app.globalData.childSelected,
    list: [{
        id: 0,
        pagePath: "/pages/childDetail/childIndex/childIndex",
        text: "报表",
        iconPath: "/assets/tabbar/baobiao.png",
        selectedIconPath: "/assets/tabbar/baobiao-h.png"
      },
      {
        id: 1,
        pagePath: "/pages/childDetail/childOrderList/childOrderList",
        text: "订单",
        iconPath: "/assets/tabbar/order.png",
        selectedIconPath: "/assets/tabbar/order-h.png"
      },
      {
        id: 2,
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