// This snippet needs to be embedded into users website

;(function() {
  var options = {
    userId: ''
  }
 
  var proto = document.location.protocol,
    host = "bello-widget.firebaseapp.com",
    url = proto + "//" + host
 
  var s = document.createElement("script")
  s.type = "text/javascript"
  s.async = true
  s.src = url + "/widget-loader.js"
 
  s.onload = function() {
    window.BelloWidget.init(options)
  }
 
  var x = document.getElementsByTagName("script")[0]
  x.parentNode.insertBefore(s, x)
 })()