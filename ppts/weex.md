title: weex
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon

[slide]
# ![weex](//img.alicdn.com/tps/TB1zBLaPXXXXXXeXXXXXXXXXXXX-121-59.svg)
<small>李冬琳</small>
[slide]

# 上次分享遗留的几个问题
[slide]
* 对于css，在js引擎内没有内存计算，在h5渲染时只是进行单位换算后直接写在dom.style上，native渲染用的[css-layout](https://github.com/facebook/yoga)(改名为yoga了)进行计算，然后进行动态布局
* 不支持百分比布局，按宽度为750进行布局，最后会根据当前的屏幕大小做换算成px(value = value * window.innerWidth / 750)
* css样式不支持继承，([官方支持的属性](http://alibaba.github.io/weex/doc/references/common-style.html))
* overflow是hidden，要实现带滚动的布局可以使用内置的scroller组件
* 不支持z-index
* 事件、动画
[slide]
# 概况
* 一套代码、三端运行、动态化
* weex已捐献给Apache基金会，star数1.1w+
* weex@0.9.5已全面支持vue2.0,内置的js-runtime已经改成vue2.0，支持vue-router,vue-loader,vuex
* 目前生态也越来越丰富,支持[在线编写](http://dotwe.org/)，然后用[playground](https://weex-project.io/download.html)预览native效果
* 本地开发用weex-toolkit进行调试编译
* ![weex](/img/weex.png)
[slide]
# 特点（官方）
* 轻量（体积小巧，语法简单，方便上手）
* 可扩展（业务方可自行横向定制 native 组件和 API）
* 高性能（快速加载，快速渲染，体验流畅）
* 组件化（组件之间通过 webcomponents 的设计完美的隔离，并可以通过特定的方式进行数据和事件的传递）
* 多端统一（iOS、Android、HTML5 ）
* 生态&链路（各式各样的工具和平台）
***
[slide]
# 性能
![performance](/img/weex-performance.png)
[slide]
# 开发
* template官方内置的只有有限的标签，但是基本够用，比如div、text、input、textarea、a等等常见标签，但是支持自定义标签，所以可以无限扩展
* weex内置提供list、slider、web、scroller等组件
* css是使用的css-layout, 是前端所用的css的一个子集，只支持部分属性，未来会支持更多
* 为了渲染性能，只支持单class选择器，不支持属性选择器和关系选择器

[slide]
# 开发
<div class="columns-3">
  <img src="/img/weex-code.png" height="500"> =>
  <img src="/img/weex-code-trans.png" height="500"> =>
  <iframe data-src="https://ldllidonglin.github.io/learn-output/demo/weex/animation.html" src="about:blank;"></iframe>
</div>
[slide]

# 原理
+ 编译运行
  * H5: ![weex-html5-render](/img/weex-html5-render.png) {:&.moveIn}
  * Native: ![weex-html5-run](/img/weex-html5-run.png)
  * 前端在template中定义的div、text等等标签都是组件，各个端都有相对应的组件,渲染的时候会根据type，选择对应的端组件进行渲染
[slide]
# Native
[slide]
# Native接入
* 在android studio中新建一个android工程
* 在app的初始化代码中初始化SDK Engine
```
InitConfig.Builder builder = new InitConfig.Builder();
builder.setImgAdapter(new ImageAdapter());
// builder.setHttpAdapter(new DefaultWXHttpAdapter());
InitConfig config = builder.build();
WXSDKEngine.initialize(this,config);
```
* 初始化so库文件（JNI）
* 初始化基础js库(weex.js)
* 注册引擎内置的Component、Module
[slide]
# Native接入
## 在activity中渲染bundle.js
```
mContainer = (ViewGroup) findViewById(R.id.container);
mInstance = new WXSDKInstance(this); //create weex instance
mInstance.registerRenderListener(new SimpleRenderListener())
class SimpleRenderListener implements IWXRenderListener {
  @Override
  public void onViewCreated(WXSDKInstance wxsdkInstance, View view) {
    if (mContainer != null) {
      // 渲染完成后把创建的View添加到容器组件中
      mContainer.addView(view);
    }
  }
}
instance.renderByUrl(TAG, '"http://10.2.58.141:8081/weex_tmp/h5_render/weex-ani.js?wsport=8082",', options, null, 
  ScreenUtil.getDisplayWidth(this), ScreenUtil.getDisplayHeight(this), 
  WXRenderStrategy.APPEND_ASYNC);
```
[slide]
# Native SDK
## 运行流程
![weex-render](/img/weex-js.png)
[slide]
# Native SDK
## 渲染流程
![weex-native-render](/img/weex-native-render.png)
[slide]
# Native和js的通信
* 界面渲染（JS -> Native）
* 事件触发 （Native -> JS）
* 回调 (Native -> JS)
[slide]
# 通信（js -> native）
* js引擎执行渲染操作的最后一步就是callNative
* js引擎通过callNative函数发送给Native特定格式的[消息](http://note.youdao.com/noteshare?id=134039b0899f8a3982c0b67271f42cbc)
* debug log
  ```
  callNative >>>> instanceId:1, tasks:[{"module":"dom","method":"createBody","args":[{"ref":"_root",
    "type":"div","attr":{},"style":{}}]}], callback:-1
  callNative >>>> instanceId:1, tasks:[{"module":"dom","method":"addElement","args":["_root",{"ref":"5",
    "type":"div","attr":{},"style":{"backgroundColor":"#6666ff","width":200,"height":200},"event":["click"]},-1]}], callback:-1
  callNative >>>> instanceId:1, tasks:[{"module":"dom","method":"createFinish","args":[]}], callback:-1
    ```
* 通过JNI技术，v8引擎执行callNative代码会调用Java的callNative函数。
* Native端的callNative会提取出发过来的消息中的module、method、args等参数，然后分发出去
* 经过一序列的调用，实现布局、绑定数据、绑定事件，最终生成UI
[slide]
## 通信（native -> js）
* Native调用js有两种情况：
  + 触发事件（fireEvent）
  + 回调 (callback)
* 也是通过JNI技术，java调用execJS函数，让js引擎执行相应的函数
```
public native int execJS(String instanceId, String namespace, String function, WXJSObject[] args);
```
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
* js引擎在全局注册了fireEvent函数，所以当function是fireEvent时，就能立即调用整个函数，把对应的实例id，元素、事件类型作为参数传进去，然后获取到响应这个事件的函数handler，最终执行这个函数，实现事件的响应回调
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
* 重点在Native以及动态化
* 开发者或者团队必须具备Native能力
* 业务是否需要高动态性？
* 性能的提升有多少？
[slide]
# 谢谢！
