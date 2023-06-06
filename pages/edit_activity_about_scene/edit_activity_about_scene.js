// pages/edit_activity_about_scene/edit_activity_about_scene.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    imgList:['/image/add.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    if (typeof(options.id) !== 'undefined') {
      db.collection('scenic_guide_info').where({
        _id: options.id
      }).get().then(res => {
        var imgList = res.data[0].imgList
        imgList.push(that.data.imgList[0])
        that.setData({
          title: res.data[0].title,
          content: res.data[0].content,
          imgList: imgList
        })
      })
    } else {
      this.setData({
        title: '',
        content: '',
        imgList:['/image/add.png']
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取当前小程序的页面栈 
    let pages = getCurrentPages(); 
    // 数组中索引最大的页面--当前页面  
    let currentPage = pages[pages.length-1];
    // 给 onLoad 传入 options 参数，执行 onLoad
    this.onLoad(currentPage.options)
  },

  selectorChange(e) {
    let i = e.detail.value
    let v = this.data.editType[i]
    this.setData({selectItem: v})
  },

  selectImg(e) {
    var idx = e.currentTarget.dataset.index
    if (idx != this.data.imgList.length - 1) {
      return
    }

    var that = this
    var cnt = 7 - this.data.imgList.length
    wx.chooseImage({
      count: cnt,
      sourceType:['album', 'camera'],
      success(res) {
        var imgList = that.data.imgList
        imgList.splice(imgList.length - 1, 0, res.tempFilePaths)
        that.setData({imgList: imgList})
      }
    })
  },

  onSubmit(e) {
    var title = e.detail.value.title
    var content = e.detail.value.content
    if (title.length === 0 || content.length === 0) {
      wx.showToast({
        title: '请填写内容',
        icon:'error',
        duration: 1000
      })

      return
    }

    var that = this
    new Promise((resolve) => {
      var res = that.uploadArctile()
      resolve(res)
    }).then(res => {
      that.add_to_db(title, content, res)
    })
  },

  async uploadArctile() {
    imgList = []
    var that = this
    for (let i = 0; i < this.data.imgList.length - 1; ++i) {
      let res = await new Promise(resolve => {
        let uploadRes = wx.cloud.uploadFile({
          cloudPath: 'images/' + Date.now() + '.jpg',
          filePath: that.data.imgList[i][0],
        })
        
        return resolve(uploadRes)
      })

      var fileId = res.fileID
      imgList.push(fileId)
    }

    return imgList
  },

  add_to_db(title, content, imgList) {
    db.collection('scenic_guide_info').add({
      data : {
        title: title,
        content: content,
        imgList: imgList
      },
      success() {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
})