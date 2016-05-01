var myShapes = [];
//highlighted code line
var selNumber;
//triangle's center point
var distance = [];
var obj0, obj1, obj2;
var centerX, centerY;
//bezier's center point
var distanceB = [];
var objB0, objB1, objB2, objB3;
var centerBX, centerBY;
//what shape to add
var addState = 'addRect';
//all about color
var fillColor = {r:255, g:255, b:255};
var fillColorStr = 'rgb(255,255,255)';
var strokeColor = {r:0, g:0, b:0};
var strokeColorStr = 'rgb(0,0,0)';
var strokeWeightNum = 1;
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
//decide what to add in the doubleclick function
function addRect(){
  addState = 'addRect'; 
}

function addTriangle(){
  addState = 'addTriangle';
}

function addBezier(){
  addState = 'addBezier';
}

function addEllipse(){
  addState = 'addEllipse';
}

var content0 = "\
<script>function shapes() {\n\
  createCanvas(650, 600);\n";

var content2="\
}";

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

// replaceCanvasAndStartP5();

function pauseP5() {
  window.originalsetup = window.setup;
  window.originaldraw = window.draw;
  // window.setup = null;
  // window.draw = null;
}

function modifyp5() {
  var p5triangle = window.triangle;
  var p5rect = window.rect;
  var p5bezier = window.bezier;
  var p5ellipse = window.ellipse;
  var p5fill = window.fill;
  var p5stroke = window.stroke;
  var p5strokeWeight = window.strokeWeight;
  var p5noFill = window.noFill;
  var p5noStroke = window.noStroke;

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

  window.ellipse = function(x, y, w, h) {
    console.log('drawing a p5 ellipse',arguments);

    var coordinates = [x, y, w, h];
    myShapes.push({
      type: 'ellipse',
      coordinates: coordinates
    })
    p5ellipse.apply(window.p5, arguments);
  }

  window.bezier = function(x, y, x2, y2, x3, y3, x4, y4) {
    console.log('drawing a p5 bezier',arguments);

    var coordinates = [x, y, x2, y2, x3, y3, x4, y4];
    myShapes.push({
      type: 'bezier',
      coordinates: coordinates
    })
    p5bezier.apply(window.p5, arguments);
  }

  window.fill = function(r, g, b) {
    console.log('detecting a p5 fill',arguments);
    if(g==null){
      g=r;
    }
    if(b==null){
      b=r;
    }
    var coordinates = [r, g, b];
    myShapes.push({
      type: 'fill',
      coordinates: coordinates
    })
    p5fill.apply(window.p5, arguments);
  }

  window.stroke = function(r, g, b) {
    console.log('detecting a p5 stroke',arguments);
    if(g==null){
      g=r;
    }
    if(b==null){
      b=r;
    }
    var coordinates = [r, g, b];
    myShapes.push({
      type: 'stroke',
      coordinates: coordinates
    })
    p5stroke.apply(window.p5, arguments);
  }
  window.strokeWeight = function(w) {
    console.log('detecting a p5 strokeWeight',arguments);

    var coordinates = [w];
    myShapes.push({
      type: 'strokeWeight',
      coordinates: coordinates
    })
    p5strokeWeight.apply(window.p5, arguments);
  }
  window.noFill = function() {
    console.log('detecting a p5 noFill');

    var coordinates = [];
    myShapes.push({
      type: 'noFill',
      coordinates: coordinates
    })
    p5noFill.apply();
  }
  window.noStroke = function() {
    console.log('detecting a p5 noStroke');

    var coordinates = [];
    myShapes.push({
      type: 'noStroke',
      coordinates: coordinates
    })
    p5noStroke.apply();
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
      //add shapes according to myShapes[]
      if(myShapes[i].type == 'rect'){
        s.addShape(new Shape(s, myShapes[i].coordinates[0],myShapes[i].coordinates[1],
        myShapes[i].coordinates[2],myShapes[i].coordinates[3],fillColorStr,strokeColorStr,strokeWeightNum)); // The default color is blue
      }else if(myShapes[i].type == 'triangle'){
        s.addShape(new Triangle(s, myShapes[i].coordinates[0],myShapes[i].coordinates[1],
        myShapes[i].coordinates[2],myShapes[i].coordinates[3],
        myShapes[i].coordinates[4],myShapes[i].coordinates[5],fillColorStr,strokeColorStr,strokeWeightNum));
      }else if(myShapes[i].type == 'bezier'){
        s.addShape(new Bezier(s, myShapes[i].coordinates[0],myShapes[i].coordinates[1],
        myShapes[i].coordinates[2],myShapes[i].coordinates[3],
        myShapes[i].coordinates[4],myShapes[i].coordinates[5],
        myShapes[i].coordinates[6],myShapes[i].coordinates[7],fillColorStr,strokeColorStr,strokeWeightNum));
      }else if(myShapes[i].type == 'ellipse'){
        s.addShape(new Ellipse(s, myShapes[i].coordinates[0],myShapes[i].coordinates[1],
        myShapes[i].coordinates[2],myShapes[i].coordinates[3],fillColorStr,strokeColorStr,strokeWeightNum)); // The default color is blue
      }
      else if(myShapes[i].type == 'fill'){
        s.addShape(new Fill(myShapes[i].coordinates[0],myShapes[i].coordinates[1],
        myShapes[i].coordinates[2]));
        fillColor.r = myShapes[i].coordinates[0];
        fillColor.g = myShapes[i].coordinates[1];
        fillColor.b = myShapes[i].coordinates[2];
        fillColorStr = 'rgb('+fillColor.r+','+fillColor.g+','+fillColor.b+')';
      }
      else if(myShapes[i].type == 'stroke'){
        s.addShape(new Stroke(myShapes[i].coordinates[0],myShapes[i].coordinates[1],
        myShapes[i].coordinates[2]));
        strokeColor.r = myShapes[i].coordinates[0];
        strokeColor.g = myShapes[i].coordinates[1];
        strokeColor.b = myShapes[i].coordinates[2];
        strokeColorStr = 'rgb('+strokeColor.r+','+strokeColor.g+','+strokeColor.b+')';
      }
      else if(myShapes[i].type == 'strokeWeight'){
        s.addShape(new StrokeWeight(myShapes[i].coordinates[0]));
        strokeWeightNum = myShapes[i].coordinates[0];
      }
      else if(myShapes[i].type == 'noFill'){
        s.addShape(new NoFill());
        fillColorStr = 'none';
      }
      else if(myShapes[i].type == 'noStroke'){
        s.addShape(new NoStroke());
        strokeColorStr = 'none';
      }      
    }
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

  // Holds the tiny boxes that will be our selection handles
  // Rect the selection handles will be in this order:
  // 0  1  2
  // 3     4
  // 5  6  7
  // Triangle the selection handles will be in this order:
  //    0   
  //        
  // 1     2
  
  this.selectionHandles = [];
    for (i = 0; i < 8; i += 1) {
      this.selectionHandles.push(new Rect(this));
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
      //if type is not fill or stroke, then it's a real shape, check if mouse is on the shape
      if(shapes[i].type!=='FILL' && shapes[i].type!=='STROKE' && shapes[i].type!=='STROKEWEIGHT'
        && shapes[i].type!=='NOFILL' && shapes[i].type!=='NOSTROKE'){
        if (shapes[i].contains(mx, my)) {
          var mySel = shapes[i];
          var selNumber0 = i;
          selNumber = selNumber0;
          // Keep track of where in the object we clicked
          // so we can move it smoothly (see mousemove)

          //RECTANGLE
          if(mySel.type === 'RECTANGLE'){
            myState.dragoffx = mx - mySel.x;
            myState.dragoffy = my - mySel.y;
          }
          //END OF RECTANGLE
          //ELLIPSE
          else if(mySel.type === 'ELLIPSE'){
            myState.dragoffx = mx - mySel.x;
            myState.dragoffy = my - mySel.y;
          }
          //END OF ELLIPSE
          //TRIANGLE
          else if(mySel.type === 'TRIANGLE'){
            centerX = (mySel.x+mySel.x2+mySel.x3)/3;
            centerY = (mySel.y+mySel.y2+mySel.y3)/3;

            //save the distance between Center and (x, y); Center and (x2, y2); Center and (x3, y3);
            obj0 = {x: centerX - mySel.x, y: centerY - mySel.y};
            obj1 = {x: centerX - mySel.x2, y: centerY - mySel.y2};
            obj2 = {x: centerX - mySel.x3, y: centerY - mySel.y3};
            //if the distance is [], push three obj in, if there's already three objs in it, update them
            if(distance.length == 3){
              distance[0] = obj0;
              distance[1] = obj1;
              distance[2] = obj2;
            }else{
              distance.push(obj0);
              distance.push(obj1);
              distance.push(obj2);
            }
            myState.dragoffx = mx - centerX;
            myState.dragoffy = my - centerY;
          }
          //END OF TRIANGLE
          //BEZIER
          else if(mySel.type === 'BEZIER'){
            centerBX = (mySel.x+mySel.x2+mySel.x3+mySel.x4)/4;
            centerBY = (mySel.y+mySel.y2+mySel.y3+mySel.y4)/4;

            //save the distance between Center and (x, y); Center and (x2, y2); Center and (x3, y3);
            objB0 = {x: centerBX - mySel.x, y: centerBY - mySel.y};
            objB1 = {x: centerBX - mySel.x2, y: centerBY - mySel.y2};
            objB2 = {x: centerBX - mySel.x3, y: centerBY - mySel.y3};
            objB3 = {x: centerBX - mySel.x4, y: centerBY - mySel.y4};
            //if the distance is [], push three obj in, if there's already three objs in it, update them
            if(distanceB.length == 4){
              distanceB[0] = objB0;
              distanceB[1] = objB1;
              distanceB[2] = objB2;
              distanceB[3] = objB3;
            }else{
              distanceB.push(objB0);
              distanceB.push(objB1);
              distanceB.push(objB2);
              distanceB.push(objB3);
            }
            myState.dragoffx = mx - centerBX;
            myState.dragoffy = my - centerBY;
          }
          //END OF  BEIZIER
          myState.dragging = true;
          myState.selection = mySel;
          myState.valid = false;
          return;
        }
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
      //RECT      
      if(myState.selection.type === 'RECTANGLE'){
        myState.selection.x = mouse.x - myState.dragoffx;
        myState.selection.y = mouse.y - myState.dragoffy;
      }
      //ELLIPSE
      else if(myState.selection.type === 'ELLIPSE'){
        myState.selection.x = mouse.x - myState.dragoffx;
        myState.selection.y = mouse.y - myState.dragoffy;
      }
      //TRIANGLE
      else if(myState.selection.type === 'TRIANGLE'){
        centerX = mouse.x - myState.dragoffx;
        centerY = mouse.y - myState.dragoffy;
        myState.selection.x = Math.round(centerX - distance[0].x);
        myState.selection.y = Math.round(centerY - distance[0].y);
        myState.selection.x2 = Math.round(centerX - distance[1].x);
        myState.selection.y2 = Math.round(centerY - distance[1].y);
        myState.selection.x3 = Math.round(centerX - distance[2].x);
        myState.selection.y3 = Math.round(centerY - distance[2].y);
      }
      //BEZIER
      else if(myState.selection.type === 'BEZIER'){
        centerBX = mouse.x - myState.dragoffx;
        centerBY = mouse.y - myState.dragoffy;
        myState.selection.x = Math.round(centerBX - distanceB[0].x);
        myState.selection.y = Math.round(centerBY - distanceB[0].y);
        myState.selection.x2 = Math.round(centerBX - distanceB[1].x);
        myState.selection.y2 = Math.round(centerBY - distanceB[1].y);
        myState.selection.x3 = Math.round(centerBX - distanceB[2].x);
        myState.selection.y3 = Math.round(centerBY - distanceB[2].y);
        myState.selection.x4 = Math.round(centerBX - distanceB[3].x);
        myState.selection.y4 = Math.round(centerBY - distanceB[3].y);
      }
      //END OF BEZIER

      myState.valid = false; // Something's dragging so we must redraw
      //TRIANGLE
    } else if(myState.resizeDragging){
      //resize!
        if(myState.selection.type === 'RECTANGLE'){
        //RECT
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
              myState.selection.h += oldy - my; //can only change height 
              break;
            case 2:
              myState.selection.y = my;
              myState.selection.w = mx - oldx;
              myState.selection.h += oldy - my;
              break;
            case 3:
              myState.selection.x = mx;
              myState.selection.w += oldx - mx; // can only change width
              break;
            case 4:
              myState.selection.w = mx - oldx; // can only change width
              break;
            case 5:
              myState.selection.x = mx;
              myState.selection.w += oldx - mx;
              myState.selection.h = my - oldy;
              break;
            case 6:
              myState.selection.h = my - oldy; //can only change height
              break;
            case 7:
              myState.selection.w = mx - oldx;
              myState.selection.h = my - oldy;
              break;
          }
        }
        else if(myState.selection.type === 'ELLIPSE'){
        //ELLIPSE
          oldx = myState.selection.x;
          oldy = myState.selection.y;
          oldh = myState.selection.h;
          oldw = myState.selection.w;
          
          //    1   
          // 2  0  3
          //    4   
          switch (myState.expectResize) {
            case 0:
              myState.selection.x = mx;
              myState.selection.y = my;
              break;
            case 1:
              myState.selection.h = oldy - my; //can only change height 
              break;
            case 2:
              myState.selection.w = oldx - mx; // can only change width
              break;
            case 3:
              myState.selection.w = mx - oldx; // can only change width
              break;
            case 4:
              myState.selection.h = my - oldy; //can only change height
              break;
          }
        }
        else if(myState.selection.type === 'TRIANGLE'){
        //TRIANGLE
        //    0   
        //        
        // 1     2
        //update the distance between center and x1,y1, x2,y2, x3, y3
          function updateDis(){
            centerX = (myState.selection.x+myState.selection.x2+myState.selection.x3)/3;
            centerY = (myState.selection.y+myState.selection.y2+myState.selection.y3)/3;
            distance[0].x = centerX - myState.selection.x;
            distance[0].y = centerY - myState.selection.y;
            distance[1].x = centerX - myState.selection.x2;
            distance[1].y = centerY - myState.selection.y2;
            distance[2].x = centerX - myState.selection.x3;
            distance[2].y = centerY - myState.selection.y3;
          }
          switch (myState.expectResize) {
            case 0:
              myState.selection.x = mx;
              myState.selection.y = my;
              updateDis();
              break;
            case 1:
              myState.selection.x2 = mx;
              myState.selection.y2 = my;
              updateDis();
              break;
            case 2:
              myState.selection.x3 = mx;
              myState.selection.y3 = my;
              updateDis();
              break;
          }
        }
        else if(myState.selection.type === 'BEZIER'){
        //BEZIER
        // 1     0   
        //        
        // 3     2
        //update the distance between center and x1,y1, x2,y2, x3, y3
          function updateDisB(){
            centerBX = (myState.selection.x+myState.selection.x2+myState.selection.x3+myState.selection.x4)/4;
            centerBY = (myState.selection.y+myState.selection.y2+myState.selection.y3+myState.selection.y4)/4;
            distanceB[0].x = centerBX - myState.selection.x;
            distanceB[0].y = centerBY - myState.selection.y;
            distanceB[1].x = centerBX - myState.selection.x2;
            distanceB[1].y = centerBY - myState.selection.y2;
            distanceB[2].x = centerBX - myState.selection.x3;
            distanceB[2].y = centerBY - myState.selection.y3;
            distanceB[3].x = centerBX - myState.selection.x4;
            distanceB[3].y = centerBY - myState.selection.y4;
          }
          switch (myState.expectResize) {
            case 0:
              myState.selection.x = mx;
              myState.selection.y = my;
              updateDisB();
              break;
            case 1:
              myState.selection.x2 = mx;
              myState.selection.y2 = my;
              updateDisB();
              break;
            case 2:
              myState.selection.x3 = mx;
              myState.selection.y3 = my;
              updateDisB();
              break;
            case 3:
              myState.selection.x4 = mx;
              myState.selection.y4 = my;
              updateDisB();
              break;
          }
        }
      myState.valid = false; // Something's dragging so we must redraw
    }
    // if there's a selection see if we grabbed one of the selection handles
    if (myState.selection !== null && !myState.resizeDragging) {
      //TRIANGLE
      if(myState.selection.type === 'TRIANGLE'){
        for (i = 0; i < 3; i += 1) {
          //    0   
          //        
          // 1     2       
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
                this.style.cursor='nwse-resize';
                break;
              case 1:
                this.style.cursor='nwse-resize';
                break;
              case 2:
                this.style.cursor='nwse-resize';
                break;
            }
            return;
          }       
        }
      }
      //BEZIER
      else if(myState.selection.type === 'BEZIER'){
        for (i = 0; i < 4; i += 1) {
          // 1     0   
          //        
          // 3     2       
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
                this.style.cursor='nwse-resize';
                break;
              case 1:
                this.style.cursor='nwse-resize';
                break;
              case 2:
                this.style.cursor='nwse-resize';
                break;
              case 3:
                this.style.cursor='nwse-resize';
                break;
            }
            return;
          }       
        }
      }
      //RECT
      else if(myState.selection.type === 'RECTANGLE'){
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
      }
      //ELLIPSE
      else if(myState.selection.type === 'ELLIPSE'){
        for (i = 0; i < 5; i += 1) {
          //    1   
          // 2  0  3
          //    4 
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
                this.style.cursor='nwse-resize';
                break;
              case 1:
                this.style.cursor='n-resize';
                break;              
              case 2:
                this.style.cursor='w-resize';
                break;
              case 3:
                this.style.cursor='e-resize';
                break;
              case 4:
                this.style.cursor='s-resize';
                break;
            }
            return;
          }       
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
    //add new triangle
    if(addState === 'addTriangle'){
      console.log('adding a triangle');

      var triangle = new Triangle(myState, mouse.x, mouse.y - 40, mouse.x - 20*Math.sqrt(3), 
        mouse.y + 20, mouse.x + 20*Math.sqrt(3), mouse.y + 20, fillColorStr, strokeColorStr, strokeWeightNum);

      myState.addShape(triangle);
      //push new x, y, x2, y2, x3, y3 to myShapes[]
      var newCoordinates = [mouse.x, mouse.y - 40, mouse.x - 20*Math.sqrt(3), mouse.y + 20,
        mouse.x + 20*Math.sqrt(3), mouse.y + 20];

      myShapes.push({
        type: 'triangle',
        coordinates: newCoordinates
      });
    }
    //add new rect, 40, 40
    else if(addState === 'addRect'){
      console.log('adding a rect');
      var rect = new Shape(myState, mouse.x - 20, mouse.y - 20, 40, 60, fillColorStr, strokeColorStr, strokeWeightNum);

      myState.addShape(rect);
      //push new x, y, w, h to myShapes[]
      var newCoordinates = [mouse.x - 20, mouse.y - 20, 40, 60];
      myShapes.push({
        type: 'rect',
        coordinates: newCoordinates
      });
    }
    //add new ellipse
    else if(addState === 'addEllipse'){
      console.log('adding a ellipse');
      var ellipse = new Ellipse(myState, mouse.x, mouse.y, 60, 40, fillColorStr, strokeColorStr, strokeWeightNum);

      myState.addShape(ellipse);
      //push new x, y, w, h to myShapes[]
      var newCoordinates = [mouse.x, mouse.y, 60, 40];
      myShapes.push({
        type: 'ellipse',
        coordinates: newCoordinates
      });
    }
    //add new bezier
    else if(addState === 'addBezier'){
      console.log('adding a bezier');
      var bezier = new Bezier(myState, mouse.x, mouse.y, mouse.x - 75, mouse.y - 10, 
        mouse.x + 5, mouse.y + 70, mouse.x - 70, mouse.y + 60, fillColorStr, strokeColorStr, strokeWeightNum);

      myState.addShape(bezier);
      //push new x, y, x2, y2, x3, y3, x4, y4 to myShapes[]
      var newCoordinates = [mouse.x, mouse.y, mouse.x - 75, mouse.y - 10, 
        mouse.x + 5, mouse.y + 70, mouse.x - 70, mouse.y + 60];
      myShapes.push({
        type: 'bezier',
        coordinates: newCoordinates
      });
    }
    //add a new code blocks, universal, no matter what kind of shape 
      var newCodeContainer = document.createElement("div");
      var lastShapeIndex = myShapes.length - 1
      newCodeContainer.id = "codeContainer"+ lastShapeIndex.toString();
      var newCodeContent = myShapes[myShapes.length - 1].type + "(" 
        + myShapes[myShapes.length - 1].coordinates + ");";
      var newCode = document.createTextNode(newCodeContent);
      newCodeContainer.appendChild(newCode);
      // var codeBlock = document.getElementById('codeBlock');
      // codeBlock.appendChild(newCodeContainer);
  }, true);
  
  // **** Options! ****
  
  this.selectionColor = '#FF00A8';
  this.selectionColorLine = '#00fffc';
  this.selectionWidth = 2;
  this.selectionBoxSize = 8;
  this.selectionBoxColor = 'darkred';  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
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
      if(myShapes[i].type === 'rect'){
        myShapes[i].coordinates = [shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h];
        shapes[i].draw(ctx, fillColorStr, strokeColorStr, strokeWeightNum);
      }
      else if(myShapes[i].type === 'triangle'){
        myShapes[i].coordinates = [shapes[i].x, shapes[i].y, shapes[i].x2, shapes[i].y2, 
        shapes[i].x3, shapes[i].y3];
        shapes[i].draw(ctx, fillColorStr, strokeColorStr, strokeWeightNum);
      }
      else if(myShapes[i].type === 'bezier'){
        myShapes[i].coordinates = [shapes[i].x, shapes[i].y, shapes[i].x2, shapes[i].y2, 
        shapes[i].x3, shapes[i].y3, shapes[i].x4, shapes[i].y4];
        shapes[i].draw(ctx, fillColorStr, strokeColorStr, strokeWeightNum);
      }
      else if(myShapes[i].type === 'ellipse'){
        myShapes[i].coordinates = [shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h];
        shapes[i].draw(ctx, fillColorStr, strokeColorStr, strokeWeightNum);
      }  
      // go over each shape, create each code line
      codeContent += "\u00A0"+"\u00A0"+myShapes[i].type + "(" + myShapes[i].coordinates + ");" + "\n";
    }

    //wrap all lines
    var content = codeContent;
    editor.setValue(content0+content+content2);
    //hide "<script>"
    editor.markText({line:0,ch:0},{line:0,ch:8},{collapsed: true, inclusiveLeft: true, inclusiveRight: true});
    // //hide "</script>"
    // editor.markText({line:13,ch:1},{line:13,ch:9},{collapsed: true, inclusiveLeft: true, inclusiveRight: true});
    
    //if selected highlight the according code
    if (this.selection != null) {  
      var lineNumber = 2+selNumber;
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