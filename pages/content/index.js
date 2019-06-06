// pages/content/index.js
import * as echarts from "../../ec-canvas/echarts";
import util from '../../util/util.js';
import time from '../../util/dateUtil.js';
import filter from '../../util/filter.js';
import formatTimeTwo from '../../util/dateUtil.js';
var app = getApp();

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
};


function initCharts(component, option) {
  component.init((canvas, width, height) => {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    chart.setOption(option);
    return chart;
  });
};

Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    currentDelay: 0,
    pageNO: 1,
    yanshou: false,
    guidang: false,
    navbar: ['项目总览', '项目动态', '成员贡献', '代码质量', '问题沟通'],
    pageSize: 10,
    bodyType: '',
    evaluated: true,
    flag: 0,
    proList: {},
    currTime: Date.parse(new Date()), //当前日期时间
    currTimeFmt: time.formatTimeTwo(new Date(), 'Y-M-D'), //当前日期格式化
    //初始化定义的数据
    xiala: [],
    //项目动态初始数据
    xmdt: [],
    stagePointInfo: [],
    orderId: '',
    projectId: "",
    firstPerson: '需求调研分析与设计',
    question: [],
    dynamicDetailMsg: [{
      projectid: 132,
      id: 7,
      jfid: 3111,
      userName: "马明",
      doTime: "2018-05-15 15:05",
      doDate: "2018-05-15",
      type: "0",
      reportType: "",
      content: "现有人员归属-解决空名字.xls",
      title: "",
      startTime: "",
      endTime: "",
      members: "",
      unreaduser: "1175,3111,",
      bodyType: "1"
    }],
    winHeight: '',
    currentTab: 0,
    scrollLeft: 0,
    expandToolBar: true,
    //提问文件图标
    fill_icon: [{
        name: 'excel',
        icon: '../../img/icon_excel.png'
      },
      {
        name: 'jpg',
        icon: '../../img/icon_images.png'
      },
      {
        name: 'png',
        icon: '../../img/icon_images.png'
      },
      {
        name: 'gif',
        icon: '../../img/icon_images.png'
      },
      {
        name: 'pdf',
        icon: '../../img/icon_pdf.png'
      },
      {
        name: 'ppt',
        icon: '../../img/icon_ppt.png'
      },
      {
        name: 'word',
        icon: '../../img/icon_word.png'
      }
    ],
    //发起问题 选择阶段
    choosephase: [{
        code: '1',
        name: ''
      },
      {
        code: '2',
        name: '开发阶段'
      },
      {
        code: '3',
        name: '测试阶段'
      },
    ],
    choose: 0,
    qustestarea: "",
    userid: [],
    //提醒谁看展开收缩 初始数据定义
    showView: true,
    personsee: [],
    belongType: 0,

    questionId: '',
    contents: '',

    /**------------项目动态参数开始------------------*/
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    calendarList: [],

    //日期初始化选中样式
    selectCSS: 'bk-color-day',
    dynamicData: { //六种状态的动态，1为有动态，0为没有动态
      "dynamicType": 1,
      "dynamicType1": 1,
      "dynamicType2": 1,
      "dynamicType3": 1,
      "dynamicType4": 1,
      "dynamicType5": 1
    },
    /**----------------项目动态参数结束------------------*/

    /*--------------成员贡献开始-------------*/
    ddd: [],

    echarOption: [],

    cygx: {
      lazyLoad: true
    },
    /*-----------成员贡献结束------------*/
    /*---------代码质量开始--------------*/
    scoreData: {},
    zl_list: [{
        title: '编译',
        des: '满分100分。代码编译时，出现错误、警告、提示越多，得分越低。合计得分越高，可编译性越好。',
        score: 60
      },
      {
        title: '可维护',
        des: '满分100分。代码复杂度低，代码重复性越低，得分越高，代码可维护性越好。',
        score: 61
      },
      {
        title: '规范性',
        des: '满分100分。代码注释率越高，得分越高；命名违反规则越多，得分越低。合计得分越高，规范性越好。',
        score: 62
      },
      {
        title: '可靠性',
        des: '满分100分。代码违反安全性规则越多，得分越低；代码违反常规编写规则，次数越多，得分越低；代码出现坏习惯越多，得分越低。合计得分越高，代码可靠性越高。',
        score: 63
      }
    ],
    chushifenshu: 0,
    fenshu: 9,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    ec: {
      onInit: initChart,
      lazyLoad: true
    },
    /*-----------------代码质量结束---------------*/
  },

  // watchSupplier: function() {
  //   app.globalData.detailData = this.data;
  //   wx.navigateTo({
  //     url: '/pages/evaluateSupplier/index?disabled=true'
  //   })
  // },

  // evaluateSupplier: function () {
  //   app.globalData.detailData = this.data;
  //   wx.navigateTo({
  //     url: '/pages/evaluateSupplier/index'
  //   })
  // },


  //点击修改事件
  onChangeShowState: function(event) {
    var stageIndex = event.currentTarget.dataset.stageIndex;
    var that = this;
    var stageShow = "xiala[" + stageIndex + "].showView";
    that.setData({
      [stageShow]: !that.data.xiala[stageIndex].showView
    });
  },

  //提醒给谁看
  onChangeStateLook: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    });
  },

  //点击选择类型
  clickPerson: function() {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },

  /**
   * 滑动切换tab
   */
  switchTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCol();
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //获取当前tab页面切换
  caigouxqTap: function(e) {
    const currentTab = e.detail.key * 1;
    this.setData({
      currentTab,
      expandToolBar: true
    })
    if (currentTab == 2) {
      var that = this;
      /*----------成员贡献开始-------*/
      var arrays = that.data.echarOption;
      for (var i = 0; i < arrays.length; i++) {
        //初始化数据
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          grid: {
            show: false, //是否显示直角坐标系的网格,true显示，false不显示
            borderWidth: 0,
            borderColor: '#ff0000',
            x: 40,
            y: 20
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: { // 坐标X轴线样式
              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                color: '#9B9B9B',
                width: 1,
                type: 'solid'
              }
            },
            data: arrays[i].dataTime,
          }],
          yAxis: [{
            type: 'value',
            axisLine: { // 坐标Y轴线样式
              show: true, // 默认显示，属性show控制显示与否
              lineStyle: {
                color: '#9B9B9B',
                width: 1,
                type: 'solid'
              }
            },
          }],
          series: [{
            name: '增加代码量',
            type: 'line',
            smooth: true,
            data: arrays[i].addCode,
            areaStyle: {
              type: 'default',
              color: "#E6F8F3"
            }
          }, {
            name: '删除代码量',
            type: 'line',
            smooth: true,
            data: arrays[i].delCode,
            areaStyle: {
              type: 'default',
              color: "#FFF3EA"
            }
          }]
        };
        this.component = that.selectComponent('#mychart-dom-bar' + i);
        initCharts(this.component, option);
      }
      /*----------成员贡献结束-------*/
    }
  },

  onPageScroll: function(e) {
    //console.log(e.scrollTop);
    if (this.data.currentTab == 2) {
      if (e.scrollTop >= 60 && this.data.expandToolBar) {
        this.setData({
          expandToolBar: false
        })
      } else if (e.scrollTop < 60 && !this.data.expandToolBar){
        this.setData({
          expandToolBar: true
        })
      }
    }
  },



  //滑动切换超过1屏之后  给页面加大
  checkCol: function() {
    var that = this;
    if (that.data.currentTab > 4) {
      that.setData({
        scrollLeft: 300
      })
    } else {
      that.setData({
        scrollLeft: 0
      })
    }
  },

  //拨打手机号码
  call: function(e) {
    var mobile = e.currentTarget.dataset.mobile
    if (mobile != null && mobile != '') {
      wx.makePhoneCall({
        phoneNumber: mobile
      })
    } else {
      // wx.showModal({
      //   title: "温馨提示",
      //   content: "该用户手机号码为空",
      //   showCancel: false,
      //   confirmText: "确定"
      // });
    }
  },


  //问题沟通
  question: function(e) {
    var that = this;
    var projectId = e.currentTarget.dataset.id;
    var bodytype = e.currentTarget.dataset.type;
    wx.redirectTo({
      url: '../content/index?page=4&id=' + projectId + '&bodytype=' + bodytype,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    showView: (options.showView == "true" ? true : false);
    //获取项目进展及项目动态，成员贡献 保存ID  ，以供使用
    var projectId = options.id;
    //订单ID
    var order = options.orderid == undefined ? "" : options.orderid;
    var proIdSecret = options.proIdSecret == undefined ? wx.getStorageSync('proIdSecret') : options.proIdSecret;
    wx.setStorageSync('proIdSecret', proIdSecret);
    this.setData({
      orderName: options.orderName,
      proIdSecret: proIdSecret
    });

    //页面标题为路由参数
    options.orderName && wx.setNavigationBarTitle({
      title: options.orderName
    })
    //项目类型
    var bodyType = options.bodytype;
    //跳转至那个tab页面
    var page = parseInt(options.page || '0');
    var currentObj = that.getCurrentDayString()
    that.setData({
      currentTab: page,
      projectId: projectId,
      bodyType: bodyType,
      orderNo: options.orderNo,
      orderId: order,
      currentDate: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate(),
      currentDay: currentObj.getDate(),
      currentObj: currentObj,
      /*  获取当前的年、月  */
      currentYear: currentObj.getFullYear(),
      currentMonth: (currentObj.getMonth() + 1)
    })
    //自动获取系统高度
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight;
        var clientWidth = res.windowWidth;
        var rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        })
      },
    });
    //成员贡献
    that.personCodeInfoApi(that);

    /*-----------项目动态开始--------*/
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    var currDay = now.getDate();
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      currDay: currDay,
      isToday: '' + year + month + now.getDate()
    })
    /*-----------项目动态结束--------*/

    //加载的时候调用项目进展
    that.proStageDescApi(that);
    //问题沟通
    that.questionApi(that);
    //获取问题指派给谁看
    that.membersApi(that);
    //获取当天项目动态
    that.dynamicListApi(that);
    //项目阶段进展
    that.stagePointInfoApi(that);
    //供应商评价
    



    //代码质量
    that.avgrepocheckApi(that);
    that.setSchedule(currentObj);
  },
  proHealthStatus: function(bodyType, proIdSecret, that) {
    var proIdSecreta = wx.getStorageSync('proIdSecret');
    let proHealthDegreeUrl = app.globalData.healthDegreeListDev + app.globalData.healthDegreeList;

    let tempParam = {
      token: app.globalData.token,
      proIdSecret: proIdSecreta,
      bodyType
    }

    util.callAjaxGetSign(proHealthDegreeUrl, tempParam, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {

          // console.log(res.data);
          const rdd = res.data.data;
          let max = 0;
          [rdd.menberDelivery, rdd.proPlan, rdd.codeQuali].forEach(a => {
            max = a > max && a != 4 ? a : max;
          })
          // if (rdd.menberDelivery > 0) {
          //   max = 3;
          // }
          this.setData({
            health: {
              ...rdd,
              policeStaName: rdd.policeStaName.join(','),
              proPlanClass: rdd.proPlan == 1 ? 'health-green' : rdd.proPlan == 2 ? 'health-yellow' : rdd.proPlan == 3 ? 'health-red' : 'health-grey',
              menberDeliveryClass: 
              rdd.menberDelivery == 1 ? 'health-green' : rdd.menberDelivery == 2 ? 'health-yellow' : rdd.menberDelivery == 3 ? 'health-red' : 'health-grey',
                //rdd.menberDelivery == 0 ? 'health-green' : rdd.menberDelivery == 1 ? 'health-yellow' : rdd.menberDelivery == 2 ? 'health-yellow' : rdd.menberDelivery >= 3 ? 'health-red' : 'health-red',
              codeQualiClass: rdd.codeQuali == 1 ? 'health-green' : rdd.codeQuali == 2 ? 'health-yellow' : rdd.codeQuali == 3 ? 'health-red' : 'health-grey',
              totalStatus: max == 1 ? '正常' : max == 2 ? '有风险' : max == 3 ? '高风险' : '',
              totalColor: max == 1 ? '#07B985' : max == 2 ? '#F0A33F' : max == 3 ? '#E55449' : '',
              totalImg: max == 1 ? 'jsyq1' : max == 2 ? 'yjk1' : max == 3 ? 'gw1' : ''
            }
          })

          // console.log('policeStaName',this.data.policeStaName);
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
  },
  doDay: function(e) {
    var that = this;
    //console.log(e);

    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    let date = new Date();
    let currMonth = date.getMonth() + 1;
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1;
      if (m != currMonth) {
        d = 1;
      } else {
        d = date.getDate();
      }
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {
        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1;
      if (m != currMonth) {
        d = 1;
      } else {
        d = date.getDate();
      }
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str)
    this.setData({
      currentDate: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate(),
      currentObj: currentObj,
      /*  获取当前的年、月  */
      currentYear: currentObj.getFullYear(),
      currentMonth: (currentObj.getMonth() + 1),
    })
    //console.log("选择当前年：" + that.data.currentYear);
    //console.log("选择当前月：" + that.data.currentMonth);
    this.setSchedule(currentObj);
  },
  getCurrentDayString: function() {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function(currentObj) {
    //console.log(currentObj);
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = [];
    var calendarList = [];
    var f = 0
    for (var i = 0; i < 45; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = '';
        calendarList[i] = '';
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1;
          let calendar = Y;
          if (m < 10) {
            calendar = calendar + '-0' + m;
          } else {
            calendar = calendar + '-' + m;
          }
          if (currentDayList[i] < 10) {
            calendar = calendar + '-0' + currentDayList[i];
          } else {
            calendar = calendar + '-' + currentDayList[i];
          }
          f = currentDayList[i];
          calendarList.push(calendar);
        } else if (f >= currentDayNum) {
          currentDayList[i] = '';
          calendarList[i] = '';
        }
      }
    }
    that.setData({
      currentDayList: currentDayList,
      currentDay: d,
      calendarList: calendarList
    })
  },

  loadEvaluate: function() {
    var jfId = wx.getStorageSync('jfId');
    util.callAjaxGetSign(app.globalData.bidBaseUrl  /*'http://10.88.203.152:8080'*/ + app.globalData.getBizEvaluate, {
      orderId: this.data.proList.projectId,
      jfId
    }, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          this.setData({
            evaluated: !!res.data.data[0]
          })
        } else {

        }
      } else {}
    })
  },

  //选择具体日期方法--xzz1211
  selectDay: function(e) {
    var that = this;
    var year = that.data.currentYear;
    var month = that.data.currentMonth;
    var day = e.target.dataset.day;
    //console.log(e);
    that.setData({
      currentDay: e.target.dataset.day, //选择的数据，非真实当前日期
      currentDa: e.target.dataset.day, //选择某月具体的一天
      currentDate: year + '/' + month + '/' + day, //真实选择数据
    })
    //console.log("当前选择日期：" + that.data.currentDate);
    if (that.data.orderId == "" || that.data.orderId == undefined) {
      wx.redirectTo({
        url: '/pages/content_dt/dt_list?year=' + year + "&month=" + month + "&day=" + day + "&projectid=" + that.data.projectId + '&bodytype=' + that.data.bodyType,
      })
    } else {
      wx.redirectTo({
        url: '/pages/content_dt/dt_list?year=' + year + "&month=" + month + "&day=" + day + "&orderid=" + that.data.orderId + '&bodytype=' + that.data.bodyType,
      })
    }
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
    var that = this;
    setTimeout(function() {
      /*-----------------代码质量开始------------------*/
      //代码质量绘制彩色圆环进度条
      that.countInterval();
      /*-----------------代码质量结束------------------*/
    }, 3000);
    if(this.data.proList.projectId) {
      this.loadEvaluate();
    }
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

  /*----------阶段进展开始------------------------*/
  //获取单个项目列表
  //交付项目列表  projectId//主体id。bodyType//0、订单；1、社区项目  jfId
  proStageDescApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.proStageDescApi;
    var jfId = wx.getStorageSync('jfId');
    var projectId = that.data.projectId;
    var bodyType = that.data.bodyType;
    //准备参数
    var data = {
      "jfId": jfId,
      "bodyType": bodyType,
      "projectId": projectId
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //赋值
          that.setData({
            proList: {
              ...res.data.data,
              opDueendtime: res.data.data.opDueendtime ? time.formatTimeTwo(res.data.data.opDueendtime, 'Y-M-D') : '暂无',
              createTime: res.data.data.createTime ? time.formatTimeTwo(res.data.data.createTime, 'Y-M-D') : '暂无'
              },
            yanshou: res.data.data.pstatus == 3 || res.data.data.pstatus == 4,
            guidang: res.data.data.pstatus == 4
          }, () => {
            that.loadEvaluate()
          })
          that.proHealthStatus(res.data.data.bodyType, that.data.proIdSecret, that);
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


  /*----------阶段进展结束------------------------*/

  /** ------------问题沟通提交开始-----------------*/

  //绑定提问文本域时间
  bindTextAreaBlur: function(e) {
    this.setData({
      qustestarea: e.detail.value
    })
  },

  //选择阶段
  choosephaseChange: function(e) {
    //console.log(e.detail.value)
    this.setData({
      choose: e.detail.value,
      belongType: 1
    })
  },
  //提醒给谁看绑定事件
  checkboxChange: function(e) {
    this.setData({
      userid: e.detail.value
    })
  },

  //点击提交问题进入新的提交问题页面
  goQuestionPage: function() {
    var that = this;
    wx.redirectTo({
      url: '../content/newquest?page=4&id=' + that.data.projectId + '&bodytype=' + that.data.bodyType,
    })
  },

  //点击创建新的问题
  creatNewQueestion: function() {
    var that = this;
    wx.redirectTo({
      url: '../content/newquest?page=4&id=' + that.data.projectId + '&bodytype=' + that.data.bodyType,
    })
  },

  //问题回复
  contentInput: function(e) {
    var that = this;
    var contents = e.detail.value;
    var questionId = e.target.dataset.questionid;
    var target = 'question[' + e.target.dataset.idx + '].btnShow';
    var contentDom = 'question[' + e.target.dataset.idx + '].contentValue';
    if (contents) {
      that.setData({
        [target]: true,
        contents: contents,
        questionId: questionId,
        contentDom: contentDom
      });
    } else {
      that.setData({
        [target]: false
      });
    }

  },
  //获取焦点触发
  getfocus: function() {
    var that = this;
    that.setData({
      flag: 1
    })
  },

  //问题发送
  ////回复（文字+语音）type : 0 订单 , 1 项目
  // questionId : 问题id
  // jfId : 回复人的id
  // voiceLength : 语音长度 秒
  // voiceId : 语音id,上传后 后端返回
  // content : 文字内容
  questionSend: function() {
    var that = this;
    var jfId = wx.getStorageSync('jfId');
    var url = app.globalData.baseUrl + app.globalData.replyApi;
    var order = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
    //准备参数
    var data = {
      // "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "type": that.data.bodyType,
      "questionId": that.data.questionId,
      "content": that.data.contents,
      "jfId": jfId
    };
    util.callAjaxPostSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //重新刷新当前页面
          /*wx.redirectTo({
              url: '../content/index?page=4&id=' + order + '&bodytype=' + that.data.bodyType,
          })*/
          //重新刷新当前页面的数据
          that.questionApi(that);
          let contentDom = that.data.contentDom;
          that.setData({
            [contentDom]: ''
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

  //确认解决
  confirmSubmit: function(e) {
    var that = this;
    // console.log(e)
    var id = e.currentTarget.dataset.id;
    var type = that.data.bodyType;

    var order = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;

    var url = app.globalData.baseUrl + app.globalData.resolveApi;
    //准备参数
    var data = {
      "id": id,
      "type": type
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          // console.log(res.data.data);
          //重新刷新当前页面
          /*wx.redirectTo({
              url: '../content/index?page=4&id=' + order + '&bodytype=' + that.data.bodyType,
          })*/
          //重新刷新当前页面的数据
          that.questionApi(that);
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

  //问题提交
  questionSubmit: function() {
    var url = app.globalData.baseUrl + app.globalData.questionSubmitApi;
    var that = this;
    var id = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
    var content = that.data.qustestarea;
    var jfId = wx.getStorageSync('jfId') + "";
    var type = that.data.bodyType;

    var choose = that.data.choose;
    //阶段点 所属类型 0 : 订单, 1: 阶段点 , 2: 检查点, (必须)
    var belongType = that.data.belongType;
    var belongId = '';
    if (belongType == 0) {
      //所属类型对应的id (必须)
      belongId = id;
    } else {
      belongType = 1;
      belongId = that.data.choosephase[choose].code;
    }
    //通知人的 对应的userid 拼接, 多个用 英文逗号 连接
    var notifies = "";
    var user = that.data.userid;
    for (var i = 0; i < user.length; i++) {
      notifies += user[i] + ","
    }
    notifies = notifies.substring(0, notifies.length - 1);
    //引用类型 0、文件；1、报告；2、阶段变更；4、会议；5、风险
    var relationType = '';
    //引用对应的 id
    var relationId = '';

    var data = {
      "id": id,
      "type": type,
      "content": content,
      "jfId": jfId,
      "belongType": belongType,
      "belongId": belongId,
      "notifies": notifies
    }
    util.callAjaxPostSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //问题提交成功
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1200
          });
          wx.redirectTo({
            url: '../content/index?page=4&id=' + id + '&bodytype=' + type,
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
  //问题沟通   //请求参数 id 订单或者项目id type: 1 订单, 2 项目
  questionApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.questionApi;
    // var jfId = wx.getStorageSync('jfId');
    //准备参数
    var data = {
      "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "pageSize": that.data.pageSize,
      "pageNO": that.data.pageNO,
      "type": that.data.bodyType
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //赋值
          that.setData({
            question: res.data.data.list
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

  //订单成员信息
  // id：订单或项目ID
  // type : 0 订单 , 1 项目
  membersApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.membersApi;
    //准备参数
    var data = {
      "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "type": that.data.bodyType,
      jfid: wx.getStorageSync("jfId")
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          var persionArr = [];
          var arr = res.data.data;
          for (var i = 0; i < arr.length; i++) {
            var per = {};
            per['name'] = arr[i].fullname,
              per['value'] = arr[i].jfid,
              per['icon'] = app.globalData.baseUrl + '/jfprofile/resume/pic/' + arr[i].jfid + '?fileSize=1&showError=true',
              persionArr.push(per);
          }
          //赋值
          that.setData({
            personsee: persionArr
          })
        } else {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "数据提交失败，请联系客服:025-52821888",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      } else {
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "数据提交失败，请联系客服:025-52821888",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    });
  },
  /** ------------问题沟通提交结束-----------------*/



  /*-----------------------项目动态开始------------*/
  dt_list: function(event) {
    var that = this;
    var year = event.currentTarget.dataset.dateYear;
    var month = event.currentTarget.dataset.dateMonth;
    var day = event.currentTarget.dataset.dateDay;

    if (that.data.orderId == "" || that.data.orderId == undefined) {
      wx.redirectTo({
        url: '/pages/content_dt/dt_list?year=' + year + "&month=" + month + "&day=" + day + "&projectid=" + that.data.projectId + '&bodytype=' + that.data.bodyType,
      })
    } else {
      wx.redirectTo({
        url: '/pages/content_dt/dt_list?year=' + year + "&month=" + month + "&day=" + day + "&orderid=" + that.data.orderId + '&bodytype=' + that.data.bodyType,
      })
    }
  },
  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5

        }

      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },


  /*------------------项目动态结束-------------------------*/

  /*----------------代码质量开始----------------------*/
  avgrepocheckApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.avgrepocheckApi;
    // var jfId = wx.getStorageSync('jfId');
    //准备参数
    var data = {
      "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "type": that.data.bodyType
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          if (res.data.data.hasOwnProperty("total")) {
            // console.log(res.data.data);
            that.data.zl_list[0].score = res.data.data.compile;
            that.data.zl_list[1].score = res.data.data.maintain;
            that.data.zl_list[2].score = res.data.data.rule;
            that.data.zl_list[3].score = res.data.data.rely;
            //赋值
            that.setData({
              scoreData: res.data.data,
              fenshu: res.data.data.total,
              zl_list: that.data.zl_list
            })
            that.drawProgressbg();
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
  /*----------------代码质量结束----------------------*/


  /*----------------阶段进展开始----------------------*/
  // 项目阶段进展
  stagePointInfoApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.stagePointInfoApi;
    const buid = wx.getStorageSync("buid");
    const jfId = wx.getStorageSync('jfId');

    var id = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
    //准备参数
    var data = {
      id: id,
      type: that.data.bodyType,
      buId: buid,
      jfId: jfId,
      from: 'nanjing'
    };


    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          // console.log(res.data.data)
          //赋值
          const currnetTime = new Date();
          that.setData({
            xiala: res.data.data.map(rdd => {
              return {
                ...rdd,
                statusName: rdd.status == 0 ? '未开始' : rdd.status == 1 ? '进行中' : rdd.status == 2 ? '已完成' : '未开始',
                statusColor: rdd.status == 0 ? '#9B9B9B' : rdd.status == 1 ? '#07B985' : rdd.status == 2 ? '#597FF3' : '#9B9B9B',
                delay: new Date() - new Date(rdd.strDate.replace(/\-/g, "/")) > 0 ? Math.floor((new Date() - new Date(rdd.strDate.replace(/\-/g, "/"))) / (1000 * 60 * 60 * 24)) : 0
              }
            })
          }, () => {
            for (let i = 0; i < that.data.xiala.length; i++) {
              if (that.data.xiala[i].status <= 1) {
                that.setData({
                  currentDelay: that.data.xiala[i].delay
                })
                return
              }
            }
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

  //项目动态
  //projectId//主体id。bodyType为0时传订单id，为1时传项目id
  // bodyType//0、订单；1、社区项目
  // unreaduser//当前用户的jfid
  dynamicListApi: function(that) {
    var jsId = wx.getStorageSync('jfId');
    var url = app.globalData.baseUrl + app.globalData.dynamicListApi;
    var id = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
    //准备参数
    var data = {
      "projectId": id,
      "bodyType": that.data.bodyType,
      "unreaduser": jsId
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          //console.log(res.data.data);
          //赋值
          that.setData({
            xmdt: res.data.data
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

  //动态详情
  // projectId//主体id。bodyType为0时传订单id，为1时传项目id
  // bodyType//0、订单；1、社区项目
  // unreaduser//当前用户的jfid
  // currentDate//日期格式：2018-02-12
  dynamicDetailApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.dynamicDetailApi;
    //准备参数
    var data = {
      "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "type": that.data.bodyType,
      "unreaduser": wx.getSystemInfo("jfId"),
      "currentDate": '2018-02-12'
    };
    util.callAjaxPostSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          // console.log(res.data.data)
          //赋值
          that.setData({
            // stagePointInfo: res.data.data
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
  /*----------------阶段进展结束----------------------*/
  /*----------------成员贡献开始----------------------*/
  personCodeInfoApi: function(that) {
    var url = app.globalData.baseUrl + app.globalData.personCodeInfoApi;
    //准备参数
    var data = {
      "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "type": that.data.bodyType
    };
    util.callAjaxGetSign(url, data, function(res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          var arrays = res.data.data;
          var echarOption = [];

          for (var i = 0; i < arrays.length; i++) {
            var array = arrays[i].list;
            var total = {};
            var dataTime = [];
            var addCode = [];
            var delCode = [];
            for (var j = 0; j < array.length; j++) {
              var strDate = array[j].strDate.substring(5, array[j].strDate.length);
              var addCodeNum = array[j].addCodeNum;
              var delCodeNum = array[j].delCodeNum;
              dataTime.push(strDate);
              addCode.push(addCodeNum + i);
              delCode.push(delCodeNum + i);
            }
            total.dataTime = dataTime;
            total.addCode = addCode;
            total.delCode = delCode;
            echarOption.push(total);
          }
          //赋值
          that.setData({
            ddd: res.data.data,
            echarOption: echarOption
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


  /*----------------成员贡献结束----------------------*/

  /*-----------------代码质量开始------------------*/

  /*圆形进度条*/
  drawProgressbg: function() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg');
    var that = this;
    var fenshu = that.data.fenshu;
    ctx.setLineWidth(3); // 设置圆环的宽度
    if (fenshu >= 80 && fenshu <= 100) {
      ctx.setStrokeStyle('#a6e7d3'); // 设置圆环的颜色
    } else if (fenshu >= 70 && fenshu < 80) {
      ctx.setStrokeStyle('#acd0e7');
    } else if (fenshu >= 60 && fenshu < 70) {
      ctx.setStrokeStyle('#fbd3ae');
    } else if (fenshu > 0 && fenshu < 60) {
      ctx.setStrokeStyle('#f9b2b4');
    };
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(110, 110, 80, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function(step) {
    var context = wx.createCanvasContext('canvasProgress');
    var that = this;
    var fenshu = that.data.fenshu;
    // 设置渐变
    var gradient = context.createLinearGradient(100, 200, 200, 100);
    gradient.addColorStop("0", "#24bd90");
    gradient.addColorStop("1.0", "#1cd89c");
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
    if (fenshu >= 80 && fenshu <= 100) {
      context.setStrokeStyle(gradient);
    } else if (fenshu >= 70 && fenshu < 80) {
      context.setStrokeStyle(gradient2);
    } else if (fenshu >= 60 && fenshu < 70) {
      context.setStrokeStyle(gradient3);
    } else if (fenshu > 0 && fenshu < 60) {
      context.setStrokeStyle(gradient4);
    };
    context.setLineCap('round');
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 80, -Math.PI / 2, -step * Math.PI - Math.PI / 2, true);
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
  /*-----------------代码质量结束------------------*/

  evaluateExpert: function () {
    app.globalData.detailData = this.data.proList;
    wx.navigateTo({
      url: '/pages/evaluateSupplier/index'
    })
  },
  watchExpert: function () {
    app.globalData.detailData = this.data.proList;
    wx.navigateTo({
      url: '/pages/evaluateSupplier/index?disabled=true'
    })
  }

}));