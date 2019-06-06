// pages/list/index.js
var util = require('../../util/util.js');
var time = require('../../util/dateUtil.js');
var app = getApp();
const contentListUrl = app.globalData.baseUrl + app.globalData.pendingNotifications;
const signReadUrl = app.globalData.baseUrl + app.globalData.signRead;


Page({
  data: {
    proList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var jfId = wx.getStorageSync('jfId');
    if (jfId != null && jfId != '') {
      that.getBacklogListData(that);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getBacklogListData: function(that) {
    var jfId = wx.getStorageSync('jfId');
    let params = {
      "jfId": jfId
    };

    util.callAjaxGetSign(contentListUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          console.log(res.data.data.listDate)
          //赋值
          this.setData({
            proList: res.data.data.listDate
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
  },
  // 标记已读
  signRead: function(e) {
    console.log(e.currentTarget.dataset.id);
    var _that = this;
    var jfId = wx.getStorageSync('jfId');
    let params = {
      "jfId": jfId,
      "id": e.currentTarget.dataset.id
    };
    util.callAjaxGetSign(signReadUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          console.log(res.data.data.listDate)
          //更新列表
          _that.getBacklogListData(_that);

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

  },
  // 评价
  evaluate: function(e) {
    console.log(e.currentTarget.dataset.id);

    if (true) {
      // 跳转到评价专家页面
      // app.globalData.detailData = this.data;
      wx.navigateTo({
        url: '/pages/evaluateExpert/index?id=' + e.currentTarget.dataset.id
      })
    } else {
      // 跳转到评价供应商页面
      wx.navigateTo({
        url: '',
      })
    }
  },

  // 查看
  examine: function(e) {
    console.log(e.currentTarget.dataset.id);
    // 跳转到项目详情页面
    wx.navigateTo({
      url: '',
    })
  },

})