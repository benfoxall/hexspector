(function () {
'use strict';

var h1 = document.createElement('h1');

h1.innerText = 'this does not work yet';

Object.assign(
  h1.style,
  {
    background: 'aquamarine',
    color: '#000',
    fontFamily: 'sans-serif',
    fontSize: '2vw',
    padding: '1em',
    position: 'fixed',
    margin: 0,
    top: 0,
    right: 0,
    zIndex: 9999
  }
);

document.body.appendChild(h1);

}());
