// pages/my_money/my_money.js
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as mClient from '../../utils/customClient';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: "",
    endDate: "",
    serchContent: '',
    pointsData: [],
    saleAmountSort: 1,
    productCountSort: 3,
    saledAmount: 0,
    arriveAmount: 0,
    pointTitels: ['点位', '累计销售额金', '累计到账金额'], //分类
    pointTitelImageUrls:['','../../assets/img/arrow.png','../../assets/img/arrow.png'],
    pageIndex: 1,
    pageSize: 5,
    orderSort: 1,
    pointTotal: 0,
    loadText: '已经到底了',
    pointDateDetailly: '',
  },

  onLoad: function (options) {
    let nowtime = new Date();
    let startTime = options.time;
    nowtime.setDate(nowtime.getDate())
    let endTime = util.customFormatTime(nowtime);
    let saledAmount = options.saledAmount;
    let arriveAmount = options.arriveAmount;

    this.setData({
      startDate: startTime,
      endDate: endTime,
      saledAmount: saledAmount,
      arriveAmount: arriveAmount,
    });

    this.renderPointTable();
    
  },

  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
    })

    this.renderPointTable();
  },

  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value,
    })

    this.renderPointTable();
  },

  bindPointSerch: function (e) {
    let serchContent = e.detail.value;
    this.renderPointTable(serchContent);
  },

  bindSort: function (e) {
    let that = this;
    let sortGenre = e.currentTarget.dataset.index;
    let saleAmountSort = that.data.saleAmountSort;
    let productCountSort = that.data.productCountSort;
    let pointTitelImageUrls = that.data.pointTitelImageUrls;

    if (sortGenre === 1) {
      pointTitelImageUrls[2]='../../assets/img/arrow.png'
      if (saleAmountSort === 1) {
        pointTitelImageUrls[sortGenre]='../../assets/img/arrow-h.png'
        this.setData({
          saleAmountSort: 2,
          pointSort: 2,
          pointTitelImageUrls: pointTitelImageUrls,
        })
        
      } else {
        pointTitelImageUrls[sortGenre]='../../assets/img/arrow-l.png'
        this.setData({
          saleAmountSort: 1,
          pointSort: 1,
          pointTitelImageUrls: pointTitelImageUrls,
        })
      };
      this.renderPointTable();
    } else if (sortGenre === 2) {
      pointTitelImageUrls[1]='../../assets/img/arrow.png'
      if (productCountSort === 3) {
        pointTitelImageUrls[sortGenre]='../../assets/img/arrow-h.png'
        this.setData({
          productCountSort: 4,
          pointSort: 4,
          pointTitelImageUrls: pointTitelImageUrls,
        })
      } else {
        pointTitelImageUrls[sortGenre]='../../assets/img/arrow-l.png'
        this.setData({
          productCountSort: 3,
          pointSort: 3,
          pointTitelImageUrls: pointTitelImageUrls,
        })
      };
      this.renderPointTable();
    };
  },

  bindLoding:function(){
    let that = this;
    let pageIndex = that.data.pageIndex;
    let serchContent = that.data.serchContent;
    this.renderPointTable(serchContent,pageIndex)
  },

  renderPointTable: function(serchPointName='', pageIndex=1){
    let that = this;
    let pointSort = that.data.pointSort;
    let startDate = that.data.startDate;
    let endDate = that.data.endDate;
    let pageSize = that.data.pageSize;
    let pointTotal = that.data.pointTotal;

    if(((pageIndex*pageSize)-pointTotal)>pageSize){
       return;
    }

    let data = {
      start: startDate,
      end: endDate,
      pageindex: pageIndex,
      pagesize: pageSize,
      order: pointSort,
      name: serchPointName,
    }

    mClient.get(api.PointTransactionSummation, data)
        .then(resp => {
          let pointTotal =resp.data.data.total;
          if ((pointTotal / pageSize) < pageIndex || (pointTotal / pageSize) <= 1) {
            this.setData({
                loadText: '已经到底了',
            })
          } else{
            this.setData({
              loadText: '加载中',
          })
          }
          this.setData({
            pointsData: resp.data.data.summary,
            pageindex: pageIndex+1,
            pointTotal: pointTotal,
          })
        });
  },

})