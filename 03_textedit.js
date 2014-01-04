var s = Snap("#workarea");

Snap.load("assets/03_textedit.svg", function(f) {
  s.append(f);
});

function makeEditable(element, selector) {
  // makeEditable(element, [selector])
  //   * makes a <text/> element inside an SVG editable
  //   * element is the object that responds to click events for editing
  //   * if element is not itself the text element, use the selector to specify
  //     the text element
  var textelement = selector ? element.select(selector) : element,
      emb,
      input;
  function startEditing() {
    // Create an HTML input element
    emb = element.createEmbeddedHTML("40", "38", "100%", "100%");
    emb.html.append("<input value=''></input>");
    input = emb.html.children("input");

    // Update values and views
    input.val(textelement.attr("text"));
    textelement.attr("display", "none");

    // Update event handlers
    element.unclick(startEditing);
    input.change(endEditing).focusout(endEditing);

    // Give focus to the input element
    input.focus().select();
  }

  function endEditing() {
    textelement.attr({
      display: "inherit",
      text: input.val()
    });
    element.click(startEditing);
    emb.svg.remove();
  }

  element.click(startEditing);
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

  makeEditable(obj, "text");
});
