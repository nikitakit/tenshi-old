$(function() {

    // List of scenes, in order
    var scenes = [
        {
            script: "00_welcome.js",
            title: "Welcome!"
        },
        {
            script: "01_dynamicsize.js",
            title: "Text resizing inside blocks"
        },
        {
            script: "02_dragdrop.js",
            title: "Drag and Drop"
        }
    ];

    // The SVG workarea used for all of the scenes
    var workarea = "<svg id='workarea' xmlns='http://www.w3.org/2000/svg' version='1.1'\
                width='1000px' height='1000px' viewBox='0 0 1000 1000'>\
            </svg>";

    // Scene loading logic
    function load_scene(num) {
        if (num < 0 || num >= scenes.length) {
            return false;
        }

        // Create a new workarea, update the title, run the script
        $("#workarea").replaceWith(workarea);
        $("#titletext").text("" + num + ". " + scenes[num].title);
        $.getScript(scenes[num].script);
        return true;
    }

    // Scene switching buttons
    var current = 0;
    $("#bck").click(function() {
        if (load_scene(current - 1)) {
            current = current - 1;
        }
    });

    $("#fwd").click(function() {
        if (load_scene(current + 1)) {
            current = current + 1;
        }
    });

    // Add an initial (empty) workarea, and load initial scene
    $("#main").append(workarea);
    load_scene(current);
});
