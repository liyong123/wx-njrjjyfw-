var util = require('../../util/util.js');
import filter from '../../util/filter.js';
import {
  pages
} from '../../auth.js';
var app = getApp();


Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    navigatorFailed: true,
    myProjectUrl: true,
    navigatorFailedFocus: true,
    userData1: true,
    headicon: "", //头像链接
    isLogin: false, //是否已登录
    username: "", //用户名
    realname: '',
    realname1: "",
    nickname: "",
    loginName: "",
    userCenterList: [{
        icon: 'user-img/account-info.png',
        title: '账户信息',
        url: '/pages/user/user-info/userInfo'
      },
      {
        icon: '',
        title: ''
      },
    ],
    pages: []
  },

  //拨打400电话
  tel_call: function(e) {
    wx.makePhoneCall({
      phoneNumber: "025-52821888",
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 查看是否授权
    const userData = wx.getStorageSync("userData") || '0';
    this.setData({
      pages: pages[userData * 1],
      userData
    });
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
    let jfid = wx.getStorageSync("jfId");
    let headicon = app.globalData.baseUrl + app.globalData.imagesAPI + jfid + "?fileSize=1&showError=true";
    this.setData({
      headicon: headicon, //result.headicon,//头像链接
      isLogin: wx.getStorageSync('isLogin'), //是否已登录
      username: wx.getStorageSync('username'), //用户名
      realname: wx.getStorageSync('realname1'),
      realname: wx.getStorageSync('realname'),
      nickname: wx.getStorageSync('nickname')
    })

    if (wx.getStorageSync('realname')) {
      this.setData({
        loginName: wx.getStorageSync('realname')
      })
    } else if (wx.getStorageSync('nickname')) {
      this.setData({
        loginName: wx.getStorageSync('nickname')
      })
    } else {
      this.setData({
        loginName: wx.getStorageSync('username')
      })
    }
    if (jfid) {
      var userData = wx.getStorageSync("userData");
      if (userData == "1") {
        this.setData({
          navigatorFailed: false,
          myProjectUrl: false,
          userData1: true,
          navigatorFailedFocus: false
        })
      } else if (userData == "2" || userData == "3") {
        this.setData({
          navigatorFailed: false,
          myProjectUrl: false,
          userData1: false,
          navigatorFailedFocus: false
        })
      }
    } else {
      this.setData({
        navigatorFailed: true,
        myProjectUrl: true,
        navigatorFailedFocus: true
      })
    }

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
    wx.startPullDownRefresh();
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

  //退出登录
  loginout: function(e) {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认退出登录吗',
      success: function(res) {
        console.log("退出登录：", res);
        if (res.confirm) {
          var loginName = wx.getStorageSync('loginName') == null ? '' : wx.getStorageSync('loginName');
          var mobile = wx.getStorageSync('mobile') == null ? '' : wx.getStorageSync('mobile');
          wx.clearStorageSync(); //清空当前缓存
          wx.setStorageSync('loginName', loginName);
          wx.setStorageSync('mobile', mobile);
          that.setData({
            headicon: "", //头像链接
            isLogin: false, //是否已登录
            username: "", //用户名
          });
          wx.reLaunch({
            url: '/pages/web/visitorIndex'
          })
        }
      }
    })
  },
}));