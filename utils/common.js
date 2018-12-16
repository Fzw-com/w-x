/* 
* @Author: Marte
* @Date:   2018-12-12 21:52:00
* @Last Modified by:   Marte
* @Last Modified time: 2018-12-12 23:26:29
*/
var debug = getApp().debug || true;
var yxxruiSliderData = {
    datas:[],//数据包，必须为数组
    blankWidth:12,//空白处的宽度
    newImgWidth:18,
    totalWidth:0,//总宽度
    x:0,
    firstX:0,//初始化后的首次位置
    curPage:1,//当前页面
    indicateDote:[]//小数点
};
var that = null;
var direction = 'left';//滚动的方向
var autoRun = true;//是否自动滚动
var duration = 200;//滚动一屏需要的时间
var interval = 2000; //时间间隔
var startSlideCallback = null;//开始滚动的回调事件
var endSlideCallback = null ;//滚动结束的回调事件
var autoRunTimer; //自动滚动定时器
var slideTimer; //滚动过程定时器
var lastX;
var firstX;
var firstPointX = 0 ;//手指触摸屏幕时的x坐标
var sliderLock = 0; //滚动锁，不能多次滚动
function initMySlider(opt){
    if(opt.that == null){
        console.log('输入正确this');
        return ;
    }
    //初始化用户传参
    that = opt.that;
    yxxruiSliderData.datas = opt.datas || yxxruiSliderData.datas;
    yxxruiSliderData.blankWidth = opt.blankWidth == undefined?yxxruiSliderData.blankWidth:opt.blankWidth;
    yxxruiSliderData.newImgWidth = opt.newImgWidth == undefined?yxxruiSliderData.newImgWidth:opt.newImgWidth;
    autoRun = opt.autoRun;
    interval = opt.interval || interval;
    duration = opt.duration || duration;
    direction = opt.direction || direction;
    startSlideCallback = opt.startSlide || startSlideCallback;
    endSlideCallback = opt.endSlide || endSlideCallback;
   
    //初始化用户传参
    var len = yxxruiSliderData.datas.length;
    if(len<1){
        return ;
    }
    for(var i = 0;i<len;i++){
      yxxruiSliderData.indicateDote.push(i+1); 
    }

    var fistImg = yxxruiSliderData.datas[0];
    var lastImg = yxxruiSliderData.datas[len-1];
    yxxruiSliderData.datas.unshift(lastImg);//最后图片放前面
    yxxruiSliderData.datas.push(fistImg);//最后图片放前面

    //计算参数
    var w = wx.getSystemInfoSync().screenWidth;//屏幕宽
    var kx = yxxruiSliderData.blankWidth; //空隙

    var nx = yxxruiSliderData.newImgWidth;//新图片突出
    var ox = kx + nx*2; //每页无效宽度
    var pageWidth = w-ox;//每页大小
    var fx = pageWidth - nx;//首次打开默认位置
    yxxruiSliderData.totalWidth = yxxruiSliderData.datas.length * pageWidth;
    yxxruiSliderData.firstX = -fx;
    yxxruiSliderData.x = -fx;
    let cc = 'yxxruiSliderData.totaoWidth';
    that.setData({
        yxxruiSliderData:yxxruiSliderData
    });
    console.log(that)
    dealEvent(that);
    // startSlideCallback && startSlideCallback(1)
    // endSlideCallback && endSlideCallback(1)


}
function dealEvent(){
    that.sliderTouchStart = function(opt){
        slideTimer && clearInterval(slideTimer)
        sliderLock = 0;
        autoRunTimer && clearInterval(autoRunTimer);
        lastX = yxxruiSliderData.x;
        firstPointX = opt.touches[0].clientX;
    };

    that.sliderTouchMove = function(opt){
        var pointx = opt.touches[0].clientX;
        yxxruiSliderData.x = lastX + (pointx-firstPointX);
        that.setData({
           yxxruiSliderData:yxxruiSliderData 
        });
    };
    that.sliderTouchEnd = function(opt){
        slidePage(that,0);
        if(autoRun){
            autoRunMyslider(that,interval);
        }
    };
    that.sliderTouchCancel = that.sliderTouchEnd;
    that.onHide = function(){
        autoRunTimer && clearInterval(autoRunTimer);
    };
    that.onShow = function(){
        if(autoRun){
            autoRunMyslider(that,interval);
        }
    }
}
//自动开始滚动
function autoRunMyslider(that,t){
    autoRunTimer && clearInterval(autoRunTimer);
    autoRunTimer = setInterval(function(){
        var dir = direction == 'right'?1:-1;
        slidePage(that,dir);
    },t);
}

//一次滚动一屏，并且有方向
function slidePage(that,page){
    var lastx = yxxruiSliderData.x-yxxruiSliderData.newImgWidth;
    var totalWidth = yxxruiSliderData.totalWidth;
    var perScreenX = totalWidth/yxxruiSliderData.datas.length;
    var remain = (perScreenX - Math.abs(lastx%perScreenX))%perScreenX;
    if(remain>0){
        //离哪边近跑那边
        if(remain<perScreenX/2){
            //距离左边近
            slideTo(that,-remain);
        }else{
            slideTo(that,perScreenX-remain);
        }
    }else{
        slideTo(that,perScreenX*page);
    }
}
function slideTo(that,x){ //锁，若正在滚动，则不允许操作
    if(sliderLock == 1)return;
    sliderLock = 1;
    var i =0;
    var timeStep = 20; //x毫秒刷新一次
    var lastx = yxxruiSliderData.x;
    var perScreenX = yxxruiSliderData.totalWidth/yxxruiSliderData.datas.length;
    var step = Math.floor(perScreenX / (duration/timeStep));
    var totalWidth = yxxruiSliderData.totalWidth;
    slideTimer = setInterval(function(){
        var curPage = 0;
        if(i == 0){
            curPage = Math.abs(Math.round((lastx + x -18)/perScreenX),0);
            curPage = curPage == yxxruiSliderData.datas.length -1?1:curPage;
            curPage = curPage == 0? yxxruiSliderData.datas.length -2:curPage;
            startSlideCallback && startSlideCallback(curPage);
        }

        if(i>=Math.abs(x)){
            slideTimer && clearInterval(slideTimer);
            
            //向左滚动到终点，最后一张
            if(lastx + x>=yxxruiSliderData.newImgWidth){
              yxxruiSliderData.x = yxxruiSliderData.newImgWidth - (totalWidth - x-perScreenX)
            }
            //向右滚动到终点，回到最开始
            if(lastx + x + totalWidth - perScreenX<=yxxruiSliderData.newImgWidth){
                yxxruiSliderData.x = yxxruiSliderData.firstX;
            }

            //计算当前第几页
            lastx = yxxruiSliderData.x;
            curPage = Math.abs(Math.floor((lastx+perScreenX)/perScreenX))
            yxxruiSliderData.curPage = curPage;
            that.setData({
                yxxruiSliderData:yxxruiSliderData
            });
            //向用户回调
            endSlideCallback && endSlideCallback(curPage);

            //一切完毕，关闭锁
            sliderLock = 0;
            return;
        }
        //距离比步数大。直接跳步数
        if(Math.abs(x)-i>step){
            i+=step;
        }else{
            i = Math.abs(x);
        }
        if(x>0){
            //x>0,向右滚动（lastx为负值）
            yxxruiSliderData.x = lastx +i;
        }else{
            yxxruiSliderData.x = lastx -i;
        }
        that.setData({
            yxxruiSliderData:yxxruiSliderData
        });
    },timeStep);
}
module.exports = {
    initMySlider:initMySlider
}

