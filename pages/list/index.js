// pages/list/index.js
import util from '../../util/util.js';
import time from '../../util/dateUtil.js';
import filter from '../../util/filter.js';
import {
  QUERY_STATE_CAIGOUZHONG,
  QUERY_STATE_YIQIANYUE,
  QUERY_STATE_YIZHONGZHI,
  QUERY_STATE_JIANSHEZHONG,
  QUERY_STATE_DAIYANSHOU,
  QUERY_STATE_YIWANCHENG,
  QUERY_STATE_YIGUIDANG,
  QUERY_STATE_QUANBU,
  QUERY_STATE_QUANBU1,
  QUERY_STATE_QIANYUEZHONG,
  QUERY_STATE_YIPINGBIAO,
  QUERY_STATE_PINGBIAOZHONG,
} from './constants.js'
import constants from './constants.js'
let app = getApp();
import {
  pages
} from '../../auth.js';


// const cgzbSelections = [{
//     title: '全部',
//     image: 'qb',
//     key: QUERY_STATE_QUANBU
//   },
//   {
//     title: '招标中',
//     image: 'zbz',
//     key: QUERY_STATE_CAIGOUZHONG
//   }, {
//     title: '评标中',
//     image: 'zbz',
//     key: QUERY_STATE_PINGBIAOZHONG
//   }, {
//     title: '已评标',
//     image: 'zbz',
//     key: QUERY_STATE_YIPINGBIAO
//   },{
//     title: '签约中',
//     image: 'yqy',
//     key: QUERY_STATE_QIANYUEZHONG
//   }, {
//     title: '已签约',
//     image: 'yqy',
//     key: QUERY_STATE_YIQIANYUE
//   },  {
//     title: '已终止',
//     image: 'yzz',
//     key: QUERY_STATE_YIZHONGZHI
//   }
// ];

const cgzbSelections = [{
    title: '全部',
    image: 'qb',
    key: QUERY_STATE_QUANBU
  },
  {
    title: '采购中',
    image: 'zbz',
    key: QUERY_STATE_CAIGOUZHONG
  }, {
    title: '已签约',
    image: 'yqy',
    key: QUERY_STATE_YIQIANYUE
  }, {
    title: '已终止',
    image: 'yzz',
    key: QUERY_STATE_YIZHONGZHI
  }
];


const xmjsSelections = [{
  title: '全部',
  image: 'qb',
  key: QUERY_STATE_QUANBU1
}, {
  title: '建设中',
  image: 'jsz',
  key: QUERY_STATE_JIANSHEZHONG
}, {
  title: '验收中',
  image: 'ysz',
  key: QUERY_STATE_DAIYANSHOU
}, {
  title: '已验收',
  image: 'yys',
  key: QUERY_STATE_YIWANCHENG
}, {
  title: '已归档',
  image: 'ygd',
  key: QUERY_STATE_YIGUIDANG
}]

const purchaseUrl = app.globalData.bidBaseUrl + app.globalData.purchaseListApi;
// const purchaseUrl = 'http://10.88.203.249:8081' + app.globalData.purchaseListApi;

const proListUrl = app.globalData.baseUrl + app.globalData.proListApi;

Page(filter.identityFilter({
  data: {
    pageNO: 1,
    pageSize: 10,
    scrollTop: 0,
    tabs: [{
        title: '采购招标',
        key: 'cgzb',
        selections: cgzbSelections
      },
      {
        title: '项目建设',
        key: 'xmjs',
        selections: xmjsSelections
      }
    ],
    isShowStates: false,
    activeTabKey: 'cgzb',
    selections: cgzbSelections,
    activeSelectionIndex: 0,
    searchName: '',
    list: null,
    listIsEnd: false,
    loading: false,
    pages: [],
    constants
  },
  watch: {
    activeTabKey: {
      handler: function(key) {
        let activeTab = this.data.tabs.filter(tab => tab.key === key) ? this.data.tabs.filter(tab => tab.key === key)[0] : null
        this.setData({
          selections: activeTab ? activeTab.selections : [],
          activeSelectionIndex: '0',
          list: []
        });
      },
      time: 'after'
    },
    activeSelectionIndex: {
      handler: function(key) {
        this.setData({
          pageNO: 1,
          scrollTop: 0,
          searchName: ''
        }, () => {})
        this.loadList();
      },
      time: 'after'
    }
  },


  // 跳转详情
  toDetail: function(e) {
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
    } = e.currentTarget.dataset.tookit;

    wx.navigateTo({
      url: activeTabKey === 'cgzb' ?
        `/pages/caigouxiangqing/index?orderId=${orderId}&orderName=${orderName}` : `/pages/content/index?orderId=${orderId}&orderName=${orderName}&id=${projectId}&bodytype=${bodyType}&page=0&proIdSecret=${projectIdSecret}&orderNo=${orderNo}`,
    })
  },
  /**
   * 切换 采购招标-项目建设 标签
   */
  onTabsChange: function(e) {
    const {
      key
    } = e.detail;
    if (this.data.activeTabKey == key) return;
    this.setData({
      listIsEnd: false,
      activeTabKey: key
    });
  },

  /**
   * 转换状态
   */
  toggleState: function() {
    this.setData({
      isShowStates: !this.data.isShowStates
    });
  },

  /**
   * 切换查询状态
   */
  onPickerChange: function(e) {
    const {
      key
    } = e.currentTarget.dataset;
    this.setData({
      listIsEnd: false,
      isShowStates: !this.data.isShowStates,
      activeSelectionIndex: key
    })
  },

  /**
   * 输入搜索名称
   */
  onEnterSearchName: function(e) {
    this.setData({
      searchName: e.detail.value
    })
  },

  onSearch: function() {
    this.setData({
      listIsEnd: false,
      pageNO: 1
    }, () => {
      this.loadList();
    });
  },

  onLoad: function(options) {
    const userData = wx.getStorageSync("userData") || '0';
    this.setData({
      pages: pages[userData * 1]
    });
    const {
      activeTabKey = 'cgzb', orderStatus
    } = options;

    this.setData({
      pages: pages[userData * 1],
      activeTabKey,
      selections: this.data.tabs.filter(t => t.key === activeTabKey)[0].selections,
    }, () => {
      if (orderStatus) {
        let index = 0;
        this.data.selections.forEach((s, i) => {
          if (s.key == orderStatus) {
            index = i;
          }
        });
        this.setData({
          activeSelectionIndex: index
        });
      }
    })
    getApp().setWatcher(this);

    // 将初始化列表放在onLoad函数中，如果在详情中能修改列表页则需要将此放入onShow方法
    if (!orderStatus) {
      this.loadList();
    }

    // this.setData({
    //   listIsEnd: false
    // }, () => {
    //   this.loadList();
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      pageNO: this.data.pageNO + 1,
    }, () => {
      this.loadList();
    })
  },

  formatTime: function(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].opDueendtime) {
        data[i].opDueendtime = time.formatTimeTwo(data[i].opDueendtime, 'Y-M-D');
      } else {
        data[i].opDueendtime = '暂无';
      }
    }
    return data;
  },

  getProjectHealthDegree: function(promiseArr) {
    return Promise.all(promiseArr);
  },

  loadList: function() {
    const jfId = wx.getStorageSync('jfId');
    const buid = wx.getStorageSync("buid");
    this.setData({
      loading: true
    });
    let {
      pageNO,
      pageSize,
      selections,
      activeSelectionIndex,
      activeTabKey,
      searchName,
      listIsEnd,
      list,
    } = this.data;
    let params = {
      ...(searchName ? {
        serachName: searchName
      } : {}),
      jfId,
      serachStatus: selections[activeSelectionIndex].key,
      pageNO,
      pageSize
    }
    let url = activeTabKey === 'cgzb' ? purchaseUrl : proListUrl;

    params = activeTabKey === 'cgzb' ? params : {
      jfId,
      queryScope: selections[activeSelectionIndex].key,
      pageNO,
      pageSize,
      buId: buid,
      from: 'nanjing',
      ...(searchName ? {
        keywords: searchName
      } : {})
    };

    let proHealthDegreeUrl = app.globalData.healthDegreeListDev + app.globalData.healthDegreeList;
    const token = app.globalData.token;

    if (listIsEnd) return;
    // console.log(params.queryScope)
    util.callAjaxGetSign(url, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        // console.log(res);
        if (res.data.resultcode == '0000') {
          let result = res.data.data;
          //如果是项目建设列表还需要去查询项目健康度
          if (activeTabKey != 'cgzb') {
            // 时间格式化
            result = this.formatTime(result);
            (Array.isArray(result) ? result : []).forEach(rlt => {
              if (rlt.pstatus == 2) {
                rlt._stageName = '验收中'
              } else if (rlt.pstatus >= 3) {
                rlt._stageName = '已验收'
              }
              // if (rlt.pstatus == 2 || rlt.pstatus == 3 || rlt.pstatus == 4) {
              //   rlt._stageName = '计划执行完毕'
              // } 
              else {
                rlt._stageName = rlt.stageName
              }

              if(rlt.pstatus == 4) {
                rlt.guidang = true;
              }
            })

            const currentListLength = pageNO != 1 ? this.data.list.length : 0;

            const renderList = [];
            const status = {
              rendering: false
            };

            const renderSingle = (index, healtyDegree) => {
              return () => {
                status.rendering = true;
                let currentList = this.data.list;
                currentList[currentListLength + index].healtyDegree = healtyDegree;
                this.setData({
                  list: currentList
                }, () => {
                  status.rendering = false;
                  if (renderList.length > 0) {
                    renderList[0].call(this);
                    renderList.shift();
                  }
                })
              }
            }

            this.setData({
              list: pageNO == 1 ? result : list.concat(Array.isArray(result) ? result : []),
              listIsEnd: Array.isArray(result) ? (result.length < pageSize) : true
            }, () => {
              this.setData({
                loading: false
              });
              for (let j = 0; j < result.length; j++) {
                if (result[j].healtyDegree) continue;
                let tempParam = {
                  token,
                  proIdSecret: result[j].projectIdSecret,
                  bodyType: result[j].bodyType
                }
                util.getByPromise(proHealthDegreeUrl, tempParam, false).then(rlt => {
                  renderList.push(renderSingle(j, rlt.data.data));
                  if (!status.rendering) {
                    renderList[0].call(this);
                    renderList.shift();
                  }
                })
              }
            });

          } else {
            if (pageNO == 1) {
              this.setData({
                list: result.map(r => {
                  return {
                    ...r,
                    supplierName: r.supplierName ? r.supplierName : ''
                  }
                }),
                listIsEnd: result.length < pageSize
              }, () => {
                this.setData({
                  loading: false
                });
              })
            } else {
              this.setData({
                list: list.concat(result.map(r => {
                  return {
                    ...r,
                    supplierName: r.supplierName ? r.supplierName : ''
                  }
                })),
                listIsEnd: result.length < pageSize
              }, () => {
                this.setData({
                  loading: false
                });
              });
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
    })
  }

}));