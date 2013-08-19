function Suzanne(uModelMatrixId, vertexPositionAttrib, vertexColorAttrib){
    Model.call(this, uModelMatrixId, vertexPositionAttrib, vertexColorAttrib);
    if(this.plyPath !== undefined) {
        var plyData = loadPly(this.plyPath);
        this.vertices = plyData["vertices"];
        this.vertexNormals = plyData["normals"];
        this.colors = [];
        for(var colorIndex = 0; colorIndex < plyData["colors"].length; colorIndex++) {
            if(plyData["colors"][colorIndex] == 0) {
                this.colors.push(plyData["colors"][colorIndex]);
            } else {
                this.colors.push(parseFloat(plyData["colors"][colorIndex])/parseFloat(255));
            }
        }
    }
    this.initBuffers();

}

Suzanne.prototype = Object.create(Model.prototype);
Suzanne.prototype.constructor = Cube;
Suzanne.prototype.plyPath = "file:///home/brandon/repos/webgl_tests/suzanne.ply";