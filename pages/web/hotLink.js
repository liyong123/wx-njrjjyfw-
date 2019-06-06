// pages/web/visitorIndex.js
import * as echarts from '../../ec-canvas/echarts';
import time from '../../util/dateUtil.js';
import filter from '../../util/filter.js';
var util = require('../../util/util.js');
var md5 = require('../../util/md5.js');
var app = getApp();
const jfId = wx.getStorageSync("jfId");

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
    jfIdExist:true
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
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLinkIndex.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink1.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink2.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink3.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink4.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink5.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink6.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink7.png",
            "http://qdrc.jfh.com/qingdao/webchat/hotLinkPicture/hotLink8.png"
         ]
       });
       if(jfId && jfId !=""){
          that.setData({
            jfIdExist:false
          })
       }else {
         that.setData({
           jfIdExist: true
         })
       }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  toLogin:function(){
     wx.navigateTo({
       url: '/pages/user/login',
     })
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