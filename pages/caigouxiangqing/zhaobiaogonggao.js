// pages/caigouxiangqing/zhaobiaogonggao.js
import util from '../../util/util.js';
import wxparse from "../../wxParse/wxParse.js";
import filter from '../../util/filter.js';
var app = getApp();

Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单ID
    jfid:'',
    projectNo: '', //项目编号
    buName: '', //需求部门
    putTimeFmt: '', //发布时间
    bidendTimeFmt: '', //投标截止时间
    memoStr: '', //需求描述
    dkheight: 300,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //订单ID
    var orderId = options.orderId == undefined ? "" : options.orderId;
    var jfid = options.jfid == undefined ? "" : options.jfid;
    that.setData({
      orderId: orderId,
      jfid: jfid
    });
    //招标公告
    that.purchaseOrderDetailApi(that);
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

  //招标公告
  purchaseOrderDetailApi: function (that) {
    var url = app.globalData.baseUrl + app.globalData.purchaseOrderDetailApi;
    //准备参数
    var data = {
      "orderId": that.data.orderId == undefined ? "" : that.data.orderId,
      "jfid": that.data.jfid == undefined ? "" : that.data.jfid,
    };
    util.callAjaxGetSign(url, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //项目编号
          var projectNo = res.data.data.projectNo == undefined ? '' : res.data.data.projectNo;
          //需求部门
          var buName = res.data.data.buName == undefined ? '' : res.data.data.buName;
          //发布时间
          var putTimeFmt = res.data.data.putTimeFmt == undefined ? '' : res.data.data.putTimeFmt;
          //投标截止时间
          var bidendTimeFmt = res.data.data.bidendTimeFmt == undefined ? '' : res.data.data.bidendTimeFmt;
          //需求描述
          var memoStr = res.data.data.memoStr == undefined ? '' : res.data.data.memoStr;
          that.setData({
            projectNo: projectNo,
            buName: buName,
            putTimeFmt: putTimeFmt,
            bidendTimeFmt: bidendTimeFmt,
            memoStr: memoStr
          });
          //内嵌html片段
          // 获得高度  
          wx.getSystemInfo({
            success: function (res) {
              let winHeight = res.windowHeight;
              //console.log(winHeight);
              that.setData({
                dkheight: winHeight - winHeight * 0.05 - 80
              })
            }
          })
          wxparse.wxParse('memoStr', 'html', memoStr, that, 5);
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