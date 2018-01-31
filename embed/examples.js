// <!-- Start of Async Drift Code -->
// <script>
!function() {
  var t;
  if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0, 
  t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
  t.factory = function(e) {
    return function() {
      var n;
      return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
    };
  }, t.methods.forEach(function(e) {
    t[e] = t.factory(e);
  }), t.load = function(t) {
    var e, n, o, i;
    e = 3e5, 
    i = Math.ceil(new Date() / e) * e, 
    o = document.createElement("script"), 
    o.type = "text/javascript", 
    o.async = !0, 
    o.crossorigin = "anonymous", 
    o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js", 
    n = document.getElementsByTagName("script")[0], 
    n.parentNode.insertBefore(o, n);
  });
}();
drift.SNIPPET_VERSION = '0.3.1';
drift.load('d6sr96guec9n');
// </script>
// <!-- End of Async Drift Code -->

// intercom
;;(function() {
  var w = window
  var ic = w.Intercom

  if (typeof ic === 'function') {
    ic('reattach_activator')
    ic('update', intercomSettings)
  } else {
    var d = document
    var i = function() {
      i.c(arguments)
    }
    i.q = []
    i.c = function(args) {
      i.q.push(args)
    }
    w.Intercom = i
    
    function l() {
      var s = d.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = 'https://widget.intercom.io/widget/' + APP_ID
      var x = d.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(s, x)
    }

    if (w.attachEvent) {
      w.attachEvent('onload', l)
    } else {
      w.addEventListener('load', l, false)
    }
  }
})()

  // whatshelp
;(function() {
 var options = {
   userId: ''
 }

 var proto = document.location.protocol,
   host = "whatshelp.io",
   url = proto + "//static." + host

 var s = document.createElement("script")
 s.type = "text/javascript"
 s.async = true
 s.src = url + "/widget-send-button/js/init.js"

 s.onload = function() {
   WhWidgetSendButton.init(host, proto, options )
 }

 var x = document.getElementsByTagName("script")[0]
 x.parentNode.insertBefore(s, x)
})()