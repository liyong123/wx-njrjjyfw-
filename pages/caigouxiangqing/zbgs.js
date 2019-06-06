// pages/caigouxiangqing/zbgs.js
import util from '../../util/util.js';
import filter from '../../util/filter.js';
var app = getApp();

Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单ID
    projectNo: '', //项目编号
    orderName: '', //项目名称
    putDate: '', //信息发布时间
    bulletinDate: '', //采购公告媒体及日期
    purchaseWay: '', //采购方式
    bidEval: '', //评标委员会成员名单
    bidEvalAddress: '', //评标地点
    bidEvalDate: '', //评标日期
    name: '', //中标供应商名称
    address: '', //中标供应商地址
    price: 0, //中标金额
    company: '', //采购单位名称
    companyAddress: '', //采购单位地址
    contactsName: '', //采购单位联系人姓名
    contactsPhone: '', //采购单位联系人电话
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
    //中标公示
    that.purchaseOrderNoticeApi(that);
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

  //中标公示
  purchaseOrderNoticeApi: function (that) {
    var url = app.globalData.baseUrl + app.globalData.purchaseOrderNoticeApi;
    //准备参数
    var data = {
      "orderId": that.data.orderId == undefined ? "" : that.data.orderId,
    };
    util.callAjaxGetSign(url, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //项目编号
          var projectNo = res.data.data.projectNo;
          //项目名称
          var orderName = res.data.data.orderName;
          //信息发布时间
          var putDate = res.data.data.putDate;
          //采购公告媒体及日期
          var bulletinDate = res.data.data.bulletinDate;
          //采购方式
          var purchaseWay = res.data.data.purchaseWay;
          //评标委员会成员名单
          var bidEval = res.data.data.bidEval;
          //评标地点
          var bidEvalAddress = res.data.data.bidEvalAddress;
          //评标日期
          var bidEvalDate = res.data.data.bidEvalDate;
          //中标供应商名称
          var name = res.data.data.bidWin.name == undefined ? '' : res.data.data.bidWin.name;
          //中标供应商地址
          var address = res.data.data.bidWin.address == undefined ? '' : res.data.data.bidWin.address;
          //中标金额
          var price = res.data.data.bidWin.price == undefined ? 0 : res.data.data.bidWin.price;
          //采购单位名称
          var company = res.data.data.company;
          //采购单位地址
          var companyAddress = res.data.data.companyAddress;
          //采购单位联系人姓名
          var contactsName = res.data.data.contactsName;
          //采购单位联系人电话
          var contactsPhone = res.data.data.contactsPhone;
          that.setData({
            projectNo: projectNo,
            orderName: orderName,
            putDate: putDate,
            bulletinDate: bulletinDate,
            purchaseWay: purchaseWay,
            bidEval: bidEval,
            bidEvalAddress: bidEvalAddress,
            bidEvalDate: bidEvalDate,
            name: name,
            address: address,
            price: price,
            company: company,
            companyAddress: companyAddress,
            contactsName: contactsName,
            contactsPhone: contactsPhone
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
}));