// pages/caigouxiangqing/zhaobiaogonggao.js
import util from '../../util/util.js';
import wxparse from "../../wxParse/wxParse.js";
import filter from '../../util/filter.js';
import dateUtil from '../../util/dateUtil.js';
var app = getApp();
const jfId = wx.getStorageSync("jfId");

Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单ID
    orderNo: '',
    dkheight: 300,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订单ID
    const { orderId = "", orderNo = "" } = options;
    this.setData({
      orderId,
      orderNo
    }, () => {
      this.purchaseOrderDetailApi();
    });
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
  purchaseOrderDetailApi: function () {
    var url = app.globalData.baseUrl + app.globalData.getOrderDetail;
    const { orderId, orderNo } = this.data;
    //准备参数
    var data = {
      orderId,
      jfId,
      orderNo
    };
    util.callAjaxGetSign(url, data, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          const { memo, orderName, price, putTime } = res.data.data;
          orderName && wx.setNavigationBarTitle({
            title: orderName
          })
          this.setData({
            memo,
            orderName,
            price,
            putTimeFmt: dateUtil.formatTimeTwo(putTime, 'Y-M-D')
          });
          //内嵌html片段
          // 获得高度  
          wx.getSystemInfo({
            success: res => {
              let winHeight = res.windowHeight;
              //console.log(winHeight);
              this.setData({
                dkheight: winHeight - winHeight * 0.05 - 80
              })
            }
          })
          wxparse.wxParse('memo', 'html', memo, this, 5);
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