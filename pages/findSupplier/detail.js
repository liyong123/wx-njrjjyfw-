// pages/web/detail.js
var showNav = 0;
var app = getApp();
import util from '../../util/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spid: 0, // 输入参数

    role: 'SP_BUYING_UNIT',
    isVisitor: false,
    // 返回页面顶部
    test: "",
    scrollTop: {
      scroll_top: 0,
      // goTop_show: false
    },
    // 右侧导航列表
    quickNavigationDetail: [{
      name: '公司信息',
      id: 'listA',
      show: true
    }, {
      name: '案例方案',
      id: 'listB',
      show: true
    }, {
      name: '核心成员',
      id: 'listC',
      show: true,
    }, {
      name: '风险信息',
      id: 'listD',
      show: true
    }],
    // 锚点定位
    toView: '',
    // 查看详情
    basicDetailShowNo: 48,
    basicDetailExpanded: false,
    logo:'https://qdrc.jfh.com/qingdao/webchat/supplier/supplier_logo.png',
    // 
    isShowNav: false,
    basicInfo: { spMemo:'暂无'},
    domainShowNo: 3,

    /**成功案例 */
    successCaseShowNo: 3,
    caseExpanded: false,
    caseDetail: {},
    showCaseDetail: false,
    successCases: [],

    /**解决方案 */
    solutionShowNo: 4,
    solutionExpanded: false,
    solutionDetail: {},
    showSolutionDetail: false,
    solutions: [],
    solutionLogo: 'https://qdrc.jfh.com/qingdao/webchat/supplier/case_logo.png',

    /**核心成员 */
    coreMemberShowNo: 3,
    coreMemberExpanded: false,
    headerBaseUrl: app.globalData.baseUrl,
    coreMembers: [],
    memberPageNo: 1,
    memberPageSize: 10,
    memberLogo: 'https://qdrc.jfh.com/qingdao/webchat/supplier/member_logo.png',

    /**资质证书 */
    certificateShowNo: 3,
    certificateExpanded: false,
    certificateImageShow: false,
    certificateImageUrl: '',
    certificates: [],

    risks:[],

    isFollowed: false,

    noData: false, // 没有找到或者不存在
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.data.spid = options.spid;

    // 检测用户角色变更
    var isV = app.userRole() == 'SP_VISITOR';

    this.setData({
      isVisitor: isV,
      role: isV ? 'SP_VISITOR' : 'SP_BUYING_UNIT',
    })

    this.getDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getDetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      imageUrl: 'http://qdrc.jfh.com/qingdao/webchat/share/8781540027516_.pic_hd.jpg'
    }
  },

  // 显示页面导航
  showNav: function(e) {
    if (e.currentTarget.dataset.show) {
      this.setData({
        'isShowNav': false
      });
    } else {
      this.setData({
        'isShowNav': true
      });
    }
  },
  // 返回页面顶部
  scrollTopFun: function(e) {
    // 隐藏页面导航
    this.setData({
      'isShowNav': false
    });
    if (e.detail.scrollTop > 300) { //触发gotop的显示条件
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },
  goTopFun: function() {
    var _top = this.data.scrollTop.scroll_top; //发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
  },
  // 锚点定位
  choiceNaviItem: function (event) {
    let wordindex = event.currentTarget.dataset.index;
    if (wordindex == '#') {
      this.setData({
        toView: '常用品牌',
      })
    } else {
      this.setData({
        isShowNav: false,
        toView: wordindex,
      })
    }

  },

  // 公司简介 查看详情
  lookDetail: function() {
    var ex = !this.data.basicDetailExpanded; 
    var num = ex ? this.data.basicInfo.spMemo.length : 50;
    this.setData({
      basicDetailShowNo: num,
      basicDetailExpanded: ex,
    })
  },
  // 成功案例 查看全部
  lookAllSuccessCase: function() {
    var ex = !this.data.caseExpanded;
    var num = ex ? this.data.successCases.length : 3;
    this.setData({
      successCaseShowNo: num,
      caseExpanded: ex,
    })
  },
  // 解决方案 查看全部
  lookAllSolution: function() {
    var ex = !this.data.solutionExpanded;
    var num = ex ? this.data.solutions.length : 4;
    this.setData({
      solutionShowNo: num,
      solutionExpanded: ex,
    })
  },
  //核心成员  查看全部
  lookAllCoreMember: function() {
    var ex = !this.data.coreMemberExpanded;
    var num = ex ? this.data.coreMembers.length : 3;
    this.setData({
      coreMemberShowNo: num,
      coreMemberExpanded:ex,
    })
  },
  // 资质证书 查看全部
  lookAllCertificate: function() {
    var ex = !this.data.certificateExpanded;
    var num = ex ? this.data.certificates.length : 3;
    this.setData({
      certificateShowNo: num,
      certificateExpanded:ex,
    })
  },

  /**
   * 案例详情
   */
  successCaseClick: function(e){
    var index = e.currentTarget.dataset.index;
    var caseDetail = this.data.successCases[index];

    this.setData({
      showCaseDetail: true,
      caseDetail: caseDetail
    })
  },
  catchMaskTouch:function(){

  },

  closeCaseDetail: function(){
    this.setData({
      showCaseDetail: false
    })
  },

  /**
   * 方案详情
   */
  solutionClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var detail = this.data.solutions[index];

    this.setData({
      showSolutionDetail: true,
      solutionDetail: detail
    })
  },

  closeSolutionDetail: function () {
    this.setData({
      showSolutionDetail: false
    })
  },
  
  /**
   * 资质证书
   */
  certificateClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var detail = this.data.certificates[index];

    this.setData({
      certificateImageShow:true,
      certificateImageUrl: detail.qLogoUrl
    })
  },

  closeCertificateImage: function () {
    this.setData({
      certificateImageShow: false
    })
  },

  /**
   * 核心成员
   */
  coreMemberClick: function(e){
    return;
    var jfid = e.currentTarget.dataset.jfid;
    wx.navigateTo({
      url: './corePersonDetail?jfId=' + jfid,
    })
  },

  /**
   * 联系
   */
  makeCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.basicInfo.tel
    })
  },

  /**
   * 收藏、关注
   */
  /**
   * https://njdev.jfh.com/yjapi/expert/v2/expert/insertExpertFollow?followJfid=2346864781&beFollowJfid=2346864417&followType=2&timestamp=1540114663990&sign=00001869E983EA392B087C33191EE4873FE79
   */
  followClicked: function(){
    var url = app.globalData.bidBaseUrl
    if (this.data.isFollowed) {
      url += app.globalData.deleteExpertFollow;
    }else{
      url += app.globalData.insertExpertFollow;
    }
    
    var params = {
      'followJfid': wx.getStorageSync('jfId'),// 152,
      'beFollowJfid': this.data.basicInfo.buId,//10856,
      'followType': '1'
    }
    wx.showLoading({
      title: '',
    })
    var that = this;
    util.callAjaxNoToast(url, params, res => {
      wx.hideLoading();
      if (res) {
        if (res.data.resultcode == '0000') {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1200
          })
          //赋值
          that.setData({
            isFollowed: !that.data.isFollowed
          })
        } else {
          var content = '';
          if (res.data.resultcode != '1100') {
            content = res.data.data;
          }
          util.showAjaxTip(content);
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  followSupplier: function(){
    var that = this;
    if (!(wx.getStorageSync('isLogin') || false)){
      wx.setStorageSync('router_after_login', [{
        naviType:'switchTab',
        path:'/pages/findSupplier/index?isTabbar=true',
      },{
        naviType: 'navigateTo',
        path: '/pages/findSupplier/detail?spid=' + that.data.spid,
      }]);
      wx.navigateTo({
        url: '/pages/user/login'
      });
      return;
    };

    var url = app.globalData.bidBaseUrl + app.globalData.insertExpertFollow;
    var params = {
      'followJfid': wx.getStorageSync('jfId'),// 152,
      'beFollowJfid': this.data.basicInfo.buId,//10856,
      'followType':'1'
    }
    wx.showLoading({
      title: '',
    })
    util.callAjaxNoToast(url, params, res => {
      wx.hideLoading();
      if (res) {
        if (res.data.resultcode == '0000') {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1200
          })
          //赋值
          that.setData({
            
          })
        } else {
          var content = '';
          if (res.data.resultcode == '1102' || res.data.resultcode == '1101'){
            content = res.data.data;
          }
          util.showAjaxTip(content);
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  /**
   * 点击mask背景隐藏
   */
  dismissMask: function(){
    this.setData({
      showSolutionDetail: false,
      showCaseDetail:false,
      certificateImageShow: false,
    })
  },
  catchMaskContentTap: function(){

  },

  /**
   * 抓取详情信息
   */
  getDetail: function(){
    var that = this;

    this.getBasicInfo();

    if (!this.data.isVisitor){
      this.getSuccessCases();
      this.getRisks();
    }
  
    this.getSolutions();

    this.getCertificates();

    // 放在最后：因为分页
    if (!this.data.isVisitor) {
      this.getCoreMembers();
    }
  },
  getBasicInfo:function(){
    wx.showLoading({
      title: '',
    });
    var url = app.globalData.yjBaseUrl + app.globalData.spBaseInfo;
    var params = {
      'spId':this.data.spid,
      'role':app.userRole()//'SP_BUYING_UNIT'
    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          if (res.data.data == '' || JSON.stringify(res.data.data) == '{}'){
            that.setData({
              noData: true,
            })
            return;
          }
          //赋值
          res.data.data.spMemo = res.data.data.spMemo || '暂无'
          for (var i = 0; i < res.data.data.indlist.length; ++i){
            if (res.data.data.indlist[i].charAt(0) == '/') {
              res.data.data.indlist[i] = res.data.data.indlist[i].substr(1)
            }
          }
          that.data.basicInfo = res.data.data;
          that.setData({
            basicInfo: res.data.data
          })

          var isSupplier = wx.getStorageSync('isSupplier') || false;
          var isSelf = (wx.getStorageSync('buid') || '') == res.data.data.buId; 
          if (isSupplier && !isSelf) {
            that.setData({
              isVisitor: true,
              role: 'SP_VISITOR',
              isShowNav: false,
            })
          }else if (!that.data.isVisitor){
            that.getFollowStatus();
          }
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },
  getSuccessCases: function(){
    var url = app.globalData.yjBaseUrl + app.globalData.spSuccessCases;
    var params = {
      'spId': this.data.spid,
      'role': this.data.role//'SP_BUYING_UNIT'
    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          var list = res.data.data || [];
          for(var i=0; i < list.length; i++){
            list[i].industry = (list[i].parentIndName != '' && list[i].indName != '') ? list[i].parentIndName + '/' + list[i].indName : list[i].parentIndName + list[i].indName;
          }
          //赋值
          that.setData({
            successCases: list
          })
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },
  getSolutions: function(){
    var url = app.globalData.yjBaseUrl + app.globalData.spSolutions;
    var buid = this.data.basicInfo.buId; 
    var params = {
      'spId': this.data.spid,
      'role': this.data.role//'SP_BUYING_UNIT'
    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          //赋值
          that.setData({
            solutions: res.data.data
          })
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },
  getCoreMembers:function(){
    var url = app.globalData.yjBaseUrl + app.globalData.spCoreMembers;
    var params = {
      'spId': this.data.spid,
      'role': this.data.role,//'SP_BUYING_UNIT',
      'page':this.data.memberPageNo,
      'rows':this.data.memberPageSize,
    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          //赋值
          var list = res.data.data||[];
          for(var i = 0; i < list.length; i++){
            list[i].tech = list[i].tech.split('、', 3);
            list[i].skill = list[i].skill.split('、', 3);
          }
        
          // 合并
          that.setData({
            coreMembers: that.data.coreMembers.concat(list),
          })
          if (list.length == that.data.memberPageSize) {
            that.data.memberPageNo++;
            that.getCoreMembers();
          }
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },
  getCertificates: function () {
    var url = app.globalData.yjBaseUrl + app.globalData.spCertificates;
    var params = {
      'spId': this.data.spid,
      'role': this.data.role//'SP_BUYING_UNIT'
    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      wx.hideLoading();
      if (res) {
        if (res.data.status == 1) {
          //赋值
          that.setData({
            certificates: res.data.data
          })
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },
  getRisks: function(){
    var url = app.globalData.yjBaseUrl + app.globalData.spRisks;
    var params = {
      'spId': this.data.spid,
      'role': this.data.role//'SP_BUYING_UNIT'
    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res) {
        if (res.data.status == 1) {
          //赋值
          that.setData({
            risks: res.data.data
          })
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  getFollowStatus: function(){
    var url = app.globalData.bidBaseUrl + app.globalData.getSuppFollow;
    var params = {
      'followJfid': wx.getStorageSync('jfId'),// 152,
      'beFollowJfid': this.data.basicInfo.buId,//10856,
    }
    var that = this;
    util.callAjaxNoToast(url, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          that.setData({
            isFollowed: res.data.data.followStatus == '2'
          })
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  /**
   * 成熟度分析
   */
  gotoMaturityAnalysis:function(){
    wx.navigateTo({
      url: './maturityAnalysis?spid=' + this.data.spid,
    })
  }
})