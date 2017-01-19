import Template from './template.html'
import hexie from './hexie-ui.js'

const element = new Template({
  target: document.body,
  data: {
    eval: '',
    expanded: false
  }
})

const panel = element.refs.panel

element.observe( 'eval', answer => {
  let target

  element.set({expanded: false})

  if(!answer) {
    return panel.innerText = ''
  }

  try {
    target = eval(answer)
  } catch (e) {
    panel.innerText = `${answer} not found`
  }

  if(typeof target == 'undefined') {
    panel.innerText = `${answer} is undefined `
  }
  else {

    // urgh
    [
      Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array
    ].forEach(type => {
      if(target instanceof type) {
        target = target.buffer
      }
    })


    if(!(target instanceof ArrayBuffer)) {
      panel.innerText = `${answer} is not an ArrayBuffer or typed array`
    } else {
      panel.innerHTML = ''

      const cols = 16
      const rows = Math.min(750,target.byteLength / cols)



      const ui = hexie(rows, cols, panel)

      const view = new DataView(target)

      ui(view)

      element.set({expanded: true})

    }

  }

})


window.hexspector = e => {
  element.set({eval: e})
}
