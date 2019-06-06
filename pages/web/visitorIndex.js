// pages/web/visitorIndex.js
import * as echarts from '../../ec-canvas/echarts';
import time from '../../util/dateUtil.js';
import filter from '../../util/filter.js';
var util = require('../../util/util.js');
var md5 = require('../../util/md5.js');
var app = getApp();

import {
  pages
} from '../../auth.js';


const homePageAllNumbereUrl = app.globalData.baseUrl + app.globalData.purchaseSelectionApi;

Page(filter.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [], //轮播图  图片地址
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 2000, //自动切换时间间隔,3s
    duration: 500, //  滑动动画时长1s
    msgList: [], //最新标讯  公告内容
    demandList: [], //最新需求列表
    hotSupplierList: [], //热门供应商列表
    pages: [],
    isLOgin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const userData = wx.getStorageSync("userData") || '0';
    this.setData({
      pages: pages[userData * 1]
    });

    var jfId = wx.getStorageSync('jfId');
    if (jfId) {
      this.setData({
        isLOgin: true
      })
    } else {
      this.setData({
        isLOgin: false
      })
    }
    //准备参数
    var params = {
      "jfId": jfId
    };

    // 页面头部轮播图   最新标讯   最热供应商
    // let dictListUrl = app.globalData.baseUrl + '/yjapi/wx/v1/pro/dictList';
    let dictListUrl = app.globalData.yjBaseUrl + app.globalData.bidListNewApi;
    // 页面头部轮播图
    let dictListParams = {
      type: 'wxpic',
      channelIds: 296,
      typeIds: 2,
      orderBy: 4,
      count: 5
    }
    
    // ?channelIds=296&typeIds=2&orderBy=4&count=5  
    let dictImageUrl = app.globalData.dictUrl+'/api/content/list.jspx';
    util.callAjaxGetSign(dictImageUrl, dictListParams, res => {
      if (res) {
        console.log('页面头部轮播图', res.data);
        if (res.statusCode == '200') {
          let listImage = res.data;
          for (let i = 0; i < listImage.length; i++) {
            listImage[i].typeImg = listImage[i].typeImg.split(':8080')[0] + listImage[i].typeImg.split(':8080')[1]
          }
          //赋值
          this.setData({
            imgUrls: listImage,
          })

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

    // 最新标讯
    let dictListParamswxfgt = {
      type: 'wxfgt',
      pageNo: '1',
      pageSize: '5',
    }
    util.callAjaxGetSign(dictListUrl, dictListParamswxfgt, res => {
      if (res) {
        // console.log('最新标讯',res.data.data);
        if (res.statusCode == '200') {
          //赋值
          this.setData({
            msgList: res.data.result,
          })

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
    let hotSupplierListUrl = app.globalData.bidBaseUrl + app.globalData.hotSupplierListApi;

    // 最热供应商
    let dictListParamswxgys = {
      type: 'wxgys'
    }
    util.callAjaxNoToast(hotSupplierListUrl, dictListParamswxgys, res => {
      if (res) {
        // console.log('最热供应商', res.data.data);
        if (res.statusCode == '200') {
          //赋值
          this.setData({
            hotSupplierList: res.data.data,
          })

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

    // 最新需求接口
    let urlDemend = app.globalData.bidBaseUrl + app.globalData.urlDemend;
    var paramsDe = {
      "jfId": jfId,
      pageNo: '1',
      pageSize: '3'
    };
    util.callAjaxGetSign(urlDemend, paramsDe, res => {
      if (res) {
        // console.log('最新需求接口',res);
        if (res.statusCode == '200') {
          for (let i = 0; i < 3; i++) {
            res.data.data[i].bidValidtime = time.formatTimeTwo(res.data.data[i].bidValidtime, 'Y-M-D');
            res.data.data[i].putTime = time.formatTimeTwo(res.data.data[i].putTime, 'Y-M-D');
            res.data.data[i].ocity = (res.data.data[i].ocity || '').substring(0, 2);
            if (res.data.data[i].orderNo.length > 3) {
              res.data.data[i]._orderNo = res.data.data[i].orderNo;
              res.data.data[i].orderNo = res.data.data[i].orderNo.substring(0, 3) + '万';
            }
          }
          //赋值
          this.setData({
            demandList: res.data.data,
          })
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
  // 输入框事件
  findDemandConfirm: function(e) {
    wx.navigateTo({
      url: `./search?text=${e.currentTarget.dataset.val || '' }&isHome=true`,
    })
  },
  // 跳转到需求大厅
  demandHall: function() {
    wx.navigateTo({
      url: '../../pages/web/demandDetail'
    });
  },
  // 跳转公告信息
  gotoBullInfo: function(e) {
    wx.navigateTo({
      url: `detailBar?id=${e.target.dataset.id}`
    });

    

  },
  toJieYingHui: function() {
    wx.navigateTo({
      url: '../../pages/web/jieyinghui/index'
    });
  },
  hotLink: function() {
    wx.navigateTo({
      url: '../../pages/web/hotLink'
    });
  },
  // 跳转到需求详情页面
  demandDetail: function(e) {
    const {
      orderid,
      orderno
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/web/demandDetail1?orderId=${ orderid }&orderNo=${ orderno }`
    });
  },
  // 找供应商
  lookingSupplier: function() {
    if (wx.getStorageSync('jfId')) {
      wx.navigateTo({
        url: '/pages/findSupplier/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/findSupplier/guide',
      })
    }
  },
  // 跳转到供应商详情页面
  supplierDetail: function(e) {
    var spid = e.currentTarget.dataset.buid;
    wx.navigateTo({
      url: '/pages/findSupplier/detail?spid=' + spid,
    })
  },
  // 跳转到登录页面
  login: function() {
    wx.navigateTo({
      url: '../../pages/user/login'
    });
  },

  formatTime: function(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].opDueendtime) {
        let cur = data[i].opDueendtime.split('T')[0].split('-');
        data[i].opDueendtime = `${cur[0]}年${cur[1]}月${cur[2]}日`;
      } else {
        data[i].opDueendtime = '';
      }
    }
    return data;
  },
}))