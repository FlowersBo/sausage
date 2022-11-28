// custom-tab-bar/index.js
const app = getApp();
Component({

  data: {
    selected: null,
    list: []
  },

  observers: {
    // selected(data=1) {
    //   this.setData({
    //     selected: data
    //   })
    // }
  },


  // 生命周期
  attached() {

  },

  ready() {
    let roles = wx.getStorageSync('roles');
    console.log('角色', roles);
    let list = [{
        pagePath: "/pages/index/index",
        text: "报表",
        iconPath: "/assets/tabbar/baobiao.png",
        selectedIconPath: "/assets/tabbar/baobiao-h.png"
      },
      {
        pagePath: "/pages/pointLocation/pointLocation",
        text: "点位",
        iconPath: "/assets/tabbar/dingdan.png",
        selectedIconPath: "/assets/tabbar/dingdan-h.png"
      },
      {
        pagePath: "/pages/commodity/commodity",
        text: "商品",
        iconPath: "/assets/tabbar/shebei.png",
        selectedIconPath: "/assets/tabbar/shebei-h.png"
      },
      {
        pagePath: "/pages/order_goods/order_goods",
        text: "订货",
        iconPath: "/assets/tabbar/dinghuo.png",
        selectedIconPath: "/assets/tabbar/dinghuo-h.png"
      },
      {
        pagePath: "/pages/user/user",
        text: "我的",
        iconPath: "/assets/tabbar/menu-mine.png",
        selectedIconPath: "/assets/tabbar/menu-mine-h.png"
      }
    ];
    if (roles) {
      roles.forEach(element => {
        if (element === 'cooperate' || element === 'operate' || element === 'agency' || element === 'areaManager')
          // list.splice(3, 1); //临时隐藏订货
        return
        else if (element === 'companyOperate' || element === 'vp' || element === 'ceo')
          list.splice(3, 1);
        else if (element === 'mediate') {
          list.splice(1, 1);
          list.splice(1, 1);
          list.splice(1, 1);
        }
      });
      this.setData({
        list
      })
    }
  },
  methods: { //切换tabbar
    switchTab(e) {
      const data = e.currentTarget.dataset;
      app.globalData.selected = data.index;
      wx.switchTab({
        url: data.path
      })
      // that.setData({
      //   selected: data.index,
      // })
    }
  }
})