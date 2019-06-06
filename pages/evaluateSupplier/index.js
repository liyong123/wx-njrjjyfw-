import util from '../../util/util.js';
import filter from '../../util/filter.js';
const app = getApp();

const evaluateUrl = app.globalData.bidBaseUrl + app.globalData.saveBizEvaluate;
const watchUrl = app.globalData.bidBaseUrl + app.globalData.getBizEvaluate;
// const evaluateUrl = 'http://10.88.203.152:8080' + app.globalData.saveBizEvaluate;
// const watchUrl = 'http://10.88.203.152:8080' + app.globalData.getBizEvaluate;
// pages/evaluateExpert/index.js
Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {

  },
  onLoad: function (options) {
    const jfId = wx.getStorageSync('jfId');
    this.setData({
      disabled: !!options.disabled,
      ...(app.globalData.detailData || {}),
      orderId: app.globalData.detailData.projectId
    }, () => {

      let params;
      if (options.id) {
        params = {
          orderId: options.id,
          jfId
        };
      } else {
        params = {
          orderId: app.globalData.detailData.projectId,
          jfId
        };
      }

      if (this.data.disabled) {
        util.callAjaxGet(watchUrl, params, res => {
          wx.stopPullDownRefresh();
          if (res) {
            if (res.data.resultcode == '0000') {
              const { efficiency, techSkill, cooperate, communication, timelyFinish, quality } = res.data.data[0];
              this.setData({
                efficiency: efficiency.toFixed(1),
                techSkill: techSkill.toFixed(1),
                cooperate: cooperate.toFixed(1),
                communication: communication.toFixed(1),
                timelyFinish: timelyFinish.toFixed(1),
                quality: quality.toFixed(1)
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
        })
      }
    })
  },

  changeRate: function (e) {
    const {
      detail: {
        value
      },
      target: {
        dataset: {
          index
        }
      }
    } = e;
    this.setData({
      [index]: value.toFixed(1)
    });
  },

  submitEvaluate: function () {
    const {
      orderId,
      techSkill = 0,
      efficiency = 0,
      communication = 0,
      quality = 0,
      timelyFinish = 0,
      cooperate = 0
    } = this.data;
    var jfIda = wx.getStorageSync('jfId');
    const params = {
      jfId: jfIda,
      orderId,
      itemScore: `${techSkill},${efficiency},${communication},${quality},${timelyFinish},${cooperate}`
    }
    util.callAjaxGet(evaluateUrl, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          wx.showModal({
            title: "评价成功",
            showCancel: false,
            confirmText: "确定",
            success: () => {
              wx.navigateBack()
            }
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
    })
  }

}))