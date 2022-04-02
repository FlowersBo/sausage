import * as echarts from '../../ec-canvas/echarts';
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';

import todo from '../../component/v2/plugins/todo'
import selectable from '../../component/v2/plugins/selectable'
import solarLunar from '../../component/v2/plugins/solarLunar/index'
import timeRange from '../../component/v2/plugins/time-range'
import week from '../../component/v2/plugins/week'
import holidays from '../../component/v2/plugins/holidays/index'
import plugin from '../../component/v2/plugins/index'

plugin
	.use(todo)
	.use(solarLunar)
	.use(selectable)
	.use(week)
	.use(timeRange)
	.use(holidays)

let that;
let app = getApp();
import {
	OrderList
} from '../../config/api';
// let isReportGenre = "天数";

function initChart(canvas, width, height, xsign, xdata, graphGenres) {
	const chart = echarts.init(canvas, null, {
		width: width,
		height: height
	});
	canvas.setChart(chart);
	var option = {
		color: ["#3398DB", "#d9a8f2", "#b31fff", "#5c1cff"],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow"
			}
		},
		xAxis: {
			// name: isReportGenre,
			// nameLocation: 'end',	
			// nameTextStyle: {
			// 	color: '#BB0012',
			// 	fontStyle: 'italic',
			// 	fontSize: '8',
			// 	verticalAlign: 'middle',
			// 	align: 'left'
			// },
			// boundaryGap: false,
			type: 'category',
			data: xsign
		},
		yAxis: {
			// name: '销售额(元)',
			type: 'value'
		},
		nameTextStyle: {
			color: '#BB0012',
			fontStyle: 'italic',
			fontSize: '8',
			verticalAlign: 'middle',
			align: 'left'
		},
		grid: {
			top: 30,
			left: 50,
			height: 100
		},
		series: [{
			// name: '金额',
			barWidth: "50%",
			data: xdata,
			type: 'bar',
			itemStyle: {
				normal: {
					// 随机显示
					//color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
					// 定制显示（按顺序）
					color: function (params) {
						var colorList = ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
						return colorList[params.dataIndex]
					}
				}
			}
		}, ]
	};
	chart.setOption(option);
	return chart;
}

Page({
	data: {
		loadText: '点击加载更多',
		dateRangeindex: 0,
		info: {
			reportGenres: ['销售日报', '销售月报'],
			dateRange: [
				['日期', '自定义'],
				['月份', '自定义'],
			],
		},
		reportTotal: {
			'销售额': `0元`,
			'订单数': `0单`,
			'销售量': `0根`
		},
		cumulativeSales: {
			'累计销售额': `0元`,
			'累计销售量': `0根`,
		},
		reportDetail: {
			titles: ['点位', '销售额', '销售量', '时段'],
			titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''],
		},
		reportGenre: 0,
		dateRange: 0,

		saleroomSort: 0,
		salesVolumeSort: 0,

		isShowGraph: false,
		graphGenre: 0,

		chartsTitleGenre: 0,
		chartsData: {},
		charts: [],

		pageIndex: 1,
		pageSize: 20,

		pointsData: [],

		serchContent: '',
		url: "../../assets/img/arrow.png",

		ec: { //ec
			onInit: initChart
		},
		ecDatas: [],
		ecxsign: [
			// [1, 2, 3, 4, 5, 6, 7],
			// [1, 2, 3],
			// [1, 2, 3, 4, 5, 6],
			// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		],
		graphGenres: [{
			title: '销售额'
		}, {
			title: '订单数'
		}, {
			title: '销售量'
		}, ],

		pointDetaillyDate: '', //计算的时间段
		isDateRangeindex: true, //显示表格
		// 排序
		isSaleAmountSort: false,
		isSaleCountSort: false,
		pointSort: 1, //默认点位表排序按销售额升序
		pointTotal: 0,

		// 日历
		isShow: false,
		// themeColor: '#ffd00a',
		// calendarType: 'yydates',
		// startMonthCount: -11,
		// monthCount: 1,
		// pastDateChoice: true,
		// dateTitle: '',
		// dateSubTitle: '开始',
		// endDateSubTitle: '结束',
		// endDateTitle: '',

		// 月份
		isPickerShow: false,
		isPickerRender: false,
		monthStartTime: "起始月份",
		monthEndTime: "结束月份",
		pickerConfig: {
			endDate: true,
			column: "second",
			dateLimit: true,
			initStartTime: "2022-01",
			initEndTime: util.customFormatMonth(new Date),
			// limitStartTime: "2021-01",
			limitEndTime: util.customFormatMonth(new Date)
		},
		calendarConfig: {
			theme: 'elegant',
			// highlightToday: true,
			// markToday: '今日',
			// showHolidays: true,
			// emphasisWeek: true,
			chooseAreaMode: true,
			// defaultDate: '2020-9-8',
			// autoChoosedWhenJump: true
		},
		frequency: 0,
		agencyId: '',
	},


	// 日历、
	afterTapDate(e) {
		let frequency = that.data.frequency;
		if (e.detail.month <= 9) {
			e.detail.month = `0${e.detail.month}`
		}
		if (e.detail.date <= 9) {
			e.detail.date = `0${e.detail.date}`
		}
		if (frequency == 0) {
			that.setData({
				frequency: 1,
				startTimer: `${e.detail.year}-${e.detail.month}-${e.detail.date}`
			})
		} else {
			that.setData({
				frequency: 0,
				endTimer: `${e.detail.year}-${e.detail.month}-${e.detail.date}`
			})
			let startTimer = (new Date(that.data.startTimer.replace(/-/g, '/'))).getTime();
			let endTimer = (new Date(that.data.endTimer.replace(/-/g, '/'))).getTime();
			if (startTimer < endTimer) {
				startTimer = that.data.startTimer;
				endTimer = that.data.endTimer;
			} else {
				startTimer = that.data.endTimer;
				endTimer = that.data.startTimer;
			}
			that.renderReport(that.data.dateRange, startTimer, endTimer);
			this.setData({
				pointDetaillyDate: startTimer + '~' + endTimer,
				startTime: startTimer,
				endTime: endTimer,
				isShow: false
			});
			that.fadeDown();
		}
		// switch (e) {
		// 	case frequency: {
		// const calendar = this.selectComponent('#calendar').calendar;
		// const {
		// 	year,
		// 	month
		// } = calendar.getCurrentYM();
		// const selected = calendar['getSelectedDates']();
		// if (!selected || !selected.length)
		// 	return this.showToast('当前未选择任何日期')
		// console.log('当前选择时间', selected)
		// const rst = selected.map(item => JSON.stringify(item));
		// console.log(rst)
		//   break
		//  }
		// }
		// console.log('afterTapDate', e.detail);
	},

	afterCalendarRender(e) {},

	cancelWindowFn() {
		that.setData({
			isShow: false
		})
		that.fadeDown();
	},


	fadeIn: function () {
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'linear'
		})
		animation.bottom(0).step()
		this.setData({
			animationData: animation.export()
		})
	},

	fadeDown: function () {
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'linear', //动画的效果 默认值是linear
		})
		animation.bottom(-720).step()
		this.setData({
			animationData: animation.export()
		})
	},

	// 单日月
	dateTimeBody(e) {
		this.setData({
			dateTime: e.detail
		})
		this.renderTransactionSummation(that.data.dateRange);
	},

	// 自定义月报&&月份区间选择
	pickerShow: function () {
		this.setData({
			isPickerShow: true,
			isPickerRender: true,
			chartHide: true
		});
	},
	pickerHide: function () {
		this.setData({
			isPickerShow: false,
			chartHide: false
		});
	},
	setPickerTime: function (val) {
		console.log('月份时间段', val);
		let monthlyDate = val.detail;
		that.setData({
			monthStartTime: monthlyDate.startTime,
			monthEndTime: monthlyDate.endTime,
			pointDetaillyDate: `${monthlyDate.startTime}~${monthlyDate.endTime}`
		});
		that.monthlySalesVolume(monthlyDate.startTime, monthlyDate.endTime);
	},

	onLoad: function (options) {
		that = this;
		let agencyId = options.agencyId,
			reportGenre = options.reportGenre,
			agencyName = options.agencyName;
		let dateRange = parseInt('' + reportGenre + 0);
		console.log('当前agencyId',agencyId);
		this.setData({
			agencyId,
			reportGenre,
			agencyName,
			dateRange
		})
		this.renderTransactionSummation(dateRange);
	},

	// 切换销售日月报
	selectedReportGenres: function (e) {
		let index = e.currentTarget.dataset.index;
		let dateRangeindex = that.data.dateRangeindex;
		console.log(index, dateRangeindex);
		let dateRange = parseInt('' + index + dateRangeindex);
		console.log('上边', dateRange);
		let reportDetail = that.data.reportDetail;
		if (dateRange === 0) {
			reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		} else if (dateRange === 1) {
			reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		} else {
			reportDetail.titles = ['点位', '销售额', '销售量'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
		};
		this.setData({
			reportGenre: index,
			dateRange: dateRange,
			reportDetail: reportDetail,
		});
		if (dateRange === 0 || dateRange === 10) {
			that.setData({
				propDate: true,
			})
			if (dateRange == 10) {
				that.setData({
					isMonth: true,
				})
			} else {
				that.setData({
					isMonth: false,
				})
			}
			this.renderTransactionSummation(dateRange);
		}
		if (dateRange === 1) {
			let {
				startTime,
				endTime
			} = that.data;
			if (startTime) {
				that.renderReport(that.data.dateRange, startTime, endTime);
			} else {
				that.setData({
					reportTotal: {
						'销售额': `0元`,
						'订单数': `0单`,
						'销售量': `0根`
					},
					isFlag: false
				})
			}
			that.setData({
				pointDetaillyDate: `${startTime}~${endTime}`,
				isShow: true
			})
			that.fadeIn();
		}
		if (dateRange == 11) {
			let {
				monthStartTime,
				monthEndTime
			} = that.data;
			if (monthStartTime != '起始月份') {
				console.log('起始月份', monthStartTime);
				that.monthlySalesVolume(monthStartTime, monthEndTime);
				that.setData({
					pointDetaillyDate: `${monthStartTime}~${monthEndTime}`
				})
			} else {
				that.setData({
					statistics: '',
					pointDetaillyDate: '请选择起始月份',
					reportTotal: {
						'销售额': `0元`,
						'订单数': `0单`,
						'销售量': `0根`
					},
					pointsData: []
				})
			}
			that.pickerShow();
		} else {
			that.setData({
				isShowGraph: false
			})
		}
	},

	// 切换天数/月数
	selectedDateRange: function (e) {
		let that = this;
		let index = e.currentTarget.dataset.index;
		let reportGenre = that.data.reportGenre;
		let dateRange = parseInt('' + reportGenre + index);
		console.info('下边', dateRange);
		that.setData({
			dateRange
		})
		let reportDetail = that.data.reportDetail;
		if (dateRange === 0) {
			reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''];
		} else if (dateRange === 1) {
			reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''];
			that.setData({
				isDateRangeindex: true
			})
		} else {
			that.setData({
				isDateRangeindex: true
			})
			reportDetail.titles = ['点位', '销售额', '销售量'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
		};
		if (dateRange == 0 || dateRange === 10) {
			that.setData({
				propDate: true,
			})
			if (dateRange == 10) {
				that.setData({
					isMonth: true,
				})
			} else {
				that.setData({
					isMonth: false,
				})
			}
			that.setData({
				isDateRangeindex: false
			})
			this.renderTransactionSummation(dateRange);
		} else {
			that.setData({
				isDateRangeindex: true
			})
		}
		if (dateRange === 1) {
			let {
				startTime,
				endTime
			} = that.data;
			if (startTime) {
				that.renderReport(that.data.dateRange, startTime, endTime);
			} else {
				that.setData({
					reportTotal: {
						'销售额': `0元`,
						'订单数': `0单`,
						'销售量': `0根`
					},
					isFlag: false
				})
			}
			that.setData({
				pointDetaillyDate: `${startTime}~${endTime}`,
				isShow: true
			})
			that.fadeIn();
		}
		if (dateRange == 11) {
			let {
				monthStartTime,
				monthEndTime
			} = that.data;
			if (monthStartTime != '起始月份') {
				console.log('起始月份', monthStartTime);
				that.monthlySalesVolume(monthStartTime, monthEndTime);
				that.setData({
					pointDetaillyDate: `${monthStartTime}~${monthEndTime}`
				})
			} else {
				that.setData({
					statistics: '',
					pointDetaillyDate: '请选择起始月份',
					reportTotal: {
						'销售额': `0元`,
						'订单数': `0单`,
						'销售量': `0根`
					},
					pointsData: []
				})
			}
			that.pickerShow();
		} else {
			that.setData({
				isShowGraph: false
			})
		}
		this.setData({
			dateRange: dateRange,
			dateRangeindex: index,
			dateRangeindex_off: index,
			reportDetail: reportDetail,
		});
	},

	// 计算切换时间段
	renderTransactionSummation: function (dateRange = 0, pointName = '', pageIndex = 1, pointsData = []) {
		let isMonth = that.data.isMonth; //单月判断
		let pointReportDate = new Date();
		let pointSummationReportDate = new Date();
		this.setData({
			loadText: '点击加载更多',
		})
		console.log('当前的dateRange', dateRange)
		if (dateRange === 0) {
			pointReportDate.setDate(pointReportDate.getDate());
			let pointDetaillyDate = util.customFormatTime(pointReportDate);
			console.log('选择日期：', `${that.data.dateTime?that.data.dateTime:pointDetaillyDate}`);
			if (that.data.dateTime && !isMonth) {
				pointDetaillyDate = that.data.dateTime
			}
			this.setData({
				pointDetaillyDate
			});
			this.renderReport(that.data.dateRange, pointDetaillyDate, '');
		} else if (dateRange === 10) {
			pointSummationReportDate.setMonth(pointSummationReportDate.getMonth());
			let endDateReportTotal = util.customFormatMonth(pointSummationReportDate);
			let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);
			pointSummationReportDate.setMonth(pointSummationReportDate.getMonth());
			let startDateReportTotal = util.customFormatMonth(pointSummationReportDate);
			let pointDetaillyStartDate = util.customFormatOnlyMonth;
			let pointDetaillyDate = endDateReportTotal;
			if (that.data.dateTime && isMonth) {
				pointDetaillyDate = that.data.dateTime
			}
			this.setData({
				pointDetaillyDate
			});
			console.log('时间：', pointDetaillyDate);
			this.renderReport(that.data.dateRange, '', pointDetaillyDate);
		}
	},

	// 查询列表数据
	renderReport: function (dateRange = 0, searchDate, searchMonth, pageIndex = 1, pointsData = []) {
		that.setData({
			loadText: '点击加载更多',
		})
		console.log(dateRange);
		let reportTotal = that.data.reportTotal;
		let cumulativeSales = that.data.cumulativeSales;
		let data;
		if (dateRange === 1) {
			data = {
				startDate: searchDate,
				endDate: searchMonth,
				sortType: that.data.pointSort,
				pageNum: pageIndex,
				pageSize: that.data.pageSize,
				agencyId: that.data.agencyId
			};
			mClient.get(api.AgencyRangeDate, data)
				.then(resp => {
					let statistics = resp.data.data.statistics;
					console.log('自定义日报', resp);
					if (!resp.data.data) {
						that.setData({
							reportTotal: {
								'销售额': `0元`,
								'订单数': `0单`,
								'销售量': `0根`
							}
						})
						return
					}
					reportTotal['销售额'] = `${resp.data.data.summary.amount}元`;
					reportTotal['订单数'] = `${resp.data.data.summary.orderSum}单`;
					reportTotal['销售量'] = `${resp.data.data.summary.productCount}根`;
					let pointTotal = resp.data.data.saleList.total;
					that.setData({
						reportTotal: reportTotal,
						statistics: statistics,
						isFlag: true
					})
					if ((that.data.pageSize * (pageIndex - 1)) >= pointTotal && pointTotal > 0) {
						this.setData({
							loadText: '已经到底了',
						})
						return
					}
					pointsData = pointsData.concat(resp.data.data.saleList.list);
					console.log('列表', pointsData);
					that.setData({
						pointsData: pointsData,
						pageIndex
					})
					if (that.data.pageSize * pageIndex >= pointTotal) {
						this.setData({
							loadText: '已经到底了',
						})
						return
					}
				})
				.catch(rej => {
					console.log('销量错误', rej);
				})
		} else {
			data = {
				searchDate,
				searchMonth,
				sortType: that.data.pointSort,
				pageNum: pageIndex,
				pageSize: that.data.pageSize,
				agencyId: that.data.agencyId
			};
			mClient.get(api.AgencySingle, data)
				.then(resp => {
					console.log('单日/单月/自定义日', resp);
					if (!resp.data.data) {
						that.setData({
							reportTotal: {
								'销售额': `0元`,
								'订单数': `0单`,
								'销售量': `0根`
							},
							cumulativeSales: {
								'累计销售额': `0元`,
								'累计销售量': `0根`,
							},
						})
						return
					}
					reportTotal['销售额'] = `${resp.data.data.summary.amount}元`;
					reportTotal['订单数'] = `${resp.data.data.summary.orderSum}单`;
					reportTotal['销售量'] = `${resp.data.data.summary.productCount}根`;
					cumulativeSales['累计销售额'] = `${resp.data.data.total.totalAmount}元`;
					cumulativeSales['累计销售量'] = `${resp.data.data.total.totalCount}根`;
					let pointTotal = resp.data.data.pointList.total;
					this.setData({
						reportTotal: reportTotal,
						cumulativeSales: cumulativeSales,
						pointTotal: pointTotal,
					});
					if ((that.data.pageSize * (pageIndex - 1)) >= pointTotal) {
						this.setData({
							loadText: '已经到底了',
						})
						return
					}
					pointsData = pointsData.concat(resp.data.data.pointList.list);
					this.setData({
						pointsData: pointsData,
						pageIndex
					});
					if (that.data.pageSize * pageIndex >= pointTotal) {
						this.setData({
							loadText: '已经到底了',
						})
						return
					}
				})
				.catch(rej => {
					console.log('销量错误', rej);
				})
		}
	},

	// 自定义月报
	async monthlySalesVolume(startMonth, endMonth) {
		let reportTotal = that.data.reportTotal;
		let data = {
			startMonth,
			endMonth,
			agencyId: that.data.agencyId
		};
		let result = await (mClient.get(api.AgencyRangeMonth, data));
		console.log('自定义月报', result);
		if (!result.data.data) {
			that.setData({
				reportTotal: {
					'销售额': `0元`,
					'订单数': `0单`,
					'销售量': `0根`
				}
			})
			return
		}
		reportTotal['销售额'] = `${result.data.data.summary.amount}元`;
		reportTotal['订单数'] = `${result.data.data.summary.orderSum}单`;
		reportTotal['销售量'] = `${result.data.data.summary.productCount}根`;
		that.setData({
			reportTotal: reportTotal,
			statistics: result.data.data.statistics
		})
		that.renderChart(result.data.data.statistics); //echarts
	},

	//渲染echarts
	renderChart: function (statistics) {
		that.setData({
			isShowGraph: false
		});
		console.log('自定义月份统计', statistics);
		let monthList = [];
		for (const key in statistics) {
			if (Object.hasOwnProperty.call(statistics, key)) {
				const element = statistics[key];
				if (element.saleAmount) {
					monthList.push(element);
				}
			}
		}
		console.log('有数据的', monthList);
		let amountchartObject = [];
		let orderCountchartObject = [];
		let productCountchartObject = [];
		let ecxsign = [],
			amountchart = [],
			orderCountchar = [],
			productCountchart = [];
		for (const key in monthList) {
			if (Object.hasOwnProperty.call(monthList, key)) {
				const element = monthList[key];
				ecxsign.push(element.date);
				amountchart.push(element.saleAmount);
				orderCountchar.push(element.orderSum);
				productCountchart.push(element.productCount);
				// amountchart.date = element.date;
				// amountchart.saleAmount = element.saleAmount;
				// amountchartObject.push(amountchart);

				// orderCountchar.date = element.date;
				// orderCountchar.orderSum = element.orderSum;
				// orderCountchartObject.push(orderCountchar);

				// productCountchart.date = element.date;
				// productCountchart.orderSum = element.productCount;
				// productCountchartObject.push(productCountchart);
			}
		}
		// console.log('时间&金额', amountchartObject);
		// console.log('时间&订单', orderCountchartObject);
		// console.log('时间&销量', productCountchartObject);
		let ecDatas = [];
		ecDatas.push(amountchart, orderCountchar, productCountchart);
		// if (index == 0) {
		// 	isReportGenre = '天数'
		// } else {
		// 	isReportGenre = '月份'
		// }
		that.setData({
			ecDatas,
			ecxsign,
			isShowGraph: true
		});
	},

	// 跳转日折线图
	bindReportDetaill: function (e) {
		let point = e.currentTarget.dataset.point;
		wx.navigateTo({
			url: '../report_details/report_details?pointid=' + point.pointId + "&pointName=" + point.pointName + '&agencyId=' + that.data.agencyId
		})
	},

	// 跳转明细
	bindDetail: function (e) {
		let point = e.currentTarget.dataset.point,
			startTime = that.data.startTime,
			endTime = that.data.endTime
		console.log('点位id', point);
		wx.navigateTo({
			url: '../tableDetail/tableDetail?pointId=' + point.pointId + "&pointName=" + point.pointName + "&pointStartDate=" + startTime + "&pointEndDate=" + endTime + '&agencyId=' + that.data.agencyId
		})
	},

	// 点位销售统计列表排序
	bindPointSort: function (e) {
		let isSaleAmountSort = that.data.isSaleAmountSort;
		let isSaleCountSort = that.data.isSaleCountSort;
		let index = e.currentTarget.dataset.index;
		let dateRange = that.data.dateRange;
		let reportDetail = that.data.reportDetail;
		console.info('当前销售量id', index);
		if (index === 1) {
			reportDetail.titleUrls[2] = '../../assets/img/arrow.png';
			if (isSaleAmountSort === false) {
				reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
				this.setData({
					isSaleAmountSort: true,
					pointSort: 2,
					reportDetail: reportDetail
				})
			} else {
				reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
				this.setData({
					isSaleAmountSort: false,
					pointSort: 1,
					reportDetail: reportDetail
				})
			}
		} else if (index === 2) {
			reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
			if (isSaleCountSort === false) {
				reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
				this.setData({
					isSaleCountSort: true,
					pointSort: 4,
					reportDetail: reportDetail
				})
			} else {
				reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
				this.setData({
					isSaleCountSort: false,
					pointSort: 3,
					reportDetail: reportDetail
				})
			}
		} else {
			return;
		}
		if (dateRange === 0) {
			that.renderReport(that.data.dateRange, that.data.pointDetaillyDate, '', );
		} else if (dateRange === 10) {
			that.renderReport(that.data.dateRange, '', that.data.pointDetaillyDate, );
		} else {
			that.renderReport(that.data.dateRange, that.data.startTime, that.data.endTime);
		}
	},

	bindLoading: function () {
		let that = this;
		let pointsData = that.data.pointsData;
		let pageIndex = that.data.pageIndex;
		let dateRange = that.data.dateRange;
		let pageSize = that.data.pageSize;
		let pointTotal = that.data.pointTotal;
		if ((pointTotal / pageSize) < pageIndex) {
			this.setData({
				loadText: '已经到底了',
			})
		}
		if (((pageIndex * pageSize) - pointTotal) > pageSize) {
			wx.showToast({
				title: '已经到底了',
				icon: 'none',
				duration: 1000
			});

			this.setData({
				loadText: '已经到底了',
			})
			return;
		};
		pageIndex = pageIndex + 1;
		if (dateRange === 0) {
			that.renderReport(that.data.dateRange, that.data.pointDetaillyDate, '', pageIndex, pointsData);
		} else if (dateRange === 10) {
			that.renderReport(that.data.dateRange, '', that.data.pointDetaillyDate, pageIndex, pointsData);
		} else {
			that.renderReport(that.data.dateRange, that.data.startTime, that.data.endTime, pageIndex, pointsData);
		}
	},

	onShow: function () {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0
			})
		}
	},

	// 以点位名称搜索
	// bindPointSerch: function (e) {
	// 	let that = this;
	// 	let dateRange = that.data.dateRange;
	// 	let serchContent = e.detail.value;

	// 	this.renderReport(dateRange, serchContent);
	// },
	// bindSerchContentInput: function (e) {
	// 	this.setData({
	// 		serchContent: e.detail.value
	// 	})
	// },
})