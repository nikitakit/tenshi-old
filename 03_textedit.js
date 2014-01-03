var s = Snap("#workarea");

Snap.load("assets/03_textedit.svg", function(f) {
  s.append(f);
});

function clickHandler() {
  var emb = this.createEmbeddedHTML("40", "38", "100%", "100%");
  emb.html.append("<input value=''></input>");
  var input = emb.html.children("input");
  input.val(this.select("text").attr("text"));
  this.unclick(clickHandler);
  this.select("text").attr("display", "none");
  input.change(changeText).focusout(changeText);
  input.focus().select();
}

function changeText() {
  var foreignobject = Snap($(this).parents("foreignObject")[0]);
  foreignobject.parent().select("text").attr({
    display: "inherit",
    text: $(this).val()
  });
  foreignobject.parent().click(clickHandler);
  foreignobject.remove();
}


Snap.load("assets/scaling.svg", function(f) {
  s.append(f.select("#block"));
  var obj = s.select("#block");

  // Set up the initial text value
  obj.select("text").attr("text", "Text");
  obj.dynamicSize("#rectangle",
                  500,
                  obj.select("text").getSmartBBox().height,
                  "text");

  obj.click(clickHandler);
});
