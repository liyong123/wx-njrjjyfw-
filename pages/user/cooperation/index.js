import util from '../../../util/util.js';
import dateUtil from '../../../util/dateUtil.js'
import filter from '../../../util/filter.js';
var app = getApp()
var baseUrl = app.globalData.bidBaseUrl;
var expertListApi = app.globalData.expertListApi; //我合作的专家列表接口
var providerListApi = app.globalData.providerListApi; //我合作的供应商列表接口
var jfId = wx.getStorageSync("jfId");
Page(filter.identityFilter({
  data: {
    tabDatas: [],
    currentTab: 0,
    pageNum: 1,
    pageSize: 10,
    listIsEnd: false,
    noProviderTip: false,
    noExpertTip: false,
    expertList: [],
    expertMessageWidth: (wx.getSystemInfoSync().windowWidth - 110) + "px",
    eachModuleHeight:"auto",
    eachProviderModuleHeight:"auto",
    listSort2: {
      registeredAssetsDefault: {
        type: 'desc'
      },
      annualSales2: {
        type: 'desc'
      },
      registeredAssets2: {
        type: 'icon'
      },
      staffSize2: {
        type: 'icon'
      }
    },
    sortStatusList2: {
      registeredAssetsDefault: true,
      annualSales2: true,
      registeredAssets2: false,
      staffSize2: false,
    },
    order: "1",
    rank: "2",
    keyWord: "",
    loading: false
  },

  onLoad: function(options) {},
  /**
   * 生命周期函数--页面显示/切入前台时触发
   */
  onShow: function() {
    var that = this;
    this.byUrlLoadData();
    this.setData({
      tabDatas: [{
          title: "供应商",
          num: "0"
        },
        {
          title: "专家",
          num: "0"
        }
      ]
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 筛选 跳转
  searchSupplierInfo: function() {
    wx.navigateTo({
      url: '../../../pages/findSupplier/filterDetail'
    });
  },

  // 专家排序   registeredAssets2:默认排序  staffSize2:职称  annualSales2:综合得分
  // 供应商排序   registeredAssets2:注册资本  staffSize2:人员规模  annualSales2:年营业额
  sortRegisteredAssets2: function(event) {

    const that = this;
    const sortType = event.currentTarget.dataset.sortType;
    let currentType;

    if (this.data.listSort2[sortType].type === 'icon') {
      currentType = 'desc';
    } else if (this.data.listSort2[sortType].type === 'desc') {
      currentType = 'asc';
    } else if (this.data.listSort2[sortType].type === 'asc') {
      currentType = 'desc';
    };

    //判断升降序图标
    this.data.listSort2[sortType].type = currentType;
    if (sortType === 'registeredAssets2') {
      that.setData({
        listSort2: {
          registeredAssetsDefault: {
            type: 'desc'
          },
          registeredAssets2: {
            type: currentType
          },
          staffSize2: {
            type: 'icon'
          },
          annualSales2: {
            type: 'icon'
          }
        },
      });
    } else if (sortType === 'staffSize2') {
      that.setData({
        listSort2: {
          registeredAssetsDefault: {
            type: 'desc'
          },
          registeredAssets2: {
            type: 'icon'
          },
          staffSize2: {
            type: currentType
          },
          annualSales2: {
            type: 'icon'
          }
        },
      });
    } else if (sortType === 'annualSales2') {
      that.setData({
        listSort2: {
          registeredAssetsDefault: {
            type: 'desc'
          },
          registeredAssets2: {
            type: 'icon'
          },
          staffSize2: {
            type: 'icon'
          },
          annualSales2: {
            type: currentType
          }
        },
      });
    } else if (sortType === 'registeredAssetsDefault') {
      that.setData({
        listSort2: {
          registeredAssetsDefault: {
            type: currentType
          },
          registeredAssets2: {
            type: 'icon'
          },
          staffSize2: {
            type: 'icon'
          },
          annualSales2: {
            type: 'icon'
          }
        },
      });
    } 

    // that.setData({
    //   listSort2: this.data.listSort2
    // });


    let sortStatusList2 = this.data.sortStatusList2;
    let itemStatus;
    for (itemStatus in sortStatusList2) {
      if (itemStatus === sortType) {
        sortStatusList2[itemStatus] = true;
      } else {
        sortStatusList2[itemStatus] = false;
      }
    }


    that.setData({
      sortStatusList2
    });

    //判断点击的是哪个排序
    var rank = "";
    if (sortType == "registeredAssets2") {
      rank = "0";
    } else if (sortType == "staffSize2") {
      rank = "1"
    } else if (sortType == "annualSales2") {
      rank = "2"
    } else if (sortType == "registeredAssetsDefault") {
      //点击专家的默认排序，搜素框清空
      if (that.data.currentTab == 1) {
        that.setData({
          keyWord: ""
        })
      }
    }
    var order = "";
    var orderNow = this.data.listSort2[sortType].type;
    if (orderNow == "desc") {
      order = "1";
    } else if (orderNow == "asc") {
      order = "0"
    }
    that.setData({
      order: order,
      rank: rank,
      pageNum: 1
    })
    this.byUrlLoadData()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    console.log('触到底部了');
    // console.log("pageNum:", this.data.pageNum);
    if (that.data.listIsEnd) return
    this.setData({
      pageNum: this.data.pageNum + 1,
    }, () => {
      this.byUrlLoadData();
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    this.setData({
      pageNum: 1
    }, () => {
      this.byUrlLoadData();
    })
    if (that.data.currentTab == 0) {
      if (that.data.expertList.length > 0) {
        var listHeight = 120 * (that.data.expertList.length);
         console.log("listHeightP:", listHeight);
         console.log("screenHeightP:", (wx.getSystemInfoSync().screenHeight - 95))
        if ((listHeight + 44) < (wx.getSystemInfoSync().screenHeight - 95)) {
          that.setData({
            eachProviderModuleHeight: wx.getSystemInfoSync().screenHeight + "px"
          })
        } else {
          that.setData({
            eachProviderModuleHeight: "auto"
          })
        }
      }
    } else {
      if (that.data.expertList.length > 0) {
        var listHeight = 90 * (that.data.expertList.length);
         console.log("listHeight:", listHeight);
         console.log("screenHeight:", (wx.getSystemInfoSync().screenHeight - 95))
        if ((listHeight + 44) < (wx.getSystemInfoSync().screenHeight - 95)) {
          that.setData({
            eachModuleHeight: wx.getSystemInfoSync().screenHeight + "px"
          })
        } else {
          that.setData({
            eachModuleHeight: "auto"
          })
        }
      }
    }

    wx.stopPullDownRefresh()

  },
  loadList: function(url) {
    var that = this;
    that.setData({
      loading: true
    });
    let {
      pageNum,
      pageSize,
      expertList,
      listIsEnd,
      keyWord,
      order,
      rank
    } = this.data;
    const userjfid = wx.getStorageSync('jfId');

    let params = {
      jfid: userjfid,
      pageNum,
      pageSize,
      order,
      rank,
      keyWord
    };
    //todo:滑到最后一页后，不允许再访问接口

    util.callAjaxGetSign(url, params, res => {
      // console.log("res:", res)
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          var list = res.data.data.list;
          //处理接口数据，并赋给列表
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.tagsContent && item.tagsContent != "") {
              var tagsArr = item.tagsContent.split(",");
              if (tagsArr.length > 3) {
                item.tagsContent = tagsArr.splice(0, 3)
              } else {
                item.tagsContent = tagsArr;
              }
            }
            var buildTime = item.BUILDTIME;
            if (buildTime && buildTime != "") {
              //   var newTime = buildTime.split("T")[0];
              //   item.BUILDTIME = newTime.replace(/\-/g, ".")
              item.BUILDTIME = dateUtil.formatTimeTwo(buildTime, "Y-M-D")
            }


          }

          if (pageNum == 1) {
            this.setData({
              expertList: list,
              listIsEnd: list.length < pageSize
            }, () => {
              that.setData({
                loading: false
              });
            })
          } else {
            this.setData({
              expertList: expertList.concat(list),
              listIsEnd: list.length < pageSize
            }, () => {
              that.setData({
                loading: false
              });
            })
          }
        } else {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "获取数据失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "关闭"
          // });
          that.setData({
            loading: false
          });
        }
      } else {
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "获取数据失败，请联系客服:400-064-0003",
        //   showCancel: false,
        //   confirmText: "关闭"
        // });
        that.setData({
          loading: false
        });
      }
    })
  },
  //tab切换
  tabChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.tab,
      rank: "",
      order: "",
      keyWord: "",
      pageNum: 1,
      expertList: [],
      listIsEnd: false,
      eachProviderModuleHeight:"auto",
      eachModuleHeight:"auto",
      listSort2: {
        registeredAssetsDefault: {
          type: 'desc'
        },
        registeredAssets2: {
          type: 'desc'
        },
        staffSize2: {
          type: 'icon'
        },
        annualSales2: {
          type: 'icon'
        }
      },
      sortStatusList2: {
        registeredAssetsDefault: true,
        registeredAssets2: true,
        staffSize2: false,
        annualSales2: false
      }
    });
    this.byUrlLoadData()
  },
  //加载列表数据
  byUrlLoadData: function() {
    var that = this;
    let {
      currentTab
    } = that.data;
    var expertUrl = baseUrl + expertListApi;
    var providerUrl = baseUrl + providerListApi;
    if (currentTab == 0) {
      this.loadList(providerUrl) //加载供应商数据
    } else if (currentTab == 1) {
      this.loadList(expertUrl) //加载专家数据
    }
  },
  //跳转到专家详情
  toExpertDetail: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../../../pages/expertMessage/index?jfId=' + e.currentTarget.dataset.id
    })
  },
  //跳转到供应商详情
  toProviderDetail: function(e) {
    var spid = e.currentTarget.dataset.bid;
    if (spid && spid != "") {
      wx.navigateTo({
        url: '/pages/findSupplier/detail?spid=' + spid,
      })
    }
  },
  //搜索框 搜索
  getSearchInputValue: function(e) {
    var that = this;
    that.setData({
      keyWord: e.detail.value,
      pageNum: 1,
      expertList: []
    });
    that.byUrlLoadData();
  },

}))