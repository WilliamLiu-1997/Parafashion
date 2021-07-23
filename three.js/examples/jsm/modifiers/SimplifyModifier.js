THREE.SimplifyModifier = function () {};

( function () {

var cb = new THREE.Vector3(),
  ab = new THREE.Vector3();

function pushIfUnique(array, object) {
  if (array.indexOf(object) === -1) array.push(object);
}

function removeFromArray(array, object) {
  var k = array.indexOf(object);
  if (k > -1) array.splice(k, 1);
}

function computeEdgeCollapseCost(u, v) {
  // if we collapse edge uv by moving u to v then how
  // much different will the model change, i.e. the "error".

  var edgelength = v.position.distanceTo(u.position);
  var curvature = 0;

  var sideFaces = [];
  var i,
    il = u.faces.length,
    face,
    sideFace;

  // find the "sides" triangles that are on the edge uv
  for (i = 0; i < il; i++) {
    face = u.faces[i];

    if (face.hasVertex(v)) {
      sideFaces.push(face);
    }
  }

  // use the triangle facing most away from the sides
  // to determine our curvature term
  for (i = 0; i < il; i++) {
    var minCurvature = 1;
    face = u.faces[i];

    for (var j = 0; j < sideFaces.length; j++) {
      sideFace = sideFaces[j];
      // use dot product of face normals.
      var dotProd = face.normal.dot(sideFace.normal);
      minCurvature = Math.min(minCurvature, (1.001 - dotProd) / 2);
    }

    curvature = Math.max(curvature, minCurvature);
  }

  // crude approach in attempt to preserve borders
  // though it seems not to be totally correct
  var borders = 0;
  if (sideFaces.length < 2) {
    // we add some arbitrary cost for borders,
    //borders += 1;
    curvature = 1;
  }

  var amt = edgelength * curvature + borders + computeUVsCost(u, v);

  return amt;
}

// check if there are multiple texture coordinates at U and V vertices(finding borders)
function computeUVsCost(u, v) {
  if (!u.faces[0].faceVertexUvs || !u.faces[0].faceVertexUvs) return 0;
  if (!v.faces[0].faceVertexUvs || !v.faces[0].faceVertexUvs) return 0;
  var UVsAroundVertex = [];
  var UVcost = 0;
  // check if all coordinates around V have the same value
  for (var i = v.faces.length - 1; i >= 0; i--) {
    var f = v.faces[i];
    if (f.hasVertex(u)) UVsAroundVertex.push(getUVsOnVertex(f, v));
  }
  UVsAroundVertex.reduce((prev, uv) => {
    if (prev.x && (prev.x !== uv.x || prev.y !== uv.y)) {
      UVcost += 1;
    }
    return uv;
  }, {});

  UVsAroundVertex.length = 0;
  // check if all coordinates around U have the same value
  for (i = u.faces.length - 1; i >= 0; i--) {
    var f = u.faces[i];
    if (f.hasVertex(v)) UVsAroundVertex.push(getUVsOnVertex(f, u));
  }
  UVsAroundVertex.reduce((prev, uv) => {
    if (prev.x && (prev.x !== uv.x || prev.y !== uv.y)) {
      UVcost += 1;
    }
    return uv;
  }, {});
  return UVcost;
}

function computeEdgeCostAtVertex(v) {
  // compute the edge collapse cost for all edges that start
  // from vertex v.  Since we are only interested in reducing
  // the object by selecting the min cost edge at each step, we
  // only cache the cost of the least cost edge at this vertex
  // (in member variable collapse) as well as the value of the
  // cost (in member variable collapseCost).

  if (v.neighbors.length === 0) {
    // collapse if no neighbors.
    v.collapseNeighbor = null;
    v.collapseCost = -0.01;

    return;
  }

  v.collapseCost = 100000;
  v.collapseNeighbor = null;

  // search all neighboring edges for "least cost" edge
  for (var i = 0; i < v.neighbors.length; i++) {
    var collapseCost = computeEdgeCollapseCost(v, v.neighbors[i]);

    if (!v.collapseNeighbor) {
      v.collapseNeighbor = v.neighbors[i];
      v.collapseCost = collapseCost;
      v.minCost = collapseCost;
      v.totalCost = 0;
      v.costCount = 0;
    }

    v.costCount++;
    v.totalCost += collapseCost;

    if (collapseCost < v.minCost) {
      v.collapseNeighbor = v.neighbors[i];
      v.minCost = collapseCost;
    }
  }

  // we average the cost of collapsing at this vertex
  v.collapseCost = v.totalCost / v.costCount;
  // v.collapseCost = v.minCost;
}

function removeVertex(v, vertices) {
  console.assert(v.faces.length === 0);

  while (v.neighbors.length) {
    var n = v.neighbors.pop();
    removeFromArray(n.neighbors, v);
  }

  removeFromArray(vertices, v);
}

function removeFace(f, faces) {
  removeFromArray(faces, f);

  if (f.v1) removeFromArray(f.v1.faces, f);
  if (f.v2) removeFromArray(f.v2.faces, f);
  if (f.v3) removeFromArray(f.v3.faces, f);

  // TODO optimize this!
  var vs = [f.v1, f.v2, f.v3];
  var v1, v2;

  for (var i = 0; i < 3; i++) {
    v1 = vs[i];
    v2 = vs[(i + 1) % 3];

    if (!v1 || !v2) continue;
    v1.removeIfNonNeighbor(v2);
    v2.removeIfNonNeighbor(v1);
  }
}
let max = 30;
function collapse(vertices, faces, u, v, preserveTexture) {
  // u and v are pointers to vertices of an edge
  // Collapse the edge uv by moving vertex u onto v

  if (!v) {
    // u is a vertex all by itself so just delete it..
    removeVertex(u, vertices);
    return true;
  }

  var i;
  var tmpVertices = [];

  for (i = 0; i < u.neighbors.length; i++) {
    tmpVertices.push(u.neighbors[i]);
  }

  var moveToThisUvsValues = [];

  // delete triangles on edge uv:
  for (i = u.faces.length - 1; i >= 0; i--) {
    if (u.faces[i].hasVertex(v)) {
      if (preserveTexture && u.faces[i].faceVertexUvs) {
        // get uvs on remaining vertex
        moveToThisUvsValues = getUVsOnVertex(u.faces[i], v);
      }
      removeFace(u.faces[i], faces);
    }
  }

  if (preserveTexture && u.faces.length && u.faces[0].faceVertexUvs) {
    for (i = u.faces.length - 1; i >= 0; i--) {
      var face = u.faces[i];
      var faceVerticeUVs = getUVsOnVertex(face, u);
      faceVerticeUVs.copy(moveToThisUvsValues);
    }
  }

  // update remaining triangles to have v instead of u
  for (i = u.faces.length - 1; i >= 0; i--) {
    u.faces[i].replaceVertex(u, v);
  }
  //v.position = getPointInBetweenByPerc(u.position, v.position, 0.50);

  removeVertex(u, vertices);
  // recompute the edge collapse costs in neighborhood
  for (i = 0; i < tmpVertices.length; i++) {
    computeEdgeCostAtVertex(tmpVertices[i]);
  }

  return true;
}

function getPointInBetweenByPerc(pointA, pointB, percentage) {
  var dir = pointB.clone().sub(pointA);
  var len = dir.length();
  dir = dir.normalize().multiplyScalar(len * percentage);
  return pointA.clone().add(dir);
}

function getUVsOnVertex(face, vertex) {
  return face.faceVertexUvs[getVertexIndexOnFace(face, vertex)];
}

function getVertexIndexOnFace(face, vertex) {
  var index = [face.v1, face.v2, face.v3].indexOf(vertex);
  if (index === -1) {
    throw new Error("Vertex not found");
  }
  return index;
}

function minimumCostEdge(vertices, skip) {
  // O(n * n) approach. TODO optimize this

  var least = vertices[skip];

  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].collapseCost < least.collapseCost) {
      least = vertices[i];
    }
  }

  return least;
}

// we use a triangle class to represent structure of face slightly differently

function Triangle(v1, v2, v3, a, b, c, fvuv, materialIndex) {
  this.a = a;
  this.b = b;
  this.c = c;

  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;

  this.normal = new THREE.Vector3();
  this.faceVertexUvs = fvuv;
  this.materialIndex = materialIndex;

  this.computeNormal();

  v1.faces.push(this);
  v1.addUniqueNeighbor(v2);
  v1.addUniqueNeighbor(v3);

  v2.faces.push(this);
  v2.addUniqueNeighbor(v1);
  v2.addUniqueNeighbor(v3);

  v3.faces.push(this);
  v3.addUniqueNeighbor(v1);
  v3.addUniqueNeighbor(v2);
}

Triangle.prototype.computeNormal = function() {
  var vA = this.v1.position;
  var vB = this.v2.position;
  var vC = this.v3.position;

  cb.subVectors(vC, vB);
  ab.subVectors(vA, vB);
  cb.cross(ab).normalize();

  this.normal.copy(cb);
};

Triangle.prototype.hasVertex = function(v) {
  return v === this.v1 || v === this.v2 || v === this.v3;
};

Triangle.prototype.replaceVertex = function(oldv, newv) {
  if (oldv === this.v1) {
    this.a = newv.id;
    this.v1 = newv;
  } else if (oldv === this.v2) {
    this.b = newv.id;
    this.v2 = newv;
  } else if (oldv === this.v3) {
    this.c = newv.id;
    this.v3 = newv;
  }

  removeFromArray(oldv.faces, this);
  newv.faces.push(this);

  oldv.removeIfNonNeighbor(this.v1);
  this.v1.removeIfNonNeighbor(oldv);

  oldv.removeIfNonNeighbor(this.v2);
  this.v2.removeIfNonNeighbor(oldv);

  oldv.removeIfNonNeighbor(this.v3);
  this.v3.removeIfNonNeighbor(oldv);

  this.v1.addUniqueNeighbor(this.v2);
  this.v1.addUniqueNeighbor(this.v3);

  this.v2.addUniqueNeighbor(this.v1);
  this.v2.addUniqueNeighbor(this.v3);

  this.v3.addUniqueNeighbor(this.v1);
  this.v3.addUniqueNeighbor(this.v2);

  this.computeNormal();
};

function Vertex(v, id) {
  this.position = v;

  this.id = id; // old index id

  this.faces = []; // faces vertex is connected
  this.neighbors = []; // neighbouring vertices aka "adjacentVertices"

  // these will be computed in computeEdgeCostAtVertex()
  this.collapseCost = 0; // cost of collapsing this vertex, the less the better. aka objdist
  this.collapseNeighbor = null; // best candinate for collapsing
}

Vertex.prototype.addUniqueNeighbor = function(vertex) {
  pushIfUnique(this.neighbors, vertex);
};

Vertex.prototype.removeIfNonNeighbor = function(n) {
  var neighbors = this.neighbors;
  var faces = this.faces;

  var offset = neighbors.indexOf(n);
  if (offset === -1) return;
  for (var i = 0; i < faces.length; i++) {
    if (faces[i].hasVertex(n)) return;
  }

  neighbors.splice(offset, 1);
};

/**
 * modify - will reduce vertices and faces count
 * mergeVertices might be needed prior
 * @param count int how many vertices to remove ie. 60% removal Math.round(geo.vertices.count * 0.6)
 **/

const lowerLimit = 51;
THREE.SimplifyModifier.prototype.modify = function ( geometryRaw, percentage, preserveTexture = true ) {
  let geometry = geometryRaw;
  
  if (geometry.vertices.length < lowerLimit * 3) {
    return geometryRaw;
  }

  geometry.mergeVertices();
  geometry.computeVertexNormals();

  var oldVertices = geometry.vertices; // Three Position
  var oldFaces = geometry.faces; // Three Face
  var oldFaceUVs = geometry.faceVertexUvs[0];

  // conversion
  var vertices = new Array(oldVertices.length); // Simplify Custom Vertex Struct
  var faces = new Array(oldFaces.length); // Simplify Custom Traignle Struct
  var faceUVs = []; // rebuild UVs

  var i, il, face;

  // add vertices
  for (i = 0, il = oldVertices.length; i < il; i++) {
    vertices[i] = new Vertex(oldVertices[i], i);
  }

  if (preserveTexture && oldFaceUVs.length) {
    // add UVs
    for (i = 0; i < oldFaceUVs.length; i++) {
      const faceUV = oldFaceUVs[i];

      faceUVs.push([
        new THREE.Vector2(faceUV[0].x, faceUV[0].y),
        new THREE.Vector2(faceUV[1].x, faceUV[1].y),
        new THREE.Vector2(faceUV[2].x, faceUV[2].y)
      ]);
    }
  }

  // add faces
  for (i = 0, il = oldFaces.length; i < il; i++) {
    face = oldFaces[i];
    faces[i] = new Triangle(
      vertices[face.a],
      vertices[face.b],
      vertices[face.c],
      face.a,
      face.b,
      face.c,
      faceUVs[i],
      face.materialIndex
    );
  }

  // compute all edge collapse costs
  for (i = 0, il = vertices.length; i < il; i++) {
    computeEdgeCostAtVertex(vertices[i]);
  }

  var nextVertex;
  var z = Math.round(geometry.vertices.length * percentage);
  var skip = 0;

  // console.time('z')
  // console.profile('zz');

  while (z--) {
    nextVertex = minimumCostEdge(vertices, skip);
    if (!nextVertex) {
      console.log("no next vertex");
      break;
    }

    var collapsed = collapse(
      vertices,
      faces,
      nextVertex,
      nextVertex.collapseNeighbor,
      preserveTexture
    );
    if (!collapsed) {
      skip++;
    }
  }

  // TODO convert to buffer geometry.
  var newGeo = new THREE.Geometry();
  if (preserveTexture && oldFaceUVs.length) newGeo.faceVertexUvs[0] = [];

  for (i = 0; i < vertices.length; i++) {
    var v = vertices[i];
    newGeo.vertices.push(v.position);
  }
  for (i = 0; i < faces.length; i++) {
    var tri = faces[i];
    newGeo.faces.push(
      new THREE.Face3(
        vertices.indexOf(tri.v1),
        vertices.indexOf(tri.v2),
        vertices.indexOf(tri.v3),
        undefined,
        undefined,
        tri.materialIndex
      )
    );

    if (preserveTexture && oldFaceUVs.length) {
      newGeo.faceVertexUvs[0].push(faces[i].faceVertexUvs);
      if (faces[i].faceVertexUvs === undefined) {
        debugger;
      }
    }
  }

  newGeo.mergeVertices();
  newGeo.computeVertexNormals();
  newGeo.computeFaceNormals();
  newGeo.name = geometry.name;

  // console.log(`face change from ${geometry.faces.length} to ${newGeo.faces.length}`);

  return newGeo;
};

} )();