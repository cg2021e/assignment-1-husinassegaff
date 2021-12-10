class WebGLWorld {
    constructor(gl) {
        this.gl = gl;
        this.objects = [];
        this.view = null;
        this.projection = null;
        this.camera = {
            position: [0, 0, 0],
            up: [0, 1, 0],
            look: [0, 0, 0],
        };
        this.lightning = {
            position: [0, 0, 0],
            ambientConstantGlobal:[1.0,  1.0,  1.0],
            ambientIntensityGlobal: 0.0,
        };
        this.clearColor = [1.0, 1.0, 1.0, 1.0];
    }

    deploy() {
        // Projection
        this.projection = glMatrix.mat4.create();

        // View
        this.view = glMatrix.mat4.create();

        this.objects.forEach((x) => x.initialize());
    }

    render() {
        // Clear Screen
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(...this.clearColor);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Configure Camera
        glMatrix.mat4.perspective(this.projection, Math.PI / 3, 1, 0.5, 10);
        glMatrix.mat4.lookAt(this.view, this.camera.position, this.camera.look, this.camera.up);

        // Render each object
        this.objects.forEach((x) => x.render());
    }

    addObject(obj) {
        this.objects.push(obj);
        obj.world = this;
    }
}

class WebGLObject {
    constructor(gl, model, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl;
        this.model = model;
        this.lightning = {
            ambientIntensity: 0.0,
            diffuseIntensity: 0.0,
            specularIntensity: 0.0,
            shininessConstant: 100
        };

        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;

        this.vertexShader = null;
        this.fragmentShader = null;

        this.shaderProgram = null;
        this.shaderVar = {};

        this.buffers = {
            vertexBuffer: null,
            fragmentBuffer: null
        }

        this.transform = {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        };

        this.world = null;
    }

    initialize() {
        this._createVertexBuffer();
        this._createFragmentBuffer();
        this._createShader();
        this._compileShader();
        
        this._createShaderProgram();
        this._linkShaderProgram();
        this._runShaderProgram();
    }

    render() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
        
        this.gl.useProgram(this.shaderProgram);

        this._registerShaderAttribute();
        this._registerShaderVar();

        this._renderTransform();
        this._renderMesh();
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    _renderTransform() {
        var model = glMatrix.mat4.create();

        // Transform
        glMatrix.mat4.translate(model, model, this.transform.position); // Position
        glMatrix.mat4.rotate(model, model, this.transform.rotation[0] / 180 * Math.PI, [1, 0, 0]); // Rotation X
        glMatrix.mat4.rotate(model, model, this.transform.rotation[1] / 180 * Math.PI, [0, 1, 0]); // Rotation Y
        glMatrix.mat4.rotate(model, model, this.transform.rotation[2] / 180 * Math.PI, [0, 0, 1]); // Rotation Z
        glMatrix.mat4.scale(model, model, this.transform.scale); // Scale
        this.gl.uniformMatrix4fv(this.shaderVar.uModel, false, model);

        // View
        this.gl.uniformMatrix4fv(this.shaderVar.uView, false, this.world.view);

        // Projection
        this.gl.uniformMatrix4fv(this.shaderVar.uProjection, false, this.world.projection);

        // World Properties
        this.gl.uniform3fv(this.shaderVar.uLightConstant, this.world.lightning.ambientConstantGlobal);
        this.gl.uniform1f(this.shaderVar.uAmbientIntensityGlobal, this.world.lightning.ambientIntensityGlobal);
        this.gl.uniform3fv(this.shaderVar.uLightPosition, this.world.lightning.position);
        this.gl.uniform3fv(this.shaderVar.uViewerPosition, this.world.camera.position);

        // Lightning
        this.gl.uniform1f(this.shaderVar.uAmbientIntensity, this.lightning.ambientIntensity);
        this.gl.uniform1f(this.shaderVar.uShininessConstant, this.lightning.shininessConstant);

        // Normals
        var normalModel = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(normalModel, model);
        this.gl.uniformMatrix3fv(this.shaderVar.uNormalModel, false, normalModel);
    }

    _renderMesh() {
        this.gl.drawElements(this.gl.TRIANGLES, this.model.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    _createVertexBuffer() {
        this.buffers.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.model.vertices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    _createFragmentBuffer() {
        this.buffers.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.model.indices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    _createShader() {
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vertexShader, this.vertexShaderSource);
        
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
    }

    _compileShader() {
        this.gl.compileShader(this.vertexShader);
        this.gl.compileShader(this.fragmentShader);
    }

    _createShaderProgram() {
        this.shaderProgram = this.gl.createProgram();
    }

    _linkShaderProgram() {
        this.gl.attachShader(this.shaderProgram, this.vertexShader);
        this.gl.attachShader(this.shaderProgram, this.fragmentShader);

        this.gl.linkProgram(this.shaderProgram);
    }

    _runShaderProgram() {
        this.gl.useProgram(this.shaderProgram);
    }

    _registerShaderAttribute() {
        this.shaderVar.aPosition = this.gl.getAttribLocation(this.shaderProgram, "aPosition");
        this.gl.vertexAttribPointer(this.shaderVar.aPosition, 3, this.gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.enableVertexAttribArray(this.shaderVar.aPosition);
        
        this.shaderVar.aNormal = this.gl.getAttribLocation(this.shaderProgram, "aNormal");
        this.gl.vertexAttribPointer(this.shaderVar.aNormal, 3, this.gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(this.shaderVar.aNormal);

        this.shaderVar.aColor = this.gl.getAttribLocation(this.shaderProgram, "aColor");
        this.gl.vertexAttribPointer(this.shaderVar.aColor, 3, this.gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(this.shaderVar.aColor);
    }

    _registerShaderVar() {
        this.shaderVar.uModel = this.gl.getUniformLocation(this.shaderProgram, "uModel");
        this.shaderVar.uView = this.gl.getUniformLocation(this.shaderProgram, "uView");
        this.shaderVar.uProjection = this.gl.getUniformLocation(this.shaderProgram, "uProjection");

        this.shaderVar.uNormalModel = this.gl.getUniformLocation(this.shaderProgram, "uNormalModel");
        this.shaderVar.uViewerPosition = this.gl.getUniformLocation(this.shaderProgram, "uViewerPosition");
        this.shaderVar.uLightPosition = this.gl.getUniformLocation(this.shaderProgram, "uLightPosition");
        this.shaderVar.uLightConstant = this.gl.getUniformLocation(this.shaderProgram, "uLightConstant");
        this.shaderVar.uAmbientIntensityGlobal = this.gl.getUniformLocation(this.shaderProgram, "uAmbientIntensityGlobal");
        this.shaderVar.uAmbientIntensity = this.gl.getUniformLocation(this.shaderProgram, "uAmbientIntensity");
        this.shaderVar.uShininessConstant = this.gl.getUniformLocation(this.shaderProgram, "uShininessConstant");
    }
}

var vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute vec3 aNormal;
    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    void main() {
        gl_Position = uProjection * uView * uModel * (vec4(aPosition, 1.0));
        vColor = aColor;
        vNormal = aNormal;
        vPosition = (uModel * (vec4(aPosition, 1.0))).xyz;
    }
`;

var fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uLightConstant;

    uniform float uAmbientIntensityGlobal;
    uniform float uAmbientIntensity;
    
    uniform vec3 uLightPosition;
    uniform mat3 uNormalModel;
    uniform vec3 uViewerPosition;

    uniform float uShininessConstant;

    void main() {
        vec3 ambient = uLightConstant * max(uAmbientIntensity, uAmbientIntensityGlobal);
        vec3 lightDirection = uLightPosition - vPosition;
        vec3 normalizedLight = normalize(lightDirection);
        vec3 normalizedNormal = normalize(uNormalModel * vNormal);
        float cosTheta = dot(normalizedNormal, normalizedLight);
        vec3 diffuse = vec3(0.0, 0.0, 0.0);
        if (cosTheta > 0.0) {
            float diffuseIntensity = cosTheta;
            diffuse = uLightConstant * diffuseIntensity;
        }
        vec3 reflector = reflect(-lightDirection, normalizedNormal);
        vec3 normalizedReflector = normalize(reflector);
        vec3 normalizedViewer = normalize(uViewerPosition - vPosition);
        float cosPhi = dot(normalizedReflector, normalizedViewer);
        vec3 specular = vec3(0.0, 0.0, 0.0);
        if (cosPhi > 0.0) {
            float shininessConstant = uShininessConstant; 
            float specularIntensity = pow(cosPhi, shininessConstant); 
            specular = uLightConstant * specularIntensity;
        }
        vec3 phong = ambient + diffuse + specular;
        gl_FragColor = vec4(phong * vColor, 1.0);
    }
`;

function main() {
    let canvas = document.getElementById('myCanvas'); 
    let gl = canvas.getContext('webgl');

    gl.viewport(0, 0, 640, 640);

    // model
    let cubeModel = makeCube();
    let jarModel = makeJar();
    let planeModel = makePlane();

    // cube
    let cubeObject = new WebGLObject(gl, cubeModel, vertexShaderSource, fragmentShaderSource);
    cubeObject.transform.scale = [0.1, 0.1, 0.1];
    cubeObject.transform.position = [0, -0.75, 1.8];
    cubeObject.lightning.ambientIntensity = 0.0;
    cubeObject.lightning.diffuseIntensity = 0.0;
    cubeObject.lightning.specularIntensity = 0.0;

    // jar left
    let jarLeftObject = new WebGLObject(gl, jarModel, vertexShaderSource, fragmentShaderSource);
    jarLeftObject.transform.position = [-1, -1, 2];
    jarLeftObject.transform.rotation = [-90, 0, 30];
    jarLeftObject.transform.scale = [0.15, 0.15, 0.15];
    jarLeftObject.lightning.shininessConstant = 1; // Plastic Shininess, around 5 - 10

    // jar right
    let jarRightObject = new WebGLObject(gl, jarModel, vertexShaderSource, fragmentShaderSource);
    jarRightObject.transform.position = [1, -1, 2];
    jarRightObject.transform.rotation = [-90, 0, 130];
    jarRightObject.transform.scale = [0.15, 0.15, 0.15];
    jarRightObject.lightning.shininessConstant = 200; // Metal Shininess, around 100 - 200
 

    // plane
    let planeObject = new WebGLObject(gl, planeModel, vertexShaderSource, fragmentShaderSource);
    planeObject.transform.scale = [20, 0, 20];
    planeObject.transform.position = [0, -1.13, 2];

    let world = new WebGLWorld(gl);

    world.clearColor = [0.8, 0.8, 0.8, 1.0];
    world.camera.position = [0, -1, 3.0]; 
    world.camera.up = [0, 1, 0];
    world.lightning.position = cubeObject.transform.position;
    world.lightning.ambientIntensity = 0.0;

    world.addObject(cubeObject);
    world.addObject(jarLeftObject);
    world.addObject(jarRightObject);

    world.addObject(planeObject);

    world.deploy();

    // Controller
    let cubePosition = cubeObject.transform.position;
    let cameraPosition = world.camera.position;
    let cubeSpeed = 0.05;
    let cameraSpeed = 0.05;
    let moveRatio = 0.05;

    let check = "on";

    document.addEventListener("keydown", (event) => {  
        if (event.keyCode == 32) {
            if(check == "on") {
                world.lightning.ambientIntensityGlobal = 1.0;
                cubeObject.lightning.ambientIntensity = 1.0;
                cubeObject.lightning.diffuseIntensity = 1.0;
                cubeObject.lightning.specularIntensity = 1.0;
                check = "off";
            } else {
                world.lightning.ambientIntensityGlobal = 0.0;
                cubeObject.lightning.ambientIntensity = 0.0;
                cubeObject.lightning.diffuseIntensity = 0.0;
                cubeObject.lightning.specularIntensity = 0.0;
                check = "on";
            }
        }
        
        if (event.keyCode == 'W'.charCodeAt()) cubePosition[2] -= cubeSpeed;
        else if (event.keyCode == 'S'.charCodeAt()) cubePosition[2] += cubeSpeed;
        
        if (event.keyCode == 'A'.charCodeAt()) cubePosition[0] -= cubeSpeed;
        else if (event.keyCode == 'D'.charCodeAt()) cubePosition[0] += cubeSpeed;

        if (event.keyCode == 38) cameraPosition[2] -= cameraSpeed;
        else if (event.keyCode == 40) cameraPosition[2] += cameraSpeed;

        if (event.keyCode == 37) cameraPosition[0] -= cameraSpeed;
        else if (event.keyCode == 39) cameraPosition[0] += cameraSpeed;
    }, false);

    function render() {
        world.render();

        cubeObject.transform.position = lerpVec3(cubeObject.transform.position, cubePosition, moveRatio);
        world.lightning.position = lerpVec3(world.lightning.position, cubePosition, moveRatio);
        world.camera.position = lerpVec3(world.camera.position, cameraPosition, moveRatio);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();

// challenge 6 is not finished yet