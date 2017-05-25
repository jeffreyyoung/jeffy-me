import React from 'react'
import ColorPicker from './ColorPicker.js';
import getPosition from './utils/getPosition';
import io from 'socket.io-client'

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

  componentDidMount() {
    let canvas = this.canvas;
    this.canvasPosition = getPosition(canvas);
    if (window) {
      window.addEventListener("scroll", () => this.canvasPosition = getPosition(canvas), false);
      window.addEventListener("resize", () => this.canvasPosition = getPosition(canvas), false);
    }
    var context = canvas.getContext('2d');

    let drawLine = (x0, y0, x1, y1, color, emit) => {
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

    let transformCoordsAndDrawLine = (x0, y0, x1, y1, color, emit) => {
      x0 = x0 - canvas.offsetLeft + window.scrollX
      x1 = x1 - canvas.offsetLeft + window.scrollX
      y0 = y0 - canvas.offsetTop + window.scrollY
      y1 = y1 - canvas.offsetTop + window.scrollY
      drawLine(x0, y0, x1, y1, color, emit);
    }

    let onMouseDown = (e) => {
      this.drawing = true;
      this.x = e.clientX;
      this.y = e.clientY;
    }

    let onMouseUp = (e) => {
      if (!this.drawing) { return; }
      this.drawing = false;
      transformCoordsAndDrawLine(this.x, this.y, e.clientX, e.clientY, this.color, true);
    }

    let onMouseMove = (e) => {
      if (!this.drawing) { return; }
      transformCoordsAndDrawLine(this.x, this.y, e.clientX, e.clientY, this.color, true);
      this.x = e.clientX;
      this.y = e.clientY;
    }


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

    this.socket.on('drawing', data => {
      console.log('RECEIVED DRAWING EVENT', data);
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false)
    });
    this.canvas.addEventListener('mousedown', onMouseDown, false);
    this.canvas.addEventListener('mouseup', onMouseUp, false);
    this.canvas.addEventListener('mouseout', onMouseUp, false);
    this.canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
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
