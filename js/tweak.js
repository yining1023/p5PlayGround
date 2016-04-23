// Initialize CodeMirror editor with a nice html5 canvas demo.
var delay;
var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  mode: 'text/html',
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  extraKeys: {
    "Tab": "indentMore"
  }
});

//hide unimportant HTML code
//hide the head of <html><body><script>
editor.markText({line:0,ch:0},{line:0,ch:287},{collapsed: true, inclusiveLeft: true, inclusiveRight: true});
//hide </script></html>
editor.markText({line:16,ch:1},{line:26,ch:10},{collapsed: true, inclusiveLeft: true, inclusiveRight: true});

//run the code in the editor
function updatePreview() {
  var previewFrame = document.getElementById('preview');
  var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
  preview.open();
  preview.write(editor.getValue());
  preview.close();
  //call the hover function again after users changed the code in the editor, so users can manipulate the new code too
  // $('.cm-number').hover(hoverIn, hoverOut);
  // $('.cm-number').on('click hover', clickHover);
}

//run the code in the editor for the first time
setTimeout(updatePreview, 200);

//insert or remove js files
var reloadOnce = false;
$('input').change(function () {
  if ($('input').is(':checked')) {
    var head = document.getElementsByTagName('head')[0];
    //inject p5.inspector.js
    var script = document.createElement("script");
    script.id = "p5Inspector";
    script.type = "text/javascript";
    script.src = "js/p5.playground.js"; 
    head.insertBefore(script, head.childNodes[1]);
    console.log("injected p5.inspector.js");
  } 
  else {
    var head = document.getElementsByTagName('head')[0];
    //inject p5.inspector.js
    var script = document.createElement("script");
    script.id = "p5Inspector";
    script.type = "text/javascript";
    script.src = "js/p5.playground.js"; 
    head.insertBefore(script, head.childNodes[1]);
    console.log("injected p5.inspector.js");
    //remove js files
    $('#p5Inspector').remove();
    var canvas = document.getElementById('defaultCanvas0');
    if(canvas){
      console.log('replacing canvas');
      canvas.parentNode.removeChild(canvas);
    }
    if(!reloadOnce){
      reload = true;
      location.reload();
    }
  }
});

//p5 tweak mode, add changing hard-coded number UI
//add hover event listener to all elements with class .cm-number
// $('.cm-number').on('click hover', clickHover);

function clickHover(){
  console.log('Clicked');
  var getCursorPos = editor.getCursor("anchor");
  // console.log(getCursorPos);
  var word = editor.findWordAt(editor.getCursor("head"));
  // console.log(word);
  var changingWord = editor.getRange(word.anchor, word.head);
  // console.log('number to be changed: '+changingWord);
  var numValue = parseInt(changingWord)+10;
  // console.log('numvalue: '+numValue);
  var strValue = numValue.toString();
  // console.log('strvalue: '+strValue);
  if(!isNaN(numValue)){
    editor.replaceRange(strValue, word.anchor, word.head);
    handleChange();
  }
}

//live coding mode
function handleChange(){
  //something happened here slow down the program, code changes N times = N in myShapes
  console.log('code changed in the editor');
  if(!$('input').is(':checked')){
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 200);
  }
}

editor.on("change", function() {
  handleChange();
});

//show or hide the whole editor
// var cm = $('.CodeMirror')[0].CodeMirror;
// $(cm.getWrapperElement()).hide();
// $(cm.getWrapperElement()).show();