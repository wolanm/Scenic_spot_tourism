//index.js
//获取应用实例
var app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    a1src:'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/news_2.png',
    a2src: 'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/meet_1.png',
    a3src: 'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/news_1.png',
    a4src: 'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/news_3.png',
    signupimg:'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/signup.png',
    imgUrls: [
      'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/lunbo1.jpg',
      'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/lunbo2.jpg',
      'cloud://cloud1-8glw5m5v07e9ee9d.636c-cloud1-8glw5m5v07e9ee9d-1317059123/scenic_spot_tourism_img/lunbo3.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000 ,
    activityList:[]
  },

  onLoad() {
    var that = this
    db.collection('scene_activity_info').limit(2).get().then(res => {
      var activityList = []
      for (idx in res.data) {
        var activityObj = {
          id: res.data[idx]._id,
          name: res.data[idx].title,
          image: res.data[idx].imgList[0]
        }
        activityList.push(activityObj)
      }

      that.setData({activityList: activityList})
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        // 转发失败
        onsole.log("转发失败")
      }
    }
  },
  onScenicSpotTap: function (event) {
    const id = event.currentTarget.dataset.id;
    console.log(id)

    wx.navigateTo({
      url: `/pages/activity2/activity2?id=${id}`
    })
  }
})
