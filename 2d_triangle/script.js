var main = function() {
    // We get the canvas from the DOM.
    var CANVAS = document.getElementById("your_canvas");
    
    // Resize the canvas.
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    // Create a WebGL context.
    var GL;
    try {
        GL = CANVAS.getContext("experimental-webgl", {antialias: false});
    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }

    // Vertex shader.
    var shader_vertex_source = "\n\
                                attribute vec2 position;\n\
                                void main(void) {\n\
                                    gl_position = vec4(position, 0.0, 1.0);\n\
                                }";
};
