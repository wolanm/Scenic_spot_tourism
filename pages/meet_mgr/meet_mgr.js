// pages/meet_mgr/meet_mgr.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetInfoList: [],
    showList: [],
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    db.collection('meet_info').get().then(res => {
      var meetInfoList = []
      for (i in res.data) {
        var meetInfo = {
          scenicName: res.data[i].scenicName,
          scenicId: res.data[i].sceneId,
          meetNumber: res.data[i].number,
          name: res.data[i].lastname,
          phone: res.data[i].phone,
          meetTime: res.data[i].meetTime
        }

        meetInfoList.push(meetInfo)
      }

      that.setData({
        meetInfoList: JSON.parse(JSON.stringify(meetInfoList)),
        showList: JSON.parse(JSON.stringify(meetInfoList))
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  search(e) {
    var word = e.detail.value
    var showList = []
    for (const v of this.data.meetInfoList) {
      if (v.phone.search(word) !== -1) {
        showList.push(JSON.parse(JSON.stringify(v)))
      }
    }

    this.setData({showList: showList})
  },

  cancelSearch() {
    this.setData({
      inputValue: '',
      showList: JSON.parse(JSON.stringify(meetInfoList))
    })
  },

  async cancelMeetInfo(e) {
    var flag = false
    await wx.showModal({
      title: '提示',
      content: '确认核销吗'
    }).then(res => {
      if (res.confirm) {
        flag = true
      }
    })

    if (!flag) {
      return
    }

    var that = this
    var index = e.currentTarget.dataset.index
    var showList = this.data.showList
    var meetInfoList = this.data.meetInfoList
    var scenicId = showList[index].scenicId
    await db.collection('meet_info').where({
      number: showList[index].meetNumber
    }).remove().then(res => {
      var deleteIdx = 0
      while (deleteIdx < meetInfoList.length) {
        if (meetInfoList[deleteIdx].id === showList[index].id) {
          break
        }

        ++deleteIdx
      }
      showList.splice(index, 1)
      meetInfoList.splice(deleteIdx, 1)
      that.setData({
        showList: showList,
        meetInfoList: meetInfoList
      })
    })

    const _ = db.command
    await db.collection('scenic_spots_info').where({
      _id: scenicId
    }).update({
      data: {
        capacity: _.inc(1)
      }
    })

    await wx.showToast({
      title: '核销成功',
      icon: 'success',
      duration: 1000
    })
  }
})