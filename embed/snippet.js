// This snippet needs to be embedded into users website

;(function() {
  var BelloWidgetOptions = {
    userId: 'martynas'
  }
 
  var proto = document.location.protocol,
    host = "widget.belloforwork.com",
    url = proto + "//" + host
 
  var s = document.createElement("script")
  s.type = "text/javascript"
  s.async = true
  s.src = url + "/widget-loader.js"
 
  var x = document.getElementsByTagName("script")[0]
  x.parentNode.insertBefore(s, x)
 })()