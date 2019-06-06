// pages/content/newquest.js
import util from '../../util/util.js';
import filter from '../../util/filter.js';
var app = getApp();
Page(filter.identityFilter({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '',
    navbar: ['阶段进展', '项目动态', '成员贡献', '代码质量', '问题沟通'],
    currentTab: 0,
    scrollLeft: 0,
    orderId: '',
    projectId: "",
    pageNO: 1,
    pageSize: 10,
    bodyType: '',
    belongType: 0,
    //发起问题 选择阶段
    choosephase: [
      /*{
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
      },*/
    ],
    choose: 0,
    qustestarea: "",
    userid: [],
    //提醒谁看展开收缩 初始数据定义
    showView: true,
    personsee: [
      // {
      // name: '张三丰',
      // value: '张三丰',
      // icon: '../../img/tem/img_1.jpg'
      // },
      // {
      //     name: '李四光',
      //     value: '李四光',
      //     icon: '../../img/tem/img_1.jpg'
      // },
      // {
      //     name: '赵四',
      //     value: '赵四',
      //     icon: '../../img/tem/img_1.jpg'
      // },
      // {
      //     name: '赵四',
      //     value: '赵四',
      //     icon: '../../img/tem/img_1.jpg'
      // },
    ],
    color: "#9B9B9B", //提交按钮颜色
    noteMaxLen: 200, //文本框最大字数
    currentNoteLen: 0, //文本框当前字数

  },

  /**
   * 滑动切换tab
   */
  switchTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCol();
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      wx.redirectTo({
        url: '../content/index?page=' + e.target.dataset.current + '&id=' + that.data.projectId + '&bodytype=' + that.data.bodyType,
      })
    }
  },


  //滑动切换超过1屏之后  给页面加大
  checkCol: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  //提醒给谁看
  onChangeStateLook: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //获取项目进展及项目动态，成员贡献 保存ID  ，以供使用
    var projectId = options.id;
    //订单ID
    var order = options.orderid == undefined ? "" : options.orderid;
    //项目类型
    var bodyType = options.bodytype;

    //跳转至那个tab页面
    var page = options.page;
    that.setData({
      currentTab: page,
      projectId: projectId,
      bodyType: bodyType,
      orderId: order
    })

    //自动获取系统高度
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight;
        var clientWidth = res.windowWidth;
        var rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        })
      },
    })

    //项目阶段进展，获取阶段信息
    that.stagePointInfoApi(that);

    //获取问题指派给谁看
    that.membersApi(that);

  },
  //绑定提问文本域时间
  bindTextAreaBlur: function (e) {
    var color = "#9B9B9B";
    if (e.detail.value) {
      color = "#0ac18a";
    }
    this.setData({
      qustestarea: e.detail.value,
      color: color
    });
  },

  //选择阶段
  choosephaseChange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      choose: e.detail.value,
      belongType: 1
    })
  },
  //提醒给谁看绑定事件
  checkboxChange: function (e) {
    this.setData({
      userid: e.detail.value
    })
  },

  //点击提交问题进入新的提交问题页面
  goQuestionPage: function () {
    var that = this;
    wx.redirectTo({
      url: '../content/newquest?page=4&id=' + that.data.projectId + '&bodytype=' + that.data.bodyType,
    })
  },
  //问题提交
  questionSubmit: function () {
    var url = app.globalData.baseUrl + app.globalData.questionSubmitApi;
    var that = this;
    var id = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
    var content = that.data.qustestarea;
    if (!content) {
      wx.showModal({
        title: "温馨提示",
        content: "请输入问题内容",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    //验证是否存在表情包
    let reg = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g;
    if (reg.test(content)){
      wx.showModal({
        title: "温馨提示",
        content: "问题内容不能包含表情包~",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
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
      belongId = that.data.choosephase[choose].id;
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
    util.callAjaxPostSign(url, data, function (res) {
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
        } else if (res.data.resultcode == '1006'){
          wx.showModal({
            title: "温馨提示",
            content: "问题内容不能包含表情包",
            showCancel: false,
            confirmText: "确定"
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //订单成员信息
  // id：订单或项目ID
  // type : 0 订单 , 1 项目
  membersApi: function (that) {
    var url = app.globalData.baseUrl + app.globalData.membersApi;
    //准备参数
    var data = {
      "id": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
      "type": that.data.bodyType
    };
    util.callAjaxGetSign(url, data, function (res) {
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

  //项目阶段进展，获取阶段信息
  stagePointInfoApi: function (that) {
    var url = app.globalData.baseUrl + app.globalData.stagePointInfoApi;

    var id = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
    //准备参数
    var data = {
      "id": id,
      "type": that.data.bodyType
    };
    util.callAjaxGetSign(url, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
          let belongType = 0;
          if (res.data.data.length > 0) {
            belongType = 1;
          }
          //赋值
          that.setData({
            choosephase: res.data.data,
            belongType: belongType
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

  //字数限制
  bindWordLimit: function (e) {
    var value = e.detail.value, len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len //当前字数
    });
  }
}));