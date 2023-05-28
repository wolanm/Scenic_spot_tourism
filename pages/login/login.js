const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
     userName:'',
  },
  //在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
  onLoad: function () {
    
  },

  /**
   * 登录
   */
  login() {
    var that = this
    wx.getUserProfile({
      desc: '用于获取用户信息',
      success(res) {
        var userInfo = res.userInfo
        that.setData({userName: userInfo.nickName})
        wx.cloud.database().collection('user_info').add({
          data: {
            imgUrl: userInfo.avatarUrl,
            userName: userInfo.nickName,
            userPhone: ''
          },
          success(res) {
            app.globalData.docId = res._id
            app.globalData.loginStatus = true
            app.globalData.userName = that.data.userName
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })

    wx.navigateTo({
      url: '/pages/modify_user_info/modify_user_info',
    })
  }
})