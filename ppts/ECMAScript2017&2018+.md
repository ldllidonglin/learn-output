title: ECMAScript2017&2018+
speaker: 李冬琳
url: 
transition: slide3
files: 
theme: moon
[slide]
# ECMAScript规范及ECMAScript2017&2018+
[slide]
# 主要内容
* ECMAScript规范及其制定流程
* ES2017&ES2018+

[slide]
# ECMAScript规范及其制定流程

[slide]
# What？
* ECMAScript {:&.moveIn}
  * 是一种由**Ecma国际**通过**ECMA-262**标准化的脚本程序设计语言，它的具体实现有JavaScript、MS的JScript、Adobe 的ActionScript等
* Ecma国际
  * Ecma国际是一个制定通信技术、消费电子等领域相关标准的一个组织。其会员目前有Google、HP、Hitachi、IBM、Intel、Konica Minolta、MircroSoft、Paypal、Yahoo等.
* ECMA-262
  * ECMA在1997年发布的262号标准。
[slide]
# History
* 1995年，Netscape的**Brendan Eich**发明了JavaScript语言
* 1996年Netscape将JavaScript提交给ECMA
* 1997年6月，ECMAScript 1.0
* 1998年6月，ECMAScript 2.0
* 1999年12月，ECMAScript 3.0
* 2009年12月，ECMAScript 5.0
* 2011年6月，ECMAScript 5.1
* <span class="red">2015年6月，ECMAScript 2015</span>
* 2016年6月，ECMAScript 2016
* 2017年6月，ECMAScript 2017
* ...
[slide]
# Update
+ Who？ {:&.moveIn}
  * Ecma国际的TC39委员会
+ How？
  * 成文标准要从事实标准中诞生，实现先于标准存在
  * 任何人都可以去[ecma262的github](https://github.com/tc39/ecma262/pulls)以提PR的方式提出提案
  * TC39委员会每两月开一次会，讨论各个阶段的提案能否进入下一阶段
  * 每个提案一共要经过[5个阶段](https://tc39.github.io/process-document/)，到达stage4的提案才会写入下一版规范
+ when？
  * Ecma国际每年6月份开General Assembly，表决是否通过当年的ECMA-262标准。
[slide]
# TC39 Process
![stages](/img/ECMA/stages.png)

[slide]
# TC39 Process
+ stage0(Strawman)，只要注册会TC39的会员，就可以提交
+ stage1(Proposal)，提供demos/polyfills。说明TC39委员会愿意考虑这提议
+ stage2(Draft), 完善的说明，必须包含2个实验性的具体实现，其中一个可以是用转译器实现的，例如Babel
+ stage3(Candidate)，规范文档，评审人和ECMAScript的编辑要在规范上签字，至少要有两个符合规范的具体实现
+ stage4(Finished)，完成阶段，必须有2个实现通过[test262](https://github.com/tc39/test262)测试，ECMAScript的编辑必须规范上的签字

[slide]
# ES2017&ES2018+

[slide]
# ECMAScript2017 总体介绍
* 共27章+7个附录，共880页
* 1-5: 规范的历史、引用、符号约定等内容
* 6-9章: 数据类型、抽象操作、执行上下文、对象的内部方法
* 10-16章: ECMAScript的语法定义，比如表达式、语句、函数、类等
* 17-26章: ECMAScript标准库的定义，比如全局对象、数字、日期、Proxy、Reflect等标准对象的定义
* 27章: 内存模型

[slide]
# ES2017
* 今年6月27号在General Assembly上表决通过，[新特性](https://github.com/tc39/proposals/blob/master/finished-proposals.md)主要有：
 + Object.values/Object.entries
 + String padding
 + Object.getOwnPropertyDescriptors
 + Trailing commas in function parameter lists and calls
 + Async Functions
 + Shared memory and atomics

[slide]
## 1 Object.values/Object.entries
    + Object.values
    ```
    const obj = { x: 'xxx', y: 1 };
    Object.values(obj); // ['xxx', 1]

    const obj = ['e', 's', '8']; // same as { 0: 'e', 1: 's', 2: '8' };
    Object.values(obj); // ['e', 's', '8']
    ```
    + Object.entries
    ```
    const obj = { x: 'xxx', y: 1 };
    Object.entries(obj); // [['x', 'xxx'], ['y', 1]]

    const obj = ['e', 's', '8'];
    Object.entries(obj); // [['0', 'e'], ['1', 's'], ['2', '
    ```

[slide]
## 2 String padding
* 内置String填充函数
  + padStart
  ```
  'es8'.padStart(2);          // 'es8'
  'es8'.padStart(5);          // '  es8'
  'es8'.padStart(6, 'woof');  // 'wooes8'
  'es8'.padStart(14, 'wow');  // 'wowwowwowwoes8'
  ```
  + padEnd
  ```
  'es8'.padEnd(2);          // 'es8'
  'es8'.padEnd(5);          // 'es8  '
  'es8'.padEnd(6, 'woof');  // 'es8woo'
  'es8'.padEnd(14, 'wow');  // 'es8wowwowwowwo'
  ```

[slide]
## 3 Object.getOwnPropertyDescriptors
* 返回对象自身所有属性的属性描述符
  ```
  const obj = { 
    get es7() { return 777; },
    get es8() { return 888; }
  };
  Object.getOwnPropertyDescriptors(obj);
    // {
    //   es7: {
    //     configurable: true,
    //     enumerable: true,
    //     get: function es7(){}, //the getter function
    //     set: undefined
    //   },
    //   es8: {
    //     configurable: true,
    //     enumerable: true,
    //     get: function es8(){}, //the getter function
    //     set: undefined
    //   }
    // }
  ```

[slide]
## 4 Trailing commas in function parameter lists and calls
* 函数声明和函数调用时允许参数尾部添加逗号
```
function es8(var1, var2, var3,) {
  // ...
}
es8(10, 20, 30,);
```

[slide]
## 5 Async Function
* 异步编程解决方案
  ```
  function fetchTextByPromise() {
    return new Promise(resolve => { 
        setTimeout(() => { 
          resolve("es8");
        }, 2000);
    });
  }
  async function sayHello() { 
    const externalFetchedText = await fetchTextByPromise();
    console.log(`Hello, ${externalFetchedText}`); // Hello, es8
  }
  sayHello(); // Hello es8
  ```

[slide]
## 6 Shared memory and atomics
* 结合Web Worker，使用SharedArrayBuffer在不同线程间共享内存，通过Atomics解决多线程对共享内存的的竞态问题。
    ```
    // main.js
    const worker = new Worker('worker.js');
    // To be shared
    const sharedBuffer = new SharedArrayBuffer( // (A)
        10 * Int32Array.BYTES_PER_ELEMENT); // 10 elements
    // Share sharedBuffer with the worker
    worker.postMessage({sharedBuffer}); // clone
    // Local only
    const sharedArray = new Int32Array(sharedBuffer); // (B)
    // worker.js
    self.addEventListener('message', function (event) {
        const {sharedBuffer} = event.data;
        const sharedArray = new Int32Array(sharedBuffer); // (A)
        Atomics.store(sharedArray, 0, 123);
        // ···
    });
    ```

[slide]
# ES2018+ {:&.flexbox.vleft}

* stage4
  + [Lifting template literal restriction](https://github.com/tc39/proposal-template-literal-revision)
 
* stage3([16个](https://github.com/tc39/proposals/blob/master/README.md))
   * [Function.prototype.toString revision](http://tc39.github.io/Function-prototype-toString-revision/)
   * [promise-finally](https://github.com/tc39/proposal-promise-finally)
   * [Optional catch binding](https://github.com/tc39/proposal-optional-catch-binding)
   * [class fields](https://github.com/tc39/proposal-class-fields)
   * [import()](https://github.com/tc39/proposal-dynamic-import)
   * [import.meta](https://github.com/tc39/proposal-import-meta)
   * [global](https://github.com/tc39/proposal-global)
   
[slide]
* [Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread)</li>
* [Asynchronous Iteration](https://github.com/tc39/proposal-async-iteration)
* [RegExp Lookbehind Assertions](https://github.com/tc39/proposal-regexp-lookbehind)
* [RegExp Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes)
* [RegExp named capture groups](https://github.com/tc39/proposal-regexp-named-groups)
* [s (dotAll) flag for regular expressions](https://github.com/tc39/proposal-regexp-dotall-flag)
* [Legacy RegExp features in JavaScript](https://github.com/tc39/proposal-regexp-legacy-features)
* [BigInt](https://github.com/tc39/proposal-bigint)
* [Private methods and accessors](https://github.com/tc39/proposal-private-methods)

[slide]
# stage 4
[slide]
# Template Literal Revision
* 现在规范中，对于模板字符串有限制，对\x，\u开头的字符串进行转义
  ```
  function latex(strings) {...}
  let document = latex`
    \newcommand{\unicode}{\textbf{Unicode!}} // 报错
    \newcommand{\xerxes}{\textbf{King!}} // 报错
  `
  ```
* 放松对标签模板里面的字符串转义的限制。遇到不合法的字符串转义，就返回undefined，而不是报错，并且从raw属性上面可以得到原始字符串。
  ```
  function tag(strs) {
      strs[0] === undefined
      strs.raw[0] === "\\unicode and \\u{55}";
  }
  tag`\unicode and \u{55}`
  ```

[slide]
# stage3
[slide]
# 1 Function.prototype.toString 
* 以前规范规定的很模糊，导致各引擎实现的不一致。比如对换行空格的处理、内置函数和自定义函数的返回
* 明确、具体的规定这个方法的针对不同的函数的返回。
  + 内置函数、宿主函数、绑定函数一律返回"function () { [native code] }"
  + 通过ECMAScript定义的，一字不落的返回和源代码一样的文本
  + 通过Function等构造函数动态创建的，合成一个源代码返回，针对不同的情况，规定返回格式
  + 其余情况返回TypeError

[slide]
## 2 Promise.prototype.finally
* Promise原生提供finally方法
  ```
  Promise.resolve(2)
  .then(() => {}, () => {})
  .finally(function () {

  })
  ```

[slide]
## 3 Optional catch binding
* try{}catch(e){}的e参数变为可选
  ```
  try{

  }catch(){
    // 可不写参数了
  }
  ```

[slide]
## 4 global
* 增加一个名为global的，在浏览器、nodejs、Web Workers中通用的全局对象，用来访问全局变量
```
'use strict';
(function (global) {
	if (!global.global) {
		if (Object.defineProperty) {
			Object.defineProperty(global, 'global', {
				configurable: true,
				enumerable: false,
				value: global,
				writable: true
			});
		} else {
			global.global = global;
		}
	}
})(typeof this === 'object' ? this : Function('return this')())
```

[slide]
## 5 import(specifier)
* ES2015就写入规范的import，原生提供了静态的、同步的加载模块的方式
* import()用来支持动态加载模块，返回一个Promise  
```
import('a.js')
.then(myModule => {
    console.log(myModule.default);
});
```

[slide]
## 6 import.meta
* 给模块内部提供一种获取上下文信息的途径
```
<script type="module" src="path/to/hamster-displayer.mjs" data-size="500"></script>
(async () => {
  const response = await fetch(new URL("../hamsters.jpg", import.meta.url));
  const blob = await response.blob();

  const size = import.meta.scriptElement.dataset.size || 300;

  const image = new Image();
  image.src = URL.createObjectURL(blob);
  image.width = image.height = size;

  document.body.appendChild(image);
})();
```

[slide]
## 7 Rest/Spread Properties
* 对象支持展开运算符和函数形参的剩余参数语法
```
const obj = {foo: 1, bar: 2, baz: 3};
const {foo, ...rest} = obj;
```
```
const obj = {foo: 1, bar: 2, baz: 3};
console.log({...obj, qux: 4})
//{foo: 1, bar: 2, baz: 3, qux: 4 }
```

[slide]
## 8 class-fields
* class语法新增声明公共字段和私有字段的方式
  ```
  class Counter extends HTMLElement {
    #x = 0; // 私有字段
    y = 1; // 公共字段
    a () {

    }
  }
  ```

[slide]
## 9 Private methods and accessors
* class语法新增申明私有方法和访问器
  ```
  class Counter extends HTMLElement {
    #x = 0; // 私有字段
    y = 1; // 公共字段
    #a () {
      this.#x++
    }
    get #x() {}
    set #x(value) {}
  }

  ```

[slide]
## 10 async-iteration
* 新增异步迭代器，针对异步数据迭代
  ```
  const { value, done } = syncIterator.next();

  asyncIterator.next().then(({ value, done }) => /* ... */);

  for await (const line of readLines(filePath)) {
    console.log(line);
  }
  ```

[slide]
## 11 RegExp Lookbehind Assertions
* 正则表达式以前只有先行断言，现在新增正向后行断言(?<=...)和负向后行断言(?<!...)
  ```
  /(?<=\$)\d+(\.\d*)?/.test('$10.53') // true
  /(?<=\$)\d+(\.\d*)?/.test('&10.53') // false

  /(?<!\$)\d+(\.\d*)?/.test('$10.53') // false
  /(?<!\$)\d+(\.\d*)?/.test('&10.53') // true
  ```

[slide]
## 12 Unicode property escapes in regular expressions
* 正则表达式新增一种方式
```\p{UnicodePropertyName=UnicodePropertyValue},\P{UnicodePropertyValue}```，可以实现对某一类Unicode字符的识别，而不是写一串的\u1232...
  ```
  const regex = /^\p{Decimal_Number}+$/u;
  regex.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼');
  // → true

  const regex = /\p{Emoji_Modifier_Base}$/u;
  regex.test('⌚');
  // → true
  ```

[slide]
## 13 RegExp named capture groups
* 正则表达式新增命名捕获分组语法```(?<name>...) ```
  ```
  let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
  console.log(`one: ${one}, two: ${two}`);  // prints one: foo, two: bar
  ```

[slide]
## 14 regexp-dotall-flag
* 以前正则里的`.`不能匹配`\n \r`等换行符，新增`s`flag，支持单行模式，从而让`.`能匹配换行符
```
/./s.test('\n') // true
```

[slide]
## 15 regexp-legacy-features
* 将很多浏览器已经实现了的，但是没有写入规范的RegExp构造函数上的属性，比如RegExp.$1-9、RegExp.input等写入规范，并且规定这些属性的特性。[具体改动](https://github.com/tc39/proposal-regexp-legacy-features/blob/master/changes.md)

[slide]
## 16 BigInt
* 新增一个数值类型：BigInt，用来表示大于2^53和小于-2^53的整数。
  ```
  typeof 123n === 'bigint'
  ```
* Number和BigInt不能互转
* 重载了+ / 等运算符

[slide]
# Babel支持情况
* global
* Asynchronous Iteration
* async-to-generator
* Rest/Spread Properties
* Optional catch binding

[slide]
# THX
[slide]
* [ECMA国际](http://www.ecma-international.org/)
* [tc39会议纪要](https://github.com/rwaldron/tc39-notes)
* [正在进行中的各个提案的状态](https://github.com/tc39/proposals/blob/master/README.md)
* [各大浏览器对新特性的实现情况](http://kangax.github.io/compat-table/esnext/)
* [ECMAScript2017](http://www.ecma-international.org/ecma-262/8.0/index.html)
* [ES5中文](https://www.w3.org/html/ig/zh/wiki/ES5)
* [Dr.Axel Rauschmayer](http://2ality.com/2015/11/tc39-process.html)
* 
