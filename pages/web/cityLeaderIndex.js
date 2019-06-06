import util from '../../util/util.js';
import dateUtil from '../../util/dateUtil.js'
import filter from '../../util/filter.js';
import * as echarts from '../../ec-canvas/echarts';
import geoJson from './cityLeaderIndexDatas.js';
import {
  pages
} from '../../auth.js';
var app = getApp();
var investedBaseUrl = app.globalData.yjBaseUrl;
var cityLeaderIndexTotalMoney = investedBaseUrl + app.globalData.getCityLeaderIndexTotalMoney; //总投入
var cityLeaderIndexAreaDatas = investedBaseUrl + app.globalData.getCityLeaderIndexAreaDatas; //总投入 区级数据
var buildBaseUrl = app.globalData.baseUrl;
var cityLeaderIndexTotalBuild = buildBaseUrl + app.globalData.getCityLeaderIndexTotalBuild //总建设及总建设区级数据
var chart = null;
var series = [{
  type: 'map',
  mapType: 'nanjing',
  name: "南京云集",
  left: 10,
  right: 0,
  top: 0,
  bottom: 0,
  silent: true,
  label: {
    show: true,
    color: '#fff',
    fontSize: 12,
  },
  itemStyle: {
    borderWidth: 1,
    borderColor: '#fff',
    areaColor: '#E1E1EB',
  },
  emphasis: {
    label: {
      color: '#fff'
    },
    itemStyle: {
      // areaColor: '#3D43E8',
      areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
        offset: 0,
        color: '#79C1FF'
      }, {
        offset: 1,
        color: '#3D43E8'
      }]),
      borderWidth: 0
    }
  },
  animation: false,
  data: [{
      name: "市直属",
      value: "320101"
    },
    {
      name: "玄武区",
      value: "320102",
      label: {
        show: true,
        fontSize: 10
      }
    },
    {
      name: "秦淮区",
      value: "320104",
      label: {
        show: true,
        fontSize: 10
      }

    },
    {
      name: "建邺区",
      value: "320105",
      label: {
        show: true,
        fontSize: 10
      }
    },
    {
      name: "鼓楼区",
      value: "320106",
      label: {
        show: true,
        fontSize: 10
      }
    },
    {
      name: "浦口区",
      value: "320111"
    },
    {
      name: "栖霞区",
      value: "320113"
    },
    {
      name: "雨花台区",
      value: "320114",
      label: {
        show: true,
        fontSize: 10
      }
    },
    {
      name: "江宁区",
      value: "320115"
    },
    {
      name: "六合区",
      value: "320116"
    },
    {
      name: "溧水区",
      value: "320117"
    },
    {
      name: "高淳区",
      value: "320118"
    }

  ]
}];

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  echarts.registerMap('nanjing', geoJson);
  const option = {
    series: series
  };
  chart.setOption(option);
  return chart;
}

// 为了对应接口返回数据key的奇葩设定
var keys = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

var chartPie = null;
var optionPie = {
  color: ['#ffe066', '#f25f5c', '#247ba0', '#70c1b3', '#50514f', '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f'],
  title: {
    left: '6%',
    top: '10%',
    textStyle: {
      color: '#5a5a5a',
      fontSize: 14,
    }
  },
  // tooltip: {
  //   trigger: 'item',
  //   formatter: "{a} <br/>{b} : {c} ({d}%)"
  // },

  series: [{
    type: 'pie',
    radius: ['40%', '60%'],
    center: ['50%', '50%'],
    // data: [
    //   { value: 335, name: '直接访问' },
    //   { value: 310, name: '邮件营销' },
    //   { value: 274, name: '联盟广告' },
    //   { value: 235, name: '视频广告' },
    //   { value: 400, name: '搜索引擎' }
    // ],
    label: {
      normal: {
        fontSize: 14,
        lineHeight: 14,
        formatter: '{count|{c}}{normal|家}\n{d}%\n{name|{b}}',
        rich: {
          count: {
            color: '#5a5a5a',
            fontSize: 12,
          },
          normal: {
            color: '#999999',
            fontSize: 12,
          },
          name: {
            color: '#5a5a5a',
            fontSize: 12,
          }
        }
      }
    },
    labelLine: {
      normal: {
        smooth: 0.2,
        length: 10,
        length2: 20
      }
    },

    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function(idx) {
      return Math.random() * 200;
    }
  }]
};

function initChartPie(canvas, width, height) {
  chartPie = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartPie);


  chartPie.setOption(optionPie);
  return chartPie;
};

var chartBar = null;
var optionBar = {

  tooltip: {
    trigger: 'item',

  },
  grid: [{
    left: 0,
    right: 0,
    top: '5%',
    bottom: '8%',
    containLabel: true,
  }],
  // dataset:{
  //   // source: [['volume', 'count'],['<100', 43],
  //   //           ['100~200', 83],
  //   //           ['Cheese Cocoa', 86],
  //   //           ['Walnut Brownie', 72]]
  // },

  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#e9ebee',
      }
    },
    axisLabel: {
      color: '#839ef2',
      interval: 0,
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
  },
  series: [{
    type: 'bar',
    label: {
      show: true,
      position: 'insideTop',
      color: 'white',
    },
    itemStyle: {
      color: '#839ef2',
      barBorderRadius: 8,
    }
  }],

  animationType: 'scale',
  animationEasing: 'elasticOut',
  animationDelay: function(idx) {
    return Math.random() * 200;
  }
};

function initChartBar(canvas, width, height) {
  chartBar = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartBar);


  chartBar.setOption(optionBar);
  return chartBar;
}

Page(filter.identityFilter({
  data: {
    currentYear: '',
    yearBoardShow:false,
    yearGrps:[],
    selectedYearTab:1,
    pages: [],
    cityTabDatas: [],
    currentTab: 0,
    currentArea: -1,
    totalMoney: "--",
    totalBuild: "--",
    purchaseIn: "--",
    buildIn: "--",
    alreadyDeal: "--",
    alreadyPass: "--",
    eachAreaDatas: [],
    boardShow: false,
    boardDatas: [],
    boardDataReady: false,
    boardAreaName: '',
    purchaseNum: "--",
    dealMoney: "--",
    proportion: "--",
    boardPositionLeft: 0 + "rpx",
    boardPositionTop: 0 + "rpx",
    boardArrowShow: true,
    boardArrowBottomShow: true,
    mainContentHight: (wx.getSystemInfoSync().windowHeight - 275 * (wx.getSystemInfoSync().windowWidth / 750)) + "px",
    mapContentTop: ((wx.getSystemInfoSync().windowHeight - 275 * (wx.getSystemInfoSync().windowWidth / 750) - 100 * (wx.getSystemInfoSync().windowWidth / 750) - 180 * (wx.getSystemInfoSync().windowWidth / 750)) / 2) + (180 * (wx.getSystemInfoSync().windowWidth / 750)) + "px",
    eachAreaTop: ((wx.getSystemInfoSync().windowHeight - 275 * (wx.getSystemInfoSync().windowWidth / 750) - 100 * (wx.getSystemInfoSync().windowWidth / 750) - 180 * (wx.getSystemInfoSync().windowWidth / 750)) / 2) + (180 * (wx.getSystemInfoSync().windowWidth / 750)),
    ec: {
      onInit: initChart
    },

    // 整体数据
    totalCount: {},

    // 年营业额分布数据
    anualSales: [],

    // 政府行业数据分布
    GovData: [],

    // 供应商资质
    licenseTab: [{
      name: '双软',
      type: 2
    }, {
      name: '系统集成',
      type: 4
    }, {
      name: 'CMMI',
      type: 1
    }, {
      name: 'ISO',
      type: 3
    }],
    licenseTabSel: 0,
    licenseData: [
      [],
      [],
      [],
      []
    ],

    // 规模分布
    staffData: [],

    ecPie: {
      onInit: initChartPie,
    },
    ecBar: {
      onInit: initChartBar,
    }
  },

  onLoad: function(options) {

    const userData = wx.getStorageSync("userData") || '0';
    this.setData({
      pages: pages[userData * 1]
    });
    var that = this;
    if (options.currentIndex && options.currentIndex != "") {
      that.setData({
        currentTab: options.currentIndex
      })
    }

  },
  /**
   * 生命周期函数--页面显示/切入前台时触发
   */
  onShow: function() {
    var that = this;
    //进入页面滚到页面顶部
    wx.pageScrollTo({
      scrollTop: 0,
    });
    that.setData({
      cityTabDatas: [{
          title: "全市总投入"
        },
        {
          title: "全市总建设"
        },
        {
          title: "供应商概览"
        }
      ],
      eachAreaDatas: [{
          name: "市直属",
          value: "320101",
          namePinyin: "SHIZHISHU"
        },
        {
          name: "玄武区",
          value: "320102",
          namePinyin: "XUANWU"
        },
        {
          name: "秦淮区",
          value: "320104",
          namePinyin: "QINHUAI"
        },
        {
          name: "建邺区",
          value: "320105",
          namePinyin: "JIANYE"
        },
        {
          name: "鼓楼区",
          value: "320106",
          namePinyin: "GULOU"
        },
        {
          name: "浦口区",
          value: "320111",
          namePinyin: "PUKOU"
        },
        {
          name: "栖霞区",
          value: "320113",
          namePinyin: "QIXIA"
        },
        {
          name: "雨花台区",
          value: "320114",
          namePinyin: "YUHUATAI"
        },
        {
          name: "江宁区",
          value: "320115",
          namePinyin: "JIANGNING"
        },
        {
          name: "六合区",
          value: "320116",
          namePinyin: "LIUHE"
        },
        {
          name: "溧水区",
          value: "320117",
          namePinyin: "LISHUI"
        },
        {
          name: "高淳区",
          value: "320118",
          namePinyin: "GAOCHUN"
        }
      ],
      yearGrps:[
        { year: "2018" }
      ]

    });

    var date = new Date();
    var currentYear = date.getFullYear();
    var yearGrpsCopy = that.data.yearGrps.slice();
    that.setData({
      currentYear: currentYear
    });
    
    for(var i =0 ;i<parseInt(that.data.currentYear-2018);i++){
       yearGrpsCopy.push({year:(2018+i+1).toString()})
    }
     
    that.setData({
      yearGrps: yearGrpsCopy
    })

    
    if (that.data.currentTab == 0) {
      that.getCityLeaderIndexTotalMoneyDatas(that);
      that.getDityLeaderIndexAreaDatas(that);
    } else if (that.data.currentTab == 1) {
      that.getCityLeaderIndexTotalBuildDatas(that);
    }
    

    // this.fetchOverviewData();
  },
  // 页面隐藏/切入后台时触发
  onHide() {
    this.resetMap()
  },
  // 页面卸载时触发
  onUnload() {
    this.resetMap()
  },
  resetMap() {
    this.setData({
      currentArea: -1,
    })
    //恢复地图
    var mapDatas = series[0].data;
    for (var i = 0; i < mapDatas.length; i++) {
      mapDatas[i].selected = false
    }
    chart.setOption({
      series: series
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //currentTab==0时，获取总投入接口
  getCityLeaderIndexTotalMoneyDatas: function(that) {
    let moneyParams = {
      flagYear:that.data.currentYear
    }
    util.callAjaxGetSign(cityLeaderIndexTotalMoney, moneyParams, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          let dataTotal = res.data.data;
          if (dataTotal && dataTotal.length > 0) {
            that.setData({
              totalMoney: dataTotal[0].totalBudget && dataTotal[0].totalBudget != "" ? dataTotal[0].totalBudget : dataTotal[0].totalBudget === 0 ? "0" : "暂无",
              purchaseIn: dataTotal[0].totalPrice && dataTotal[0].totalPrice != "" ? dataTotal[0].totalPrice : dataTotal[0].totalPrice === 0 ? "0" : "暂无",
              alreadyDeal: dataTotal[0].deaPrice && dataTotal[0].deaPrice != "" ? dataTotal[0].deaPrice : dataTotal[0].deaPrice === 0 ? "0" : "暂无"
            })
          }
        } else {
          that.setData({
            totalMoney: "暂无",
            purchaseIn: "暂无",
            alreadyDeal: "暂无"
          })
          console.log("总投入数据获取失败！")
        }
      }
    })
  },
  //currentTab==0时，获取弹出面板上要展示的各区的数据
  getDityLeaderIndexAreaDatas: function(that) {
    let areaParams = {
      flagYear: that.data.currentYear
    }
    util.callAjaxGetSign(cityLeaderIndexAreaDatas, areaParams, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          let dataTotal = res.data.data;
          if (dataTotal && dataTotal.length > 0) {
            that.setData({
              boardDatas: dataTotal,
              boardDataReady: true
            })
          }
        } else {
          console.log("总投入区级数据获取失败！")
        }
      }
    })
  },
  //currentTab==1时，获取总建设接口
  getCityLeaderIndexTotalBuildDatas: function(that) {
    let params = {
      from: "nanjing",
      code: "1000"
    }
    util.callAjaxGetSign(cityLeaderIndexTotalBuild, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          let dataTotal = res.data.data;
          if (dataTotal) {
            that.setData({
              totalBuild: dataTotal.total && dataTotal.total != "" ? dataTotal.total : dataTotal.total === 0 ? "0" : "暂无",
              buildIn: dataTotal.building && dataTotal.building != "" ? dataTotal.building : dataTotal.building === 0 ? "0" : "暂无",
              alreadyPass: dataTotal.checked && dataTotal.checked != "" ? dataTotal.checked : dataTotal.checked === 0 ? "0" : "暂无"
            });
            if (dataTotal.list && dataTotal.list.length > 0) {
              that.setData({
                boardDatas: dataTotal.list
              })
            }
          }
        } else {
          that.setData({
            totalBuild: "暂无",
            buildIn: "暂无",
            alreadyPass: "暂无"
          });
          console.log("总投入区级数据获取失败！")
        }
      }
    })
  },
  //tab切换
  tabChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.citytab,
      currentArea: -1,
      boardShow: false,
    })
    //tab切换恢复地图
    this.resetMap();
    if (that.data.currentTab == 0 || that.data.currentTab == 1) {
      that.setData({
        boardDatas: [],
        totalMoney: "--",
        totalBuild: "--",
        purchaseIn: "--",

        buildIn: "--",
        alreadyDeal: "--",
        alreadyPass: "--",

        purchaseNum: "--",
        dealMoney: "--",
        proportion: "--",
      });

      // 根据currentTab 值，访问相应的接口
      if (that.data.currentTab == "0") {
        that.getCityLeaderIndexTotalMoneyDatas(that);
        that.getDityLeaderIndexAreaDatas(that);
      } else if (that.data.currentTab == "1") {
        that.getCityLeaderIndexTotalBuildDatas(that);
      } else {
        that.setData({
          boardDatas: []
        })
      }
    } else if (that.data.currentTab == 2) {
      // wx.navigateTo({
      //   url: './cityLeaderProviderOverview?currentIndex=2',
      // })
      that.fetchOverviewData();
    }

  },

  areaTabChange: function(e) {
    if (this.data.boardDataReady) {
      this._areaTabChange(e);
    } else {
      setTimeout(() => {
        this.areaTabChange(e)
      }, 100)
    }
  },

  _areaTabChange: function(e) {
    var that = this;
    that.setData({
      currentArea: e.currentTarget.dataset.areatab
    });
    var currentArea = that.data.currentArea;
    console.log(currentArea)
    var eachAreaDatas = that.data.eachAreaDatas;
    var mapDatas = series[0].data;
    for (var i = 0; i < eachAreaDatas.length; i++) {
      if (currentArea == i) {
        mapDatas[i].selected = true
      } else {
        mapDatas[i].selected = false
      }
    }
    chart.setOption({
      series: series
    })

    var choosedCode = eachAreaDatas[currentArea].value;
    var choosedName = eachAreaDatas[currentArea].name;
    var choosedNamePinyin = eachAreaDatas[currentArea].namePinyin;
    var boardDataAll = that.data.boardDatas;
    //弹出面板
    that.setData({
      boardShow: true,
      boardAreaName: choosedName + " " + choosedNamePinyin,
    });
    //匹配弹框位置
    switch (choosedName) {
      case "市直属":
        that.setData({
          boardArrowShow: false,
          boardArrowBottomShow: false,
          boardPositionLeft: 380 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 150 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "玄武区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 240 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 150 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "秦淮区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 236 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 180 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "建邺区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 192 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 170 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "鼓楼区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 200 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 140 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "浦口区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 160 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 160 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "栖霞区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 350 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 110 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "雨花台区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 210 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 190 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "江宁区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 320 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 175 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "六合区":
        that.setData({
          boardArrowShow: true,
          boardArrowBottomShow: false,
          boardPositionLeft: 310 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 35 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "溧水区":
        that.setData({
          boardArrowShow: false,
          boardArrowBottomShow: true,
          boardPositionLeft: 364 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 80 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      case "高淳区":
        that.setData({
          boardArrowShow: false,
          boardArrowBottomShow: true,
          boardPositionLeft: 364 + "rpx",
          boardPositionTop: (that.data.eachAreaTop + 170 * (wx.getSystemInfoSync().windowWidth / 750)) + "px"
        });
        break;
      default:
        break;
    }
    if (boardDataAll.length > 0) {
      for (let eachData of boardDataAll) {
        if (that.data.currentTab == 0) {
          if (eachData.area_code == choosedCode) {
            that.setData({
              purchaseNum: eachData.pcount ? (eachData.pcount + "家") : "暂无",
              dealMoney: eachData.purchase_dea_price ? (eachData.purchase_dea_price + "元") : "暂无",
              proportion: eachData.area_pur_dea_per ? (eachData.area_pur_dea_per + "%") : "暂无"
            })
            return
          } else {
            that.setData({
              purchaseNum: "暂无",
              dealMoney: "暂无",
              proportion: "暂无"
            })
          }
        } else if (that.data.currentTab == 1) {
          if (eachData.code == choosedCode) {
            that.setData({
              purchaseNum: eachData.total && eachData.total != "" ? (eachData.total + "个") : eachData.total === 0 ? "0" : "暂无",
              proportion: eachData.proportion && eachData.proportion != "" ? (eachData.proportion + "%") : eachData.proportion === 0 ? "0%" : "暂无"
            })
            return
          } else {
            that.setData({
              purchaseNum: "暂无",
              proportion: "暂无"
            })
          }
        }
      }
    } else {
      that.setData({
        purchaseNum: "暂无",
        dealMoney: "暂无",
        proportion: "暂无"
      })
    }

  },

  coloseBoard: function() {
    var that = this;
    if (this.data.currentTab == 2) return;
    var index = that.data.currentArea; //选中的区
    var currentTab = that.data.currentTab; //头部tab值
    var currentYear = that.data.currentYear;
    if (index == -1) {
      index = 0
    }
    if (that.data.currentTab == 0 || that.data.currentTab == 1) {
      wx.navigateTo({
        url: './cityLeaderArea?index=' + index + "&currentTab=" + currentTab + "&currentYear=" + currentYear
      })
    }
    that.setData({
      boardShow: false,
      yearBoardShow:false
    })
  },

  //点击屏幕其他位置，面板消失
  hideMapBoardModal: function(e) {
    var that = this;
    that.setData({
      boardShow: false
    })
    this.resetMap()
  },
  hideMapBoardModal2: function(e) {
    console.log("e2:", e)
  },

  // 资质tab切换
  licenseTabChanged: function(e) {
    var tabIndex = e.currentTarget.dataset.tab;
    this.changeLicense(tabIndex);
  },

  changeLicense: function(index) {
    this.setData({
      licenseTabSel: index,
    })

    var option = {
      title: {
        text: this.data.licenseTab[index].name,
      },
      series: [{
        name: index == 2 ? 'CMMI' : '',
        data: this.data.licenseData[index],
        label: {
          normal: {
            formatter: index == 2 ?
              '{count|{c}}{normal|家}\n{d}%\n{normal|{a}}\n{name|{b}}' : '{count|{c}}{normal|家}\n{d}%\n{name|{b}}'
          }
        }
      }],
    };
    chartPie.setOption(option)
  },

  /**
   * 获取数据
   */
  fetchOverviewData: function() {
    wx.showLoading({
      title: '',
    })
    this.getSPTotalCount();

    this.getSPAnualSales();
    this.getSPStaff();
    this.getSPGovDataPercent();
    this.getAllSPQualify();
  },

  /**
   * 顶部概览数据
   */
  getSPTotalCount: function() {
    var url = app.globalData.yjBaseUrl + app.globalData.getSPTotalCount;
    var params = {

    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          //赋值
          that.setData({
            totalCount: res.data.data
          })
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  /**
   * 营业额分布数据
   */
  getSPAnualSales: function() {
    console.log('getSPAnualSales')
    var url = app.globalData.yjBaseUrl + app.globalData.getSPAnualSales;
    var params = {

    }
    // chartBar.showLoading();
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        // chartBar.hideLoading();
        if (res.data.status == 1) {
          /*返回结果结构好奇葩！！！！
          {"data":{"fiveItem":"500以上","fiveCount":1,"fourItem":"301-500","oneItem":"100以下","oneCount":4,"fourCount":0,"threeCount":0,"twoItem":"100-200","twoCount":1,"threeItem":"201-300"},"status":1,"message":"获取成功"} */
          //赋值
          var result = res.data.data;
          var dataset = [
            ['sales', 'count']
          ];
          for (var i = 0; i < keys.length; i++) {
            var sale = result[keys[i] + 'Item'] || '';
            if (sale == '') break;
            dataset.push([sale, result[keys[i] + 'Count']]);
          }
          that.data.anualSales = dataset;

          chartBar.setOption({
            dataset: {
              source: that.data.anualSales
            }
          })

        } else {
          util.showAjaxTip(res.message);
        }
      } else {
        // chartBar.hideLoading();
        util.showAjaxTip();
      }
    })
  },

  /**
   * 人员规模分布数据
   */
  getSPStaff: function() {
    var url = app.globalData.yjBaseUrl + app.globalData.getSPStaff;
    var params = {

    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          /*返回结果结构好奇葩！！！！
          {"data":{"fiveCount":1,"fourItem":"101-200","sixItem":"401-500","eightCount":0,"oneItem":"小于8","oneCount":3,"fourCount":0,"fiveItem":"201-400","sixCount":1,"nineItem":"1000以上","nineCount":1,"sevenCount":0,"eightItem":"751-1000","threeCount":0,"twoItem":"8-20","sevenItem":"501-750","twoCount":0,"threeItem":"21-100"},"status":1,"message":"获取成功"} */
          //赋值
          var result = res.data.data;
          var dataset = [];
          var total = 0;
          for (var i = 0; i < keys.length; i++) {
            var staff = result[keys[i] + 'Item'] || '';
            if (staff == '') break;
            var count = result[keys[i] + 'Count'] || 0;
            total += count;
            dataset.push({
              name: staff,
              count: count
            })
          }
          // 计算百分比
          for (var i = 0; i < dataset.length; i++) {
            dataset[i].percent = (dataset[i].count * 100.0 / total).toFixed(1) + '%';
          }
          that.setData({
            staffData: dataset,
          })
        } else {
          util.showAjaxTip(res.message);
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  /**
   * 政府行业分布 getSPGovDataPercent
   */
  getSPGovDataPercent: function() {
    var url = app.globalData.yjBaseUrl + app.globalData.getSPGovDataPercent;
    var params = {

    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        wx.hideLoading();
        if (res.data.status == 1) {
          /*
          {"data":[{"tag_code":"C020103020149","tag_name":"安监","cou":3},{"tag_code":"C020103020108","tag_name":"教育","cou":1}],"status":1,"message":"获取成功"} */
          //赋值
          var result = res.data.data;
          var total = res.data.total;
          for (var i = 0; i < result.length; i++) {
            if (result[i].tag_name == '教育') {
              result[i].icon = 'jiaoyu.jpg';
            } else if (result[i].tag_name == '公安') {
              result[i].icon = 'gongan.jpg';
            } else if (result[i].tag_name == '通用') {
              result[i].icon = 'tongyong.jpg';
            } else if (result[i].tag_name == '安监') {
              result[i].icon = 'anjian.jpg';
            } else if (result[i].tag_name == '司法') {
              result[i].icon = 'sifa.jpg';
            } else {
              result[i].icon = 'qita.jpg';
            }
            result[i].percent = (result[i].cou * 100.0 / total).toFixed(1) + '%';
          }

          that.setData({
            GovData: result,
          })
        } else {
          util.showAjaxTip(res.message);
        }
      } else {
        wx.hideLoading();
        util.showAjaxTip();
      }
    })
  },

  /**
   * 获取所有资质数据
   */
  getAllSPQualify: function() {
    wx.hideLoading();
    var url = app.globalData.yjBaseUrl + app.globalData.getSPQualifInfo;

    for (var i = 0; i < this.data.licenseTab.length; i++) {
      var key = this.data.licenseTab[i].type
      this.getSPQualifInfo(i, url, key);
    }
  },
  /**
   * 供应商资质 getSPQualifInfo
   */
  getSPQualifInfo: function(index, url, key) {
    var that = this;

    // if (index == 0) {
    //   chartPie.showLoading();
    // }
    var params = {
      key: key,
    }

    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          /*
          {"data":[{"q_name":"CMMI证书","cou":1},{"q_name":"CMMI证书/一级","cou":1},{"q_name":"CMMI证书/三级","cou":1},{"q_name":"CMMI证书/二级","cou":2},{"q_name":"CMMI证书/五级","cou":1},{"q_name":"CMMI证书/四级","cou":1}],"noQaCount":188,"status":1,"message":"获取成功"} */
          //赋值
          var result = res.data.data;
          var dataset = [];
          if (key == 1) {
            for (var n = 0; n < result.length; n++) {
              dataset.push({
                value: result[n].cou,
                name: (result[n].q_name.split('/'))[1] || '',
              })
            }
          } else {
            for (var n = 0; n < result.length; n++) {
              dataset.push({
                value: result[n].cou,
                name: result[n].q_name,
              })
            }
            dataset.push({
              value: res.data.noQaCount,
              name: '无相应资质'
            })
          }

          that.data.licenseData[index] = dataset;
          if (index == 0) {
            // chartPie.hideLoading();
            that.changeLicense(0);
          }
        } else {
          // /chartPie.hideLoading()
          util.showAjaxTip(res.message);
        }
      } else {
        // chartPie.hideLoading()
        util.showAjaxTip();
      }
    })
  },
   
  chooseYearEvent:function(e){
    var that = this;
    var yearBoardShow = that.data.yearBoardShow;
    yearBoardShow =!yearBoardShow;
    that.setData({
      yearBoardShow: yearBoardShow
    })
  },
//年份切换
  clickYearEvent:function(e){
    var that = this;
    that.setData({
      currentYear:e.currentTarget.dataset.yearindex
    })
    if (that.data.currentTab == 0 || that.data.currentTab == 1) {
      that.setData({
        boardDatas: [],
        totalMoney: "--",
        totalBuild: "--",
        purchaseIn: "--",

        buildIn: "--",
        alreadyDeal: "--",
        alreadyPass: "--",

        purchaseNum: "--",
        dealMoney: "--",
        proportion: "--",
        boardShow: false,
      });

      // 根据currentTab 值，访问相应的接口
      if (that.data.currentTab == 0) {
        that.getCityLeaderIndexTotalMoneyDatas(that);
        that.getDityLeaderIndexAreaDatas(that);
      } else if (that.data.currentTab == 1) {
        that.getCityLeaderIndexTotalBuildDatas(that);
      } else {
        that.setData({
          boardDatas: []
        })
      }
    } else if (that.data.currentTab == 2) {
      that.fetchOverviewData();
    }
  }


}))