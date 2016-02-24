var main = function() {
    // We get the canvas from the DOM.
    var CANVAS = document.getElementById("your_canvas");
    
    // Resize the canvas.
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    /*==================== WEBGL CONTEXT ====================*/
    // Create a WebGL context.
    var GL;
    try {
        GL = CANVAS.getContext("experimental-webgl", {antialias: false});
    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }
   
    /*==================== SHADERS ====================*/
    // Vertex shader.
    var shader_vertex_source = "\n\
                                attribute vec2 position;\n\
                                void main(void) {\n\
                                    gl_Position = vec4(position, 0.0, 1.0);\n\
                                }";

    // Fragment shader.
    var shader_fragment_source = "\n\
                                  precision mediump float;\n\
                                  void main(void) {\n\
                                  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n\
                                  }";

    // Compiles a shader.
    var get_shader = function(source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    }

    // Setup the vertex and fragment shaders.
    var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    // Build the shader program and attach our shaders.
    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    // Link the shader program to the WebGL context "GL".
    GL.linkProgram(SHADER_PROGRAM);

    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

    GL.enableVertexAttribArray(_position);

    GL.useProgram(SHADER_PROGRAM);

    /*==================== THE TRIANGLE ====================*/
    // Triangle's vertex points.
    var triangle_vertices = [-1, -1,    // bottom left of viewport
                             1, -1,     // bottom right of viewport
                             1, 1];     // top right of viewport

    var TRIANGLE_VERTICES = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTICES);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(triangle_vertices), GL.STATIC_DRAW);

    // Triangle's faces.
    var triangle_faces = [0, 1, 2];
    var TRIANGLE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangle_faces), GL.STATIC_DRAW);

    /*==================== DRAWING ====================*/
    // Set the clear colour to transparent.
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    var animate = function() {
        // Set the drawing area on the canvas and clear it.
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);

        // Draw the triangle.
        GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTICES);
        GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4 * 2, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
        
        GL.flush();

        window.requestAnimationFrame(animate);
    };
    animate();
};
