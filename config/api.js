// const ApiRootUrl = 'https://api.morninggo.cn/';
// const ApiRootUrl = 'http://192.168.126.247:8080/morninggo_app_http_war/';
const ApiRootUrl = 'https://w3.morninggo.cn/';
// const ApiRootUrl = 'http://localhost:8080/mg/';
module.exports = {
    Login: ApiRootUrl + 'app/user/auth', //登录授权
    VerificationCode: ApiRootUrl + 'app/user/smscode', //验证码

    RefreshAuth: ApiRootUrl + 'app/user/refresh_auth', //刷新授权

    DeviceList: ApiRootUrl + 'app/device/devicelist', //设备列表
    AlarmList: ApiRootUrl + 'app/device/alarmlist', //设备报警

    OrderList: ApiRootUrl + 'app/order/orderlist', //订单列表
    OrderDetail: ApiRootUrl + 'app/order/orderdetail', //订单详情

    Info: ApiRootUrl + 'app/user/info', //用户信息

    NearlySevendaysEchart: ApiRootUrl + 'app/report/7daysdata',
    NearlyMonthsEchart: ApiRootUrl + 'app/report/monthdata',
    NearlyThreeMonthsEchart: ApiRootUrl + 'app/user/info',
    LastTwelveMonthsEchart: ApiRootUrl + 'app/user/info',

    PointDataByDay: ApiRootUrl + 'app/report/pointdatabydate',
    PointDataByMonth: ApiRootUrl + 'app/report/pointdatabymonth',
    PointDataByHour: ApiRootUrl + 'app/report/pointdatahours',
    PointToday: ApiRootUrl + 'app/report/pointdatatoday',

    PointSummarybydate: ApiRootUrl + 'app/report/summarybydate',
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
    SendVerificationCode: ApiRootUrl + "allinpay/member/sendVerificationCode",//发送短信
    BindPhone: ApiRootUrl + "allinpay/member/bindPhone",//绑定手机号
    UpdatePhone: ApiRootUrl + "allinpay/member/updatePhoneByPayPwd",//修改手机号
    QueryBankCard: ApiRootUrl + "allinpay/member/queryBankCard",//卡信息查询
    InExpDetail: ApiRootUrl + "allinpay/order/queryInExpDetail",//收支明细
    SetPayPwd: ApiRootUrl + "allinpay/member/setPayPwd",//设置密码
    UpdatePayPwd: ApiRootUrl + "allinpay/member/updatePayPwd", //修改密码
    ResetPayPwd: ApiRootUrl + "allinpay/member/resetPayPwd", //忘记密码
    DepositApply: ApiRootUrl + "allinpay/order/depositApply", //充值
    PayByBackSMS: ApiRootUrl + "allinpay/order/payByBackSMS", //确认充值
    WithdrawApply: ApiRootUrl + "allinpay/order/withdrawApply", //提现
}