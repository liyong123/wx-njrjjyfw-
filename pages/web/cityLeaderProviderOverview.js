import util from '../../util/util.js';
import dateUtil from '../../util/dateUtil.js'
import filter from '../../util/filter.js';
import * as echarts from '../../ec-canvas/echarts';
var app = getApp();

// 为了对应接口返回数据key的奇葩设定
var keys = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

var chartPie = null;
var optionPie = {
  color: ['#ffe066', '#f25f5c','#247ba0', '#70c1b3', '#50514f','#f4f1de','#e07a5f','#3d405b','#81b29a','#f2cc8f'],
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

    series: [
      {
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
              count:{
                color:'#5a5a5a',
                fontSize: 12,
              },
              normal: {
                color: '#999999',
                fontSize: 12,
              },
              name: {
                color: '#5a5a5a',
                fontSize:12,
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
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
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
  grid:[{
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
    axisLine:{
      lineStyle:{
        color:'#e9ebee',
      }
    },
    axisLabel:{
      color:'#839ef2',
      interval: 0,
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {show: false},
    axisTick: {show:false},
  },
  series: [{
    type: 'bar',
    label: {
      show: true,
      position:'insideTop',
      color: 'white',
    },
    itemStyle: {
      color:'#839ef2',
      barBorderRadius: 8,
    }
  }],

  animationType: 'scale',
  animationEasing: 'elasticOut',
  animationDelay: function (idx) {
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
    tabDatas: [],
    currentTab: 2,
    // 整体数据
    totalCount:{}, 

    // 年营业额分布数据
    anualSales:[],

    // 政府行业数据分布
    GovData:[],

      // 供应商资质
    licenseTab: [{
      name:'双软',
      type:2
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
    licenseData:[[],[],[],[]],

    // 规模分布
    staffData:[], 

    ecPie: {
      onInit: initChartPie,
    },
    ecBar: {
      onInit: initChartBar,
    }
  },

  onLoad: function (options) {
    var that = this;
    if(options.currentIndex && options.currentIndex!=""){
      that.setData({
        currentTab: options.currentIndex
      })
    }
  },
  /**
   * 生命周期函数--页面显示/切入前台时触发
   */  
  onShow: function () {
    var that = this;
    that.setData({
      tabDatas: [
        { title: "全市总投入" },
        { title: "全市总建设" },
        { title: "参与供应商" }
      ]
    })
    wx.showLoading({
      title: '',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.fetchData();
  },


  //tab切换
  tabChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.tab
    });
    if(that.data.currentTab == 0 || that.data.currentTab == 1){
      wx.navigateTo({
        url: './cityLeaderIndex?currentIndex='+ that.data.currentTab,
      })
    }
  },

  // 资质tab切换
  licenseTabChanged: function(e){
    var tabIndex = e.currentTarget.dataset.tab;
    this.changeLicense(tabIndex);
  },

  changeLicense:function(index) {
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
  fetchData:function(){
    this.getSPTotalCount();

    this.getSPAnualSales();
    this.getSPStaff();
    this.getSPGovDataPercent();
    this.getAllSPQualify();
  },

  /**
   * 顶部概览数据
   */
  getSPTotalCount: function(){
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
  getSPAnualSales: function () {
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
          var dataset = [['sales', 'count']];
          for (var i=0; i < keys.length; i++){
            var sale = result[keys[i] + 'Item'] || '';
            if (sale == '') break;
            dataset.push([sale, result[keys[i] + 'Count']]);
          }
          that.data.anualSales = dataset;

          chartBar.setOption({
            dataset:{
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
  getSPStaff: function () {
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
          for(var i = 0; i < dataset.length; i++){
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
  getSPGovDataPercent: function () {
    var url = app.globalData.yjBaseUrl + app.globalData.getSPGovDataPercent;
    var params = {

    }
    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      if (res) {
        if (res.data.status == 1) {
          /*
          {"data":[{"tag_code":"C020103020149","tag_name":"安监","cou":3},{"tag_code":"C020103020108","tag_name":"教育","cou":1}],"status":1,"message":"获取成功"} */
          //赋值
          var result = res.data.data;
          var total = res.data.total;
          for (var i = 0; i < result.length; i++) {
            if (result[i].tag_name == '教育'){
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
        util.showAjaxTip();
      }
    })
  },

  /**
   * 获取所有资质数据
   */
  getAllSPQualify: function(){
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
  getSPQualifInfo: function (index, url, key) {
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
          }else{
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

}))