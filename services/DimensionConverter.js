const CANVAS_WIDTH_SERVER = 1900;
const CANVAS_HEIGHT_SERVER = 1000;

export default {
  clientCoordsToServerCoords(clientX, clientY, clientCanvasWidth, clientCanvasHeight) {
    validateClientParams(clientX, clientY, clientCanvasWidth, clientCanvasHeight);

    let serverX = clientX * (CANVAS_WIDTH_SERVER / clientCanvasWidth);
    let serverY = clientY * (CANVAS_HEIGHT_SERVER / clientCanvasHeight);

    return {
      x: serverX,
      y: serverY
    }
  },

  serverCoordsToClientCoords(serverX, serverY, clientCanvasWidth, clientCanvasHeight) {
    validateClientCanvasDimension(clientCanvasWidth, clientCanvasHeight);

    let clientX = serverX * (clientCanvasWidth / CANVAS_WIDTH_SERVER);
    let clientY = serverY * (clientCanvasHeight / CANVAS_HEIGHT_SERVER);

    return {
      x: clientX,
      y: clientY
    }
  },

  getClientCanvasDimensions(maxClientWidth, maxClientHeight) {
    let option1 = new Dimensions({
      width: maxClientWidth,
      height: maxClientWidth * ( CANVAS_HEIGHT_SERVER / CANVAS_WIDTH_SERVER)
    });

    let option2 = new Dimensions({
      width: maxClientHeight * ( CANVAS_WIDTH_SERVER / CANVAS_HEIGHT_SERVER),
      height: maxClientHeight
    });

    let largerOption = option1.area > option2.area ? option1 : option2;
    let smallerOption = option1.area > option2.area ? option2 : option1;
    if (largerOption.hasDimensionsWithinMax(maxClientWidth, maxClientHeight)) {
      return largerOption;
    } else if (smallerOption.hasDimensionsWithinMax(maxClientWidth, maxClientHeight)) {
      return smallerOption;
    } else {
      throw new Error('THIS SHOULDNT HAPPEN');
    }
  },

  CANVAS_WIDTH_SERVER,
  CANVAS_HEIGHT_SERVER
}

class Dimensions {
  constructor({width, height}) {
    this.width = width;
    this.height = height;
  }
  get area() {
    return this.width * this.height
  }
  hasDimensionsWithinMax(maxWidth, maxHeight) {
    return this.width <= maxWidth && this.height <= maxHeight;
  }
}


//
//     ******* VALIDATION FUNCTIONS *********
//

function validateClientCanvasDimension(clientCanvasWidth, clientCanvasHeight) {
  let clientCanvasRatio = clientCanvasWidth/clientCanvasHeight;
  let serverCanvasRatio = CANVAS_WIDTH_SERVER/CANVAS_HEIGHT_SERVER;
  if (Math.abs( (clientCanvasRatio - serverCanvasRatio) / serverCanvasRatio) < 0.01) {
    //throw new Error('Invalid client canvas dimensions');
  }
}
function validateClientCoordinates(clientX, clientY, clientCanvasWidth, clientCanvasHeight) {
  if (clientX < 0 || clientY < 0 || clientX > clientCanvasWidth || clientY > clientCanvasHeight) {
    //throw new Error('Invalid coordinates')
  }
}
function validateClientParams(clientX, clientY, clientCanvasWidth, clientCanvasHeight) {
  validateClientCanvasDimension(clientCanvasWidth, clientCanvasHeight);
  validateClientCoordinates(clientX, clientY, clientCanvasWidth, clientCanvasHeight);
}
