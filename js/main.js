function webGLStart() {
    var canvas = document.getElementById("gl_canvas");
    loadPly("");
    initWebGL(canvas);      // Initialize the GL context

    // Only continue if WebGL is available and working

    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

        initShaders();
        initBuffers();

        setInterval(drawScene, 10);
    }
}

var gl = null;
function initWebGL(canvas){

    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Create the shader program

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);

    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
}

function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // Unknown shader type
        return null;
    }
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initBuffers() {
    var modelUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
    suzanne = new Suzanne(modelUniform, vertexPositionAttribute, vertexColorAttribute);
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projectionMatrix = mat4.create(mat4.prototype);
    projectionMatrix = mat4.perspective(projectionMatrix, 45, 640.0/480.0, 0.1, 100.0);
    suzanne.rotate(0, 0, 0);
    var viewMatrix = mat4.create(mat4.prototype);
    mat4.translate(viewMatrix, viewMatrix, [-0.0, 0.0, -4.0]);

    setMatrixUniforms(projectionMatrix, viewMatrix);
    suzanne.display()
}

function setMatrixUniforms(projectionMatrix, viewMatrix) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uProjMatrix");
    gl.uniformMatrix4fv(pUniform, false, projectionMatrix);

    var viewUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
    gl.uniformMatrix4fv(viewUniform, false, viewMatrix);
}