// pages/caigouxiangqing/xmht.js
import util from '../../util/util.js';
import filter from '../../util/filter.js';
var app = getApp();

Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单ID
    contractStatus: '', //合同状态
    planNo: '', //电子合同编号
    caigouNo: '',//采购号
    buName: '', //采购人（甲方）
    legalName: '', //甲方联系人(代表姓名)
    partyBBUName: '', //供应商（乙方）（如果partyBBUName为空，显示partyBBUOName）
    supplyerName: '', //乙方联系人
    contractSingedPrice: '', //货物总价款
    signPriceCN: '', //货物总价款大写
    dueendtime_fmt: '', //乙方交货日期
    cashDeposit: '', //履约保证金
    delayMoney1: '', //售后违约百分比
    delayMoney: '', //乙方逾期滞纳金百分比
    agree_time: '', //甲方签署日期
    sign_time: '', //签署日期
    status: '', //签约状态

    pmAddr: '', //甲方住所地
    supplyerAddr: '', //乙方住所地
    legalEmail: '', //甲方电子邮箱
    arbitrationType: '', //争议解决方式条数
    supplyerBankName: '', //开户银行
    supplyerBankNo: '', //帐号：
    supplyerMobile: '', //电话
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //订单ID
    var orderId = options.orderId == undefined ? "" : options.orderId;
    that.setData({
      orderId: orderId
    });
    //项目合同
    that.purchaseAgreementApi(that);
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
  
  },

  //项目合同
  purchaseAgreementApi: function (that) {
    var url = app.globalData.baseUrl + app.globalData.purchaseAgreementApi;
    var jfId = wx.getStorageSync('jfId');    
    //准备参数
    var data = {
      "orderId": that.data.orderId == undefined ? "" : that.data.orderId,
      "jfId": jfId
    };
    util.callAjaxGetSign(url, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //合同状态
          var contractStatus = res.data.data.contractStatus;
          //电子合同编号
          var planNo = res.data.data.planNo;
          //采购号
          var caigouNo = res.data.data.caigouNo;
          //采购人（甲方）
          var buName = res.data.data.buName;
          //甲方联系人(代表姓名)
          var legalName = res.data.data.legalName;
          //供应商（乙方）（如果partyBBUName为空，显示partyBBUOName）
          var partyBBUName = res.data.data.partyBBUName == null ? res.data.data.partyBBUOName : res.data.data.partyBBUName;
          //乙方联系人
          var supplyerName = res.data.data.supplyerName == null ? '' : res.data.data.supplyerName;
          //货物总价款
          var contractSingedPrice = res.data.data.contractSingedPrice;
          //货物总价款大写
          var signPriceCN = res.data.data.signPriceCN;
          //乙方交货日期
          var dueendtime_fmt = res.data.data.dueendtime_fmt;
          //履约保证金
          var cashDeposit = res.data.data.cashDeposit;
          //售后违约百分比
          var delayMoney1 = res.data.data.delayMoney1;
          //乙方逾期滞纳金百分比
          var delayMoney = res.data.data.delayMoney;
          //签署日期
          var agree_time = res.data.data.agree_time == null ? '' : res.data.data.agree_time;
          //签署日期
          var sign_time = res.data.data.sign_time == null ? '' : res.data.data.sign_time;
          //签约状态
          var status = res.data.data.status;
          that.setData({
            contractStatus: contractStatus,
            planNo: planNo,
            caigouNo: caigouNo,
            buName: buName,
            legalName: legalName,
            partyBBUName: partyBBUName,
            supplyerName: supplyerName,
            contractSingedPrice: contractSingedPrice,
            signPriceCN: signPriceCN,
            dueendtime_fmt: dueendtime_fmt,
            cashDeposit: cashDeposit,
            delayMoney1: delayMoney1,
            delayMoney: delayMoney,
            agree_time: agree_time,
            sign_time: sign_time,
            status: status
          });
        } else {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "数据提交失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      } else {
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "数据提交失败，请联系客服:400-064-0003",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    });
  }
}))