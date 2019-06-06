// pages/findSupplier/corePersonDetail.js
import util from '../../util/util.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jfId: '',//jfid

    info: {},
    
    workList: ['暂无'],//工作
    skillList: ['暂无'],//技能
    // cases: [{
    //   time: '20171212 -20181818',
    //   name: '南京政府水利工程项目',
    //   industry: '政府-安全监管',
    //   classify: 'app应用开发',
    //   describe: '暂无'
    // }],
    cases:[],
    showSuccessCaseNum: '2',//默认展开项目案例数
    lookDetailIndex: '-1',// 定位案例描述展开项
    ellipsis: true,//自我介绍默认不展开全部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化页面数据，获取参数
    this.data.jfId = options.jfId;
    this.loadPersonInfo();
  },

  loadPersonInfo: function () {
    var params = {
      "jfId": this.data.jfId,
      "role": app.userRole()//'SP_BUYING_UNIT'
    };
    var url = app.globalData.yjBaseUrl + app.globalData.spCoreBaseInfo;
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.status == 1) {
          //赋值
          res.data.data.memLogoUrl = res.data.data.memLogoUrl != '' ? app.globalData.baseUrl + res.data.data.memLogoUrl : 'https://qdrc.jfh.com/qingdao/webchat/supplier/member_logo.png';
          //行业 
          var inds = res.data.data.listIndustry;
          for(var i = 0; i < inds.length; i++){
            inds[i] = (inds[i].indName != '' && inds[i].domName != '') ? inds[i].indName + '/' + inds[i].domName : inds[i].indName + inds[i].domName;
          }
          if (inds.length == 0) inds[0] = '暂无';
          res.data.data.listIndustry = inds;

          if (res.data.data.birthDate != '') {
            var nowY = new Date().getFullYear();
            var birthY = new Date(res.data.data.birthDate).getFullYear();
            res.data.data.age = nowY - birthY;
          }

          that.setData({
            info: res.data.data || {},
            ellipsis: res.data.data.memDesc.length > 90
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
   * 自我介绍展开
   */
  ellipsis: function () {
    var value = !this.data.ellipsis;
    this.setData({
      ellipsis: value
    })
  },
  /**
    * 成功案例 查看全部
    */
  lookAllSuccessfulCase: function () {
    this.setData({
      "showSuccessProjectNumber": this.data.cases.length
    })
  },
  /**
   * 项目案例描述详情
   */
  lookDetail: function (event) {
    var lookIndex = event.currentTarget.id;
    this.setData({
      "lookDetailIndex": lookIndex
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})