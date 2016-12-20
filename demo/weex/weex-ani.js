define('@weex-component/foo', function (require, exports, module) {

;
  var animation = require('@weex-module/animation')
  module.exports = {
    methods: {
      run: function () {
        var testEl = this.$el('test')
        animation.transition(testEl, {
          styles: {
            backgroundColor: '#FF0000',
            transform: 'translate(100px, 100px)'
          },
          duration: 0, 
          timingFunction: 'ease',
          'transform-origin': 'center center',
          delay: 0 
        }, function () {
          console.log('animation finished.')
        })
      }
    }
  }


;module.exports.style = {
  "test": {
    "backgroundColor": "#6666ff",
    "width": 200,
    "height": 200
  }
}

;module.exports.template = {
  "type": "div",
  "children": [
    {
      "type": "div",
      "id": "test",
      "classList": [
        "test"
      ],
      "events": {
        "click": "run"
      }
    }
  ]
}

;})

// require module
bootstrap('@weex-component/foo', {"transformerVersion":"0.3.1"})