import * as THREE from './three.js/build/three.module.js';
import { CameraControls } from './js/CameraControls.js';
import { OBJLoader } from "./three.js/examples/jsm/loaders/OBJLoader.js";
import Stats from './three.js/examples/jsm/libs/stats.module.js';

let camera, cameralight, controls, scene, renderer, garment, env_light, stats;
let camera_patch, cameralight_patch, controls_patch, scene_patch, renderer_patch, patch, env_light_patch;
let obj_vertices_count = 0;
let obj3D = new THREE.Object3D();
let progress_obj = 0, progress_mtl = 0;
let patch_panel_width = $("#container_patch").css("width");
let pointer = new THREE.Vector2();
let original = [];
let mouse_down = false;

let selected = [];

var max_radius = 0;
let default_material = new THREE.MeshPhongMaterial({ color: randomColor(), reflectivity: 0.1, side: THREE.DoubleSide })
let obj_size = 1;
let pixelRatio = window.devicePixelRatio;
var FPS = 60;
var singleFrameTime = 1 / FPS;
var timeStamp = 0;
const clock = new THREE.Clock();


let reset_position = false;


var garments_obj = "./leggins/leggins_patch.obj";
var garments_obj = "./leggins/leggins.obj"




setTimeout(() => {
init();
init_patch();
onWindowResize();
animate();
},1000)

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181818);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById("container").appendChild(renderer.domElement);
    stats = new Stats();
    document.getElementById("container").appendChild(stats.dom);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.01,
        200
    );
    camera.position.set(0, 0.5, 2);

    cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.8);

    camera.add(cameralight);
    scene.add(camera);
    env_light = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(env_light);

    // controls

    controls = new CameraControls(camera, renderer.domElement);
    controls.dynamicSensitivity = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.rotateSpeed = 1.3;
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.mouseButtons = { PAN: THREE.MOUSE.RIGHT, ZOOM: false, ROTATE: THREE.MOUSE.LEFT };

    //garment = ply_loader(garments_obj1, 1);
    garment = obj_loader(garments_obj, 1);

    scene.add(garment);


    var helper = new THREE.GridHelper(10, 50, 0x999999, 0x666666);
    helper.position.y = 0;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);



    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);


}


function init_patch() {
    scene_patch = new THREE.Scene();
    renderer_patch = new THREE.WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });

    renderer_patch.setPixelRatio(pixelRatio);
    renderer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);
    document.getElementById("container_patch").appendChild(renderer_patch.domElement);
    camera_patch = new THREE.PerspectiveCamera(
        45,
        $("#container_patch").width() / window.innerHeight / 0.78,
        0.01,
        1000
    );
    camera_patch.position.set(0, 0, 2);

    cameralight_patch = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.8);
    cameralight_patch.position.set(0, 0, 0)
    camera_patch.add(cameralight_patch);
    scene_patch.add(camera_patch);
    env_light_patch = new THREE.AmbientLight(0xffffff, 0.2);
    scene_patch.add(env_light_patch);

    controls_patch = new CameraControls(camera_patch, renderer_patch.domElement);

    controls_patch.dynamicSensitivity = false;
    controls_patch.enableDamping = true;
    controls_patch.dampingFactor = 0.15;
    controls_patch.enableKeys = false;

    controls_patch.enableRotate = false;


}


function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    timeStamp += delta;
    if (timeStamp > singleFrameTime) {
        stats.begin();
        if (patch_panel_width != $("#container_patch").css("width")) {
            patch_panel_width = $("#container_patch").css("width")
            onWindowResize()
        }
        if (progress_obj + progress_mtl == 200 && garment !== undefined && garment.children !== undefined && garment.children[0] !== undefined && garment.children[0].children !== undefined) {
            camera.position.set(0, obj_size / 2, obj_size * 2);
            controls.saveState();
            var lack = false;
            var all_empty = true;
            progress_obj = progress_mtl = -1;
            var num = garment.children[0].children.length;

            patch = patch_loader(garment, 1);
            patch.name = "patch";
            scene_patch.add(patch);
            camera_patch.position.set(0, 0, 2 * max_radius);
            controls_patch.saveState();
            camera_patch.far = max_radius * 50;
            camera_patch.near = max_radius * 0.01;
            controls_patch.maxZ = max_radius * 20;
            controls_patch.minZ = max_radius * 0.015;
            controls.maxDistance = 5;
            for (var i = 0; i < original.length; i++) {
                if (original[i].geometry.groups.length > 0) {
                    original[i].material = original[i].material.slice(0)
                }
            }

            $("#vertice_num").html("<p>Vertices: " + obj_vertices_count + "</p>")
            onWindowResize();

            for (var i = 0; i < num; i++) {
                try {
                    var empty = true;
                    var uvarray = garment.children[0].children[i].geometry.attributes.uv.array
                    if (!all_empty || i == 0) {
                        for (var uv_index in uvarray) {
                            if (uvarray[uv_index] != 0 && uvarray[uv_index] != 1) {
                                empty = false;
                            }
                        }
                    }
                    !empty ? all_empty = false : all_empty = true;
                }
                catch (err) {
                    console.warn(err + ". Using empty UVs instead.")
                    lack = true
                }
            }
            if (lack || all_empty) { $("#alert_uv").html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Warning!&nbsp;</b></strong>The imported model lacks of partial UVs. This means that part of the textures may cannot be set!&nbsp;&nbsp;</div>'); }


            hide_loading();

        }
        else if (progress_obj + progress_mtl == -2 && garment.children[0].children !== undefined) {


        }

        $("#texture_container").css({ "max-height": window.innerHeight * 0.91 * 0.45 })
        $(".up-area").css({ "width": $(".dg.main").css("width") })
        $("#gui_container_gui").css({ "max-height": window.innerHeight * 0.91 - 50 - $('#texture_container').height() })
        if (patch_scaled) { $(".panel_box").css({ width: Math.max(window.innerWidth * 0.2, window.innerWidth - 2 - $("#gui_container").width()) }); }
        controls_patch.sensitivity = camera_patch.position.z
        render();
        stats.end();
        timeStamp = timeStamp % singleFrameTime;
    }
}

function render() {
    controls.update();
    renderer.render(scene, camera);

    if (render_patch_flag) {
        controls_patch.update();
        renderer_patch.render(scene_patch, camera_patch);

    }
}


function onWindowResize() {
    if (window.innerWidth < 980 && !resize_patch && $("#alert_size").html().length == 0) {
        $("#alert_size").html('<div id="size_alert" class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Warning!&nbsp;</b></strong>Your window width is too small. This web application is <b>NOT</b> compatible!&nbsp;&nbsp;</div>');
    }
    else if (window.innerWidth >= 980) {
        $("#size_alert").hide();
        $("#alert_size").html("");
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(pixelRatio);

    if (render_patch_flag) {
        camera_patch.aspect = $("#container_patch").width() / window.innerHeight / 0.78;
        camera_patch.updateProjectionMatrix();
        renderer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);
        renderer_patch.setPixelRatio(pixelRatio);
    }
}

function onKeyDown(e) {
    switch (e.keyCode) {
        case 16:
            let on_gui = pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)
            if (!on_gui
                && !gui_options.cut
                && selected.length > 0
                && !mouse_down
                && !reset_position) {
                set_cursor(1)
                shift = true;
                controls.stop = true;
                controls_patch.stop = true;
            }
            else if (!mouse_down
                && !reset_position) {
                shift = false;
                controls.stop = false;
                controls_patch.stop = false;
                set_cursor(0)
            }
            break;
        case 17:
            ctrl = true;
            controls.mouseButtons.ROTATE = THREE.MOUSE.LEFT;
            break;
    }
};

function onKeyUp(e) {
    switch (e.keyCode) {
        case 16:
            shift = false;
            controls.stop = false;
            controls_patch.stop = false;
            if (!reset_position) set_cursor(0)
            break;
        case 17:
            ctrl = false;
            controls.mouseButtons.ROTATE = THREE.MOUSE.MIDDLE;
            break;
    }
};


function individual_garmentToPatch(bufGeom, ig, uv) {
    try {
        var groups = bufGeom.groups;
        var origUVs = uv;

        if (groups.length > 0) { var group = groups[ig]; }
        else { var group = { start: 0, count: bufGeom.getAttribute('position').count } }

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;
            newPositions[indexDest] = origUVs[indexOrigUV];
            newPositions[indexDest + 1] = origUVs[indexOrigUV + 1];
            newPositions[indexDest + 2] = 0;

            newUVs[indexDestUV] = origUVs[indexOrigUV];
            newUVs[indexDestUV + 1] = origUVs[indexOrigUV + 1];

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
        newBufGeom.computeVertexNormals();
        return newBufGeom;
    }
    catch (e) {
        var groups = bufGeom.groups;

        if (groups.length > 0) { var group = groups[ig]; }
        else { var group = { start: 0, count: bufGeom.getAttribute('position').count } }

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;
            newPositions[indexDest] = 0;
            newPositions[indexDest + 1] = 0;
            newPositions[indexDest + 2] = 0;

            newUVs[indexDestUV] = 0;
            newUVs[indexDestUV + 1] = 0;

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
        newBufGeom.computeVertexNormals();
        return newBufGeom;
    }


}


function rearrange_geo(geo, position, scale) {
    let old_position = geo.getAttribute('position').array;
    let num = geo.getAttribute('position').count;
    let new_position = new Float32Array(num * 3);
    for (var i = 0; i < num; i++) {
        let index = i * 3

        new_position[index] = (old_position[index] + position.x) * scale.x
        new_position[index + 1] = (old_position[index + 1] + position.y) * scale.y
        new_position[index + 2] = (old_position[index + 2] + position.z) * scale.z
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new_position, 3));
    geo.computeVertexNormals();
}



function get_face_position(position) {
    let position_projection = {}
    let positions=[]
    for (let i = 0; i < position.length; i += 3) {
        let pos = [position[i], position[i+1], position[i+2]]
        if (!position_projection.hasOwnProperty(pos)) {
            positions.push(pos)
            position_projection[pos] = positions.length - 1
        }
    }
    let faces = []
    for (let i = 0; i < position.length; i += 9) {
        let pos = [position_projection[[position[i], position[i + 1], position[i + 2]]], position_projection[[position[i + 3], position[i + 4], position[i + 5]]], position_projection[[position[i + 6], position[i + 7], position[i + 8]]]]
        faces.push(pos)
    }
    console.log(faces, positions)
    return [faces, positions]
}

function produce_geo1(position, line = false) {

    let [face_js, position_js] = get_face_position(position)

    let Faces = new Module.vector$vector$size_t$$()
    let Coords = new Module.vector$vector$double$$()
    for (let i = 0; i < position_js.length; i++) {
        let Coords_Vector = new Module.vector$double$()
        Coords_Vector.push_back(position_js[i][0])
        Coords_Vector.push_back(position_js[i][1])
        Coords_Vector.push_back(position_js[i][2])
        Coords.push_back(Coords_Vector)
        Coords_Vector.delete()
    }
    for (let i = 0; i < face_js.length; i++) {
        let Faces_Vector = new Module.vector$size_t$()
        Faces_Vector.push_back(face_js[i][0])
        Faces_Vector.push_back(face_js[i][1])
        Faces_Vector.push_back(face_js[i][2])
        Faces.push_back(Faces_Vector)
        Faces_Vector.delete()
    }
    let Points = new Module.vector$vector$vector$double$$$()
    let FacesOut = new Module.vector$vector$size_t$$()
    let CoordsOut = new Module.vector$vector$double$$()
    let Partition = new Module.vector$int$()
    let FaceVertUV = new Module.vector$vector$vector$double$$$()

    if (line) {
        for (let i = 0; i < line.length; i++) {
            let Points_c = new Module.vector$vector$double$$()
            for (let j = 0; j < line[i].length; j++) {
                let Points_p = new Module.vector$double$()
                Points_p.push_back(line[i][j].x)
                Points_p.push_back(line[i][j].y)
                Points_p.push_back(line[i][j].z)
                Points_c.push_back(Points_p)
                Points_p.delete()
            }
            Points.push_back(Points_c)
            Points_c.delete()
        }
    }

    Module.DerivePatchLayout(Faces, Coords, Faces, Coords, Points, FacesOut, CoordsOut, Partition, FaceVertUV)
    Faces.delete()
    Coords.delete()
    Points.delete()

    console.log(FacesOut.size(), CoordsOut.size(), Partition.size(), FaceVertUV.size())

    let partitions = []
    for (let i = 0; i < Partition.size(); i++) {
        partitions.push(Partition.get(i))
    }
    let groups_o = []
    for (let i = 0; i < partitions.length; i++) {
        if (groups_o[partitions[i]] == undefined) {
            groups_o[partitions[i]] = [i]
        } else {
            groups_o[partitions[i]].push(i)
        }
    }
    let groups = []
    for (let i = 0; i < groups_o.length / 2; i++) {
        groups.push(groups_o[i])
        groups.push(groups_o[i + groups_o.length / 2])
    }

    let faces = []
    let uvs = []
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].length; j++) {
            faces.push([FacesOut.get(groups[i][j]).get(0), FacesOut.get(groups[i][j]).get(1), FacesOut.get(groups[i][j]).get(2)])
            let x = i % 2 == 0 ? i : i - 1
            if (i % 2 == 0) { uvs.push(FaceVertUV.get(groups[x][j]).get(0).get(0), FaceVertUV.get(groups[x][j]).get(0).get(1), FaceVertUV.get(groups[x][j]).get(1).get(0), FaceVertUV.get(groups[x][j]).get(1).get(1), FaceVertUV.get(groups[x][j]).get(2).get(0), FaceVertUV.get(groups[x][j]).get(2).get(1)) }
            else { uvs.push(-FaceVertUV.get(groups[x][j]).get(1).get(0), FaceVertUV.get(groups[x][j]).get(1).get(1), -FaceVertUV.get(groups[x][j]).get(0).get(0), FaceVertUV.get(groups[x][j]).get(0).get(1), -FaceVertUV.get(groups[x][j]).get(2).get(0), FaceVertUV.get(groups[x][j]).get(2).get(1)) }
        }
    }

    let pos = new Float32Array(faces.length * 9);
    for (let i = 0; i < faces.length * 9; i += 9) {
        pos[i] = CoordsOut.get(faces[i / 9][0]).get(0)
        pos[i + 1] = CoordsOut.get(faces[i / 9][0]).get(1)
        pos[i + 2] = CoordsOut.get(faces[i / 9][0]).get(2)

        pos[i + 3] = CoordsOut.get(faces[i / 9][1]).get(0)
        pos[i + 4] = CoordsOut.get(faces[i / 9][1]).get(1)
        pos[i + 5] = CoordsOut.get(faces[i / 9][1]).get(2)

        pos[i + 6] = CoordsOut.get(faces[i / 9][2]).get(0)
        pos[i + 7] = CoordsOut.get(faces[i / 9][2]).get(1)
        pos[i + 8] = CoordsOut.get(faces[i / 9][2]).get(2)
    }
    let uv = new Float32Array(uvs);
    let geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    let index = 0;
    for (let i = 0; i < groups.length; i++) {
        geo.addGroup(index, groups[i].length * 3, i);
        index += groups[i].length * 3
    }
    geo.computeVertexNormals();

    let material = []
    for (let group_i = 0; group_i < geo.groups.length; group_i += 2) {
        let default_m = default_material.clone()
        default_m.color.set(randomColor())
        material.push(default_m);
        material.push(default_m);
    }

    FacesOut.delete()
    CoordsOut.delete()
    Partition.delete()
    FaceVertUV.delete()

    return [geo, material];
}



function obj_loader(url_obj, scale) {
    original = []
    let onProgress_obj = function (xhr) {
        if (xhr.lengthComputable) {
            let percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded(obj)");
            progress_obj = Math.round(percentComplete, 2);
        }
    };
    let newobj = obj3D.clone();
    progress_mtl = 100
    let objLoader = new OBJLoader();
    objLoader.load(
        url_obj,
        function (root) {
            let x_max = -Infinity, x_min = Infinity, y_max = -Infinity, y_min = Infinity, z_max = -Infinity, z_min = Infinity;
            root.traverse(function (child) {
                if (child.type === 'Mesh') {
                    child.name = randomString();

                    //simple geometry
                    //child.geometry = new THREE.DodecahedronGeometry(2, 3)
                    
                    //increase complexity of geometry
                    //child.geometry = new THREE.DodecahedronGeometry(2, 15)

                    //***************************************************************]
                    let geo_mat = produce_geo1(child.geometry.attributes.position.array)
                    child.geometry = geo_mat[0]
                    child.material = geo_mat[1]
                    original.push(child.clone())
                    obj_vertices_count += child.geometry.attributes.position.count;
                    //***************************************************************

                    child.castShadow = true;
                    child.receiveShadow = true;

                    child.geometry.computeBoundingBox();
                    x_max = x_max < child.geometry.boundingBox.max.x ? child.geometry.boundingBox.max.x : x_max;
                    y_max = y_max < child.geometry.boundingBox.max.y ? child.geometry.boundingBox.max.y : y_max;
                    z_max = z_max < child.geometry.boundingBox.max.z ? child.geometry.boundingBox.max.z : z_max;
                    x_min = x_min > child.geometry.boundingBox.min.x ? child.geometry.boundingBox.min.x : x_min;
                    y_min = y_min > child.geometry.boundingBox.min.y ? child.geometry.boundingBox.min.y : y_min;
                    z_min = z_min > child.geometry.boundingBox.min.z ? child.geometry.boundingBox.min.z : z_min;
                }
            })
            let scale_value = Math.max(x_max - x_min, y_max - y_min, z_max - z_min);
            obj_size = 1
            let geo_position = new THREE.Vector3(-(x_min + x_max) / 2, -y_min, -(z_min + z_max) / 2);
            let geo_scale = new THREE.Vector3(scale / scale_value, scale / scale_value, scale / scale_value);
            root.traverse(function (child) {
                if (child.type === 'Mesh') {
                    rearrange_geo(child.geometry, geo_position, geo_scale)

                    //***************************************************************

                    //***************************************************************

                    child.geometry.computeBoundingBox();
                }
            })
            newobj.add(root);
        },
        onProgress_obj
    );
    return newobj;
}


function array_default_material_clone(array, clone) {
    var result = []
    for (var i = 0; i < array.length; i++) {
        if (array[i].envMap !== undefined) { array[i].envMap = null }
        if (clone) result.push(array[i].clone())
        else result.push(array[i])
    }
    return result
}

function patch_loader(garment, scale) {
    let num = garment.children[0].children.length;
    max_radius = 0;
    let first = false;
    let max_height = 0;
    let newobj = obj3D.clone();
    let last_x = -Infinity;
    let last_y = 4;
    for (let x = 0; x < num; x++) {
        let patch_geo = garment.children[0].children[x].geometry.clone();
        let patch_mtl = Array.isArray(garment.children[0].children[x].material) ? array_default_material_clone(garment.children[0].children[x].material, true) : garment.children[0].children[x].material.clone();

        let geo_uv = patch_geo.getAttribute('uv').array

        if (patch_geo.groups && patch_geo.groups.length > 0) {
            let group_3d = new THREE.Group();
            for (let individual_i = 0; individual_i < patch_geo.groups.length; individual_i++) {
                if (last_x > scale * 5) {
                    last_x = -Infinity;
                    last_y -= max_height * 1.5;
                    max_height = 0
                }
                let individual_patch = individual_garmentToPatch(patch_geo, individual_i, geo_uv)
                let patch_map = new THREE.Mesh(individual_patch, patch_mtl[individual_i]);
                individual_patch.computeBoundingBox();
                let x_max = individual_patch.boundingBox.max.x;
                let y_max = individual_patch.boundingBox.max.y;
                let x_min = individual_patch.boundingBox.min.x;
                let y_min = individual_patch.boundingBox.min.y;
                let radius_x = (x_max - x_min);
                let radius_y = (y_max - y_min);
                max_radius = max_radius < radius_x * scale ? radius_x * scale : max_radius;
                max_radius = max_radius < radius_y * scale ? radius_y * scale : max_radius;
                max_height = max_height < radius_y * scale ? radius_y * scale : max_height;
                if (!first) {
                    last_x = (-radius_x / 2) * scale
                    last_y = (radius_y / 2) * scale
                    first = (-radius_x / 2) * scale;
                }
                last_x = last_x == -Infinity ? first : last_x;
                patch_map.position.set(last_x - x_min * scale, last_y - y_max * scale, 0);
                last_x += (radius_x) * 1.5 * scale;
                patch_map.scale.set(scale, scale, scale);
                patch_map.name = randomString();
                group_3d.add(patch_map);
            }
            group_3d.name = garment.children[0].children[x].name;
            newobj.add(group_3d)
        }
        else {
            if (last_x > scale * 5) {
                last_x = -Infinity;
                last_y -= max_height * 1.5;
                max_height = 0
            }
            patch_geo = individual_garmentToPatch(patch_geo, 0, geo_uv);
            let patch_map = new THREE.Mesh(patch_geo, patch_mtl);
            patch_map.name = garment.children[0].children[x].name;
            patch_geo.computeBoundingBox();
            let x_max = patch_geo.boundingBox.max.x;
            let y_max = patch_geo.boundingBox.max.y;
            let x_min = patch_geo.boundingBox.min.x;
            let y_min = patch_geo.boundingBox.min.y;
            let radius_x = (x_max - x_min);
            let radius_y = (y_max - y_min);
            max_radius = max_radius < radius_x * scale ? radius_x * scale : max_radius;
            max_radius = max_radius < radius_y * scale ? radius_y * scale : max_radius;
            max_height = max_height < radius_y * scale ? radius_y * scale : max_height;
            if (!first) {
                last_x = (-radius_x / 2) * scale
                last_y = (radius_y / 2) * scale
                first = (-radius_x / 2) * scale;
            }
            last_x = last_x == -Infinity ? first * scale : last_x;
            patch_map.position.set(last_x - x_min * scale, last_y - y_max * scale, 0);
            last_x += radius_x * 1.5 * scale;
            patch_map.scale.set(scale, scale, scale);
            newobj.add(patch_map);
        }
    }
    newobj.traverse(function (child) {
        if (child.type === 'Mesh') {
            child.scale.multiplyScalar(scale / max_radius)
            child.position.multiplyScalar(scale / max_radius)
        }
    })
    max_radius = 1;
    return newobj
}

function randomString(e) {
    e = e || 32;
    let t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function randomColor() {
    return Math.random() * 0xccffff
}