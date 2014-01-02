var s = Snap("#workarea");

Snap.load("assets/xx_template.svg", function(f) {
  s.append(f);
});

Snap.load("assets/scaling.svg", function(f) {
  s.append(f.select("#block"));
  var obj = s.select("#block");
  s.select("text").attr("text", Date());
  obj.dynamicSize("#rectangle",
                  obj.select("text").getBBox().width + 20,
                  obj.select("text").getBBox().height,
                  "text");
  obj.drag();
});
