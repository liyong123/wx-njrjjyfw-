// pages/leadership-index/index.js
import * as echarts from '../../ec-canvas/echarts';
import filter from '../../util/filter.js';
import constants from '../../pages/list/constants.js'

var util = require('../../util/util.js');
var dateUtil = require('../../util/dateUtil.js');
import time from '../../util/dateUtil.js';
var md5 = require('../../util/md5.js');
var app = getApp();

const circleSrcs =[
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl0.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl15.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl25.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl45.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl55.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl65.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl75.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl85.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl95.png",
  "http://qdrc.jfh.com/qingdao/webchat/codeyuan/zl100.png",
]

const getCircleSrc = (fen) => {
  if(fen == 0) {
    return circleSrcs[0];
  } else if (fen >0 && fen <=20) {
    return circleSrcs[1];
  } else if (fen > 20 && fen <= 30) {
    return circleSrcs[2];
  } else if (fen > 30 && fen <= 50) {
    return circleSrcs[3];
  } else if (fen > 50 && fen < 60) {
    return circleSrcs[4];
  } else if (fen >= 60 && fen < 70) {
    return circleSrcs[5];
  } else if (fen >= 70 && fen < 80) {
    return circleSrcs[6];
  } else if (fen >= 80 && fen <= 90) {
    return circleSrcs[7];
  } else if (fen > 90 && fen < 100) {
    return circleSrcs[8];
  } else if(fen == 100) {
    return circleSrcs[9];
  }
}

import {
  pages
} from '../../auth.js';

Page(filter.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    contractNum: 0, //项目总览 项目总数量
    titleUrlData: {}, // 采购中  建设中  已完成
    titleUrlData1: {}, // 采购中  建设中  已完成
    totalPrice: 0, // 项目总览 项目总金额
    //设置项目代码资产圆形进度条所用数据参数  
    chushifenshu: 0,
    fenshu: 0,
    count: 0, // 设置 计数器 初始为0
    count2: 0,
    count3: 0,
    countTimer: null, // 设置 定时器 初始为null
    countTimer2: null,
    countTimer3: null,
    drawn: false, // 保证绘制一次即可
    //设置项目代码资产圆形进度条所用数据参数结束
    _num: 0, //项目代码资产tab参数
    codeAsset: [],
    topCodeAsset: {},
    pages: [],
    ...constants,
    weekDynamic: [], //项目一周动态数据列表
    suppliers: [],
    hasCodeData: true,
    hasSupplierData: true,
    circleSrc: ''
  },

  /*圆形进度条*/
  drawProgressbg: function() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg');
    var that = this;
    var fenshu = that.data.fenshu;
    ctx.setLineWidth(1); // 设置圆环的宽度
    if (fenshu >= 80) {
      ctx.setStrokeStyle('#59c4c2'); // 设置圆环的颜色
    } else if (fenshu > 60 && fenshu < 80) {
      ctx.setStrokeStyle('#f8a43f');
    } else if (fenshu >= 0 && fenshu <= 60) {
      ctx.setStrokeStyle('#eb3757');
    };
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(50, 50, 40, 0, 2 * Math.PI, false);
    //设置一个原点(50,50)，半径为100的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function(step) {
    var context = wx.createCanvasContext('canvasProgress');
    var that = this;
    var fenshu = that.data.fenshu;
    // 设置渐变
    var gradient1 = context.createLinearGradient(100, 200, 200, 100);
    gradient1.addColorStop("0", "#24bd90");
    gradient1.addColorStop("1.0", "#1cd89c");
    var gradient2 = context.createLinearGradient(100, 200, 200, 100);
    gradient2.addColorStop("0", "#3184c0");
    gradient2.addColorStop("1.0", "#36add9");
    var gradient3 = context.createLinearGradient(100, 200, 200, 100);
    gradient3.addColorStop("0", "#f77f28");
    gradient3.addColorStop("1.0", "#f9cc59");
    var gradient4 = context.createLinearGradient(100, 200, 200, 100);
    gradient4.addColorStop("0", "#e0296d");
    gradient4.addColorStop("1.0", "#fc4d33");

    context.setLineWidth(7);
    if (fenshu >= 80) {
      context.setStrokeStyle(gradient1);
    } else if (fenshu >= 70 && fenshu < 80) {
      context.setStrokeStyle(gradient2);
    } else if (fenshu >= 60 && fenshu < 70) {
      context.setStrokeStyle(gradient3);
    } else if (fenshu >= 0 && fenshu <= 60) {
      context.setStrokeStyle(gradient4);
    };

    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    if (step == 0) {
      context.arc(50, 50, 40, -Math.PI / 2, -Math.PI / 2);
    } else {
      context.arc(50, 50, 40, -Math.PI / 2, -Math.PI * 2 * step / 2 - Math.PI / 2, true);
    }
    context.stroke();
    context.draw()
  },
  countInterval: function() {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count <= this.data.fenshu) {
        /* 绘制彩色圆环进度条
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (100 / 2));
        this.data.chushifenshu++;
        this.data.count++;
        //console.log(this.data.chushifenshu);
        this.setData({
          chushifenshu: this.data.chushifenshu
        });
      } else {
        this.setData({
          chushifenshu: this.data.fenshu
        });
        clearInterval(this.countTimer);
      }
    }, 10)
  },

  // onPageScroll: function(e) {
  //   //console.log(e.scrollTop);
  //   console.log(e);
  //   if (e.scrollTop == 100) {
  //     wx.pageScrollTo({
  //       scrollTop: 300,
  //     })
  //   }
  // },

  //项目代码资产tab切换
  navbarTap: function(e) {
    //console.log(e.currentTarget.dataset.num);
    this.setData({
      topCodeAsset: this.data.codeAsset[e.currentTarget.dataset.num],
      fenshu: this.data.codeAsset[e.currentTarget.dataset.num].codeTotal,
      circleSrc: getCircleSrc(this.data.codeAsset[e.currentTarget.dataset.num].codeTotal),
      chushifenshu: 0,
      _num: e.currentTarget.dataset.num,
      count: 0
    }, () => {
      this.drawProgressbg();
      this.countInterval();
    })

  },

  // 项目代码资产 
  loadCodeAsset() {
    const jfid = wx.getStorageSync('jfId');
    const buid = wx.getStorageSync("buid");
    util.callAjaxGetSign(app.globalData.baseUrl + app.globalData.orderCodeQuality, {
      jfid,
      buid,
      'from': 'nanjing'
    }, res => {
      wx.stopPullDownRefresh();
      // 假数据
      if (res) {
        if (res.data.resultcode == '0000') {
          const codeAsset = res.data.data.map(rdd => {
            return {
              ...rdd,
              reportDate: rdd.reportDate ? dateUtil.formatTimeTwo(rdd.reportDate, 'Y-M-D') : '暂无',
              color: rdd.codeTotal >= 80 ? 'green' : rdd.codeTotal >= 70 ? 'blue' : rdd.codeTotal >= 60 ? 'orange' : 'red',
              _orderName: (rdd.orderName || '').length < 7 ? rdd.orderName : rdd.orderName.slice(0, 7) + '...'
            }
          }).slice(0, 3);

          this.setData({
            codeAsset,
            topCodeAsset: codeAsset[0] || {},
            fenshu: codeAsset[0] ? codeAsset[0].codeTotal : 0,
            circleSrc: getCircleSrc(codeAsset[0] ? codeAsset[0].codeTotal : 0)
          }, () => {
            // this.drawProgressbg();
            // this.countInterval();
            // this.data.drawn = true;
          });
          //返回数据为空（res.data.data）,展示暂无数据
          if (res.data.data && res.data.data.length == 0) {
            this.setData({
              hasCodeData: false,
            })
          }
        } else {
          this.setData({
            hasCodeData: false,
          })
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "项目代码资产数据获取失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      } else {
        this.setData({
          hasCodeData: false,
        })
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "项目代码资产数据获取失败，请联系客服:400-064-0003",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    })
  },

  // 合作供应商 
  loadSuppliers() {
    const jfid = wx.getStorageSync('jfId');
    // const buid = wx.getStorageSync("buid");
    util.callAjaxGetSign(app.globalData.bidBaseUrl + app.globalData.list, {
      jfid,
      pageNum: 1,
      pageSize: 3
    }, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          this.setData({
            suppliers: res.data.data.list.map(rddl => {
              return {
                ...rddl,
                customerScore: (rddl.customerScore || 0).toFixed(1)
              }
            }),
          });
          //返回数据为空（res.data.data）,展示暂无数据
          if (res.data.data.list && res.data.data.list.length == 0) {
            this.setData({
              hasSupplierData: false,
            })
          }

        } else {
          //返回数据为空（res.data.data）,展示暂无数据
          this.setData({
            hasSupplierData: false,
          })

          // wx.showModal({
          //   title: "温馨提示",
          //   content: "合作的供应商数据获取失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      } else {
        //返回数据为空（res.data.data）,展示暂无数据
        this.setData({
          hasSupplierData: false,
        })
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "合作的供应商数据获取失败，请联系客服:400-064-0003",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const userData = wx.getStorageSync("userData") || '0';
    this.setData({
      pages: pages[userData * 1]
    });
    //页面加载的获取请求方法接口
    var that = this;
    var jfId = wx.getStorageSync('jfId');
    if (jfId != null && jfId != '') {
      that.getHomePageTitleInfo(that);
      that.getProjectAmount(that);
      that.getProjectCount(that);
      that.getWeekDynamicCondition(that);
    };
    this.loadCodeAsset();
    this.loadSuppliers();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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

  // 获取 采购中  建设中  已完成  数据
  getHomePageTitleInfo: function (that) {
    var homePageTitleUrl = app.globalData.baseUrl + app.globalData.homePageTitle;
    var homePageTitleUrl1 = app.globalData.bidBaseUrl + app.globalData.homePageTitle1;
    var jfId = wx.getStorageSync('jfId');
    //准备参数
    var params = {
      "jfId": jfId
    };

    util.callAjaxGetSign(homePageTitleUrl1, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          //赋值
          this.setData({
            titleUrlData1: res.data.data
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

    util.callAjaxGetSign(homePageTitleUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          //赋值
          this.setData({
            titleUrlData: res.data.data
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
  // 项目总数量
  getProjectCount: function(that) {
    const homePageAllNumbereUrl = app.globalData.baseUrl + app.globalData.homePageAllNumber;
    var jfId = wx.getStorageSync('jfId');
    //准备参数
    var params = {
      "jfId": jfId
    };

    util.callAjaxGetSign(homePageAllNumbereUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          //赋值
          this.setData({
            contractNum: res.data.data
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
  // 跳转到供应商详情页面
  gotogInfo: function(e) {
    var spid = e.currentTarget.dataset.id;
    if (spid && spid != "") {
      wx.navigateTo({
        url: '../../pages/findSupplier/detail?spid=' + spid
      });
    }
  },
  // 找供应商
  gotolist: function() {
    wx.navigateTo({
      url: '/pages/user/cooperation/index',
    })
  },

  // 项目总金额  
  getProjectAmount: function(that) {
    var homePageCumulativeUrl = app.globalData.baseUrl + app.globalData.homePageCumulative;
    var jfId = wx.getStorageSync('jfId');
    //准备参数
    var params = {
      "jfId": jfId
    };

    util.callAjaxGetSign(homePageCumulativeUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          //赋值
          this.setData({
            totalPrice: res.data.data.totalPrice
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

  // 获取项目一周动态

  getWeekDynamicCondition: function(that) {
    let weekDyURL = app.globalData.bidBaseUrl + app.globalData.dynweekdata;
    let proHealthUrl = app.globalData.admserviceUrl + app.globalData.proHealthData; 
    var jfId = wx.getStorageSync('jfId');
    var buid = wx.getStorageSync('buid');
    //准备参数
    var params = {
      "pageNum": 1,
      "pageSize": 3,
      "jfid": jfId,
      "buid": buid
    };

    util.callAjaxGetSign(weekDyURL, params, res => {
      if (res) {
        // console.log('weekDyURL', res.data.data);
        if (res.data.resultcode == '0000') {
          let loadedCount = 0;//计算数据加载数量

          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].putTime = time.formatTimeTwo(res.data.data[i].putTime, 'Y.M.D');
            let stageName = res.data.data[i].stageName;
            if (stageName && stageName != '') {
              loadedCount++;
              let proIdSecret = res.data.data[i].orderIdSecret;
              let proHealthParams = {
                proIdSecret: proIdSecret,
                bodyType: 0,
                token: '5544AE6B7D3C4A794838A68FE05F49CD'
              }
              util.callAjaxGetSign(proHealthUrl, proHealthParams, result => {
                if(result){
                  if (result.data.resultcode == '0000') {
                    let proPlan = result.data.data.proPlan;
                    let delayDay = result.data.data.delayDay;
                    let notDelFileList = result.data.data.notDelFileList;
                    res.data.data[i].proPlan = proPlan === 1 ? "正常" : proPlan === 2 ? "有风险" : proPlan === 3 ? "高风险" : "4";
                    res.data.data[i].delayDay = delayDay;
                    if(notDelFileList&&notDelFileList.length>0){
                      res.data.data[i].notDelFileList = notDelFileList.join("、")
                    }
                  }
                }
                if (loadedCount === res.data.data.length){
                  this.setData({
                    weekDynamic: res.data.data
                  });
                }
              })
            } else {
              loadedCount ++;
              if (loadedCount === res.data.data.length) {
                this.setData({
                  weekDynamic: res.data.data
                });
              }
            }
          }

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
  //项目一周动态跳转到项目详情
  // 跳转详情
  toProjectDetail: function (e) {
    const {
      orderId,
      orderName,
      projectId,
      orderIdSecret,
      stageName,
      orderNo,
    } = e.currentTarget.dataset.itemgrp;
    wx.navigateTo({
      url: (stageName === ''|| !stageName) ?
        `/pages/caigouxiangqing/index?orderId=${orderId}&orderName=${orderName}` : `/pages/content/index?orderId=${orderId}&orderName=${orderName}&id=${projectId}&bodytype=0&page=0&proIdSecret=${orderIdSecret}&orderNo=${orderNo}`,
    })
  },

  //项目代码资产跳转到建设中的项目详情
  // 跳转详情
  codetoDetail: function (e) {
    console.log("code:",e.currentTarget.dataset.codeasset)
    const {
      orderId,
      orderName,
      projectId,
      orderIdSecret,
      orderNo,
    } = e.currentTarget.dataset.codeasset;
    wx.navigateTo({
      url: `/pages/content/index?orderId=${orderId}&orderName=${orderName}&id=${orderId}&bodytype=0&page=0&proIdSecret=${orderIdSecret}&orderNo=${orderId}`,
    })
  },


}))