import * as echarts from '../../ec-canvas/echarts';
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
let that;
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
		color: ["#3398DB"],
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
			boundaryGap: false,
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
			barWidth: "20%",
			data: xdata,
			type: 'bar'
		}]
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
				['今日', '昨日', '近7天', '自定义'],
				['本月', '上个月', '自定义'],
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
		pageSize: 10,

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

		// 排序
		isSaleAmountSort: false,
		isSaleCountSort: false,
		pointSort: 1, //默认点位表排序按销售额升序
		pointTotal: 0,

		// 日历
		isShow: false,
		themeColor: '#ffd00a',
		calendarType: 'yydates',
		startMonthCount: -12,
		monthCount: 1,
		pastDateChoice: true,
		dateTitle: '',
		dateSubTitle: '开始',
		endDateSubTitle: '结束',
		endDateTitle: '',
		// 月份
		isPickerShow: false,
		isPickerRender: false,
		monthStartTime: "起始月份",
		monthEndTime: "结束月份",
		pickerConfig: {
			endDate: true,
			column: "second",
			dateLimit: true,
			initStartTime: "2021-01",
			initEndTime: "2021-12",
			limitStartTime: "2021-01",
			limitEndTime: "2021-12"
		},
	},

	onLoad: function () {
		that = this;
		// console.log(that.data.info.dateRange[reportGenre])
		let dateRange = that.data.dateRange;
		this.renderTransactionSummation(dateRange);
		this.renderReport(dateRange);
		// that.createChart();
	},

	// 点击显示插件
	btnClick: function () {
		console.log('显示');
		this.setData({
			isShow: true,
		})
	},

	_yybindchange: function (e) {
		that.setData({
			loadText: '',
		})
		let dateWrap = e.detail;
		console.log('选择范围', dateWrap);
		let startTime = dateWrap.startTime,
			endTime = dateWrap.endTime;
		that.rangeDateSummationTotal(startTime, endTime);
		if (startTime) {
			let pointDetaillyDate = startTime + '~' + endTime;
			this.setData({
				pointDetaillyDate: pointDetaillyDate
			});
			console.log(pointDetaillyDate);
		}
		that.setData({
			startTime,
			endTime
		})
	},

	_yybindhide: function () {
		console.log('隐藏')
	},

	_yybinddaychange: function (e) {
		console.log('日期发生变化', e);
	},


	// 月份区间选择
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
		that.monthlyStatistics(monthlyDate.startTime, monthlyDate.endTime);
	},

	// 切换销售日月报
	selectedReportGenres: function (e) {
		let that = this;
		let index = e.currentTarget.dataset.index;
		let dateRangeindex = that.data.dateRangeindex;
		let dateRangeindex_off = that.data.dateRangeindex_off;
		console.log(index, dateRangeindex);
		let dateRange = parseInt('' + index + dateRangeindex);
		console.log('上边', dateRange);
		if (dateRange === 13 && index === 1) {
			dateRange = 12;
			dateRangeindex = 2;
			that.setData({ //设置第四个变第三个
				dateRangeindex
			})
		} else if (dateRangeindex_off === 3) {
			console.log('原来的', dateRangeindex_off);
			dateRange = 3;
			that.setData({
				dateRange,
				dateRangeindex: dateRangeindex_off
			})
		};
		let reportDetail = that.data.reportDetail;
		if (index === 1) {
			reportDetail.titles = ['点位', '销售额', '销售量'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
		} else {
			reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		};
		if (dateRange === 0 || dateRange === 1) {
			reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		} else if (dateRange === 2) {
			reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		} else if (dateRange === 3) {
			reportDetail.titles = ['点位', '销售额', '销售量'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
		};
		// reportDetail[1] = '../../assets/img/arrow.png';
		// reportDetail[2] = '../../assets/img/arrow.png';
		console.log(reportDetail);
		this.renderTransactionSummation(dateRange)
		this.renderReport(dateRange);
		this.setData({
			reportGenre: index,
			dateRange: dateRange,
			reportDetail: reportDetail,
		});
		if (dateRange == 12) {
			let {
				monthStartTime,
				monthEndTime
			} = that.data;
			if (monthStartTime != '起始月份') {
				console.log('起始月份', monthStartTime);
				that.monthlySalesVolume(monthStartTime, monthEndTime);
				that.monthlyStatistics(monthStartTime, monthEndTime);
				that.setData({
					pointDetaillyDate: `${monthStartTime}~${monthEndTime}`
				})
			} else {
				that.setData({
					statistics: '',
					pointDetaillyDate: '请选择起始时间',
					reportTotal: {
						'销售额': `0元`,
						'订单数': `0单`,
						'销售量': `0根`
					},
				})
			}
		} else {
			that.setData({
				isShowGraph: false
			})
		}
		// if (index == 0) {
		// 	isReportGenre = '天数'
		// } else {
		// 	isReportGenre = '月份'
		// }
	},

	// 切换天数/月数
	selectedDateRange: function (e) {
		let that = this;
		let index = e.currentTarget.dataset.index;
		let reportGenre = that.data.reportGenre;
		let dateRange = parseInt('' + reportGenre + index);
		console.info('下边', dateRange);
		let reportDetail = that.data.reportDetail;
		// reportDetail[1] = '../../assets/img/arrow.png';
		// reportDetail[2] = '../../assets/img/arrow.png';
		if (dateRange === 0 || dateRange === 1) {
			reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		} else if (dateRange === 2) {
			reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
		} else if (dateRange === 3) {
			reportDetail.titles = ['点位', '销售额', '销售量'];
			reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
		};
		this.renderTransactionSummation(dateRange)
		this.renderReport(dateRange);
		if (dateRange == 12) {
			let {
				monthStartTime,
				monthEndTime
			} = that.data;
			if (monthStartTime != '起始月份') {
				console.log('起始月份', monthStartTime);
				that.monthlySalesVolume(monthStartTime, monthEndTime);
				that.monthlyStatistics(monthStartTime, monthEndTime);
				that.setData({
					pointDetaillyDate: `${monthStartTime}~${monthEndTime}`
				})
			} else {
				that.setData({
					statistics: '',
					pointDetaillyDate: '请选择起始时间',
					reportTotal: {
						'销售额': `0元`,
						'订单数': `0单`,
						'销售量': `0根`
					},
				})
			}
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

	//查询今日/昨日的销售额/订单数/销售量/累计销量
	renderReportTotal: function (startDate, endDate) {
		let that = this;
		let reportTotal = that.data.reportTotal;
		let cumulativeSales = that.data.cumulativeSales;
		let data = {
			searchDate: startDate,
			// enddate: endDate,
		};
		mClient.get(api.OneDaySummation, data)
			.then(resp => {
				console.log('今/昨销量', resp);
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
				reportTotal['销售额'] = `${resp.data.data.amount}元`;
				reportTotal['订单数'] = `${resp.data.data.orderSum}单`;
				reportTotal['销售量'] = `${resp.data.data.productCount}根`;
				cumulativeSales['累计销售额'] = `${resp.data.data.accumulateAmount}元`;
				cumulativeSales['累计销售量'] = `${resp.data.data.accumulateProductCount}根`;

				// reportTotal['销售额'] = `${resp.data.data.amount}元`;
				// if (resp.data.data.COUNT) {
				// 	reportTotal['订单数'] = `${resp.data.data.COUNT.toLowerCase()}单`;
				// } else {
				// 	reportTotal['订单数'] = `${resp.data.data.count}单`;
				// }
				// reportTotal['销售量'] = `${resp.data.data.productcount}根`;
				this.setData({
					reportTotal: reportTotal,
					cumulativeSales: cumulativeSales
				});
			})
			.catch(rej => {
				console.log('销量错误', rej);
			})
	},

	// 近7天/自定义销量和统计表
	async rangeDateSummationTotal(startDate, endDate) {
		let reportTotal = that.data.reportTotal;
		let data = {
			startDate,
			endDate
		};
		let result = await (mClient.get(api.RangeDateSummation, data));
		let statistics = result.data.data.statistics;
		console.log('近7日/自定义销量', result);
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
		reportTotal['销售额'] = `${result.data.data.amount}元`;
		reportTotal['订单数'] = `${result.data.data.orderSum}单`;
		reportTotal['销售量'] = `${result.data.data.productCount}根`;
		that.setData({
			reportTotal: reportTotal,
			statistics: statistics
		})
	},

	// 月报的销售额/订单数/销售量
	async monthlySalesVolume(startMonth, endMonth) {
		let reportTotal = that.data.reportTotal;
		let data = {
			startMonth,
			endMonth
		};
		let result = await (mClient.get(api.RangeMonthSummation, data));
		console.log('月报的销售额', result);
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
		reportTotal['销售额'] = `${result.data.data.amount}元`;
		reportTotal['订单数'] = `${result.data.data.orderSum}单`;
		reportTotal['销售量'] = `${result.data.data.productCount}根`;
		that.setData({
			reportTotal: reportTotal
		})
	},

	// 自定义月报的统计
	async monthlyStatistics(startMonth, endMonth) {
		let data = {
			startMonth,
			endMonth
		};
		let result = await (mClient.get(api.RangeMonthSaleList, data));
		console.log('自定义月报的统计', result);
		that.renderChart(result.data.data); //echarts
		that.setData({
			statistics: result.data.data
		})
	},

	// 计算切换时间段
	renderTransactionSummation: function (dateRange = 0, pointName = '', pageIndex = 1, pointsData = []) {
		let that = this;
		let pointReportDate = new Date();
		let pointSummationReportDate = new Date();

		this.setData({
			loadText: '点击加载更多',
		})
		console.log('当前的dateRange', dateRange)
		if (dateRange === 0 || dateRange === 3) { //今天||自定义
			if (dateRange === 0) {
				pointReportDate.setDate(pointReportDate.getDate());
				let startDate = util.customFormatTime(pointReportDate);
				let endDate = util.customFormatTime(pointReportDate);
				let pointDetaillyDate = util.customFormatTime(pointReportDate);
				console.log(pointDetaillyDate); //当前时间
				this.setData({
					pointDetaillyDate: pointDetaillyDate
				});

				this.renderReportTotal(startDate, endDate);
			}
			if (dateRange === 3) {
				let {
					startTime,
					endTime
				} = that.data;
				// pointReportDate.setDate(pointReportDate.getDate() - 1);
				// let endDate = util.customFormatTime(pointReportDate);
				// let pointDetaillyEndDate = util.customFormatTime(pointReportDate);

				// pointReportDate.setDate(pointReportDate.getDate() - 30);
				// let startDate = util.customFormatTime(pointReportDate);
				// let pointDetaillyStartDate = util.customFormatTime(pointReportDate);

				// if (startTime) {
				// 	let pointDetaillyDate = startTime + '~' + endTime;
				// 	this.setData({
				// 		pointDetaillyDate: pointDetaillyDate
				// 	});
				// 	console.log(pointDetaillyDate);
				// }
				// that.rangeDateSummationTotal(startDate, endDate);
			}
		} else {
			if (dateRange === 1) {
				pointReportDate.setDate(pointReportDate.getDate() - 1);
				let endDate = util.customFormatTime(pointReportDate);
				let pointDetaillyEndDate = util.customFormatTime(pointReportDate);

				// pointReportDate.setDate(pointReportDate.getDate() - 1);
				let startDate = util.customFormatTime(pointReportDate);
				let pointDetaillyStartDate = util.customFormatTime(pointReportDate);

				console.log('昨日', startDate, endDate);
				let pointDetaillyDate = pointDetaillyStartDate;
				this.setData({
					pointDetaillyDate: pointDetaillyDate
				});

				this.renderReportTotal(startDate, endDate);
			}

			if (dateRange === 2) {
				pointReportDate.setDate(pointReportDate.getDate() - 1);
				let endDate = util.customFormatTime(pointReportDate);
				let pointDetaillyEndDate = util.customFormatTime(pointReportDate);

				pointReportDate.setDate(pointReportDate.getDate() - 6);
				let startDate = util.customFormatTime(pointReportDate);
				let pointDetaillyStartDate = util.customFormatTime(pointReportDate);

				let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
				console.log('近7天', pointDetaillyDate);
				this.setData({
					pointDetaillyDate: pointDetaillyDate,
					pointStartDate: pointDetaillyStartDate,
					pointEndDate: pointDetaillyEndDate
				});

				this.rangeDateSummationTotal(startDate, endDate);
			}

			if (dateRange === 10) {
				pointSummationReportDate.setMonth(pointSummationReportDate.getMonth());
				let endDateReportTotal = util.customFormatMonth(pointSummationReportDate);
				let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);

				pointSummationReportDate.setMonth(pointSummationReportDate.getMonth());
				let startDateReportTotal = util.customFormatMonth(pointSummationReportDate);
				let pointDetaillyStartDate = util.customFormatOnlyMonth(pointSummationReportDate);

				let pointDetaillyDate = pointDetaillyEndDate;
				this.setData({
					pointDetaillyDate: pointDetaillyDate
				});
				console.log(startDateReportTotal, endDateReportTotal);
				this.monthlySalesVolume(startDateReportTotal, endDateReportTotal);
			}

			if (dateRange === 11) {
				pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 1);
				let endDateReportTotal = util.customFormatMonth(pointSummationReportDate);
				let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);

				pointSummationReportDate.setMonth(pointSummationReportDate.getMonth());
				let startDateReportTotal = util.customFormatMonth(pointSummationReportDate);
				let pointDetaillyStartDate = util.customFormatOnlyMonth(pointSummationReportDate);

				let pointDetaillyDate = pointDetaillyEndDate;
				this.setData({
					pointDetaillyDate: pointDetaillyDate
				});

				this.monthlySalesVolume(startDateReportTotal, startDateReportTotal);
			}

			if (dateRange === 12) {
				// pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 1);
				// let endDateReportTotal = util.customFormatTime(pointSummationReportDate);
				// let pointDetaillyEndDate = util.customFormatOnlyMonth(pointSummationReportDate);

				// pointSummationReportDate.setMonth(pointSummationReportDate.getMonth() - 11);
				// let startDateReportTotal = util.customFormatTime(pointSummationReportDate);
				// let pointDetaillyStartDate = util.customFormatOnlyMonth(pointSummationReportDate);

				// let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
				// this.setData({
				// 	pointDetaillyDate: pointDetaillyDate
				// });
				// this.renderReportTotal(startDateReportTotal, endDateReportTotal);
			}
		}
	},

	// 查询列表数据
	renderReport: function (dateRange = 0, pointName = '', pageIndex = 1, pointsData = []) {
		let that = this;
		let pointReportDate = new Date();
		let pointSort = that.data.pointSort;
		let pageSize = that.data.pageSize;
		let pointTotal = 0;
		console.log(dateRange, pointName, pageIndex, pointsData, pointReportDate, pointSort, pageSize, pointTotal);
		this.setData({
			loadText: '点击加载更多',
		})
		if (dateRange === 0 || dateRange === 3) {
			if (dateRange === 0) {
				pointReportDate.setDate(pointReportDate.getDate());
				let startDate = util.customFormatTime(pointReportDate);
				let endDate = util.customFormatTime(pointReportDate);
				let data = {
					startDate: startDate,
					endDate: endDate,
					pageNum: pageIndex,
					pageSize: pageSize,
					sortType: pointSort,
					// name: pointName
				};

				mClient.get(api.PointSaleList, data)
					.then(resp => {
						console.log('今日返回', resp);
						pointsData = pointsData.concat(resp.data.data.list);
						pointTotal = resp.data.data.total
						if ((pointTotal / pageSize) < pageIndex) {
							this.setData({
								loadText: '已经到底了',
							})
						}
						this.setData({
							pointsData: pointsData,
							pageIndex: pageIndex + 1,
							pointTotal: pointTotal,
						});
					});
			}

			if (dateRange === 3) {
				that.btnClick();
			}

		} else {
			if (dateRange === 1) {
				pointReportDate.setDate(pointReportDate.getDate() - 1);
				let endDate = util.customFormatTime(pointReportDate);
				// pointReportDate.setDate(pointReportDate.getDate() - 1);
				let startDate = util.customFormatTime(pointReportDate);
				let data = {
					startDate: startDate,
					endDate: endDate,
					pageNum: pageIndex,
					pageSize: pageSize,
					sortType: pointSort,
					// name: pointName
				};
				mClient.get(api.PointSaleList, data)
					.then(resp => {
						console.log('近7天返回', resp);
						pointsData = pointsData.concat(resp.data.data.list);
						pointTotal = resp.data.data.total
						if ((pointTotal / pageSize) < pageIndex) {
							this.setData({
								loadText: '已经到底了',
							})
						}
						this.setData({
							pointsData: pointsData,
							pageIndex: pageIndex + 1,
							pointTotal: pointTotal
						});
					});
			}

			if (dateRange === 2) {
				pointReportDate.setDate(pointReportDate.getDate() - 1);
				let endDate = util.customFormatTime(pointReportDate);

				pointReportDate.setDate(pointReportDate.getDate() - 7);
				let startDate = util.customFormatTime(pointReportDate);

				let data = {
					startDate: startDate,
					endDate: endDate,
					pageNum: pageIndex,
					pageSize: pageSize,
					sortType: pointSort,
					// name: pointName
				};
				mClient.get(api.PointSaleList, data)
					.then(resp => {
						console.log('近7天返回', resp);
						pointsData = pointsData.concat(resp.data.data.list);
						pointTotal = resp.data.data.total
						if ((pointTotal / pageSize) < pageIndex) {
							this.setData({
								loadText: '已经到底了',
							})
						}
						this.setData({
							pointsData: pointsData,
							pageIndex: pageIndex + 1,
							pointTotal: pointTotal
						});
					});
			}

			if (dateRange === 10) {
				pointReportDate.setMonth(pointReportDate.getMonth());
				let endDate = util.customFormatMonth(pointReportDate);

				pointReportDate.setMonth(pointReportDate.getMonth());
				let startDate = util.customFormatMonth(pointReportDate);
				console.log(startDate);
				let data = {
					startMonth: startDate,
					endMonth: endDate,
					pageNum: pageIndex,
					pageSize: pageSize,
					sortType: pointSort
				};

				mClient.get(api.PointMonthSaleList, data)
					.then(resp => {
						pointsData = pointsData.concat(resp.data.data.list);
						pointTotal = resp.data.data.total
						if ((pointTotal / pageSize) < pageIndex) {
							this.setData({
								loadText: '已经到底了',
							})
						}
						this.setData({
							pointsData: pointsData,
							pageIndex: pageIndex + 1,
							pointTotal: pointTotal
						});
					});
			}

			if (dateRange === 11) {
				pointReportDate.setMonth(pointReportDate.getMonth() - 1);
				let endDate = util.customFormatMonth(pointReportDate);

				pointReportDate.setMonth(pointReportDate.getMonth());
				let startDate = util.customFormatMonth(pointReportDate);

				let data = {
					startMonth: startDate,
					endMonth: endDate,
					pageNum: pageIndex,
					pageSize: pageSize,
					sortType: pointSort
				};

				mClient.get(api.PointMonthSaleList, data)
					.then(resp => {
						pointsData = pointsData.concat(resp.data.data.list);
						pointTotal = resp.data.data.total
						if ((pointTotal / pageSize) < pageIndex) {
							this.setData({
								loadText: '已经到底了',
							})
						}
						this.setData({
							pointsData: pointsData,
							pageIndex: pageIndex + 1,
							pointTotal: pointTotal
						});
					});
			}

			if (dateRange === 12) {
				// pointReportDate.setMonth(pointReportDate.getMonth() - 1);
				// let endDate = util.customFormatMonth(pointReportDate);

				// pointReportDate.setMonth(pointReportDate.getMonth() - 11);
				// let startDate = util.customFormatMonth(pointReportDate);

				// let data = {
				// 	startMonth: startDate,
				// 	endMonth: endDate,
				// 	pageNum: pageIndex,
				// 	pageSize: pageSize,
				// 	sortType: pointSort
				// };

				// mClient.get(api.PointMonthSaleList, data)
				// 	.then(resp => {
				// 		pointsData = pointsData.concat(resp.data.data.list);
				// 		pointTotal = resp.data.data.total
				// 		if ((pointTotal / pageSize) < pageIndex) {
				// 			this.setData({
				// 				loadText: '已经到底了',
				// 			})
				// 		}
				// 		this.setData({
				// 			pointsData: pointsData,
				// 			pageIndex: pageIndex + 1,
				// 			pointTotal: pointTotal
				// 		});
				// 	});

			}
		}
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



		// if (dateRange === 2) {
		// 	let echartGenre = 0;
		// 	this.setData({
		// 		chartsTitleGenre: echartGenre
		// 	})
		// 	mClient.get(api.NearlySevendaysEchart)
		// 		.then(resp => {
		// 			this.setData({
		// 				chartsData: resp.data.data,
		// 			});
		// 		});
		// }

		// if (dateRange === 10) {
		// 	let echartGenre = 1;
		// 	this.setData({
		// 		chartsTitleGenre: echartGenre
		// 	})
		// 	mClient.get(api.NearlyMonthsEchart)
		// 		.then(resp => {
		// 			this.setData({
		// 				chartsData: resp.data.data,
		// 			});

		// 		});
		// }

		// if (dateRange === 11) {
		// 	let echartGenre = 2;
		// 	this.setData({
		// 		chartsTitleGenre: echartGenre
		// 	})
		// 	mClient.get(api.NearlyMonthsEchart)
		// 		.then(resp => {
		// 			this.setData({
		// 				chartsData: resp.data.data,
		// 			});
		// 		});
		// }

		// if (dateRange === 12) {

		// 	let echartGenre = 3;
		// 	this.setData({
		// 		chartsTitleGenre: echartGenre
		// 	})
		// 	mClient.get(api.NearlyMonthsEchart)
		// 		.then(resp => {
		// 			this.setData({
		// 				chartsData: resp.data.data,
		// 			});
		// 		});
		// }

	},

	//eChart数据
	createChart: function (echartGenre) {
		let data = [];
		let reportCharts = [];
		let salesAmountchartObject = that.data.chartsData.salesAmount;
		let ordersCountchartObject = that.data.chartsData.ordersCount;
		let salesCountchartObject = that.data.chartsData.salesCount;
		console.log(that.data.chartsData)
		// data.push(that.convertDictionaryToArray(salesAmountchartObject, echartGenre));
		// data.push(that.convertDictionaryToArray(ordersCountchartObject, echartGenre));
		// data.push(that.convertDictionaryToArray(salesCountchartObject, echartGenre));
		// console.log(data)
		this.setData({
			ecDatas: data,
			isShowGraph: true
		});
	},

	//时间段切换
	convertDictionaryToArray: function (dirt = {}, echartGenre = 0) {
		let dataArray = [];
		for (let item in dirt) {
			dataArray.push(dirt[item]);
		}
		let arrayLength = dataArray.length;
		if (echartGenre === 1) {
			dataArray = dataArray.slice(arrayLength - 3, arrayLength)
		} else if (echartGenre === 2) {
			dataArray = dataArray.slice(arrayLength - 6, arrayLength)
		} else if (echartGenre === 3) {
			dataArray = dataArray.slice(arrayLength - 12, arrayLength)
		}
		return dataArray;
	},

	// 日折线图
	bindReportDetaill: function (e) {
		let point = e.currentTarget.dataset.point;
		wx.navigateTo({
			url: '../report_details/report_details?pointid=' + point.PointID + "&pointName=" + point.PointName
		})
	},

	// 明细
	bindDetail: function (e) {
		let point = e.currentTarget.dataset.point,
			pointStartDate = that.data.pointStartDate,
			pointEndDate = that.data.pointEndDate;
		console.log('点位id', point);
		wx.navigateTo({
			url: '../tableDetail/tableDetail?pointId=' + point.pointId + "&pointName=" + point.pointName + "&pointStartDate=" + pointStartDate + "&pointEndDate=" + pointEndDate
		})
	},

	bindSerchContentInput: function (e) {
		this.setData({
			serchContent: e.detail.value
		})
	},

	// 以点位名称搜索
	// bindPointSerch: function (e) {
	// 	let that = this;
	// 	let dateRange = that.data.dateRange;
	// 	let serchContent = e.detail.value;

	// 	this.renderReport(dateRange, serchContent);
	// },


	// 销售额/销售量排序列表
	bindPointSort: function (e) {
		let that = this;
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

		this.renderReport(dateRange);
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

		this.renderReport(dateRange, '', pageIndex, pointsData);
		this.setData({
			pageIndex: pageIndex + 1,
		})
	},
})