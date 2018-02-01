// This snippet needs to be embedded into users website

;(function() {
  var BelloWidgetOptions = {
    userId: 'martynas'
  }
 
  var s = document.createElement("script")
    s.type = "text/javascript"
    s.async = true
    s.src = "//widget.belloforwork.com/widget-loader.js"
 
  var x = document.getElementsByTagName("script")[0]
  x.parentNode.insertBefore(s, x)
 })()