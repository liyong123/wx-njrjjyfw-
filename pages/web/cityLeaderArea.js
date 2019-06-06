import util from '../../util/util.js';
import dateUtil from '../../util/dateUtil.js'
import filter from '../../util/filter.js';
import * as echarts from '../../ec-canvas/echarts';
import geoJson from './cityLeaderIndexDatas.js';
var app = getApp();

const areaList = [{
  index: 0,
  name: '市直属',
  code: '320101'
}, {
  index: 1,
  name: '玄武区',
  code: '320102'
}, {
  index: 2,
  name: '秦淮区',
  code: '320104'
}, {
  index: 3,
  name: '建邺区',
  code: '320105'
}, {
  index: 4,
  name: '鼓楼区',
  code: '320106'
}, {
  index: 5,
  name: '浦口区',
  code: '320111'
}, {
  index: 6,
  name: '栖霞区',
  code: '320113'
}, {
  index: 7,
  name: '雨花台区',
  code: '320114'
}, {
  index: 8,
  name: '江宁区',
  code: '320115'
}, {
  index: 9,
  name: '六合区',
  code: '320116'
}, {
  index: 10,
  name: '溧水区',
  code: '320117'
}, {
  index: 11,
  name: '高淳区',
  code: '320118'
}]


Page(filter.identityFilter({
  data: {
    tabDatas: [],
    currentTab: 0,
    asCaiGou: true,
    hasJianShe: true,
    _hasCaiGou: true,
    _hasJianShe: true,
    totalBudget: '--',
    _totalBudget: '--',
    purchasing: '--',
    _purchasing: '--',
    deal: '--',
    _deal: '--',
    totalProject: '--',
    _totalProject: '--',
    jianshe: '--',
    _jianshe: '--',
    yanshou: '--',
    _yanshou: '--',
    currentArea: {
      name: '市直属',
      index: 0
    },
    _currentArea: {
      name: '市直属',
      index: 0
    },
    currentYear:'',
    isTouchMove: false,
    moneyList: [],
    _moneyList: [],
    projectList: [],
    _projectList: [],
    touchEnd: true
  },

  onLoad: function(options) {
    const currentArea = areaList[options.index || 0];
    const currentTab = options.currentTab || 0;
    const currentYear = options.currentYear;
    this.setData({
      currentTab : currentTab * 1,
      currentArea,
      _currentArea: currentArea,
      currentYear: currentYear
    });
    util.callAjaxGetSign(app.globalData.baseUrl + '/ysapi/wx/v1/yanshi/one', {
      from: 'nanjing',
      code: currentArea.code
    }, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          let data = res.data.data || {};
          if (!data.list || data.list.length == 0) {
            this.setData({
              hasJianShe: false,
              _hasJianShe: false,
            })
          } else {
            this.setData({
              jianshe: data.building || '暂无',
              yanshou: data.checked || '暂无',
              totalProject: data.total || '暂无',
              projectList: data.list.slice(0, 10) || [],
              _jianshe: data.building || '暂无',
              _yanshou: data.checked || '暂无',
              _totalProject: data.total || '暂无',
              _projectList: data.list.slice(0, 10) || [],
              hasJianShe: true,
              _hasJianShe: true,
            });
          }
        } else {}
      } else {}
    })
    util.callAjaxGetSign(app.globalData.yjBaseUrl + '/yjapi/open/areaDetails', {
      flag: 1,
      areaCode: this.data.currentArea.code,
      flagYear: this.data.currentYear
    }, res => {
      if (res) {
        if (res.data.resultcode == '0000') {
          let data = res.data.data || [];
          if (data.length == 0) {
            this.setData({
              hasCaiGou: false,
              _hasCaiGou: false,
            })
          } else {
            this.setData({
              totalBudget: data[0].totalBudget || '暂无',
              _totalBudget: data[0].totalBudget || '暂无',
              purchasing: data[0].totalPrice || '暂无',
              _purchasing: data[0].totalPrice || '暂无',
              deal: data[0].deaPrice || '暂无',
              _deal: data[0].deaPrice || '暂无',
              moneyList: data || [],
              _moneyList: data || [],
              hasCaiGou: true,
              _hasCaiGou: true,
            });
          }

        } else {}
      } else {}
    })
  },
  /**
   * 生命周期函数--页面显示/切入前台时触发
   */
  onShow: function() {
    const {
      currentArea
    } = this.data;
    this.setData({
      tabDatas: [{
          title: `总投入`
        },
        {
          title: `总建设`
        },
      ]
    })
  },

  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },

  handletouchmove: function(event) {
    if(this.data.isTouchMove || !this.data.touchEnd) return;
    this.setData({ touchEnd: false });
    let currentX = event.touches[0].pageX;
    let currentY = event.touches[0].pageY;
    let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    let offset = 0;
    if (Math.abs(tx) < Math.abs(ty)) {
      if (ty < 0) {
        offset = 1;
      } else if (ty > 0) {
        offset = -1;
      }
    }
    this.setData({
      _jianshe: '--',
      _yanshou: '--',
      _totalProject: '--',
      _projectList: [],
      _hasJianShe: true,
      _totalBudget: '--',
      _purchasing: '--',
      _deal: '--',
      _moneyList: [],
      _hasCaiGou: true,
    });
    const currentIndex = this.data.currentArea.index;
    const index = currentIndex + offset;
    const currentArea = areaList[ index < 0 ? 11 : index > 11 ? 0 : index ];
    this.setData({
      _currentArea: currentArea,
      isTouchMove: true
    });
    if (offset > 0) {
      this.setData({ dir: 'top' })
    } else {
      this.setData({ dir: 'bottom' })
    }
    util.callAjaxGetSign(app.globalData.baseUrl + '/ysapi/wx/v1/yanshi/one', {
      from: 'nanjing',
      code: currentArea.code
    }, res => {
      util.callAjaxGetSign(app.globalData.yjBaseUrl + '/yjapi/open/areaDetails', {
        flag: 1,
        areaCode: currentArea.code,
        flagYear: this.data.currentYear
      }, res1 => {
        this.setData({ currentArea })
        if (res) {
          if (res.data.resultcode == '0000') {
            let data = res.data.data || {};
            if (!data.list || data.list.length == 0) {
              this.setData({
                hasJianShe: false,
                _hasJianShe: false,
                _currentArea: currentArea,
                isTouchMove: false,
                dir: "",
              })
            } else {
              this.setData({
                jianshe: data.building || '暂无',
                yanshou: data.checked || '暂无',
                totalProject: data.total || '暂无',
                projectList: data.list || [],
                hasJianShe: true,
                _jianshe: data.building || '暂无',
                _yanshou: data.checked || '暂无',
                _totalProject: data.total || '暂无',
                _projectList: data.list || [],
                _hasJianShe: true,
                _currentArea: currentArea,
                isTouchMove: false,
                dir: "",
              });
            }
          } else { }
        } else { }

        if (res1) {
          if (res1.data.resultcode == '0000') {
            let data = res1.data.data || [];
            if (data.length == 0) {
              this.setData({
                hasCaiGou: false,
                _hasCaiGou: false,
                _currentArea: currentArea,
                isTouchMove: false,
                dir: "",
              });
            } else {
              this.setData({
                totalBudget: data[0].totalBudget || '暂无',
                purchasing: data[0].totalPrice || '暂无',
                deal: data[0].deaPrice || '暂无',
                moneyList: data || [],
                hasCaiGou: true,
                _totalBudget: data[0].totalBudget || '暂无',
                _purchasing: data[0].totalPrice || '暂无',
                _deal: data[0].deaPrice || '暂无',
                _moneyList: data || [],
                _hasCaiGou: true,
                _currentArea: currentArea,
                isTouchMove: false,
                dir: "",
              });
            }
          } else { }
        } else { }
      });
    })
  },

  handletouchend: function () {
    this.setData({ touchEnd: true });
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
    var that = this;

  },


  //tab切换
  tabChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.tab
    });
  },
}))