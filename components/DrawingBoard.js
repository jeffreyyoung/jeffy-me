import React from 'react'
import ReactDOM from 'react-dom'
import ColorPicker from './ColorPicker.js';
import getPosition from './utils/getPosition';
import io from 'socket.io-client'
import DimensionConverter from './../services/DimensionConverter'
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
    if (typeof window !== 'undefined') {
      this.socket = io(window.location.origin)
    } else {
      this.socket = io(`http://localhost:3000`);
    }

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
    let coords0 = DimensionConverter.clientCoordsToServerCoords(x0, y0, w, h);
    let coords1 = DimensionConverter.clientCoordsToServerCoords(x1, y1, w, h);
    this.socket.emit('drawing', {
      x0: coords0.x,
      y0: coords0.y,
      x1: coords1.x,
      y1: coords1.y,
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

  updateCanvasDimensions() {
    if (!this.canvasWrapper) {
      this.el = ReactDOM.findDOMNode(this);
      this.canvasWrapper = this.el.querySelector('.canvas-wrapper');
    }
    let maxWidth = this.canvasWrapper.clientWidth;
    if (window) {
      maxWidth = window.innerWidth - 40;
    }
    let maxHeight = this.canvasWrapper.clientHeight;
    let dimensions = DimensionConverter.getClientCanvasDimensions(maxWidth, maxHeight);
    this.setState({canvasWidth: dimensions.width, canvasHeight: dimensions.height});
  }

  componentDidMount() {
    let canvas = this.canvas;
    this.canvasPosition = getPosition(canvas);
    this.updateCanvasDimensions();
    if (window) {
      window.addEventListener("scroll", () => this.canvasPosition = getPosition(canvas), false);
      window.addEventListener("resize", () => {
        this.canvasPosition = getPosition(canvas);
        this.updateCanvasDimensions();
      }, false);
    }
    this.canvasContext = canvas.getContext('2d');

    this.socket.on('drawing', data => {
      let coords0 = DimensionConverter.serverCoordsToClientCoords(data.x0, data.y0, this.canvas.width, this.canvas.height);
      let coords1 = DimensionConverter.serverCoordsToClientCoords(data.x1, data.y1, this.canvas.width, this.canvas.height);
      this.drawLine(coords0.x, coords0.y, coords1.x, coords1.y, data.color, false)
    });
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    this.canvas.addEventListener('mouseout', this.onMouseUp.bind(this), false);
    this.canvas.addEventListener('mousemove', throttle(this.onMouseMove.bind(this), 10), false);
  }

  onChangeColor(color) {
    this.setState({color})
  }

  render() {
    let {canvasHeight, canvasWidth} = this.state;
    return (
      <div className='drawingboard-wrapper'>
        <div>
          <ColorPicker color={this.state.color} onChange={color => this.setState({color})}/>
        </div>
        <div className='canvas-wrapper'>
          <canvas style={{width:canvasWidth,height:canvasHeight}}width={this.state.canvasWidth} height={this.state.canvasHeight} ref={node => this.canvas = node}></canvas>
        </div>
        <style jsx>{`
          canvas {
            background-color: white;
            border: 1px solid gray;
          }
          .canvas-wrapper {
            flex: 1;
            flex-basis: auto;
            display: flex;
            max-width:100%;
          }
          .drawingboard-wrapper {
            flex: 1;
            flex-basis: auto;
            display: flex;
            flex-direction: column;
            padding: 10px;
          }
        `}</style>
      </div>
    )
  }
}
