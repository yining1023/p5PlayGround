/*Every kind of shape has to have one "function Triangle", 
"Triangle.prototype.draw" and "Triangle.prototype.contains"
For rect, function Rect == function Shape
example:
  function Triangle(state, ...) {}
  Triangle.prototype.draw = function() {}
  Triangle.prototype.contains = function() {}
*/

//for shapes that only needs x,y,w,h --> rect, ellipse
function Shape(state, x, y, w, h, fill, stroke, strokeWeight) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.state = state;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#ffffff';
  this.stroke = stroke || '#000000';
  this.strokeWeight = strokeWeight || 1;

  this.type = 'RECTANGLE';
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx, optionalColor, colorStroke, strokeWeight) {
  var i, cur, half;
  if(this.fill!=='none'){
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  if(this.stroke!=='none'){
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWeight;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
  //draw some lines to help align
  //x axis: from 0 to x 
  ctx.beginPath();
  ctx.moveTo(0, this.y - 5);
  ctx.lineTo(0, this.y + 5);
  ctx.moveTo(0, this.y);
  ctx.lineTo(this.x, this.y);
  //y axis from 0 to y
  ctx.lineTo(this.x, 0);
  ctx.moveTo(this.x - 5, 0);
  ctx.lineTo(this.x + 5, 0);
  //h
  ctx.moveTo(this.x + this.w/2, this.y);
  ctx.lineTo(this.x + this.w/2, this.y + this.h);
  //w
  ctx.moveTo(this.x, this.y + this.h/2);
  ctx.lineTo(this.x + this.w, this.y + this.h/2);

  if (this.state.selection === this) {
    //draw the align lines
    ctx.strokeStyle = this.state.selectionColorLine;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = this.state.selectionColor;
    ctx.lineWidth = this.state.selectionWidth;
    //draw the outline of the rect
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

// Determine if a point is inside the rect's bounds
Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

// **** RECT ***** //
function Rect() {
  Shape.apply(this, arguments);
  this.type = 'RECTANGLE';
}

Rect.prototype.contains = function() {
  Shape.prototype.contains.apply(this, arguments);
}

Rect.prototype.draw = function() {
  Shape.prototype.draw.apply(this, arguments);
}

// **** FILL **** //
function Fill(r, g, b){
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;

  this.type = 'FILL';
}
// **** STROKE **** //
function Stroke(r, g, b){
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;

  this.type = 'STROKE';
}
// **** STROKEWEIGHT **** //
function StrokeWeight(w){
  this.w = w || 1;

  this.type = 'STROKEWEIGHT';
}
// **** NOSTROKE **** //
function NoStroke(){
  this.type = 'NOSTROKE';
}
// **** NOSTROKE **** //
function NoFill(){
  this.type = 'NOFILL';
}

// **** ELLIPSE **** //
function Ellipse(state, x, y, w, h, fill, stroke, strokeWeight){
  this.state = state;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#ffffff';
  this.stroke = stroke || '#000000';
  this.strokeWeight = strokeWeight || 1;

  this.type = 'ELLIPSE';
}

Ellipse.prototype.contains = function(mx, my){
  var dx = mx-this.x;
  var dy = my-this.y;
  return (dx*dx)/(this.w*this.w)+(dy*dy)/(this.h*this.h)<=1;
}

Ellipse.prototype.draw = function(ctx, optionalColor, colorStroke, strokeWeight){
  var i, cur, half;
  if(this.fill!=='none'){
    ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.w/2, this.h/2, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  if(this.stroke!=='none'){
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWeight;  
    ctx.stroke();
  }

  //draw some lines to help align
  //x axis: from 0 to y 
  ctx.beginPath();
  ctx.moveTo(0, this.y - 5);
  ctx.lineTo(0, this.y + 5);
  ctx.moveTo(0, this.y);
  ctx.lineTo(this.x, this.y);
  //y axis from 0 to x
  ctx.lineTo(this.x, 0);
  ctx.moveTo(this.x - 5, 0);
  ctx.lineTo(this.x + 5, 0);
  //h
  ctx.moveTo(this.x - this.w/2, this.y);
  ctx.lineTo(this.x + this.w/2, this.y);
  //w
  ctx.moveTo(this.x, this.y - this.h/2);
  ctx.lineTo(this.x, this.y + this.h/2);
  

  if (this.state.selection === this) {
    //draw the align lines
    ctx.strokeStyle = this.state.selectionColorLine;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = this.state.selectionColor;
    ctx.lineWidth = this.state.selectionWidth;
    //draw the outline of the rect
    ctx.beginPath();
    ctx.ellipse(this.x,this.y,this.w/2,this.h/2, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // draw the boxes
    half = this.state.selectionBoxSize / 2;
    
    //    1   
    // 2  0  3
    //    4   

    this.state.selectionHandles[0].x = this.x-half;
    this.state.selectionHandles[0].y = this.y-half;
    
    this.state.selectionHandles[1].x = this.x-half;
    this.state.selectionHandles[1].y = this.y-this.h/2-half;
    
    this.state.selectionHandles[2].x = this.x-this.w/2-half;
    this.state.selectionHandles[2].y = this.y-half;

    this.state.selectionHandles[3].x = this.x+this.w/2-half;
    this.state.selectionHandles[3].y = this.y-half;
    
    this.state.selectionHandles[4].x = this.x-half;
    this.state.selectionHandles[4].y = this.y+this.h/2-half;
    
    ctx.fillStyle = this.state.selectionBoxColor;
    for (i = 0; i < 5; i += 1) {
      cur = this.state.selectionHandles[i];
      ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
    }
  }
}

// **** BEZIER ***** //
function Bezier(state, x, y, x2, y2, x3, y3, x4, y4, fill, stroke, strokeWeight){
  this.state = state;
  this.x = x;
  this.y = y;
  this.x2 = x2;
  this.y2 = y2;
  this.x3 = x3;
  this.y3 = y3;
  this.x4 = x4;
  this.y4 = y4;

  this.fill = fill || '#ffffff';
  this.stroke = stroke || '#000000';
  this.strokeWeight = strokeWeight || 1;

  this.type = 'BEZIER';
}

Bezier.prototype.contains = function(mx, my){
  var maxX = Math.max(this.x, this.x2, this.x3, this.x4);
  var minX = Math.min(this.x, this.x2, this.x3, this.x4);
  var maxY = Math.max(this.y, this.y2, this.y3, this.y4);
  var minY = Math.min(this.y, this.y2, this.y3, this.y4);

  return mx <= maxX && mx >= minX && my <= maxY && my >= minY; 
}

Bezier.prototype.draw = function(ctx, optionalColor, colorStroke, strokeWeight){
  var i, cur, half;

  if(this.stroke=='none'){
    this.stroke='#000000';
  }
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWeight;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);  
    ctx.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    ctx.stroke();

  if(this.fill!=='none'){
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  
  //draw some lines to help align
  //x axis: from 0 to x 
  ctx.beginPath();
  ctx.moveTo(0, this.y - 5);
  ctx.lineTo(0, this.y + 5);
  ctx.moveTo(0, this.y);
  ctx.lineTo(this.x, this.y);
  //y axis from 0 to y
  ctx.lineTo(this.x, 0);
  ctx.moveTo(this.x - 5, 0);
  ctx.lineTo(this.x + 5, 0);

  if (this.state.selection === this) {
    ctx.strokeStyle = this.state.selectionColorLine;
    ctx.lineWidth = 2;
    ctx.stroke();
    //draw two control lines
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.moveTo(this.x3, this.y3);
    ctx.lineTo(this.x4, this.y4);
    // ctx.closePath();
    ctx.strokeStyle = this.state.selectionColor;
    ctx.lineWidth = this.state.selectionWidth;
    ctx.lineWidth = 2;
    ctx.stroke();
    // draw the boxes
    half = this.state.selectionBoxSize / 2; //selectionBoxSize = 6
    
    // 1     0
    //
    // 3     2   
    this.state.selectionHandles[0].x = this.x-half;
    this.state.selectionHandles[0].y = this.y-half;
    
    this.state.selectionHandles[1].x = this.x2-half;//use right coordinates! in this case, are x2, y2 not w or h
    this.state.selectionHandles[1].y = this.y2-half;
    
    this.state.selectionHandles[2].x = this.x3-half;
    this.state.selectionHandles[2].y = this.y3-half;

    this.state.selectionHandles[3].x = this.x4-half;
    this.state.selectionHandles[3].y = this.y4-half;

    ctx.fillStyle = this.state.selectionBoxColor;
    for (i = 0; i < 4; i += 1) {
      cur = this.state.selectionHandles[i];
      ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
    }
  }
}

// *** TRIANGLE **** //
function Triangle(state, x, y, x2, y2, x3, y3, fill, stroke, strokeWeight) {
  this.state = state;
  this.x = x;
  this.y = y;
  this.x2 = x2;
  this.y2 = y2;
  this.x3 = x3
  this.y3 = y3;
  this.fill = fill || '#ffffff';
  this.stroke = stroke || '#000000';
  this.strokeWeight = strokeWeight || 1;

  this.type = 'TRIANGLE';
}

Triangle.prototype.contains = function(mx, my) {
  var vertx=[this.x, this.x2, this.x3];
  var verty=[this.y, this.y2, this.y3];
  var i, j, c = false;
    for( i = 0, j = 3-1; i < 3; j = i++ ) {
        if( ( ( verty[i] > my ) != ( verty[j] > my ) ) &&
            ( mx < ( vertx[j] - vertx[i] ) * ( my - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                c = !c;
        }
    }
  return c;
}

Triangle.prototype.draw = function(ctx, optionalColor, colorStroke, strokeWeight) {
  var i, cur, half;
  if(this.fill!=='none'){
    ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.lineTo(this.x,this.y);
    ctx.closePath();
    ctx.fill();
  }
  if(this.stroke!=='none'){
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWeight;
    ctx.stroke();
  }

  //draw some lines to help align
  //x axis: from 0 to x 
  ctx.beginPath();
  ctx.moveTo(0, this.y - 5);
  ctx.lineTo(0, this.y + 5);
  ctx.moveTo(0, this.y);
  ctx.lineTo(this.x, this.y);
  //y axis from 0 to y
  ctx.lineTo(this.x, 0);
  ctx.moveTo(this.x - 5, 0);
  ctx.lineTo(this.x + 5, 0);

  if (this.state.selection === this) {
    ctx.strokeStyle = this.state.selectionColorLine;
    ctx.lineWidth = 2;
    ctx.stroke();
    //draw the outline of the triangle
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.closePath();
    ctx.strokeStyle = this.state.selectionColor;
    ctx.lineWidth = this.state.selectionWidth;
    ctx.lineWidth = 2;
    ctx.stroke();
    // draw the boxes
    half = this.state.selectionBoxSize / 2; //selectionBoxSize = 6
    
    //    0  
    //
    // 1     2   
    // top middle
    this.state.selectionHandles[0].x = this.x-half;
    this.state.selectionHandles[0].y = this.y-half;
    
    //bottom left, middle, right
    this.state.selectionHandles[1].x = this.x2-half;//use right coordinates! in this case, are x2, y2 not w or h
    this.state.selectionHandles[1].y = this.y2-half;
    
    this.state.selectionHandles[2].x = this.x3-half;
    this.state.selectionHandles[2].y = this.y3-half;

    ctx.fillStyle = this.state.selectionBoxColor;
    for (i = 0; i < 3; i += 1) {
      cur = this.state.selectionHandles[i];
      ctx.fillRect(cur.x, cur.y, this.state.selectionBoxSize, this.state.selectionBoxSize);
    }
  }
}
