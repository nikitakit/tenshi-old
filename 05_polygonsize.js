var s = Snap("#workarea");

Snap.load("assets/xx_template.svg", function(f) {
  s.append(f);
});

function updateText() {
  var obj = s.select("#block"),
      val = $("input").val(),
      old_bbox = obj.select("text").getSmartBBox(),
      ref_x = old_bbox.cx,
      ref_y = old_bbox.cy,
      new_bbox;

  if (val.length < 1) {
    return;
  }

  obj.select("text").attr("text", val);
  new_bbox = obj.select("text").getSmartBBox();
  obj.resizeAtPoint(ref_x, ref_y,
                    new_bbox.width - old_bbox.width,
                    new_bbox.height - old_bbox.height,
                    "text");
}

Snap.load("assets/scaling2.svg", function(f) {
  s.append(f.select("#block"));
  var obj = s.select("#block");
  //obj.drag();

  // Add an input area to modify the text
  var emb = s.createEmbeddedHTML("50%", "10px", "50%", "30px");
  emb.html.append("<form accept-charset='utf-8'> Block Text: <input id='resizeupdatetext' value='text'></input></form>");

  // Event handler to change the text inside the block
  $("#resizeupdatetext").keyup(updateText);
  $("#resizeupdatetext").change(updateText);
  updateText();
});
