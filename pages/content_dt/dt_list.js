// pages/content_dt/dt_list.js
import util from '../../util/util.js';
import filter from '../../util/filter.js';
var app = getApp();
Page(filter.identityFilter({

    /**
     * 页面的初始数据
     */
    data: {
        currYear: 0,
        currMonth: 0,
        currDay: 0,
        xmdt: [
            // {
            //     "projectid": 132,
            //     "id": 2,
            //     "jfid": '../../img/assets/conten_wtgt04.png',
            //     "userName": "王红",
            //     "doTime": "2018-05-17 15:05",
            //     "doDate": "2018-05-17",
            //     "type": "3",
            //     "reportType": "",
            //     "content": "项目以建设完成,您可以登录pc端w完成验收!",
            //     "title": "",
            //     "startTime": "",
            //     "endTime": "",
            //     "members": "",
            //     "bodyType": "1"
            // },
            // {
            //     "projectid": 132,
            //     "id": 2,
            //     "jfid": '../../img/assets/conten_wtgt04.png',
            //     "userName": "王红",
            //     "doTime": "2018-05-17 15:05",
            //     "doDate": "2018-05-17",
            //     "type": "4",
            //     "reportType": "",
            //     "content": "需求评审需求评审需求评审需求评审",
            //     "title": "需求评审",
            //     "startTime": "2018-4-16",
            //     "endTime": "2018-6-23 10：33",
            //     "members": "15",
            //     "bodyType": "1"
            // },
            // {
            //     "projectid": 132,
            //     "id": 2,
            //     "jfid": '../../img/assets/conten_wtgt04.png',
            //     "userName": "王红",
            //     "doTime": "2018-05-17 15:05",
            //     "doDate": "2018-05-17",
            //     "type": "0",
            //     "reportType": "",
            //     "content": "需求评审需求评审需求评审需求评审",
            //     "title": "需求评审",
            //     "startTime": "2018-4-16",
            //     "endTime": "2018-6-23 10：33",
            //     "members": "15",
            //     "bodyType": "1"
            // },
            // {
            //     "projectid": 132,
            //     "id": 2,
            //     "jfid": '../../img/assets/conten_wtgt04.png',
            //     "userName": "王红",
            //     "doTime": "2018-05-17 15:05",
            //     "doDate": "2018-05-17",
            //     "type": "1",
            //     "reportType": "",
            //     "content": "需求评审需求评审需求评审需求评审",
            //     "title": "需求评审",
            //     "startTime": "2018-4-16",
            //     "endTime": "2018-6-23 10：33",
            //     "members": "15",
            //     "bodyType": "1"
            // },
            // {
            //     "projectid": 132,
            //     "id": 2,
            //     "jfid": '../../img/assets/conten_wtgt04.png',
            //     "userName": "王红",
            //     "doTime": "2018-05-17 15:05",
            //     "doDate": "2018-05-17",
            //     "type": "2",
            //     "reportType": "",
            //     "content": "需求评审需求评审需求评审需求评审",
            //     "title": "需求评审",
            //     "startTime": "2018-4-16",
            //     "endTime": "2018-6-23 10：33",
            //     "members": "15",
            //     "bodyType": "1"
            // }
        ],
        stagePointInfo: [
            // stage列表
        //     {
        //         name: "需求确认", //stage名称
        //         strDate: "2018-04-02", //日期
        //         status: 2, //状态 0 初始化 1 执行中 2 完成
        //         list: [ //point列表
        //             {
        //                 name: "设计阶段各类文件材料", //point名称
        //                 strDate: null, //忽略此属性
        //                 status: 2, //point状态1 进行中;2 已完成
        //                 list: null //忽略此属性
        //             },
        //             {
        //                 name: "ssssss",
        //                 strDate: null,
        //                 status: 0,
        //                 list: null
        //             }
        //         ]
        //     },
        //     {
        //         name: "产品设计", //stage名称
        //         strDate: "2018-04-02", //日期
        //         status: 2, //状态 0 初始化 1 执行中 2 完成
        //         list: [ //point列表
        //             {
        //                 name: "设计阶段各类文件材料", //point名称
        //                 strDate: null, //忽略此属性
        //                 status: 2, //point状态1 进行中;2 已完成
        //                 list: null //忽略此属性
        //             },
        //             {
        //                 name: "ssssss",
        //                 strDate: null,
        //                 status: 0,
        //                 list: null
        //             }
        //         ]
        //     },
        //     {
        //         name: "程序开发", //stage名称
        //         strDate: "2018-04-02", //日期
        //         status: 2, //状态 0 初始化 1 执行中 2 完成
        //         list: [ //point列表
        //             {
        //                 name: "设计阶段各类文件材料", //point名称
        //                 strDate: null, //忽略此属性
        //                 status: 2, //point状态1 进行中;2 已完成
        //                 list: null //忽略此属性
        //             },
        //             {
        //                 name: "ssssss",
        //                 strDate: null,
        //                 status: 0,
        //                 list: null
        //             }
        //         ]
        //     },
        //     {
        //         name: "功能测试", //stage名称
        //         strDate: "2018-04-02", //日期
        //         status: 1, //状态 0 初始化 1 执行中 2 完成
        //         list: [ //point列表
        //             {
        //                 name: "设计阶段各类文件材料", //point名称
        //                 strDate: null, //忽略此属性
        //                 status: 2, //point状态1 进行中;2 已完成
        //                 list: null //忽略此属性
        //             },
        //             {
        //                 name: "ssssss",
        //                 strDate: null,
        //                 status: 0,
        //                 list: null
        //             }
        //         ]
        //     },
        //     {
        //         name: "项目验收", //stage名称
        //         strDate: "2018-04-02", //日期
        //         status: 0, //状态 0 初始化 1 执行中 2 完成
        //         list: [ //point列表
        //             {
        //                 name: "设计阶段各类文件材料", //point名称
        //                 strDate: null, //忽略此属性
        //                 status: 2, //point状态1 进行中;2 已完成
        //                 list: null //忽略此属性
        //             },
        //             {
        //                 name: "ssssss",
        //                 strDate: null,
        //                 status: 0,
        //                 list: null
        //             }
        //         ]
        //     }
        //
        ]
    },
    page: '',
    bodyType: '',
    orderId: '',
    projectId: "",

    stot: function () {
        var that = this;
        wx.redirectTo({
            url: '../content/index?page=1&id=' + that.data.projectId + '&bodytype=' + that.data.bodyType,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            currYear: options.year,
            currMonth: options.month,
            currDay: options.day,
            projectId: options.projectid==undefined?'':options.projectid,
            orderId: options.orderid==undefined?'':options.orderid,
            bodyType: options.bodytype,
        });
        that.dynamicDetailApi(that)
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

    //动态详情
    // projectId//主体id。bodyType为0时传订单id，为1时传项目id
    // bodyType//0、订单；1、社区项目
    // unreaduser//当前用户的jfid
    // currentDate//日期格式：2018-02-12
    dynamicDetailApi: function (that) {
        var url = app.globalData.baseUrl + app.globalData.dynamicDetailApi;
        var jfId = wx.getStorageSync('jfId');
        let dateParam = that.data.currYear;
        if (that.data.currMonth > 9){
          dateParam += ("-" + that.data.currMonth); 
        } else {
          dateParam += ("-0" + that.data.currMonth);
        }
        if (that.data.currDay > 9){
          dateParam += ("-" + that.data.currDay); 
        } else {
          dateParam += ("-0" + that.data.currDay);
        }
        //准备参数
        var data = {
            "projectId": that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId,
            "bodyType": that.data.bodyType,
            "unreaduser":jfId,
            "currentDate": dateParam
        }
        util.callAjaxGetSign(url, data, function (res) {
            wx.stopPullDownRefresh();
            if (res) {
                if (res.data.resultcode == '0000') {
                    // console.log(res.data.data)
                    //赋值
                    that.setData({
                        xmdt: res.data.data
                    })
                } else {
                    // wx.showModal({
                    //     title: "温馨提示",
                    //     content: "数据提交失败，请联系客服:400-064-0003",
                    //     showCancel: false,
                    //     confirmText: "确定"
                    // });
                }
            } else {
                // wx.showModal({
                //     title: "温馨提示",
                //     content: "数据提交失败，请联系客服:400-064-0003",
                //     showCancel: false,
                //     confirmText: "确定"
                // });
            }
        });
    },

    // 项目阶段进展
    stagePointInfoApi: function (that) {
        var url = app.globalData.baseUrl + app.globalData.stagePointInfoApi;

        var id = that.data.orderId == "" || that.data.orderId == undefined ? that.data.projectId : that.data.orderId;
        //准备参数
        var data = {
            "id": 4791,
            "type": that.data.bodyType
        };
        util.callAjaxGetSign(url, data, function (res) {
            wx.stopPullDownRefresh();
            if (res) {
                if (res.data.resultcode == '0000') {
                    //console.log(res.data.data)
                    //赋值
                    that.setData({
                        stagePointInfo: res.data.data
                    })
                } else {
                    // wx.showModal({
                    //     title: "温馨提示",
                    //     content: "数据提交失败，请联系客服:400-064-0003",
                    //     showCancel: false,
                    //     confirmText: "确定"
                    // });
                }
            } else {
                // wx.showModal({
                //     title: "温馨提示",
                //     content: "数据提交失败，请联系客服:400-064-0003",
                //     showCancel: false,
                //     confirmText: "确定"
                // });
            }
        });
    },
}));