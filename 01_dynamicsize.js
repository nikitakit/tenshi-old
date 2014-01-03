var s = Snap("#workarea");

Snap.load("assets/xx_template.svg", function(f) {
  s.append(f);
});

function updateText() {
  var obj = s.select("#block"),
      val = $("input").val();

  if (val == "") {
    return;
  }

  obj.select("text").attr("text", val);
  obj.dynamicSize("#rectangle",
                  obj.select("text").getSmartBBox().width + 15,
                  obj.select("text").getSmartBBox().height,
                  "text");
}

Snap.load("assets/scaling.svg", function(f) {
  s.append(f.select("#block"));
  var obj = s.select("#block");
  obj.drag();

  // Add an input area to modify the text
  var emb = s.createEmbeddedHTML("50%", "10px", "50%", "30px");
  emb.html.append("<form accept-charset='utf-8'> Block Text: <input id='resizeupdatetext' value='text'></input></form>");

  // Event handler to change the text inside the block
  $("#resizeupdatetext").change(updateText);
  updateText();
});
