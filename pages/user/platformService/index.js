// pages/web/visitorIndex.js
import * as echarts from '../../../ec-canvas/echarts';
import time from '../../../util/dateUtil.js';
import filter from '../../../util/filter.js';
var util = require('../../../util/util.js');
var md5 = require('../../../util/md5.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [], //轮播图  图片地址
    indicatorDots: true, //是否显示面板指示点
    autoplay: false, //是否自动切换
    interval: 2000, //自动切换时间间隔,3s
    duration: 500, //  滑动动画时长1s
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
       var that = this;
       that.setData({
         imgUrls:[
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs1.png",
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs2.png",
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs3.png",
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs4.png",
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs5.png",
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs6.png",
            "http://qdrc.jfh.com/qingdao/webchat/platformPicture/ptjs7.png"
         ]
       })
  },
  backIndex:function(e){
    var that = this;
    var userData = wx.getStorageSync("userData");
    if (!userData || userData == "1") {
      wx.navigateTo({
        url: '../../../pages/web/visitorIndex'
      }) 
    } else if (userData == "2") {
      wx.navigateTo({
        url: '../../../pages/web/leadership-index'
      })
    } else if (userData == "3") {
      wx.navigateTo({
        url: '../../../pages/web/cityLeaderIndex'
      })
    }
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
  

  
})