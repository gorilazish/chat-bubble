(function() {
  var scriptElement = document.createElement('script')
  var revision = 'e1d235'
  scriptElement.type = 'text/javascript'
  scriptElement.async = true
  scriptElement.src = '//bello-widget.firebaseapp.com/main.' + revision + '.js'
  var body = document.getElementsByTagName('body')[0]
  body.appendChild(scriptElement)
})()