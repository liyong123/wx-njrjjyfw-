// pages/web/index.js
import * as echarts from '../../ec-canvas/echarts';
import filter from '../../util/filter.js';
import time from '../../util/dateUtil.js';

var util = require('../../util/util.js');
var md5 = require('../../util/md5.js');
var app = getApp();
import {
  pages
} from '../../auth.js';

//echarts函数
var chartArea = null,
  chartBar = null;

var chartObj;

function initBarChart(canvas, width, height) {
  chartBar = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartBar);
  chartBar.setOption({});
  return chartBar;
}

function initAreaChart(canvas, width, height) {
  chartArea = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartArea);
  chartArea.setOption({});
  return chartArea;
}

Page(filter.identityFilter({
  /**
   * 页面的初始数据
   */
  data: {
    contractNum: 0, //项目总览 项目总数量
    titleUrlData: {}, // 采购中  建设中  已完成
    percent: "20", //进度条
    totalPrice: 0, // 项目总览 项目总金额
    msgSumBacklogList: 0, //首页  待办通知数量
    backlogList: [], //首页  待办通知列表
    ecBar: { //echarts必须配置   项目人力交付情况
      onInit: initBarChart
    },
    ecArea: { //echarts必须配置  项目代码总量
      onInit: initAreaChart
    },

    // 圆形进度条
    chushifenshu: 0,
    fenshu: 0,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    drawn: false, // 保证绘制一次即可
    active: '',
    pages: [],
    codeQuality: '', //项目代码质量
    codeIndex: 0, //项目代码质量  单项 

    indicatorDots: false, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 2000, //自动切换时间间隔,3s
    duration: 500, //  滑动动画时长1s

    healthDegreeList: [], //项目健康度列表

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
    var userData1 = wx.getStorageSync('userData');
    if (jfId != null && jfId != '' && userData1 == '2') {
      that.getHomePageTitleInfo(that);
      that.getProjectAmount(that);
      that.getProjectCount(that);
      that.getBacklogList(that);
      that.getOrderChatInfos(that);
      that.getCodeQuality(that);
      that.getDocumentInfo(that);
      that.getHealthDegreeList(that);
    };

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  getHomePageTitleInfo: function(that) {
    var homePageTitleUrl = app.globalData.baseUrl + app.globalData.homePageTitle;
    var jfId = wx.getStorageSync('jfId');
    //准备参数
    var params = {
      "jfId": jfId
    };

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

  // 待办通知
  getBacklogList: function(that) {
    var homePageBacklogListUrl = app.globalData.baseUrl + app.globalData.pendingNotifications;
    var jfId = wx.getStorageSync('jfId');
    //准备参数
    var params = {
      "jfId": jfId
    };

    util.callAjaxGetSign(homePageBacklogListUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          // console.log('待办通知', res.data.data);
          //赋值
          this.setData({
            backlogList: res.data.data.listDate,
            msgSumBacklogList: res.data.data.msgSum
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

  // 项目健康度列表
  getHealthDegreeList: function(thst) {
    var proListApiUrl = app.globalData.baseUrl + app.globalData.proListApi;
    var jfId = wx.getStorageSync('jfId');
    var buid = wx.getStorageSync('buid');
    //准备参数
    var paramsList = {
      jfId: jfId,
      queryScope: 0,
      keywords: '',
      pageNO: 1,
      pageSize: 3,
      buId: buid,
      "from": 'nanjing'
    };
    util.callAjaxGetSign(proListApiUrl, paramsList, res => {
      if (res) {
        // console.log('项目健康度', res);
        if (res.data.resultcode == '0000') {
          let list = res.data.data

          //准备参数
          for (let i = 0; i < list.length; i++) {
            let params = {
              proIdSecret: list[i].projectIdSecret,
              bodyType: list[i].bodyType,
              token: app.globalData.token,
            };

            let listDetail = {
              orderName: list[i].orderName,
              data: list[i]
            };

            this.getHealthDegreeDetail(params, listDetail);
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

  // 项目健康度详情
  getHealthDegreeDetail: function(parmas1, parmas2) {
    var healthDegreeUrl = app.globalData.healthDegreeListDev + app.globalData.healthDegreeList;

    util.callAjaxGetSign(healthDegreeUrl, parmas1, res => {
      if (res) {
        // console.log('项目健康度详情',res);
        if (res.data.resultcode == '0000') {
          let healthDetail = {
            orderName: parmas2.orderName,
            orderData: parmas2.data,
            data: res.data.data
          }
          this.data.healthDegreeList.push(healthDetail)
          this.setData({
            healthDegreeList: this.data.healthDegreeList
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

  //项目代码质量
  getCodeQuality: function(that) {
    var orderCodeQualityUrl = app.globalData.baseUrl + app.globalData.orderCodeQuality;
    var jfId = wx.getStorageSync('jfId');
    var buid = wx.getStorageSync('buid');
    //准备参数
    var params = {
      "jfid": jfId,
      "buid": buid,
      "from": 'nanjing'
    };

    util.callAjaxGetSign(orderCodeQualityUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].reportDate = time.formatTimeTwo(res.data.data[i].reportDate, 'Y-M-D');
          }
          //赋值
          this.setData({
            codeQuality: res.data.data,
            fenshu: res.data.data[0].codeTotal
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

  // 项目代码总量
  getOrderChatInfos: function(that) {

    let thatF = this;

    var orderChatInfosUrl = app.globalData.baseUrl + app.globalData.orderChatInfos;
    var jfId = wx.getStorageSync('jfId');
    var buid = wx.getStorageSync('buid');
    //准备参数
    var params = {
      "jfid": jfId,
      "buid": buid,
      "from": 'nanjing'
    };

    util.callAjaxGetSign(orderChatInfosUrl, params, res => {
      if (res) {
        // console.log('项目代码总量', res.data.data);
        if (res.data.resultcode == '0000') {
          let list = res.data.data;

          let dataLabel = [];
          let dateX = [];
          let dataY = [];

          let colorList = ['#597FF3', '#9754D2', '#0AC18A', '#FECA57'];

          if (list.length == 0) {
            dataLabel = [{
              icon: "roundRect",
              name: "江宁区机动车资源业务管理系统"
            }, {
              icon: "roundRect",
              name: "南京城市行政执法总队负载均衡功能虚拟软件"
            }, {
              icon: "roundRect",
              name: "南京城市行政执法总队桌面终端管理软件"
            }, {
              icon: "roundRect",
              name: "南京城市行政执法总队网上办事软件运维服务"
            }];
            dateX = ["10/02", "10/03", "10/04", "10/05", "10/06"];

            for (let i = 0; i < dataLabel.length; i++) {
              dataY.push({
                name: dataLabel[i].name,
                type: 'line',
                stack: '总量',
                areaStyle: {},
                symbol: 'none',
                smooth: true,
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0.2,
                      color: colorList[i]
                    }, {
                      offset: 1,
                      color: '#ffffff'
                    }])
                  }
                },
                data: [0, 0, 0, 0, 0]
              });
            }

            setTimeout(function() {
              //要延时执行的代码
              thatF.chartAreaCharts(dataLabel, dateX, dataY);
            }, 1000)



          } else {
            for (let i = 0; i < list.length; i++) {
              dataLabel.push({
                name: list[i].orderName,
                icon: 'roundRect'
              });
              let dataNum = [];
              for (let j = 0; j < list[i].chatInfoList.length; j++) {
                dataNum.push(list[i].chatInfoList[j].codeNum);
                if (i == 0) {
                  let dates = list[i].chatInfoList[j].strDate.split('-')[1] + '/' + list[i].chatInfoList[j].strDate.split('-')[2]
                  dateX.push(dates);
                }
              }
              dataY.push({
                name: list[i].orderName,
                type: 'line',
                stack: '总量',
                areaStyle: {},
                symbol: 'none',
                smooth: true,
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0.2,
                      color: colorList[i]
                    }, {
                      offset: 1,
                      color: '#ffffff'
                    }])
                  }
                },
                data: dataNum
              });
            }
            setTimeout(function() {
              //要延时执行的代码
              thatF.chartAreaCharts(dataLabel, dateX, dataY);
            }, 1000)
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

  // 折线图
  chartAreaCharts: function(dataLabel, dateX, dataY) {
    chartArea.setOption({
      color: ['#597FF3', '#9754D2', '#0AC18A', '#FECA57'],
      tooltip: {
        trigger: 'axis'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: dataLabel,
        bottom: 10,
        orient: "vertical",
        itemWidth: 24, // 设置宽度
        itemHeight: 2, // 设置高度
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '30%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#666666',
            type: 'solid',
            opacity: 0
          }
        },
        axisTick: {
          lineStyle: {
            color: "#666666",
            width: 0,
          }
        },
        data: dateX
      },
      yAxis: {
        type: 'value',
        name: '(万行)',
        nameLocation: 'end',
        nameTextStyle: {
          color: '#95AAC6',
          fontSize: 10,
        },
        axisLine: {
          lineStyle: {
            color: '#666666',
            type: 'solid',
            opacity: 0
          }
        },
        axisTick: {
          lineStyle: {
            color: "#666666",
            width: 0,
          }
        },
        axisLabel: {
          color: '#666666',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#dddddd'
          }
        }
      },
      series: dataY
    });
  },

  // 项目人力交付情况
  getDocumentInfo: function(that) {

    let thatF = this;

    var documentInfoUrl = app.globalData.baseUrl + app.globalData.selectOrdersDocumentInfo;
    var buid = wx.getStorageSync('buid');
    //准备参数
    var params = {
      "buId": buid
    };

    util.callAjaxGetSign(documentInfoUrl, params, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          let list = res.data.data ? res.data.data : '';
          let dataY = [];
          let dataX1 = [];
          let dataX2 = [];

          if (list == '') {
            dataY = ["南京市", "南京市", "雨花区", "雨花区"];
            dataX1 = [0, 0, 0, 0];
            dataX2 = [0, 0, 0, 0];



            setTimeout(function() {
              //要延时执行的代码
              thatF.chartBarCharts(dataY, dataX1, dataX2);
            }, 1000)

            // this.chartBarCharts(dataY, dataX1, dataX2);
          } else {
            for (let i = 0; i < list.length; i++) {
              dataY.push(list[i].orderName);
              dataX1.push(list[i].checkPonitCount);
              dataX2.push(list[i].checkPonitDocCount);
            }

            setTimeout(function() {
              //要延时执行的代码
              thatF.chartBarCharts(dataY, dataX1, dataX2);
            }, 1000)
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

  // 横向柱状图
  chartBarCharts: function(dataY, dataX1, dataX2) {
    chartBar.setOption({
      color: ['#c9d5fa', '#6493f7'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        name: '交付件数量',
        nameTextStyle: {
          color: '#9B9B9B',
          fontSize: 10,
        },
        nameLocation: 'center',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eeeeee',
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: dataY,
        axisLine: {
          lineStyle: {
            color: '#c6c6c6',
            width: 2
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#696969',
          fontSize: 12,
          interval: 0,
          formatter: function(value) {
            if (value.length > 4 && value.length < 8) {
              return value.substring(0, 4) + '\n' + value.substring(4);
            } else if (value.length > 8) {
              return value.substring(0, 4) + '\n' + value.substring(4, 8) + "...";

            } else {
              return value;
            }

          }
        }
      },
      series: [{
          name: '检查点',
          type: 'bar',
          itemStyle: {
            barBorderRadius: 5,
            normal: {
              barBorderRadius: 15,
              color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{
                    offset: 0,
                    color: '#e3eafd'
                  },
                  {
                    offset: 1,
                    color: '#c3d0f9'
                  }
                ]
              )
            },
            emphasis: {
              barBorderRadius: 15,
              color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{
                    offset: 0,
                    color: '#e3eafd'
                  },
                  {
                    offset: 1,
                    color: '#c3d0f9'
                  }
                ]
              )
            }
          },
          data: dataX1
        },
        {
          name: '有提交物的检查点',
          type: 'bar',
          itemStyle: {
            normal: {
              barBorderRadius: 15,
              color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{
                    offset: 0,
                    color: '#79c1ff'
                  },
                  {
                    offset: 1,
                    color: '#3d43e8'
                  }
                ]
              )
            },
            emphasis: {
              barBorderRadius: 15,
              color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{
                    offset: 0,
                    color: '#79c1ff'
                  },
                  {
                    offset: 1,
                    color: '#3d43e8'
                  }
                ]
              )
            }
          },
          data: dataX2
        }
      ]
    });
  },

  /*begin 圆形进度条*/
  drawProgressbg: function() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg');
    var that = this;
    var fenshu = that.data.fenshu;
    ctx.setLineWidth(3); // 设置圆环的宽度
    if (fenshu >= 80) {
      ctx.setStrokeStyle('#a6e7d3'); // 设置圆环的颜色
    } else if (fenshu >= 70 && fenshu < 80) {
      console.log('70----');
      ctx.setStrokeStyle('#acd0e7');
    } else if (fenshu >= 60 && fenshu < 70) {
      console.log('60----');
      ctx.setStrokeStyle('#fbd3ae');
    } else if (fenshu >= 0 && fenshu < 60) {
      ctx.setStrokeStyle('#f9b2b4');
    };
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(55, 55, 45, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
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

    context.setLineWidth(14);
    if (fenshu >= 80) {
      context.setStrokeStyle(gradient1);
    } else if (fenshu >= 70 && fenshu < 80) {
      context.setStrokeStyle(gradient2);
    } else if (fenshu >= 60 && fenshu < 70) {
      context.setStrokeStyle(gradient3);
    } else if (fenshu >= 0 && fenshu < 60) {
      context.setStrokeStyle(gradient4);
    };

    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(55, 55, 45, -Math.PI / 2, -step * Math.PI - Math.PI / 2, true);
    context.stroke();
    context.draw();
  },
  countInterval: function() {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count < this.data.fenshu) {
        /* 绘制彩色圆环进度条
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (100 / 2));
        this.data.chushifenshu++;
        this.data.count++;
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
  onPageScroll: function(e) {
    if (e.scrollTop >= 480 && !this.data.drawn) {
      let activeColor = '';
      let fenshuAc = this.data.fenshu;

      if (fenshuAc >= 80) {
        activeColor = 'green'
      } else if (fenshuAc >= 70 && fenshuAc < 80) {
        activeColor = 'blue'
      } else if (fenshuAc >= 60 && fenshuAc < 70) {
        activeColor = 'orange'
      } else if (fenshuAc >= 0 && fenshuAc < 60) {
        activeColor = 'red'
      };

      console.log(activeColor);
      this.setData({
        active: activeColor
      });


      this.drawProgressbg();
      this.countInterval();
      this.data.drawn = true;
    }
  },

  /*end 圆形进度条*/


  //点击显示当前的分数
  codeQualityBind: function(e) {

    let activeColor;
    let fenshuAc = this.data.codeQuality[e.currentTarget.dataset.index].codeTotal

    if (fenshuAc >= 80) {
      activeColor = 'green'
    } else if (fenshuAc >= 70 && fenshuAc < 80) {
      activeColor = 'blue'
    } else if (fenshuAc >= 60 && fenshuAc < 70) {
      activeColor = 'orange'
    } else if (fenshuAc >= 0 && fenshuAc < 60) {
      activeColor = 'red'
    };




    this.setData({
      codeIndex: e.currentTarget.dataset.index,
      fenshu: fenshuAc,
      active: activeColor
    });
    this.drawProgressbg();
    this.countInterval();
    this.drawCircle();
    this.data.drawn = true;
  },

  // 待办事项  更多
  backlogListBin: function() {
    wx.navigateTo({
      url: '/pages/web/inform'
    });
  },

  // 项目健康度  跳转到详情页
  degreeTitle: function(e) {
    const {
      activeTabKey
    } = this.data;

    const {
      orderId,
      orderName,
      projectId,
      bodyType,
      orderStatus,
      pstatus,
      projectIdSecret,
      orderNo
    } = e.currentTarget.dataset.tookit.orderData;

    wx.navigateTo({
      url: activeTabKey === 'cgzb' ?
        `/pages/caigouxiangqing/index?orderId=${orderId}&orderName=${orderName}` : `/pages/content/index?orderId=${orderId}&orderName=${orderName}&id=${projectId}&bodytype=${bodyType}&page=0&proIdSecret=${projectIdSecret}&orderNo=${orderNo}`,
    })
  },

  // 问题沟通
  degreeIssue: function(e) {
    const {
      activeTabKey
    } = this.data;

    const {
      orderId,
      orderName,
      projectId,
      bodyType,
      orderStatus,
      pstatus,
      projectIdSecret,
      orderNo
    } = e.currentTarget.dataset.tookit.orderData;

    wx.navigateTo({
      url: activeTabKey === 'cgzb' ?
        `/pages/caigouxiangqing/index?orderId=${orderId}&orderName=${orderName}` : `/pages/content/index?orderId=${orderId}&orderName=${orderName}&id=${projectId}&bodytype=${bodyType}&page=4&proIdSecret=${projectIdSecret}&orderNo=${orderNo}`,
    })
  }

}))