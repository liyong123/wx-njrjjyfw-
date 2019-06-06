var util = require('../../util/util.js');
var app = getApp();
// pages/user/changePassWord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNewPassword: false,
    showOldPassword: false,
    showConfirmPassword: false,
    showNewPasswordFocus: false,
    showOldPasswordFocus: false,
    showConfirmPasswordFocus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  changeShow: function(e) {
    var type = e.currentTarget.dataset.type;
    if (type === 'old') {
      this.setData({
        showOldPassword: !this.data.showOldPassword,
        showNewPasswordFocus: false,
        showOldPasswordFocus: true,
        showConfirmPasswordFocus: false,
      })
    } else if (type === 'new') {
      this.setData({
        showNewPassword: !this.data.showNewPassword,
        showNewPasswordFocus: true,
        showOldPasswordFocus: false,
        showConfirmPasswordFocus: false,
      })
    } else if (type === 'confirm') {
      this.setData({
        showConfirmPassword: !this.data.showConfirmPassword,
        showNewPasswordFocus: false,
        showOldPasswordFocus: false,
        showConfirmPasswordFocus: true,
      })
    }
  },

  commitForm: function(e) {
    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = e.detail.value;
    if (!oldPassword) {
      wx.showModal({
        title: "温馨提示",
        content: "原密码必须填写",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    if (!newPassword) {
      wx.showModal({
        title: "温馨提示",
        content: "新密码必须填写",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    if (!confirmPassword) {
      wx.showModal({
        title: "温馨提示",
        content: "请确认新密码",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }

    if (newPassword != confirmPassword) {
      wx.showModal({
        title: "温馨提示",
        content: "两次输入密码不同",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    const url = app.globalData.yjBaseUrl + '/yjapi/open/fixPassword';
    const jfId = wx.getStorageSync('jfId');
    util.callAjaxGetSign(url, {
      jfId,
      oldPassword,
      newPassword
    }, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          wx.showModal({
            title: "温馨提示",
            content: "密码更新成功",
            showCancel: false,
            confirmText: "确定",
            success: () => {
              wx.navigateBack()
            }
          });
        } else if (res.data.resultcode == '1101') {
          wx.showModal({
            title: "温馨提示",
            content: "更新失败,原始密码有误",
            showCancel: false,
            confirmText: "确定",

          });
        } else {
          wx.showModal({
            title: "温馨提示",
            content: "更新密码失败",
            showCancel: false,
            confirmText: "确定"
          });
        }
      } else {
        wx.showModal({
          title: "温馨提示",
          content: "更新密码失败",
          showCancel: false,
          confirmText: "确定"
        });
      }
    })
  }
})