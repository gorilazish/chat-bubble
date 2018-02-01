module.exports = function(compilation) {
  const reg = /main\.(.+).js$/
  const url = '//widget.belloforwork.com'

  let mainFile
  compilation.chunks.forEach(chunk => {
    chunk.files.forEach(filename => {
      if (reg.test(filename)) {
        mainFile = filename
      }
    })
  })

  if (!mainFile) {
    throw new Error('Failed to generate widget-loader. Could not find main bundle file')
  }

  return createTemplate(`${url}/${mainFile}`)
}

function createTemplate(bundleSrcUrl) {
  return `(function(){var d=document;var e=d.createElement('script');e.type='text/javascript';e.async=true;e.src = '${bundleSrcUrl}';var body=d.getElementsByTagName('body')[0];body.appendChild(e);})()`
}