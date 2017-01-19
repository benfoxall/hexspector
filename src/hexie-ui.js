const padZero = (str, i) => {
  while(str.length < i)
    str = `0${str}`

  return str
}

const norm_map = {
  '\n': ' ',
  '\t': ' '
}

const norm = s => norm_map[s] || s

const UI = (rows, cols, container = document.body) => {

  const root = createElement('aside')
  style(root)

  const number_root = createElement('section')
  const hex_root    = createElement('section')
  const text_root   = createElement('section')

  style(number_root)
  style(hex_root)
  style(text_root)

  root.appendChild(number_root)
  root.appendChild(hex_root)
  root.appendChild(text_root)

  for(let i = 0; i < rows; i++) {
    const number = createElement('div')
    number.innerText = i

    const hexes = createElement('div')
    const texts = createElement('div')

    for(let j = 0; j < cols; j++) {

      const hex  = createElement('span')
      const text = createElement('span')

      hex.innerText = '__'
      text.innerText = '.'

      hexes.appendChild(hex)
      texts.appendChild(text)

    }

    number_root.appendChild(number)
    hex_root.appendChild(hexes)
    text_root.appendChild(texts)

  }

  container.appendChild(root)

  // display data to this
  return function(view) {

    let idx, j, value

    for (let i = 0; i < rows; i++) {
      // populate number
      number_root.children[i].innerText =  padZero((i*cols).toString(16), 5)

      for(j = 0; j < cols; j++) {

        idx = i * cols + j

        if(idx >= view.byteLength) {
          hex_root.children[i].children[j].innerText = '__'
          text_root.children[i].children[j].innerText = '_'


        } else {
          value = view.getUint8(i * cols + j)

          // populate hex
          hex_root.children[i].children[j].innerText =
            padZero(value.toString(16), 2)

          // populate text
          text_root.children[i].children[j].innerText =
            norm(String.fromCharCode(value))


        }

      }

    }

  }

}

export default UI



function createElement(name) {
  const element = document.createElement(name)
  style(element)
  return element
}

function style(element) {
  switch (element.tagName) {

  case 'ASIDE':
    element.style.fontFamily = 'monospace'
    element.style.display = 'flex'
    element.style.justifyContent = 'space-around'
    break

  case 'SECTION':
    element.style.margin = '0 1em'
    break

  case 'DIV':
    element.style.whiteSpace = 'nowrap'
    element.style.height = '1em'
    break

  case 'SPAN':
    element.style.display = 'inline-block'
    element.style.margin = 'auto .2em'
    break

  }

}
