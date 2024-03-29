// const ApiRootUrl = 'https://api.morninggo.cn/';
//  const ApiRootUrl = 'http://w3.morninggo.cn/'; //测试
const ApiRootUrl = 'http://192.168.110.97:8080/app-http/';//13322265957
module.exports = {
    ApiRootUrl,
    Login: ApiRootUrl + 'app/user/auth', //登录授权
    LoginNew: ApiRootUrl + 'app/user/area/login',
    VerificationCode: ApiRootUrl + 'app/user/smscode', //验证码

    RefreshAuth: ApiRootUrl + 'app/user/refresh_auth', //刷新授权

    // DeviceList: ApiRootUrl + 'app/device/devicelist', //设备列表
    AlarmList: ApiRootUrl + 'app/device/alarmlist', //设备报警

    // OrderList: ApiRootUrl + 'app/order/orderlist', //订单列表
    // OrderDetail: ApiRootUrl + 'app/order/orderdetail', //订单详情
    OrderList: ApiRootUrl + 'app/order/orderList', //订单列表
    OrderDetail: ApiRootUrl + 'app/order/orderDetail', //订单详情

    Info: ApiRootUrl + 'app/user/info', //用户信息  

    // 新增(修改)接口
    OneDaySummation: ApiRootUrl + 'app/report/oneDaySummation', //一天的销量汇总/附带累计额
    RangeDateSummation: ApiRootUrl + 'app/report/rangeDateSummation', //近7天/自定义销量汇总
    PointSaleList: ApiRootUrl + 'app/report/pointSaleList', //点位销售统计/列表
    PointDataByHour: ApiRootUrl + 'app/report/pointdatahours', //日销量折线图
    RangeMonthSaleList: ApiRootUrl + 'app/report/rangeMonthSaleList', //月报销售统计
    PointMonthSaleList: ApiRootUrl + 'app/report/pointMonthSaleList', //月报点位销售明细
    RangeMonthSummation: ApiRootUrl + 'app/report/rangeMonthSummation', //月报销售额/订单量
    SinglePointSaleDetail: ApiRootUrl + 'app/report/singlePointSaleDetail', // 点位明细统计表
    PointDefineSaleLis: ApiRootUrl + 'app/report/pointDefineSaleList', //点位累计销售明细
    PointList: ApiRootUrl + 'app/report/pointList', //点位下拉列表
    ProductRanking: ApiRootUrl + 'app/product/productRanking', //商品销量排行
    ProductRankingDetail: ApiRootUrl + 'app/product/productRankingDetail', //商品销售明细
    WasteAnalyse: ApiRootUrl + 'app/product/2/wasteAnalyse', //废弃分析
    DeviceList: ApiRootUrl + 'app/device/list', //设备


    NearlySevendaysEchart: ApiRootUrl + 'app/report/7daysdata',
    NearlyMonthsEchart: ApiRootUrl + 'app/report/monthdata',
    NearlyThreeMonthsEchart: ApiRootUrl + 'app/user/info',
    LastTwelveMonthsEchart: ApiRootUrl + 'app/user/info',

    PointDataByDay: ApiRootUrl + 'app/report/pointdatabydate',
    PointDataByMonth: ApiRootUrl + 'app/report/pointdatabymonth',
    PointToday: ApiRootUrl + 'app/report/pointdatatoday',

    // PointSummarybydate: ApiRootUrl + 'app/report/summarybydate',
    PointTransactionSummation: ApiRootUrl + 'app/report/pointdatasummary',

    GoodsCategroy: ApiRootUrl + '/app/goods/gettype',
    ShelvesGoodsInfo: ApiRootUrl + '/app/goods/getgoods',
    GoodsDetaillyInfo: ApiRootUrl + '/app/goods/getgoodsdetail',
    GoodsDescriptivePicture: ApiRootUrl + '/app/goods/getgoodsdetailpics',

    ShoppingCart: ApiRootUrl + "/app/goods/getshoppingcart",
    AppendShoppingCart: ApiRootUrl + "/app/goods/addshoppingcart",
    RemoveShoppingCart: ApiRootUrl + "/app/goods/removeshoppingcart",
    ModificationShoppingCart: ApiRootUrl + "/app/goods/updateshoppingcart",

    userContactInfo: ApiRootUrl + "/app/goods/getcontacts",
    UserAddContactInfo: ApiRootUrl + "/app/goods/addcontact",
    UserUpdateContactInfo: ApiRootUrl + "/app/goods/updatecontact",
    UserRemoveContactInfo: ApiRootUrl + "/app/goods/removecontact",

    CreatGoodsOder: ApiRootUrl + "/app/goods/generateorder",
    GetGoodsOder: ApiRootUrl + "/app/goods/getorders",
    Getshipfee: ApiRootUrl + "/app/goods/getshipfee",
    GetGoodsDetail: ApiRootUrl + "/app/goods/getorderdetail",

    UserPayment: ApiRootUrl + "/app/pay/wx_pay",
    UpdateOrderStatus: ApiRootUrl + "/app/goods/updateorder",

    Essential: ApiRootUrl + "allinpay/member/essential", //收入/余额
    SetRealName: ApiRootUrl + "allinpay/member/setRealName", //个人认证
    SignContract: ApiRootUrl + "allinpay/member/signContract", //签约协议
    ApplyBindBankCard: ApiRootUrl + "allinpay/member/applyBindBankCard", //请求绑卡
    BindBankCard: ApiRootUrl + "allinpay/member/bindBankCard", //确认绑卡

    MyIncome: ApiRootUrl + "allinpay/member/myIncome", //收入
    Wallet: ApiRootUrl + "allinpay/member/myWallet", //钱包
    SendVerificationCode: ApiRootUrl + "allinpay/member/sendVerificationCode", //发送短信
    BindPhone: ApiRootUrl + "allinpay/member/bindPhone", //绑定手机号
    UpdatePhone: ApiRootUrl + "allinpay/member/updatePhoneByPayPwd", //修改手机号
    QueryBankCard: ApiRootUrl + "allinpay/member/queryBankCard", //卡信息查询
    InExpDetail: ApiRootUrl + "allinpay/order/queryInExpDetail", //收支明细
    SetPayPwd: ApiRootUrl + "allinpay/member/setPayPwd", //设置密码
    UpdatePayPwd: ApiRootUrl + "allinpay/member/updatePayPwd", //修改密码
    ResetPayPwd: ApiRootUrl + "allinpay/member/resetPayPwd", //忘记密码
    DepositApply: ApiRootUrl + "allinpay/order/depositApply", //充值
    PayByBackSMS: ApiRootUrl + "allinpay/order/payByBackSMS", //确认充值
    WithdrawApply: ApiRootUrl + "allinpay/order/withdrawApply", //提现


    // 新增&&修改接口
    //报表 
    Init: ApiRootUrl + "app/user/init", //查询用户授权信息
    // AgencyList: ApiRootUrl + "app/report/agencyList", //统计列表
    // AgencySingle: ApiRootUrl + "app/report/agencySingle", //一个合作商单日，单月报表
    // AgencyRangeDate: ApiRootUrl + "app/report/agencyRangeDate", //自定义日报
    // AgencyRangeMonth: ApiRootUrl + "app/report/agencyRangeMonth", //自定义月报

    PointSaleList: ApiRootUrl + 'app/report/v3/pointSaleList', //点位销售统计
    PointSaleMonth: ApiRootUrl + 'app/report/v3/pointSaleMonth', //点位半年/自定义
    AgencyList: ApiRootUrl + 'app/report/v3/agencyList', //合作商销售统计
    AgencyRangeMonth: ApiRootUrl + 'app/report/v3/agencyRangeMonth', //合作商半年/自定义
    SelectCityItem: ApiRootUrl + 'app/point/selectCityItem', //报表城市下拉

    // 订货
    GoodsCategory: ApiRootUrl + "app/transfer/goodsCategory", //分类
    GoodsList: ApiRootUrl + "app/transfer/goodsList", //商品列表
    AddCart: ApiRootUrl + "app/transfer/addCart", //购物车增减
    CartCount: ApiRootUrl + "app/transfer/cartCount", //购物车数量
    CartList: ApiRootUrl + "app/transfer/cartList", //购物车列表
    DeleteCart: ApiRootUrl + "app/transfer/deleteCart", //购物车为零删除
    AgencyListCK: ApiRootUrl + "app/transfer/agencyList", //获取合作商仓库地址
    GetRetailPrice: ApiRootUrl + "app/transfer/getRetailPrice", //订单列表
    CreateOrder: ApiRootUrl + "app/transfer/createOrder", //创建订单
    GoodsDetail: ApiRootUrl + "app/transfer/goodsDetail", //删除商品
    GoodsOrderDetail: ApiRootUrl + "app/transfer/orderDetail", //下单详情
    CancelOrder: ApiRootUrl + "app/transfer/cancelOrder", //取消订单
    OrderDeliver: ApiRootUrl + "app/transfer/orderDeliver", //确认收货
    BaseAccount: ApiRootUrl + "app/transfer/baseAccount", //获取公司账户
    OrderBankPay: ApiRootUrl + "app/transfer/orderBankPay", //提交上传凭证
    OrderPay: ApiRootUrl + "app/transfer/orderPay", //微信支付
    Examine: ApiRootUrl + "app/transfer/orderList", //订货审批列表
    AuthOrder: ApiRootUrl + "app/transfer/authOrder", //订货审批同意


    // 点位
    CityBillboard: ApiRootUrl + "app/point/cityBillboard", //城市点位排行
    PointBillboard: ApiRootUrl + "app/point/pointBillboard", //点位排行/自定义查询
    SelectPointItem: ApiRootUrl + "app/point/selectPointItem", //点位下拉数据
    SelectCityItem: ApiRootUrl + "app/point/selectCityItem", //用户城市下拉框数据
    SelectAgencyItem: ApiRootUrl + "app/point/selectAgencyItem", //城市合作商下拉框数据
    PointCustomize: ApiRootUrl + "app/point/pointCustomize", //点位自定义查询
    ProductRanking: ApiRootUrl + "app/product/productRanking", //商品排行榜
}