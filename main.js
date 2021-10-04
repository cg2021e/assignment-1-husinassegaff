function main() {
    //Access the canvas through DOM: Document Object Model
    var canvas = document.getElementById('myCanvas');   // The paper
    var gl = canvas.getContext('webgl');                // The brush and the paints

    // Define vertices data
    /**
     * A ( -0.5, -0.5 )
     * B (  0.5, -0.5 )
     * C (  0.5,  0.5 )
     * C ( -0.5,  0.5 )
     */

    var vertices = [
        -0.7634678531317,-0.5137166304227, 1.0, 1.0, 1.0,
       -0.756270289212,-0.5441678623907, 0.0, 1.0, 0.0,
       -0.7359499767657,-0.6079899828595, 0.0, 1.0, 0.0,
       -0.7157810370579,-0.6833953747141, 0.0, 1.0, 0.0,
       -0.7021256886996,-0.7324013103905, 0.0, 1.0, 0.0,
       -0.6890806785524,-0.7456007928604, 0.0, 1.0, 0.0,
       -0.6735972899177,-0.7641395557916, 0.0, 1.0, 0.0,
       -0.652040370833,-0.7808461680822, 0.0, 1.0, 0.0,
       -0.6299445287713,-0.7948581654872, 0.0, 1.0, 0.0,
       -0.6110822245723,-0.8045587790753, 0.0, 1.0, 0.0,
       -0.5896837726864,-0.8146181447938, 0.0, 1.0, 0.0,
       -0.563118079609,-0.8201875454116, 0.0, 1.0, 0.0,
       -0.5322785408552,-0.8234952424997, 0.0, 1.0, 0.0,
       -0.4997291826004,-0.8246788555271, 0.0, 1.0, 0.0,
       -0.468363437373,-0.8223116294722, 0.0, 1.0, 0.0,
       -0.4399567247142,-0.816393564335, 0.0, 1.0, 0.0,
       -0.4143050961808,-0.8045891993217, 0.0, 1.0, 0.0,
       -0.3946805947423,-0.7913426608507, 0.0, 1.0, 0.0,
       -0.3760373183757,-0.7780961223797, 0.0, 1.0, 0.0,
       -0.3627036553858,-0.7705976777192, 0.0, 1.0, 0.0,
       -0.3515570870984,-0.761737584978, 0.0, 1.0, 0.0,
       -0.3404105188111,-0.7517342544637, 0.0, 1.0, 0.0,
       -0.3306929977401,-0.7411593050629, 0.0, 1.0, 0.0,
       -0.3238335711017,-0.7320134028784, 0.0, 1.0, 0.0,
       -0.3170152539224,-0.7219723857131, 0.0, 1.0, 0.0,
       -0.3091459852624,-0.7123388786525, 0.0, 1.0, 0.0,
       -0.3,-0.7, 0.0, 1.0, 0.0,
       -0.293843687709,-0.6844001313051, 0.0, 1.0, 0.0,
       -0.2899123231689,-0.6620215946925, 0.0, 1.0, 0.0,
       -0.2870001944077,-0.636181234535, 0.0, 1.0, 0.0,
       -0.2795000128899,-0.6027465239248, 0.0, 1.0, 0.0,
       -0.2724660964308,-0.5696924027079, 0.0, 1.0, 0.0,
       -0.2654593127684,-0.5396267571813, 0.0, 1.0, 0.0,
       -0.260738637175,-0.5140564310499, 0.0, 1.0, 0.0,
       -0.253453584673,-0.4794060668981, 0.0, 1.0, 0.0,
       -0.25,-0.45, 0.0, 1.0, 0.0,
       -0.2479102121874,-0.4239723420422, 0.0, 1.0, 0.0,
       -0.2569181924765,-0.3955625580536, 0.0, 1.0, 0.0,
       -0.2686978590083,-0.3726961465505, 0.0, 1.0, 0.0,
       -0.2605785998987,-0.3552506945099, 0.0, 1.0, 0.0,
       -0.2546342479339,-0.3393990892705, 0.0, 1.0, 0.0,
       -0.2491852586328,-0.3220613960398, 0.0, 1.0, 0.0,
       -0.2496806212965,-0.3052190654729, 0.0, 1.0, 0.0,
       -0.2571110612525,-0.2898628228972, 0.0, 1.0, 0.0,
       -0.2665229518635,-0.2740112176578, 0.0, 1.0, 0.0,
       -0.28,-0.26, 0.0, 1.0, 0.0,
       -0.2962447116874,-0.2462709084887, 0.0, 1.0, 0.0,
       -0.3150684929093,-0.2363636552141, 0.0, 1.0, 0.0,
       -0.3333969114674,-0.2269517646031, 0.0, 1.0, 0.0,
       -0.3522665824768,-0.2186220431478, 0.0, 1.0, 0.0,
       -0.3746327062209,-0.2121775668148, 0.0, 1.0, 0.0,
       -0.4470677637252,-0.1988349567837, 0.0, 1.0, 0.0,
       -0.4731489475385,-0.1965512761614, 0.0, 1.0, 0.0,
       -0.5042670671343,-0.1951983144398, 0.0, 1.0, 0.0,
       -0.5375692660071,-0.1966228777244, 0.0, 1.0, 0.0,
       -0.564846833158,-0.1981727394943, 0.0, 1.0, 0.0,
       -0.5905745385389,-0.2025123524502, 0.0, 1.0, 0.0,
       -0.6204271297426,-0.2082882387578, 0.0, 1.0, 0.0,
       -0.6480008825415,-0.2157725430889, 0.0, 1.0, 0.0,
       -0.6783320106203,-0.2264081334542, 0.0, 1.0, 0.0,
       -0.7062996741735,-0.2390132775909, 0.0, 1.0, 0.0,
       -0.7261202739325,-0.250078197454, 0.0, 1.0, 0.0,
       -0.7431531746982,-0.2645877055136, 0.0, 1.0, 0.0,
       -0.76,-0.28, 0.0, 1.0, 0.0,
       -0.7702796462879,-0.2970763866036, 0.0, 1.0, 0.0,
       -0.7693333740231,-0.3718318955195, 0.0, 1.0, 0.0,
       -0.3989872223811,-0.2052978407861, 0.0, 1.0, 0.0,
       -0.4205805313718,-0.2017459009037, 0.0, 1.0, 0.0,
       -0.7566912837511,-0.3847791773754, 0.0, 1.0, 0.0,
       -0.7775344003177,-0.312532166928, 0.0, 1.0, 0.0,
       -0.7819503375532,-0.3320884603997, 0.0, 1.0, 0.0,
       -0.7800577930237,-0.3529064502244, 0.0, 1.0, 0.0,
       -0.7631196489365,-0.394451483515, 0.0, 1.0, 0.0,
       -0.7700766378646,-0.40865533591, 0.0, 1.0, 0.0,
       -0.7752943795607,-0.4225693137663, 0.0, 1.0, 0.0,
       -0.7778418367481,-0.4439982657354, 0.0, 1.0, 0.0,
       -0.7763218949171,-0.4690773059465, 0.0, 1.0, 0.0,
       -0.7698621421354,-0.492256418869, 0.0, 1.0, 0.0

        // -0.7634678531317, -0.5137166304227, 0.0, 1.0, 0.0,     // Point A
        //  0.5, -0.5, 0.0, 0.0, 1.0,     // Point B
        //  0.5,  0.5, 1.0, 0.0, 0.0,     // Point C
        //  0.5,  0.5, 1.0, 0.0, 0.0,     // Point C
        // -0.5,  0.5, 1.0, 0.0, 0.0,     // Point D
        // -0.5, -0.5, 0.0, 1.0, 0.0      // Point A
    ];

    // Create a linked-list for storing the vertices data
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform vec2 uChange;
        void main() {
            gl_PointSize = 10.0;
            gl_Position = vec4(aPosition + uChange, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);    // Yellow
        }
    `;

    // Create .c in GPU
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    // Compile .c into .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Prepare a .exe shell (shader program)
    var shaderProgram = gl.createProgram();

    // Put the two .o files into the shell
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Link the two .o files, so together they can be a runnable program/context.
    gl.linkProgram(shaderProgram);

    // Start using the context (analogy: start using the paints and the brushes)
    gl.useProgram(shaderProgram);

    // Teach the computer how to collect
    //  the positional values from ARRAY_BUFFER
    //  to each vertex being processed
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition, 
        2, 
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aColor);

    // Create a uniform to animate the vertices
    var uChange = gl.getUniformLocation(shaderProgram,"uChange");
    var changeX = 0;
    var changeY = 0;

    function render(){
        changeX = changeX + 0.1;
        changeY = changeY + 0.1;
        gl.uniform2f(uChange, changeX, changeY);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 77);
    }

    render();
 
}