// pages/banner/banner.js
var myslider = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myslider.initMySlider({
      that: this,
      datas: [
        '../../img/1.png',
        '../../img/2.png',
        '../../img/3.png'
      ],
      autoRun: true,
      blankWidth: 12,
      newImgWidth: 18,
      interval: 1500,
      duration: 200,
      direction: 'right',
      startSlide: function (curPage) {

      },
      endSlide: function (curPage) {

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
  
  }
})