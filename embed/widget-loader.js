module.exports = function(compilation) {
  const url = '//widget.belloforwork.com'

  const reg = /main\.(.+).js$/
  const cssReg = /main\.(.+).css$/

  let mainFile
  let mainCssFile
  
  compilation.chunks.forEach(chunk => {
    chunk.files.forEach(filename => {
      if (reg.test(filename)) {
        mainFile = filename
      } else if (cssReg.test(filename)) {
        mainCssFile = filename
      }
    })
  })

  if (!mainFile || !mainCssFile) {
    throw new Error('Failed to generate widget-loader. Could not find main bundle file')
  }

  return createTemplate(`${url}/${mainFile}`, `${url}/${mainCssFile}`)
}

function createTemplate(bundleSrcUrl, bundleCssUrl) {
  return `(function(){
    var d = document;
    var e = d.createElement('script');
    e.type = 'text/javascript';
    e.async = true;
    e.src = '${bundleSrcUrl}';
    var body = d.getElementsByTagName('body')[0];
    var l = d.createElement('link')
    l.href = '${bundleCssUrl}'
    l.rel = 'stylesheet'
    d.head.appendChild(l)
    body.appendChild(e);})()`
}