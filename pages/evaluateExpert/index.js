import util from '../../util/util.js';
const app = getApp();
const jfId = wx.getStorageSync('jfId');

const evaluateUrl = app.globalData.bidBaseUrl + app.globalData.saveExpertItemScore;
const watchUrl = app.globalData.bidBaseUrl + app.globalData.expertItemScore;
// pages/evaluateExpert/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    experts: []
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      ...(app.globalData.detailData || {})
    })
  },

  onLoad: function(options) {
    this.setData({
      disabled: !!options.disabled
    }, () => {

      console.log(options);

      let params;

      if (options.id) {
        params = {
          orderId: options.id
        };
      } else {
        params = {
          orderId: app.globalData.detailData.orderId
        };
      }

      if (this.data.disabled) {
        util.callAjaxGetSign(watchUrl, params, res => {
          wx.stopPullDownRefresh();
          if (res) {
            console.log(res);
            if (res.data.resultcode == '0000') {
              let experts = this.data.experts
              res.data.data.forEach(rdd => {
                experts.forEach(exp => {
                  if (exp.jfId == rdd.jfId) {
                    if (rdd.expertItemScore) {
                      exp.score = [];
                      exp.score[0] = (rdd.expertItemScore.split("-")[0].split(":")[1] * 1).toFixed(1);
                      exp.score[1] = (rdd.expertItemScore.split("-")[1].split(":")[1] * 1).toFixed(1);
                      exp.score[2] = (rdd.expertItemScore.split("-")[2].split(":")[1] * 1).toFixed(1);
                      exp.score[3] = (rdd.expertItemScore.split("-")[3].split(":")[1] * 1).toFixed(1);
                      exp.score[4] = (rdd.expertItemScore.split("-")[4].split(":")[1] * 1).toFixed(1);
                    } else {
                      exp.score = [0.0, 0.0, 0.0, 0.0, 0.0];
                    }
                  }
                })
              });
              this.setData({
                experts
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

  changeRate: function(e) {
    const {
      detail: {
        value
      },
      target: {
        dataset: {
          expertid,
          index
        }
      }
    } = e;
    this.data.experts.forEach(ex => {
      if (ex.jfId == expertid) {
        if (!Array.isArray(ex.score)) {
          ex.score = new Array(5);
        }
        ex.score[index] = value.toFixed(1);
      }
    })
    this.setData({
      experts: this.data.experts
    });
  },
  submitEvaluate: function() {
    const {
      orderId,
      experts
    } = this.data;
    var jfIda = wx.getStorageSync('jfId');
    const params = {
      jfId: jfIda,
      orderId,
      itemArray: experts.map(ex => {
        const values = (ex.score || [0.0, 0.0, 0.0, 0.0, 0.0]).map((exs, index) => {
          return `${index * 1 + 1}=${exs || 0.0}`
        }).join(";")
        return `${ex.jfId}:${values}`;
      })
    }
    util.callAjaxPost(evaluateUrl, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          wx.showModal({
            title: "评价成功",
            showCancel: false,
            confirmText: "确定",
            success: () => {
              wx.navigateBack({
                url: `/pages/caigouxiangqing/index?orderId=${this.data.orderId}`,
              })
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

})