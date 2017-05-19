title: ECMAScript
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon
[slide]
# ECMAScript规范初探
[slide]
# 是什么？
* ECMAScript
  * 是一种由Ecma国际通过ECMA-262标准化的脚本程序设计语言，它的具体实现有JavaScript、JScript、ActionScript
* Ecma
  * 国际英文全称是Ecma International - European association for standardizing information and communication systems，前身是European Computer Manufacturers Association，ECMA就是其首字母的缩写，现在还保留是为了纪念历史。Ecma国际主要是制定通信技术、消费电子等的标准。其会员目前有Google、HP、Hitachi、IBM、Intel、Konica Minolta、MircroSoft、Paypal、Yahoo等.
* ECMA-262
  * ECMA在1997年发布的262号标准，也就是ECMAScript 1.0
[slide]
# 从哪里来？
* ECMAScript规范由Ecma国际的TC39委员会制定，其中第一版在1997年发布，到目前为止有7版：ES1(1997)、ES2(1998)、ES3(1999)、ES5(2009)、ES5.1(2011)、ES6(2015)、ES2016(2016)
* 从ECMAScript2016(ES7)开始是每年发布一个版本，并且成文标准要从事实标准中诞生，实现先于标准存在
* 规范一共要经过[5个阶段](https://tc39.github.io/process-document/)，最终才会写入规范
  + stage0(Strawman)，只要注册会TC39的会员，就可以提交
  + stage1(Proposal)，进入标准是要描述清楚解决的问题，以及提供demos/polyfills。进入这个阶段说明TC39委员会愿意花时间来考虑你这提议
  + stage2(Draft),草案中包含新增特性语法和语义的，尽可能的完善的形式说明，允许包含一些待办事项或者占位符,必须包含2个实验性的具体实现，其中一个可以是用转译器实现的，例如Babel
  + stage3(Candidate)，候选阶段，要有规范文档，评审人和ECMAScript的编辑要在规范上签字，至少要有两个符合规范的具体实现
  + stage4(Finished)，完成阶段，必须通过[test262](https://github.com/tc39/test262)测试，有2个通过测试的实现，以获取使用过程中的重要实践经验。ECMAScript的编辑必须规范上的签字
* TC39委员会中的成员就是各大浏览器产商的员工代表，每两个月会开一次会，讨论各个阶段的提议能不能进入下一阶段，每年的6月份会发布最新一版的ECMA-262标准
[slide]
# ES2017
* 将在今年6月份发布发布，包含的[新特性](https://github.com/tc39/proposals/blob/master/finished-proposals.md)主要有以下几个：
 + Object.values/Object.entries
 + String padding
 + Object.getOwnPropertyDescriptors
 + Trailing commas in function parameter lists and calls
 + Async Functions
 + Shared memory and atomics
[slide]
# 分号自动插入
* js其实是可以不写分号的
* 什么时候会自动插入分号：
有三条主要的基本规则：

1. 当从左到右解析程序代码，遇到一个任何产生式也无法识别的token，只要满足以下三个条件之一，就会在这个token之前插入一个分号：
  * 这个token被至少一个行终结符和前一个token分开
  * 这个token是 }
  * 这个token是 ) 并且插入分号后会被解析为do-while语句的结尾分号
2. 当从左到右解析程序代码，当输入流结束，整个输入流没法被解析为完整的ECMAScript脚本或者模块，那在输入流的末尾会自动插入分号
3. 当从左到右解析程序代码，遇到一个被部分产生式解析的token，但是这些产生式是*受限产生式*，在受限产生式里紧跟在行终结符或者非行终结符后的第一个token被称作受限token。当至少一个行终结符把这个token和前一个token分割开的时候，会在受限token前插入分号

然而，这有一个附加的优先条件：如果插入分号会导致语句是空语句或者插入的分号是for语句的中两个分号之一，那这个分号不会被插入。
[slide]
## 受限token（++ -- break return throw yield）以及 箭头函数
```
return|throw|break|yield
a + b

//
return|throw|break|yield;
a+b

a = b
++c

// 
a=b;
++ca

// 
a 
=> a
```
[slide]
## 陷阱
* 1 + -
    ```
    var a = b = 1
    a=b
    +1
    ```
* 2
    ```
    a = b
    /something/.test(a)
    ```
* 3
    ```
    a = b
    (function () {})()
    ```
* 4
    ```
    a = b
    [1, 2, 3].forEach()
    ```
[slide]
# == 操作
```
var a = {}
a.valueOf = function () {
    return 1
}
var b = {}
b.valueOf = function () {
    return 1
}
console.log(a == b)
console.log(1 == a)
```
```
1 == true
1 == '1'
```
[slide]
# x == y 算法规范：
* 如果x和y类型相等，返回x === y的结果
* 如果x和y是null或者undefined，返回ture
* 如果x和y是Number和String，把String转换为Number再比较
* 如果x和y有一个使Boolean，把Boolean转换为Number再比较
* 如果等号一侧是Object，另一侧是String、Number、Symbol，把Object转换为Primitive再比较
* 以上条件都不满足，返回false
[slide]
[slide]
[slide]
[slide]
[slide]
