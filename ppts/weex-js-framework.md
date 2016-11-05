title: weex-js-framework源码解读一（compile）
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon

[slide]
# weex-js-framework源码解读一（compile）
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
[slide]
### weex-transformer之后的代码
![weex-render](/img/weex-transformer.png)
[slide]
* 上述代码最终会被传递到html5/default/app/ctrl/init.js中的init函数中
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
```
[slide]
* 执行代码是用new Function的形式执行，用到的define、require、bootstrap等参数都会以参数的形式传递
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
 VM的构造函数里主要做了几件事
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
* compileNativeComponent函数中会根据ref属性，决定调用createBody方法还是createElement方法
* compielNativeComponent最终会调用一个attachTarget函数，进行绘制
[slide]
* createBody方法会创建一个Element，然后把这个Element的role设为‘body’，ref = ‘_root'
* attachTarget函数最终都是调用dest.appendChild函数，而body的父元素是document，document的appendChild函数是appendBody
* appendBody函数会填充一些属性，比如docId,ownerDocument等，然后把这个vdom穿个listener.createBody方法
[slide]
* listener.createBody方法
```
const body = element.toJSON()
const children = body.children
delete body.children
const actions = [createAction('createBody', [body])]
if (children) {
    actions.push.apply(actions, children.map(child => {
        return createAction('addElement', [body.ref, child, -1])
    }))
}
return this.addActions(actions)
```
[slide]
* createAction方法返回的是如下格式的json
```
{ module: 'dom', method: name, args: args }
```
最终的格式
```
{
    "module": "dom",
    "method": "createBody",
    "args": [
        {
            "ref": "_root",
            "type": "div",
            "attr": {},
            "style": {}
        }
    ]
}
```
[slide]
* addActions
```
Listener.prototype.addActions = function (actions) {
  const updates = this.updates
  const handler = this.handler

  if (!Array.isArray(actions)) {
    actions = [actions]
  }

  if (this.batched) {
    updates.push.apply(updates, actions)
  }
  else {
    return handler(actions)
  }
}
```
* handler函数最终会调用callNative函数，然后经过队列等等一序列处理，最终是如下递归执行队列中的任务
```
const raf = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          function (calllback) {
            setTimeout(calllback, 16)
          }
raf(runLoop)
```
[slide]
* callNative最终是通过JNI技术传递到native端，调用java代码
* [callNative的各种action](http://note.youdao.com/noteshare?id=134039b0899f8a3982c0b67271f42cbc)
* [native端的绘制](http://note.youdao.com/noteshare?id=bfc0bd07bbaa8b6acba3a8d4b177af4f)