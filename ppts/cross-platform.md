title: 跨平台开发
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon

[slide]
# 主要的几种方式
* 代码转换
* 编译
* 虚拟机
* Hybrid
* React-Native Weex
* React-Canvas
[slide]
# 代码转换
* Java -> OC（J2OBJC）
* OC -> Java
* 某种语言（Haxe、C#） -> Java、OC
[slide]
# 编译
* 比代码转换更进一步，它直接将某个语言编译为普通平台下的二进制文件。
 - Xamarin (c#)
 - Go
[slide]
# 虚拟机
* 如Titanium、Hyperloop、NativeScript
* 自定义一种语言、UI框架，封装各个平台的接口为统一的接口。
[slide]
# Hybrid
* 如PhoneGap(cordova)、Wex、APICloud的superWebView。
* 实现原理还是封装系统的WebView，性能取决于系统自带的WebView。
* 界面还是用html+css来实现，运行在WebView中。
* 交互的跨平台实现方式是针对不同平台的WebView进行封装，提供统一的js接口，供开发者调用。
* JS与客户端通信和Hybrid的原理基本一样。
[slide]
# cordova
![cordova](/img/cordova.png)
[slide]
* JS端使用XMLHttpRequest发起请求,每个请求生成一个叫 callbackId 的唯一标识存在js端并且传到Native
```
// successCallback : 成功回调方法
// failCallback    : 失败回调方法
// server          : 所要请求的服务名字
// action          : 所要请求的服务具体操作
// actionArgs      : 请求操作所带的参数
cordova.exec(successCallback, failCallback, service, action, actionArgs);
```
* WebView中拦截请求，根据service参数对应方法进行处理，最后把处理结果和callbackId一起传给js
* js端根据callbackId，执行successCallback/failCallback
[slide]
# React Native
* 封装原生UIView成组件，前端直接使用，最终渲染成Native UI
* js端和Native端会有一份共同的配置表，配置表里包括了所有模块和模块里方法的信息
* ![react-native](/img/react-native.png)
[slide]
# Weex
* "Vue-Native"
* 用html+css+js编写，然后通过transformer成js或者json，最后交由不同平台的渲染引擎进行渲染
## 工作原理
* ![weex](/img/weex.png)
[slide]
# Weex架构
* ![weex-2](/img/weex-2.png)
[slide]
# Weex 渲染流程
* 虚拟DOM.
* 构造树结构. 分析虚拟DOM JSON数据以构造渲染树(RT).
* 添加样式. 为渲染树的各个节点添加样式.
* 创建视图. 为渲染树各个节点创建Native视图.
* 绑定事件. 为Native视图绑定事件.
* CSS布局. 使用 css-layout 来计算各个视图的布局.
* 更新视窗(Frame). 采用上一步的计算结果来更新视窗中各个视图的最终布局位置.
* 最终页面呈现.
* ![weex-render](/img/weex-render.png)
[slide]
# react-canvas
* 提供标准的React组件，实现了一个渲染引擎，最终将界面绘制在Webview中的canvas中
* 性能主要依靠Webview中canvas绘制的性能
[slide]
# 下一步计划
* 实际开发demo，对比性能fps，listview，动画，交互是否有延迟
* 阅读源码
* 复杂动画case，以及h5的动画转到native后效果消失
* 
[slide]
# 参考资源
* [跨平台开发](http://fex.baidu.com/blog/2015/05/cross-mobile/)
* [cordova](http://zhenby.com/blog/2013/05/16/cordova-for-ios/)
* [react-native](http://blog.cnbang.net/tech/2698/)
* [weex](http://www.infoq.com/cn/articles/taobao-mobile-weex)
* [weex](https://yq.aliyun.com/articles/57995)
