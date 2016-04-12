var myShapes = [];
var selNumber;
/*
if (document.readyState === 'complete') {
  pauseP5();
} else {
  window.addEventListener('load', function() {
    pauseP5();
    setTimeout(function() {
      startP5();
    }, 20);
  });
}
*/
var content0 = "\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <meta charset='UTF-8'>\n\
    <title>p5shapesTest</title>\n\
    <script src='js/p5.js' type='text/javascript'></script>\n\
    <script src='js/p5.dom.js' type='text/javascript'></script>\n\
    <style> body {padding: 0; margin: 0;} canvas {vertical-align: top;} </style>\n\
  </head>\n\
  <body>\n\
    <script>\n\
    function setup() {\n\
      createCanvas(600, 600);\n\
      stroke('rgba(0,125,255,0.6)');\n\
      fill('rgba(0,125,255,0.6)');\n";

var content2 = "\
    }\n\
    function draw(){}\n\
    </script>\n\
  </body>\n\
</html>\n\
";

function replaceCanvasAndStartP5() {
  var canvas = document.getElementById('defaultCanvas0');
  if (canvas) {
    console.log('replacing canvas');
    canvas.parentNode.removeChild(canvas);
    pauseP5();
    setTimeout(function(){
      startP5();
    }, 20);
  } else {
    console.log('trying again 100ms later');
    setTimeout(replaceCanvasAndStartP5, 100);
  }
}

replaceCanvasAndStartP5();

function pauseP5() {
  window.originalsetup = window.setup;
  window.originaldraw = window.draw;
  // window.setup = null;
  // window.draw = null;
}

function modifyp5() {
  var p5triangle = window.triangle;
  var p5rect = window.rect;

  window.triangle = function(x1, y1, x2, y2, x3, y3) {
    console.log('drawing a p5 triangle',arguments);

    var coordinates = [x1, y1, x2, y2, x3, y3];
    myShapes.push({
      type: 'triangle',
      coordinates: coordinates
    });
    p5triangle.apply(window.p5, arguments);
  }

  window.rect = function(x, y, w, h) {
    console.log('drawing a p5 rectangle',arguments);

    var coordinates = [x, y, w, h];
    myShapes.push({
      type: 'rect',
      coordinates: coordinates
    })
    p5rect.apply(window.p5, arguments);
  }
}

function startP5() {
  window.setup = function() {
    modifyp5();
    window.originalsetup();

    //link p5 canvas to myCanvas
    var iframe = document.getElementById('preview');
    var iframe_canvas = iframe.contentDocument || iframe.contentWindow.document;
    var canvas0 = iframe_canvas.getElementById('defaultCanvas0');
    var s = new CanvasState(canvas0);

    //add each line in the code block
    var codeContent = '';
    for(var i = 0; i < myShapes.length; i++){
      //draw shapes according to myShapes[]
      s.addShape(new Shape(s, myShapes[i].coordinates[0],myShapes[i].coordinates[1],
      myShapes[i].coordinates[2],myShapes[i].coordinates[3],'rgba(0,125,255,0.6)')); // The default color is blue now
      //go over each shape and create new lines
      codeContent += "\u00A0"+"\u00A0"+"\u00A0"+"\u00A0"+"\u00A0"+"\u00A0"+myShapes[i].type + "(" + myShapes[i].coordinates + ");"+"\n";
    }
    //wrap all lines
    var content = codeContent;
    // codeBlock.style.visibility = 'hidden';
    editor.setValue(content0+content+content2);
  }
  window.draw = window.originaldraw;

  new p5();
}

function CanvasState(canvas){
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft,
      styleBorderTop, html, myState, i;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }

  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****
  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  this.resizeDragging = false; // Keep track of resize
  this.expectResize = -1; // save the # of the selection handle
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;

  // Holds the 8 tiny boxes that will be our selection handles
  // the selection handles will be in this order:
  // 0  1  2
  // 3     4
  // 5  6  7
  this.selectionHandles = [];
  for (i = 0; i < 8; i += 1) {
    this.selectionHandles.push(new Shape(this));
  }

  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    var mouse, mx, my, shapes, l, i, mySel;
    if (myState.expectResize !== -1) {
      myState.resizeDragging = true;
      return;
    }
    mouse = myState.getMouse(e);
    mx = mouse.x;
    my = mouse.y;
    shapes = myState.shapes;
    l = shapes.length;
    for (var i = l-1; i >= 0; i--) {
      if (shapes[i].contains(mx, my)) {
        var mySel = shapes[i];
        var selNumber0 = i;
        selNumber = selNumber0;
        console.log(selNumber);
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    var mouse = myState.getMouse(e),
        mx = mouse.x,
        my = mouse.y,
        oldx, oldy, i, cur;
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;   
      myState.valid = false; // Something's dragging so we must redraw
    } else if(myState.resizeDragging){
      //resize!
      oldx = myState.selection.x;
      oldy = myState.selection.y;
      
      // 0  1  2
      // 3     4
      // 5  6  7
      switch (myState.expectResize) {
        case 0:
          myState.selection.x = mx;
          myState.selection.y = my;
          myState.selection.w += oldx - mx;
          myState.selection.h += oldy - my;
          break;
        case 1:
          myState.selection.y = my;
          myState.selection.h += oldy - my;
          break;
        case 2:
          myState.selection.y = my;
          myState.selection.w = mx - oldx;
          myState.selection.h += oldy - my;
          break;
        case 3:
          myState.selection.x = mx;
          myState.selection.w += oldx - mx;
          break;
        case 4:
          myState.selection.w = mx - oldx;
          break;
        case 5:
          myState.selection.x = mx;
          myState.selection.w += oldx - mx;
          myState.selection.h = my - oldy;
          break;
        case 6:
          myState.selection.h = my - oldy;
          break;
        case 7:
          myState.selection.w = mx - oldx;
          myState.selection.h = my - oldy;
          break;
      }
      
      myState.valid = false; // Something's dragging so we must redraw
    }
    // if there's a selection see if we grabbed one of the selection handles
    if (myState.selection !== null && !myState.resizeDragging) {
      for (i = 0; i < 8; i += 1) {
        // 0  1  2
        // 3     4
        // 5  6  7
        
        cur = myState.selectionHandles[i];
        
        // we dont need to use the ghost context because
        // selection handles will always be rectangles
        if (mx >= cur.x && mx <= cur.x + myState.selectionBoxSize &&
            my >= cur.y && my <= cur.y + myState.selectionBoxSize) {
          // we found one!
          myState.expectResize = i;
          myState.valid = false;
          
          switch (i) {
            case 0:
              this.style.cursor='nw-resize';
              break;
            case 1:
              this.style.cursor='n-resize';
              break;
            case 2:
              this.style.cursor='ne-resize';
              break;
            case 3:
              this.style.cursor='w-resize';
              break;
            case 4:
              this.style.cursor='e-resize';
              break;
            case 5:
              this.style.cursor='sw-resize';
              break;
            case 6:
              this.style.cursor='s-resize';
              break;
            case 7:
              this.style.cursor='se-resize';
              break;
          }
          return;
        }       
      }
      // not over a selection box, return to normal
      myState.resizeDragging = false;
      myState.expectResize = -1;
      this.style.cursor = 'auto';
    }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
    myState.resizeDragging = false;
    myState.expectResize = -1;
    if (myState.selection !== null) {
      if (myState.selection.w < 0) {
          myState.selection.w = -myState.selection.w;
          myState.selection.x -= myState.selection.w;
      }
      if (myState.selection.h < 0) {
          myState.selection.h = -myState.selection.h;
          myState.selection.y -= myState.selection.h;
      }
    }
  }, true);
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    //add new rect, green 20, 20
    myState.addShape(new Shape(myState, mouse.x - 10, mouse.y - 10, 40, 40, 'rgba(0,125,255,.6)'));
    //push new x, y, w, h to myShapes[]
    var newCoordinates = [mouse.x - 10, mouse.y - 10, 20, 20];
    myShapes.push({
      type: 'rect',
      coordinates: newCoordinates
    });
    //add a new code blocks
      var newCodeContainer = document.createElement("div");
      var lastShapeIndex = myShapes.length - 1
      newCodeContainer.id = "codeContainer"+ lastShapeIndex.toString();
      var newCodeContent = myShapes[myShapes.length - 1].type + "(" 
        + myShapes[myShapes.length - 1].coordinates + ");";
      var newCode = document.createTextNode(newCodeContent);
      newCodeContainer.appendChild(newCode);
      var codeBlock = document.getElementById('codeBlock');
      codeBlock.appendChild(newCodeContainer);
  }, true);
  
  // **** Options! ****
  
  this.selectionColor = '#FF00A8';
  this.selectionColorLine = '#00fffc';
  this.selectionWidth = 1.5;
  this.selectionBoxSize = 6;
  this.selectionBoxColor = 'darkred';  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

function Shape(state, x, y, w, h, fill) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.state = state;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx, optionalColor) {
  var i, cur, half;
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  //x
  ctx.beginPath();
  ctx.moveTo(0, this.y - 5);
  ctx.lineTo(0, this.y + 5);
  ctx.moveTo(0, this.y);
  ctx.lineTo(this.x, this.y);
  //y
  ctx.lineTo(this.x, 0);
  ctx.moveTo(this.x - 5, 0);
  ctx.lineTo(this.x + 5, 0);

  ctx.moveTo(this.x + this.w/2, this.y);
  ctx.lineTo(this.x + this.w/2, this.y + this.h);

  ctx.moveTo(this.x, this.y + this.h/2);
  ctx.lineTo(this.x + this.w, this.y + this.h/2);

  if (this.state.selection === this) {
    ctx.strokeStyle = this.state.selectionColorLine;
    ctx.stroke();
    ctx.strokeStyle = this.state.selectionColor;
    ctx.lineWidth = this.state.selectionWidth;
    ctx.strokeRect(this.x,this.y,this.w,this.h);
    
    // draw the boxes
    half = this.state.selectionBoxSize / 2;
    
    // 0  1  2
    // 3     4
    // 5  6  7
    
    // top left, middle, right
    this.state.selectionHandles[0].x = this.x-half;
    this.state.selectionHandles[0].y = this.y-half;
    
    this.state.selectionHandles[1].x = this.x+this.w/2-half;
    this.state.selectionHandles[1].y = this.y-half;
    
    this.state.selectionHandles[2].x = this.x+this.w-half;
    this.state.selectionHandles[2].y = this.y-half;
    
    //middle left
    this.state.selectionHandles[3].x = this.x-half;
    this.state.selectionHandles[3].y = this.y+this.h/2-half;
    
    //middle right
    this.state.selectionHandles[4].x = this.x+this.w-half;
    this.state.selectionHandles[4].y = this.y+this.h/2-half;
    
    //bottom left, middle, right
    this.state.selectionHandles[6].x = this.x+this.w/2-half;
    this.state.selectionHandles[6].y = this.y+this.h-half;
    
    this.state.selectionHandles[5].x = this.x-half;
    this.state.selectionHandles[5].y = this.y+this.h-half;
    
    this.state.selectionHandles[7].x = this.x+this.w-half;
    this.state.selectionHandles[7].y = this.y+this.h-half;

    
    ctx.fillStyle = this.state.selectionBoxColor;
    for (i = 0; i < 8; i += 1) {
      cur = this.state.selectionHandles[i];
      ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
    }
  }
};

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false; 
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  var ctx, shapes, l, i, shape, mySel;
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    ctx = this.ctx;
    shapes = this.shapes;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **    
    // draw all shapes
    l = shapes.length;
    //empty the codeblock first
    var codeContent = '';
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      myShapes[i].coordinates = [shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h];
      // go over each shape, create each code line
      codeContent += "\u00A0"+"\u00A0"+"\u00A0"+"\u00A0"+"\u00A0"+"\u00A0"+myShapes[i].type + "(" + myShapes[i].coordinates + ");" + "\n";
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x <= this.width && shape.y <= this.height &&
          shape.x + shape.w >= 0 && shape.y + shape.h >= 0){
        shapes[i].draw(ctx);
    }
    //wrap all lines
    var content = codeContent;
    // codeBlock.style.visibility = 'hidden';
    //because of this line, it changes edit every second, slow down the program
    editor.setValue(content0+content+content2);
  }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
      //if selected highlight the according code
      var lineNumber = 15+selNumber;
      editor.markText({line:lineNumber,ch:0},{line:lineNumber+1,ch:0},{className:"styled-background"});
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
};

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
      element = element.offsetParent;
    } while ((element));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
};