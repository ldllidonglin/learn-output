title: weex-h5-render
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon

[slide]
# weex-h5-render
[slide]
## weex
* 是阿里巴巴在今年4月份的Qcon大会上开源的跨平台移动开发工具，一份代码三端运行
* DSL和vuejs相同， 以webcomponents标准，把一个组件分成templat、style、script 三部分以单文件的形式组织代码如helloworld.we
* 安装官方的weex-toolkit工具，weex helloworld.we在桌面预览及调试开发，官方还有一个Weex Playground App,可以用来在手机上实时预览
[slide]
## 源代码
```
<template>
<div>
    <text class="title">hello weex</text>
    <text class="body">ddd</text>
</div>
</template>
<style>
.title {
    color:red;
}
.body {
    color: blue;
}
</style>
```
* template只支持有限的标签，但是基本够用，比如div、text、input、textarea、a等等常见标签
* weex原生提供list、slider、web等组件
* css是使用的css-layout,是前端所用的css的一个子集，但是h5端支持全部css，为了三端通用不建议
[slide]
### weex-transformer之后的代码
![weex-render](/img/weex-transformer.png)
[slide]
## demo
[demo](https://ldllidonglin.github.io/learn-output/demo/weex/)
```
window.weex.init({
    appId: location.href,
    loader: 'source',
    source: 'define("@weex-component/foo", function (require, exports, module) {;;module.exports.style = {"title": {'+
'"color": "#FF0000"  },  "body": {    "color": "#0000FF"  }}'+';module.exports.template = {"type": "div","children": [{"type":"text",      "classList": [        "title"      ],      "attr": {        "value": "hello weex"      }    },{"type": "text",      "classList": ["body"],"attr": {"value": "ddd"}}]};});bootstrap("@weex-component/foo", {"transformerVersion":"0.3.1"})',
    rootId: 'weex'
})
```
![weex-render-dom](/img/weex-render-dom.png)
[slide]
* init函数就是一序列的初始化，创建实例等操作，最后会把bundle代码以new Function的形式执行
* 这是它所需的参数
```
const bundleDefine = (...args) => defineFn(app, ...args)
const bundleBootstrap = (name, config, _data) => {
    result = bootstrap(app, name, config, _data || data)
    updateActions(app)
    app.doc.listener.createFinish()
    console.debug(`[JS Framework] After intialized an instance(${app.id})`)
}
const bundleRequire = name => _data => {
    result = bootstrap(app, name, {}, _data)
}
...
```
[slide]
* 用到的define、require、bootstrap等参数都会以参数的形式传递
  ```
   const fn = new Function('define','require','document','bootstrap',
      'register','render',
      '__weex_define__', // alias for define
      '__weex_bootstrap__', // alias for bootstrap
      '__weex_document__', // alias for bootstrap
      '__weex_require__',
      '__weex_viewmodel__',
      'setTimeout','setInterval','clearTimeout','clearInterval',
      functionBody
    )
    fn(
      bundleDefine,bundleRequire,bundleDocument,bundleBootstrap,bundleRegister,bundleRender,
      bundleDefine, bundleBootstrap,bundleDocument,bundleRequireModule,bundleVm,timerAPIs.setTimeout,timerAPIs.setInterval,
      timerAPIs.clearTimeout,
      timerAPIs.clearInterval)
  ```
* define函数主要就是register、init模块
* bootstrap最后是创建一个VM实例：app.vm = new Vm(cleanName, null, { _app: app }, null, data)
* VM的构造函数里主要做了如下几件事
  ```
  options = this._app.customComponentMap[type] 获得之前注册得component
  initEvents(this, externalEvents) //初始化事件和生命周期
  this.$emit('hook:init')
  initState(this)                  // 初始化data、computed、（完成observe）function
  this.$emit('hook:created')
  build(this)  //开始编译、绘制
  ```
[slide]
## 编译
* build函数其实就是调用compile，compile结束后触发ready lifecycle
* compile函数中有很多if语句，根据节点不同，派发编译到不同的函数比如
 + compileRepeat
 + compileShown
 + ...   
 <span style="color:red">最终还是会调用compile函数</span>
* compile函数最后一句是compileNativeComponent(vm, target, dest, type)，就是绘制NativeUI，因为compile是会递归调用的，所以每一次调用都会调用compileNativeComponent,实现流式渲染
* compileNativeComponent函数中会根据ref属性，决定调用createBody方法还是createElement方法来创建element
* compielNativeComponent最终会调用一个attachTarget函数，进行绘制
    ```
    attachTarget(vm, element, dest)
    ```
[slide]
* demo的绘制流程
![weex-html5-render](/img/weex-html5-render.png)
* createBody方法也是会创建一个Element，只是这个Element特殊一点，会把这个Element的role设为‘body’，ref = ‘_root'
* attachTarget函数最终都是调用dest.appendChild函数，而body的父元素是document，document的appendChild函数是appendBody
* appendBody函数会填充一些属性，比如docId,ownerDocument等，然后把这个vdom传给listener.createBody方法
[slide]
* 渲染的原子操作都是appendChild
* 每个标签都对应着weex里的component，在h5端，component有一个node属性，保存着这个component对应的DOM，最终的操作就是
component.node.appendChild(childComponent.node,index)

