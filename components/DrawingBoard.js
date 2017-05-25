import React from 'react'
import ColorPicker from './ColorPicker.js';
import getPosition from './utils/getPosition';
import io from 'socket.io-client'

function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

export default class DrawingBoard extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.socket = io(`http://localhost:3000`);
    this.state = {
      color: {
        r: '241',
        g: '112',
        b: '19',
        a: '1',
      }
    }
  }

  get color() {
    return this.state.color;
  }

  drawLine(x0, y0, x1, y1, color, emit){
    let context = this.canvasContext;
    let canvas = this.canvas;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    this.socket.emit('drawing', {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      color: color
    });
  }

  transformCoordsAndDrawLine(x0, y0, x1, y1, color, emit){
    let canvas = this.canvas;
    x0 = x0 - canvas.offsetLeft + window.scrollX
    x1 = x1 - canvas.offsetLeft + window.scrollX
    y0 = y0 - canvas.offsetTop + window.scrollY
    y1 = y1 - canvas.offsetTop + window.scrollY
    this.drawLine(x0, y0, x1, y1, color, emit);
  }

  onMouseDown(e) {
    this.drawing = true;
    this.x = e.clientX;
    this.y = e.clientY;
  }

  onMouseUp(e) {
    if (!this.drawing) { return; }
    this.drawing = false;
    this.transformCoordsAndDrawLine(this.x, this.y, e.clientX, e.clientY, this.color, true);
  }

  onMouseMove(e) {
    if (!this.drawing) { return; }
    this.transformCoordsAndDrawLine(this.x, this.y, e.clientX, e.clientY, this.color, true);
    this.x = e.clientX;
    this.y = e.clientY;
  }

  componentDidMount() {
    let canvas = this.canvas;
    this.canvasPosition = getPosition(canvas);
    if (window) {
      window.addEventListener("scroll", () => this.canvasPosition = getPosition(canvas), false);
      window.addEventListener("resize", () => this.canvasPosition = getPosition(canvas), false);
    }
    this.canvasContext = canvas.getContext('2d');

    this.socket.on('drawing', data => this.drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false));
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    this.canvas.addEventListener('mouseout', this.onMouseUp.bind(this), false);
    this.canvas.addEventListener('mousemove', throttle(this.onMouseMove.bind(this), 10), false);
  }

  onChangeColor(color) {
    this.setState({color})
  }

  render() {
    return (
      <div>
        <div>
          <ColorPicker color={this.state.color} onChange={color => this.setState({color})}/>
        </div>
        <div>
          <canvas width="1000" height="1000" ref={node => this.canvas = node}></canvas>
        </div>
        <style jsx>{`
          canvas {
            background-color: white;
            border: 1px solid gray;
          }
        `}</style>
      </div>
    )
  }
}
