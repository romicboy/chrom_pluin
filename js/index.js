// $(document).ready(function() {
//   window.onload = function() {
//     
//    
// });


(function () {
  $(document).ready(function () {
    // var search_button1 = document.getElementsByClassName('search-btn')[0];
    // search_button1.style = 'display:none'
    /**
     * 请求查询接口，查看是否有淘口令需要需要转化
     * **/
    /**/
    var searchContent = '' // 搜索的内容
    var orderId = '' // 这次查询的id
    function quertyState () {
      $.get('http://fanli.romic.cn/fanli/taobao/fanli/queryState',function(data, status) {
        console.log(data);
        if (data.errno  == 0) {
          searchContent = data.body.goodsLink;
          orderId = data.body.id
          getSearchInput(searchContent)
        } else  {
          console.log(data.error)
          setTimeout(function() {
            quertyState()
          },1000)
        }

      })
    }
    quertyState();
    
    /**
     * 提交查询结果
     * params: {
     *    id: ''  必填
     *    failed: '' 必填 0: 成功，1:失败
     *    newTaobaoPassoword: <string>  非必填，当failed等于1的时候，不传ßß
     * }
     * **/  
    function updataPassword (params,cb) {
      $.post('http://fanli.romic.cn/fanli/taobao/fanli/update',params,function(data) {
          // 发送成功后，执行。。。
          cb(data)
      })
    }
//      * 在onload结束后，网页还会加载一遍（不晓得为啥）,这个时候虽然能拿到输入框的值，但是里面的是空的，所以每隔300毫秒检查一遍
//      * 这里应该加个次数，大于多少次，告诉后端系统错误
//      * **/
      var search_input = document.getElementsByClassName("search-inp");
      var search_button = document.getElementsByClassName('search-btn')
      var code = '' // 淘口令
      var code_2 = '' // 第二个淘口令
    function getSearchInput(searchContent) {   // 搜索框赋值，并点击
      // 这里加上检查本地缓存，要是有缓存，就代表之前失败了，要重新获取
      console.log('第一步====>>初始化',new Date())
      // 这里需要加上没有商品的情况
      if (search_input.length > 0 && search_button.length > 0) {
        console.log('第一步====>>页面加载完成')
        search_input[0].value = searchContent;
         console.log('第一步====>>输入框赋值完毕')
        $('.search-btn')[0].id = 'xcFL';
        console.log('第一步====>>搜索按钮加上id')
        setTimeout(function () {
          $('#xcFL').trigger('click')  //这里要检查报错  所有的都要检查报错，报错就要重新开始。  所有的点击事件都要检查报错，报错就重新点击
          console.log('第一步====>>点击搜索按钮')
        }, 300)
        setTimeout(function() {
          clickExtension()
        },700)
      } else {
        console.log('第一步====>>等待页面加载')
        setTimeout(function () {  // 每过300毫秒重新检查一次  
          getSearchInput(searchContent);
        }, 300);
      }
    };

    function clickExtension() { // 点击推广
      console.log('第二步====>>推广初始化',new Date())
      var extensionBtn = document.getElementsByClassName("box-btn-left")
      console.log('第二步====>>获取推广按钮Dom')
      if (extensionBtn.length > 0) {
        console.log('第二步====>>获取推广按钮Dom成功')
        extensionBtn[0].id = 'xcExtensionBtn'
        console.log('第二步====>>推广按钮加上id')
        trigger('xcExtensionBtn')
        console.log('第二步====>>点击推广')
        submitExtension()
      } else {
        console.log('第二步====>>获取推广按钮Dom失败')
         var noDataList = document.getElementsByClassName('no-data-list')
         console.log('第二步====>>检查是否没有此商品链接')
         if (noDataList.length > 0) {
           // 如果大于0的话，就代表没有商品
           console.log('第二步====>>次商品没有优惠链接')
           updataPassword({id:orderId,failed:1},function() {
            quertyState()
           })
         } else {
          setTimeout(function () {  // 每过300毫秒重新检查一次
            clickExtension();
          }, 300);
         }
       
      }
    }

    function submitExtension() {// 这里有问题
      console.log('第三步====>>确认推广初始化')
      var submitBtn = document.getElementsByClassName('dialog-ft')
      console.log('第三步====>>获取确认推广按钮DOM')
      if (submitBtn.length > 0) {  // 按钮是否渲染出来
        console.log('第三步====>>获取确认推广按钮DOM成功')
        submitBtn[0].children[0].id = 'xcSubmitBtn'
        console.log('第三步====>>确认按钮加上id')
        setTimeout(function() {
          $('#xcSubmitBtn').trigger('click')
          console.log('第三步====>>点击确认推广')
          var setExtensionDom = !!document.getElementsByClassName('block-code').length  //这里是判断点击是否生效     
          console.log('第三步====>>检查确认推广是否成功')
          if (setExtensionDom) {
            console.log('第三步====>>确认推广成功')
            getGoodUrl()
          } else {
            console.log('第三步====>>确认推广失败，重新确认推广初始化')
            submitExtension()          

          }
        },300)
      }
      else {
        console.log('第三步====>>获取确认推广按钮DOM失败，重新获取')
        setTimeout(function() {
          submitExtension()          
        }
      ,300)
      }
    }
    function getGoodUrl () {   
      console.log('第四步====>>获取淘口令初始化')
      var ul = document.getElementsByClassName('tab-nav')   // 如果长时间监测不到，就重连。 要保存当前的id和链接 
      console.log('第四步====>>获取淘口令tab-nav')
      if (ul.length > 0) {
        console.log('第四步====>>获取淘口令tab-nav成功')
         var passwordBtn = ul[0].children[3]
         passwordBtn.id = 'cxPasswordBtn'
         setTimeout(function(){
          $('#cxPasswordBtn').trigger('click')
          console.log('第四步====>>点击切换tab')
          getCode()
            // 发送请求，请求成功后，点击关闭
            // window.location.href = 'http://pub.alimama.com/promo/search/index.htm' // 这里不跳首页 关闭输入框 
         },300)
      } else {
        console.log('第四步====>>获取淘口令tab-nav失败，重新初始化')
        setTimeout(function() {
          getGoodUrl()
        }
        ,300)
      }

    }
    function getCode() {   //获取淘口令
      console.log('第四步====>>准备获取淘口令')
             code = $('#clipboard-target').val()  //  这里可能会有两个值 当有优惠券口令的时候，id就不是这个了
             code_2 = $('#clipboard-target-1').val()
             if (!code && !code_2) {
              console.log('第四步====>>没有获取到淘口令，重新获取')
              setTimeout(function () {
               getcode()
              },300)
           } else {
             console.log('第四步====>>获取到淘口令,准备发送请求')
             var params = {
              newTaobaoPassword : code  ||　code_2,
              id:orderId,
              failed:0
             }
             updataPassword(params,function(data) {
                if (data.errno == 0) {
                  document.getElementsByClassName('btn-gray')[0].id = 'xcCloseBtn'
                  var search_box = document.getElementsByClassName('block-search-box')[0]
                  search_box.style.display = 'none'
                  setTimeout(function() {   // 休息5秒钟
                    $('#xcCloseBtn').trigger('click')
                    quertyState();
                  },5000)
                }
             })
             console.log(params)
             
            
            
           }
          } 
    function trigger(id) { // 原生方法实现js模拟点击
      var e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);　　　　　　　　　　　　　　//这里的click可以换成你想触发的行为
      document.getElementById(id).dispatchEvent(e);　　　//这里的clickME可以换成你想触发行为的DOM结点
    }

    // getSearchInput(); //开始

    // 1:日志 2:就在搜索页操作 3:tab操作 4:插件开关

  })

})()



// 这里是测试3



//这里是测试4