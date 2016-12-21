title: weex-native-render
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon

[slide]
# Weex Native Render
<small>李冬琳</small>
[slide]
# 上次分享遗留的几个问题
[slide]
* 对于css，在js引擎内没有内存计算，在h5渲染时只是进行单位换算后直接写在dom.style上，native渲染用的[css-layout](https://github.com/facebook/yoga)(改名为yoga了)
* 不支持百分比布局，按宽度为750进行布局，最后会根据当前的屏幕大小做换算成px(value = value * window.innerWidth / 750)
* css样式不支持继承，([官方支持的属性](http://alibaba.github.io/weex/doc/references/common-style.html))
* 不支持overflow，要实现带滚动的布局可以使用内置的scroller组件
* 不支持z-index
* 事件、动画  
[slide]
# Native Render
[slide]
## 渲染流程
* ![Weex Render Flow ](https://gtms03.alicdn.com/tps/i3/TB1_SA4MXXXXXXGaXXXpZ8UVXXX-519-337.png)
* [参考博客](http://blog.csdn.net/xuguoli_beyondboy/article/details/53064155)  
[slide]
## js引擎执行bundle.js时的运行流程图
## ![weex-js-run](/img/weex-html5-run.png)
[slide]
## 从源代码到UI的过程
![weex-render-native](/img/weex-render-native.png)
[slide]
## 通信（js -> native）
* js引擎通过callNative函数发送给Native特定格式的[消息](http://note.youdao.com/noteshare?id=134039b0899f8a3982c0b67271f42cbc)
* debug log
  ```
  callNative >>>> instanceId:1, tasks:[{"module":"dom","method":"createBody","args":[{"ref":"_root",
    "type":"div","attr":{},"style":{}}]}], callback:-1
  callNative >>>> instanceId:1, tasks:[{"module":"dom","method":"addElement","args":["_root",{"ref":"5",
    "type":"div","attr":{},"style":{"backgroundColor":"#6666ff","width":200,"height":200},"event":["click"]},-1]}], callback:-1
  callNative >>>> instanceId:1, tasks:[{"module":"dom","method":"createFinish","args":[]}], callback:-1
    ```
* 通过JNI技术，v8引擎执行callNative代码会调用Java的callNative函数，然后经过一序列的调用，实现布局、绑定数据、绑定事件，最终生成UI
[slide]
## 通信（native -> js）
* Native调用js有两种情况：
  + 触发事件（fireEvent）
  + 回调 (callback)
* 也是通过JNI技术，java调用execJS函数，将要调用的相关信息传给js引擎
[slide]
# 事件  
[slide]
* 在代码中声明的事件最终会被编译成如下格式
  ```
  "events": {
    "click": "handler"
  },
  ```
* 在js引擎执行时并不会绑定事件，只会存事件对应的响应函数
* 在Native端渲染的时候，如果有事件，会同时在View上绑定事件，当事件触发时，Native的事件回调最终是会通过callJS的方式，通知v8引擎执行相关的js代码
  ```
  mWXBridge.execJS(instanceId, namespace, function, args);
  ```
* js引擎获取function是fireEvent，和对应的实例id，元素、事件类型，然后获取到响应这个事件的函数，并且执行这个函数
[slide]
# 动画
[slide]
* [动画是weex的一个内置组件](https://alibaba.github.io/weex/cn/doc/modules/animation.html)
* [Native源码](https://github.com/alibaba/weex/blob/dev/android/sdk/src/main/java/com/taobao/weex/ui/animation/WXAnimationModule.java)
* 最终的实现是Native原生的动画
* 使用
```
var animation = require('@weex-module/animation');
var testEl = this.$el('test');
animation.transition(testEl, {
    styles: {
    color: '#FF0000',
    transform: 'translate(1, 1)',
    transformOrigin: 'center center'
    },
    duration: 0, //ms
    timingFunction: 'ease',
    delay: 0 //ms
}, function () {
    nativeLog('animation finished.')
})
```
[slide]
## 原理
* js引擎会把模块对应的方法都变成callTasks，调用animation模块方法transition时，其实是在调用callTasks
  ```
  export function requireModule (moduleName) {
      const methods = nativeModules[moduleName]
      const target = {}
    
      for (const methodName in methods) {
        target[methodName] = (...args) => this.callTasks({
          module: moduleName,
          method: methodName,
          args: args
        })
      }
    
      return target
  }
  ```
* callTasks最终还是通过callNative方法实现调用Native端的代码
* Native端会根据callNative中传过来的参数识别出是内置的animation module的transition方法，然后调用相应方法执行，实现动画效果
[slide]  
## 动画结束的回调
* 在调用的时候就会把参数中的回调注册在实例上的一个callbacks数组中，并且把标记位作为参数传给Native
* Native端动画结束后，在原生的动画结束回调事件中调用callJS，把之前传进来的标记位和回调参数一起传给js引擎，然后js引擎从callbacks中找到对应的函数，执行
[slide]
# 谢谢！
