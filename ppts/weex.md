title: weex android sdk 源码
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon

[slide]
# weex android sdk 源码分析
[slide]
# 使用
* 在app初始化代码中初始化sdk engine
```
InitConfig.Builder builder = new InitConfig.Builder();
builder.setImgAdapter(new ImageAdapter());
//builder.setHttpAdapter(new DefaultWXHttpAdapter());
InitConfig config = builder.build();
WXSDKEngine.initialize(this,config);
```
* 初始化so库文件，渲染逻辑、脚本业务框架（weex.js）等都封装在了这里；
* 初始化initScriptsFramework，也就是初始化脚本框架；
* 注册component、module
[slide]
# 在activity中渲染bundle.js
```
mInstance = new WXSDKInstance(this); //create weex instance
mInstance.registerRenderListener(new SimpleRenderListener())
class SimpleRenderListener implements IWXRenderListener {
  @Override
  public void onViewCreated(WXSDKInstance wxsdkInstance, View view) {
    if (mContainer != null) {
      //渲染完成后把创建的View添加到容器组件中
      mContainer.addView(view);
    }
  }
}
instance.renderByUrl(TAG, WEEX_INDEX_URL, options, null, 
ScreenUtil.getDisplayWidth(this), ScreenUtil.getDisplayHeight(this), 
WXRenderStrategy.APPEND_ASYNC);
```
[slide]
![weex-render](/img/weex-js.png)
```
// WXRenderManager
public void createInstance(WXSDKInstance instance) {
    mRegistries.put(instance.getInstanceId(), new WXRenderStatement(instance));
}
```
[slide]
```
/**
  * Create instance.
*/
public void createInstance(final String instanceId, final String template,
                             final Map<String, Object> options, final String data) {
    post(new Runnable() {
      @Override
      public void run() {
        invokeCreateInstance(instanceId, template, options, data);
        final long totalTime = System.currentTimeMillis() - start;
        WXSDKManager.getInstance().postOnUiThread(new Runnable() {
          @Override
          public void run() {
            WXSDKInstance instance = WXSDKManager.getInstance().getSDKInstance(instanceId);
            if (instance != null) {
              instance.createInstanceFinished(totalTime);
            }
          }
        }, 0);
      }
    }, instanceId);
}
private void invokeCreateInstance(String instanceId, String template,
                                    Map<String, Object> options, String data) {
  WXJSObject instanceIdObj = new WXJSObject(WXJSObject.String,
                                                  instanceId);
  WXJSObject instanceObj = new WXJSObject(WXJSObject.String,
                                                template);
  WXJSObject optionsObj = new WXJSObject(WXJSObject.JSON,
                                               options == null ? "{}"
                                                               : WXJsonUtils.fromObjectToJSONString(options));
  WXJSObject dataObj = new WXJSObject(WXJSObject.JSON,
                                            data == null ? "{}" : data);
  WXJSObject[] args = {instanceIdObj, instanceObj, optionsObj,
            dataObj};
  WXBridge.execJS(instanceId, null, METHOD_CREATE_INSTANCE, args);
}
```
[slide]
# callNative
* js代码执行完后会调用WXBridge的callNative函数
```
  public int callNative(String instanceId, String tasks, String callback) {
    long start = System.currentTimeMillis();
    if(WXSDKManager.getInstance().getSDKInstance(instanceId)!=null) {
      WXSDKManager.getInstance().getSDKInstance(instanceId).firstScreenCreateInstanceTime(start);
    }
    int errorCode = WXBridgeManager.getInstance().callNative(instanceId, tasks, callback);

    if(WXSDKManager.getInstance().getSDKInstance(instanceId)!=null) {
      WXSDKManager.getInstance().getSDKInstance(instanceId).callNativeTime(System.currentTimeMillis() - start);
    }
    if(WXEnvironment.isApkDebugable()){
      if(errorCode == WXBridgeManager.DESTROY_INSTANCE){
        WXLogUtils.w("destroyInstance :"+instanceId+" JSF must stop callNative");
      }
    }
    return errorCode;
  }
```
[slide]
* WXBridgeManager中的callNative
```
JSONArray array = JSON.parseArray(tasks);
JSONObject task;
int size = array.size();
for (int i = 0; i < size; ++i) {
  task = (JSONObject) array.get(i);
  if (task != null && WXSDKManager.getInstance().getSDKInstance(instanceId) != null) {
    if (TextUtils.equals(WXDomModule.WXDOM, (String) task.get(WXDomModule.MODULE))) {
      sDomModule = getDomModule(instanceId);
      sDomModule.callDomMethod(task);
    } else {
      WXModuleManager.callModuleMethod(instanceId, (String) task.get(WXDomModule.MODULE),
              (String) task.get(WXDomModule.METHOD), (JSONArray) task.get(WXDomModule.ARGS));
    }
  }
}
```
* 这个方法负责分发task,调用WXDomModule.callModuleMethod
[slide]
![weex-render](/img/weex-callNative.png)
[slide]
* WXDomModule.callDomMethod会判断method，然后调用相应方法
```
switch (method) {
    case CREATE_BODY:
      if(args == null){
        return;
      }
      createBody((JSONObject) args.get(0));
      break;
    case UPDATE_ATTRS:
      if(args == null){
        return;
      }
}
```
[slide]
# WXDomStatement中的createBody
```
void createBody(JSONObject element) {
  WXDomObject domObject = parseInner(element);
  domObject.ref = WXDomObject.ROOT;
  domObject.updateStyle(style);
  transformStyle(domObject, true);
  final WXComponent component = mWXRenderManager.createBodyOnDomThread
                                  (mInstanceId, domObject);
  mWXRenderManager.createBody(mInstanceId, component);
}
```
parseInner函数把element这个JSONObject转换成domObject，给他加上了各种type、 event、childern等属性
* 同样的，WXRenderManager执行WXRenderStatement的相同方法
[slide]
```
WXComponent createBodyOnDomThread(WXDomObject dom) {
    if (mWXSDKInstance == null) {
      return null;
    }
    WXDomObject domObject = new WXDomObject();
    domObject.type = WXBasicComponentType.DIV;
    domObject.ref = "god";
    mGodComponent = (WXVContainer) WXComponentFactory.newInstance(mWXSDKInstance, domObject, null);
    mGodComponent.createView(null, -1);
    if (mGodComponent == null) {
      if (WXEnvironment.isApkDebugable()) {
        WXLogUtils.e("rootView failed!");
      }
      //TODO error callback
      return null;
    }
    FrameLayout frameLayout = (FrameLayout) mGodComponent.getView();
    ViewGroup.LayoutParams layoutParams = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
    frameLayout.setLayoutParams(layoutParams);
    frameLayout.setBackgroundColor(Color.TRANSPARENT);

    WXComponent component = generateComponentTree(dom, mGodComponent);
    mGodComponent.addChild(component);
    mRegistry.put(component.getRef(), component);
    return component;
}
```
[slide]
```
void createBody(WXComponent component) {
    long start = System.currentTimeMillis();
    component.createView(mGodComponent, -1);
    if (WXEnvironment.isApkDebugable()) {
      WXLogUtils.renderPerformanceLog("createView", (System.currentTimeMillis() - start));
    }
    start = System.currentTimeMillis();
    component.applyLayoutAndEvent(component);
    component.bindData(component);

    if (WXEnvironment.isApkDebugable()) {
      WXLogUtils.renderPerformanceLog("bind", (System.currentTimeMillis() - start));
    }

    if (component instanceof WXScroller) {
      WXScroller scroller = (WXScroller) component;
      if (scroller.getInnerView() instanceof ScrollView) {
        mWXSDKInstance.setRootScrollView((ScrollView) scroller.getInnerView());
      }
    }
    mWXSDKInstance.setRootView(mGodComponent.getRealView());
    if (mWXSDKInstance.getRenderStrategy() != WXRenderStrategy.APPEND_ONCE) {
      mWXSDKInstance.onViewCreated(mGodComponent);
    }
}
```
[slide]
* 最终这个createBody方法把view创建了并且触发了viewCreated回调。