// pages/caigouxiangqing/index.js
import util from '../../util/util.js';
import dateUtil from '../../util/dateUtil.js'
import filter from '../../util/filter.js';
import constants from '../list/constants.js';
const app = getApp();
const jfId = wx.getStorageSync("jfId");

Page(filter.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //订单ID
    jfId: '', //订单ID
    suppliers: [],
    experts: [],
    isShowAllSuppliers: false,
    isShowAllExperts: false,
    orderStatus: -1,
    docState: 0,
    loading: false,
    ...constants
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //订单ID
    var orderId = options.orderId == undefined ? "" : options.orderId;
    this.setData({
      orderId,
      jfId: wx.getStorageSync("jfId"),
      orderName: options.orderName,
      isShowAllExperts:false
    });
    //页面标题为路由参数
    options.orderName && wx.setNavigationBarTitle({
      title: options.orderName
    })
  },

  onShow: function () {
    this.setData({
      isShowAllExperts: false
    });


    //采购详情
    this.loadDetail();
    //供应商列表数据
    this.loadSuppliers();

  },

  onHide: function () {
    this.clearTimmer();
  },

  onUnload: function () {
    this.clearTimmer();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    return {
      title: "",
      path: e.target.dataset.url,
      imageUrl:"http://qdrc.jfh.com/qingdao/webchat/share/8781540027516_.pic_hd.jpg"
    }
  },

  showAllExperts: function() {
    this.setData({
      isShowAllExperts: true
    }, () => {
      this.setData({
        _experts: this.data.experts
      })
    })
  },

  showAllSuppliers: function() {
    this.setData({
      isShowAllSuppliers: true
    }, () => {
      this.loadSuppliers();
    })
  },

  caculateTime: function () {
    var timestamp2 = this.data.bidValidTime;
    let bidTime = timestamp2 * 1;
    let currentTime = new Date().valueOf();
    let cha = bidTime - currentTime  //时间差的毫秒数
    if(cha <= 0) {
      return true
    }
    //计算出相差天数
    let days = Math.floor(cha / (24 * 3600 * 1000))
    //计算出小时数
    let leave1 = cha % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000)
    this.setData({
      resDays: days,
      resHours: hours < 9 ? `0${hours}` : hours,
      resMinutes: minutes < 9 ? `0${minutes}` : minutes,
      resSeconds: seconds < 9 ? `0${seconds}` : seconds
    })
  },

  addTimmer: function () {
    this.clearTimmer();
    let yuqi = this.caculateTime();
    if (yuqi) return;
    this.timmer = setInterval(() => {
      let yuqi = this.caculateTime();
      if(yuqi) {
        clearInterval(this.timmer);
        return;
      }
    }, 1000);
  },

  clearTimmer: function () {
    clearInterval(this.timmer);
  },

  //采购详情
  loadDetail: function () {
    const url = app.globalData.yjBaseUrl + app.globalData.yjorderData;
    
    const { ORDER_STATE_ZHAOBIAO, ORDER_STATE_PINGBIAO, ORDER_STATE_YIQIANYUE, ORDER_STATE_QIANYUEZHONG } = constants;
    const { openBid } = this.data;
    const ujfId = wx.getStorageSync("jfId");
    //准备参数
    var data = {
      jfId: ujfId,
      orderId: this.data.orderId == undefined ? "" : this.data.orderId,
    };
    console.log("ujfId::::" + data.jfId);
    console.log("orderId::::" + data.orderId);
    util.callAjaxNoToast(url, data, (res) => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {

          console.log("orderId::::" + res.data.data);
          this.setData({
            ...res.data.data,
            fbTimeFmt: dateUtil.formatTimeTwo(res.data.data.fbTime, 'Y年M月D日')
          }, () => {
            if (this.data.filterStatus == 1) {
              this.addTimmer();
            }

            // 加载专家
            this.loadExperts();
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

  // 供应商列表
  loadSuppliers: function() {
    var url = app.globalData.bidBaseUrl + app.globalData.supplierDetailsList;
    var data = {
      orderId: this.data.orderId == undefined ? "" : this.data.orderId,
      clickStatus: "false"
    };
    console.log("url::::" + url);
    console.log("orderId::::" + data.orderId);
    this.data.isShowAllSuppliers && (data.clickStatus = "");
    util.callAjaxNoToast(url, data, res => {
      wx.stopPullDownRefresh();
      console.log("res::::" + res.data.resultcode);
      if (res) {
        if (res.data.resultcode == '0000') {
          this.setData({
            suppliers: res.data.data.map(e => ({
              ...e,
              customerScore: !e.customerScore ? 0 : (e.customerScore * 1).toFixed(1)
            }))
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

  // 专家列表
  loadExperts: function() {
    var url = app.globalData.yjBaseUrl + app.globalData.yjexpertDetails;
    const { ORDER_STATE_ZHAOBIAO, filterStatus, openBid } = this.data;
    var data = {
      orderId: this.data.orderId == undefined ? "" : this.data.orderId,
      clickStatus: "",
      ...(filterStatus >= 3 && filterStatus <= 5 ? { filterStatus: 'true' } : {})
    };
    util.callAjaxNoToast(url, data, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          this.setData({
            experts: res.data.data.map(e => ({
              ...e,
              evaluated: res.data.data.every(rdd => !!rdd.expertItemScore),
              abilitieLevel: e.abilitieLevel == 1 ? '普通专家' : e.abilitieLevel == 2 ? '高级专家' : e.abilitieLevel == 3 ? '资深专家' : '其他专家',
              expertScore: (e.expertScore * 1).toFixed(1)
            })).filter(f => f.expertName != null)
          }, () =>{
            this.setData({
              _experts: this.data.experts.slice(0,3)
            })
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

  evaluateExpert: function() {
    app.globalData.detailData = this.data;
    wx.navigateTo({
      url: '/pages/evaluateExpert/index'
    })
  },
  watchExpert: function() {
    app.globalData.detailData = this.data;
    wx.navigateTo({
      url: '/pages/evaluateExpert/index?disabled=true'
    })
  }
}))