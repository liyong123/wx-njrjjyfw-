import util from 'util/util.js';
import watch from 'util/watch.js';

App({
  onLaunch: function() {
    // let p = new Promise((resolve, reject) => {
    //   this.checkLogin(resolve, reject);
    // });
    // this.globalData.promise = p;
  },
  /**
   * 检查登录状态的方法
   */
  checkLogin: function(resolve, reject) {
    let isLogin = wx.getStorageSync('jfId');
    //判断登录状态  若登录跳转到首页  否则跳转到游客首页
    if (isLogin) {
      resolve.call();
    } else {
      reject.call();
    }
  },
  setWatcher(page) {
    watch.setWatcher(page);
  },
  

  //全局参数   公共信息保存位置
  globalData: {
    token: '5544AE6B7D3C4A794838A68FE05F49CD',
    env: 'develop', // trial 体验版 develop 开发版
    expertAvatarUrl: 'https://njdev.jfh.com/yjprofile/resume/pic',
    supplierAvatarUrl: 'https://njdev.jfh.com/yjhrm/buenterprise/officiallogo',
    promise: null, // 用于获取登录权限的promise
    userInfo: null, //微信用户信息
    openid: null,
    loginCode: '', //小程序登录之后返回的code
    whUserinfo: null, //用户信息
    globalUUID: '', //全局唯一UUID
    baseUrl: 'https://dev.jfh.com', 
    //baseUrl: 'https://njtest.jfh.com', 
    bidBaseUrl: 'https://njdev.jfh.com',
    oldBaseUrl: 'https://dev.jfh.com',
    yjBaseUrl: 'https://njdev.jfh.com', // 请不要注掉了！！！
    admserviceUrl: 'https://admdev.jfh.com',//adm px 环境接口地址
    ajaxList: [],

    savedBasicInfo: { // 避免重复请求一些固定的信息：工作类型表、行业表、城市表
      city: false,
      industry: false,
      worktype: false,
    },
    /**
     *
     * 小程序本身常量资源
     *
     */
    dictUrl: 'https://yjnjcms.jfh.com',//游客首页轮播图请求地址前缀
    //小程序APPID
    appid: 'wxb84cfc38e9602f54',
    touristAppid: 'wx4700311e9f2209aa',
    //小程序加密
    secret: 'ac02f6acf847b0ab242cd9a93b9675ff',
    //小程序获取openid
    openIdUrl: 'https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code',

    /**
     *
     * 我的部分链接
     */

    loginAPI: '/ajaxlogin/login', //登录接口
    imgcodeApi: '/smsloginapi/imgcode/get', //获取图形验证码接口
    smsApi: '/smsloginapi/sms/get', //获取短信验证码接口
    validateApi: '/smsloginapi/validate', //验证接口
    userInfoApi: '/commonapi/jetchat/getuser', //登陆成功之后获取用户信息
    // pwdChangeAPI: 'https://flight.jswhlx.com/usercenter/SaveNewPwdWX',//修改密码接口
    // loginCompanyAPI: 'https://flight.jswhlx.com/piaowu/LoginOnCmpWX',//企业登录接口

    // registerPhoneValidAPI: 'https://flight.jswhlx.com/piaowu/GetIsPhoneValid',//注册时手机号校验接口
    // registerAPI: 'https://flight.jswhlx.com/piaowu/RegAction',//注册接口

    // verifyCodeAPI: 'https://flight.jswhlx.com/piaowu/getvercode',//手机验证码接口
    // obtainOpenIdAPI: 'https://www.jswhlx.com/apiwx/getWXOpenId.aspx',//获取OPENID

    /**
     * 首页链接
     */
    // 您的项目中托管代码的情况及代码质量平均分及代码托管量
    codeInfoApi: '/ysapi/wx/v1/pro/codeInfo', //参数 jfid  method:get
    //您需要注意的项目风险预警
    projectRiskApi: '/ysapi/wx/v1/pro/projectRisk', //参数 jfId method:get
    //我的采购项目
    purchaseCountApi: '/ysapi/wx/v1/pro/purchaseCount',
    //累计成交
    totalPriceApi: '/ysapi/wx/v1/pro/purchaseOrderPrice',
    // //采购阶段(搜索)
    // purchaseListApi:'https://dev.jfh.com/hwapi/wx/v1/pro/purchaseList',
    //项目简况(项目名称，预算金额，采购进度，采购进度条，参加投标家数，评标时间)
    purchaseListApi: '/yjapi/wx/v1/pro/purchasingList',
    //问题沟通
    questionApi: '/ysapi/wx/v1/pro/question',

    //确认解决
    resolveApi: '/ysapi/wx/v1/pro/question/resolve',
    //回复（文字+语音）
    replyApi: '/ysapi/wx/v1/pro/reply',
    //项目列表及未读项目总数
    proListApi: '/ysapi/wx/v1/pro/proList4YunJi',

    //项目动态
    dynamicListApi: '/ysapi/wx/v1/pro/dynamicList',
    //动态详情
    dynamicDetailApi: '/ysapi/wx/v1/pro/dynamicDetail',
    //代码质量
    avgrepocheckApi: '/ysapi/wx/v1/pro/repocheck',
    //项目阶段进展
    stagePointInfoApi: '/ysapi/wx/v1/pro/stagePointInfo',
    //代码成员贡献
    personCodeInfoApi: '/ysapi/wx/v1/pro/personCodeInfo',
    //你发布的项目
    yourProjectsApi: '/ysapi/wx/v1/pro/yourProjects',
    //订单成员信息
    membersApi: '/ysapi/wx/v1/pro/members',
    //提交新问题
    questionSubmitApi: '/ysapi/wx/v1/pro/question',
    //获取单个动态信息
    dynamicDetailMsgApi: '/ysapi/wx/v1/pro/dynamicDetailMsg',
    //交付项目列表  projectId//主体id。bodyType//0、订单；1、社区项目  jfId
    proStageDescApi: '/ysapi/wx/v1/pro/proStageDesc',
    //获取单个动态信息
    dynamicDetailMsgApi: '/ysapi/wx/v1/pro/dynamicDetailMsg',
    //获取小程序图像
    imagesAPI: '/jfprofile/resume/pic/',
    //页面跳转项目列表页面的参数配置
    purchase: {
      currentTab: 0,
      choose: 0,
      choose2: 0
    },
    //采购详情
    purchaseDetailApi: '/ysapi/wx/v1/pro/purchaseDetail',
    orderData: '/ysapi/wx/v1/pro/orderData',
    yjorderData: '/yjapi/wx/v1/pro/orderData',
    expertDetails: '/ysapi/wx/v1/pro/expertDetails',
    yjexpertDetails: '/yjapi/wx/v1/pro/expertDetails',
    supplierDetailsList: '/yjapi/wx/v1/pro/supplierDetailsList',
    //saveExpertItemScore: '/ysapi/wx/v1/pro/saveExpertItemScore',
    saveExpertItemScore: '/yjapi/open/saveExpertItemScore',
    expertItemScore: '/yjapi/wx/v1/pro/expertItemScore',
    //招标公告
    purchaseOrderDetailApi: '/ysapi/wx/v1/pro/purchaseOrderDetail',
    //中标公示
    purchaseOrderNoticeApi: '/ysapi/wx/v1/pro/purchaseOrderNotice',
    //项目合同
    purchaseAgreementApi: '/ysapi/wx/v1/pro/purchaseAgreement',
    //投标供应商和专家评标
    purchaseSelectionApi: '/ysapi/wx/v1/pro/purchaseSelection',
    // 首页 采购中  建设中  已完成
    homePageTitle: '/ysapi/expert/v2/getCountByType',
    homePageTitle1: '/yjapi/expert/v2/getCountByType',
    // 首页  项目总金额
    homePageCumulative: '/ysapi/wx/v1/pro/purchaseOrderPrice',
    // 首页  项目总数量
    homePageAllNumber: '/ysapi/expert/v2/getProCount',
    // 待办通知
    // homePageBacklogList:'/ysapi/expert/v2/getMessageList',
    // 待办通知列表
    pendingNotifications: '/ysapi/expert/v2/getMessageList',

    // 需求详情
    getOrderDetail: '/ysapi/expert/v2/getOrderDetail',

    // 领导首页，项目代码资产
    orderCodeQuality: '/ysapi/wx/v1/pro/orderCodeQuality',
    list: '/yjapi/expert/v2/expert/supplier/listTwo',
    dynweekdata:'/yjapi/expert/v2/dynweekdata/list',

    // 待办通知 标记已读
    signRead: '',

    /*******************
     * 
     * 找供应商相关的API接口
     * 
     *******************/
    spList: '/yjhrm/dsd/api/querySpListApi',
    spBaseInfo: '/yjhrm/dsd/api/getSpBaseinfo',
    spCoreMembers: '/yjhrm/dsd/api/getSpCoreMembers',
    spCoreBaseInfo: '/yjhrm/dsd/api/getSpCoreBaseinfo',
    spSuccessCases: '/yjhrm/dsd/api/getSpSuccessCases',
    spSolutions: '/yjhrm/dsd/api/getSpSolutions',
    spCertificates: '/yjhrm/dsd/api/getSpCertificate',
    spRisks: '/yjhrm/dsd/api/getSpRisks',
    popularList: '/yjapi/wx/v1/pro/popularList', //热门
    insertExpertFollow: '/yjapi/expert/v2/expert/insertExpertFollow', // 收藏
    // deleteExpertFollow:'/expert/v2/expert/deleteExpertFollow',
    // getSuppFollow:'/expert/v2/expert/getSuppFollow',
    deleteExpertFollow: '/yjapi/expert/v2/expert/deleteExpertFollow',
    getSuppFollow: '/yjapi/expert/v2/expert/getSuppFollow',
    queryWorkType: '/yjhrm/dsd/api/queryWorkTypeApi',
    queryIndustry: '/yjhrm/dsd/api/queryIndustryApi',
    queryCity: '/yjhrm/dsd/api/queryCityCodeApi',

    // 游客首页 最新需求
    urlDemend: '/yjapi/expert/v2/getOrdersList',

    // 普通员工首页
    orderChatInfos:'/ysapi/wx/v1/pro/orderChatInfos',
    orderCodeQuality: '/ysapi/wx/v1/pro/orderCodeQuality',
    selectOrdersDocumentInfo: '/ysapi/selectOrdersDocumentInfo',
    hotSupplierListApi: '/yjapi/wx/v1/pro/dictList',
    bidListNewApi: "/jfbid/openapi/platform/bidlistNew",//热门供应商

    proHealthData: '/admservice/xc/v1/board/proHealthStatus',

    healthDegreeListDev: 'https://admdev.jfh.com/admservice',
    healthDegreeList: '/xc/v1/board/proHealthStatus',

    expertListApi: "/yjapi/expert/v2/expert/ExpertDeal/list", //我合作的专家列表接口
    providerListApi: "/yjapi/expert/v2/expert/supplier/list", //我合作的供应商列表接口
    //我关注的供应商、专家列表
    focusExpertListApi: "/yjapi/expert/v2/expert/ExpertFollow/list", //我关注的专家列表接口
    focusProviderListApi: "/yjapi/expert/v2/expert/supplierFollow/list", //我关注的供应商列表接口
    //专家详情
    expertDetailApi: "/yjapi/expert/v2/expert/getExpertDetails",//获取页面数据接口
    expertFormSubmitApi: "/yjapi/expert/v2/expert/saveApplyExpert",//表单提交接口
    addFocusApi: "/yjapi/expert/v2/expert/insertExpertFollow",//关注专家
    deleteFocusApi: "/yjapi/expert/v2/expert/deleteExpertFollow",//取消关注专家

    // 评价供应商
    getBizEvaluate: '/yjapi/open/getBizEvaluate',
    saveBizEvaluate: '/yjapi/open/saveBizEvaluate',
    
    // 供应商概览
    getSPTotalCount: "/yjhrm/ledboard/api/getSPTotalCount",
    getSPCountLast6Month: "/yjhrm/ledboard/api/getSPCountLast6Month",
    getSPGovDataPercent: "/yjhrm/ledboard/api/getSPGovDataPercent",
    getSPQualifInfo: "/yjhrm/ledboard/api/getSPQualifInfo",
    getSPIndustryCount: "/yjhrm/ledboard/api/getSPIndustryCount",
    //市级领导首页 
    getCityLeaderIndexTotalMoney: "/yjapi/open/cityData",//总投入
    getCityLeaderIndexAreaDatas: "/yjapi/open/areaData",//总投入区级数据
    getCityLeaderIndexTotalBuild: "/ysapi/wx/v1/yanshi/all",//总建设
    getSPStaff: "/yjhrm/ledboard/api/getSPStaff",
    getSPAnualSales: "/yjhrm/ledboard/api/getSPAnualSales",
  },


  //获取用户OPENID
  getUserOpenId: function(callback) {
    var self = this;
    //获取loginCode
    var loginCode = wx.getStorageSync("loginCode");
    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      //调用request请求api转换登录凭证
      wx.request({
        url: self.globalData.obtainOpenIdAPI + '?appid=' +
          self.globalData.appid + '&secret=' +
          self.globalData.secret + '&js_code=' +
          loginCode,

        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          self.globalData.openid = res.data.openid
          callback(null, self.globalData.openid)
        },
        fail: function(res) {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "数据提交失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
          return;
        }
      })
    }
  },

  // 判断用户是游客还是采购商
  userRole: function() {
    var data = wx.getStorageSync('userData') || '1';
    if (data == '1') return 'SP_VISITOR';
    return 'SP_BUYING_UNIT';

  },

  // 处理路径：根据路由和跳转方式，导航页面
  handleRoutes: function(routes, routeIndex) {
    var that = this;
    if (routes.length == 0 || routes.length <= routeIndex) return;

    var route = routes[routeIndex];
    if (route.naviType == 'switchTab') {
      wx.switchTab({
        url: route.path,
        complete: function() {
          that.handleRoutes(routes, routeIndex + 1)
        }
      })
    } else if (route.naviType == 'navigateTo') {
      wx.navigateTo({
        url: route.path,
        complete: function() {
          that.handleRoutes(routes, routeIndex + 1)
        }
      })
    } else if (route.naviType == 'redirectTo') {
      wx.redirectTo({
        url: route.path,
        complete: function() {
          that.handleRoutes(routes, routeIndex + 1)
        }
      })
    }
  }
})