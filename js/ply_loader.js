function loadPly(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "file:///home/brandon/repos/webgl_tests/suzanne.ply", false);
    xhr.send();
    var plyText = xhr.responseText;
    var plyTextLines = plyText.split('\n');
    plyTextLines = stripHeader(plyTextLines);
    return getData(plyTextLines);
}

function stripHeader(lines){
    for(var index = 0; index < lines.length; index++) {
        if(lines[index] == "end_header") {
            break;
        }
    }
    var useful_lines = [];
    for(var index2 = index + 1; index2 < lines.length; index2++) {
        useful_lines.push(lines[index2]);
    }
    return useful_lines;
}

function getData(lines) {
    var vertices = [];
    var faces = [];
    for(var index = 0; index < lines.length; index++) {
        var components = lines[index].split(" ");
        if(components.length == 4) {
            faces.push(components.slice(1));
        }else if(components.length == 9) {
            vertices.push(components);
        }
    }
    var vertexData = [];
    for(var faceIndex = 0; faceIndex < faces.length; faceIndex++) {
        for(var faceVertexIndex = 0; faceVertexIndex < faces[faceIndex].length; faceVertexIndex++) {
            vertexData.push(vertices[parseInt(faces[faceIndex][faceVertexIndex])])
        }
    }

    var positions = [];
    var colors = [];
    var normals = [];
    for(var vertexDataIndex = 0; vertexDataIndex < vertexData.length; vertexDataIndex++) {
        var vData = loadVertexData(vertexData[vertexDataIndex]);
        positions = positions.concat(vData[0]);
        colors = colors.concat(vData[1]);
        normals = normals.concat(vData[2]);
    }
    return {"vertices": positions, "colors": colors, "normals": normals};;
}

function loadVertexData(components) {
    var vertPos = [];
    vertPos[0] = parseFloat(components[0]);
    vertPos[1] = parseFloat(components[1]);
    vertPos[2] = parseFloat(components[2]);
    vertPos[3] = 1.0;
    var vertNorms = [];
    vertNorms[0] = parseFloat(components[3]);
    vertNorms[1] = parseFloat(components[4]);
    vertNorms[2] = parseFloat(components[5]);
    var vertColors = [];
    vertColors[0] = parseInt(components[6]);
    vertColors[1] = parseInt(components[7]);
    vertColors[2] = parseInt(components[8]);
    return [vertPos, vertColors, vertNorms];
}
