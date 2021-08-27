import * as THREE from './three.js/build/three.module.js';
import { GUI } from './js/dat.gui.module.js';
import { CameraControls } from './js/CameraControls.js';
import { TransformControls } from "./js/TransformControls.js";
import { OBJLoader } from "./three.js/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "./three.js/examples/jsm/loaders/MTLLoader.js";
import { EffectComposer } from './three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three.js/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from './three.js/examples/jsm/postprocessing/OutlinePass.js';
import Stats from './three.js/examples/jsm/libs/stats.module.js';

let camera, cameralight, controls, scene, renderer, garment, gui, env_light, stats;
let camera_patch, cameralight_patch, controls_patch, scene_patch, renderer_patch, patch, env_light_patch;
let scene_transform, camera_transform, renderer_transform, controls_transform, arrow, directional_light;
let cut_component;
let obj_vertices_count = 0;
let drawing = false, cover = true;
let draw_line = [];
let old_garment;
let obj3D = new THREE.Object3D();
let progress_obj = 0, progress_mtl = 0;
let patch_panel_width = $("#container_patch").css("width");
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let pointer_patch = new THREE.Vector2();
let original = [];
let selected = [], selected_patch = [];
let cut_obj = [];
let mouse_down = false;
let covered_obj = new THREE.Mesh();
let selected_obj = new THREE.Mesh();
let last_cover = [];
let last_cover_patch = [];
let last_select = [];
let last_select_patch = [];
var max_radius = 0;
var textureloader = new THREE.TextureLoader();
let default_material = new THREE.MeshPhongMaterial({ color: randomColor(), reflectivity: 0.3, side: THREE.DoubleSide })
let obj_size = 1;
let find_new = false;
let pixelRatio = window.devicePixelRatio;
var FPS = 60;
var singleFrameTime = 1 / FPS;
var timeStamp = 0;
var uv_offset = false;
var intersects_scale = false;
var line_geo = new THREE.BufferGeometry();
var line_material = new THREE.LineBasicMaterial({ color: 0xff0000 });
var line = new THREE.Line(line_geo, line_material);
var line1 = new THREE.Line(line_geo.clone(), line_material);
let last_instance_position;
var draw_line_show = [];
var draw_line_show_back = [];
const clock = new THREE.Clock();


let shift = false;
let ctrl = false;
let reset_position = false;
let mouse_position = new THREE.Vector2();
let texture_state = 0;

var url = ""

let composer, outlinePass, outlinePass_select, effectFXAA, composer_patch, outlinePass_patch, outlinePass_patch_select, effectFXAA_patch;
var folder_basic, folder_env, folder_material_global, material_folder, basic_texture, lambert_texture, phong_texture, toon_texture, standard_texture, physical_texture;


var garments_obj = "./leggins/leggins_patch.obj";
var garments_mtl = "./leggins/leggins_patch.obj.mtl";
var garments_mtl = "./leggins/patch.mtl"
var garments_obj = "./leggins/patch.obj"
// var garments_mtl = "./leggins/patch_smooth.mtl"
// var garments_obj = "./leggins/patch_smooth.obj"
var garments_mtl = "./obj/village1/village_final.mtl"
var garments_obj = "./obj/village1/village_final.obj"
// var garments_mtl = "./obj/city2/city2.mtl"
// var garments_obj = "./obj/city2/city2.obj"
var garments_mtl = "./obj/tower/tower3.mtl"
var garments_obj = "./obj/tower/tower3.obj"
// var garments_mtl = "./obj/S/S.mtl"
// var garments_obj = "./obj/S/S.obj"
// var garments_mtl = "./obj/house/house.mtl"
// var garments_obj = "./obj/house/house.obj"
// garments_mtl = false


let outlinePass_params_cover = {
    edgeStrength: 2.0,
    edgeGlow: 0.5,
    edgeThickness: 1,
    pulsePeriod: 0,
    rotate: false,
    usePatternTexture: false,
    visibleEdgeColor: "#cc6666",
    hiddenEdgeColor: "#331818"
};

let outlinePass_params_select = {
    edgeStrength: 3.0,
    edgeGlow: 0.5,
    edgeThickness: 1,
    pulsePeriod: 3.5,
    rotate: false,
    usePatternTexture: false,
    visibleEdgeColor: "#ffffff",
    hiddenEdgeColor: "#444444"
};


var format = '.jpg';
var path1 = "./three.js/examples/textures/cube/Park2/";
var urls1 = [
    path1 + 'posx' + format, path1 + 'negx' + format,
    path1 + 'posy' + format, path1 + 'negy' + format,
    path1 + 'posz' + format, path1 + 'negz' + format
];
var env1 = new THREE.CubeTextureLoader().load(urls1);
var env1_refre = new THREE.CubeTextureLoader().load(urls1);
env1_refre.mapping = THREE.CubeRefractionMapping;

var env2 = textureloader.load('./texture/11.jpg');
env2.mapping = THREE.EquirectangularReflectionMapping;
var env2_refre = textureloader.load('./texture/11.jpg');
env2_refre.mapping = THREE.EquirectangularRefractionMapping;

var env3 = textureloader.load('./texture/7.jpg');
env3.mapping = THREE.EquirectangularReflectionMapping;
var env3_refre = textureloader.load('./texture/7.jpg');
env3_refre.mapping = THREE.EquirectangularRefractionMapping;

var path4 = "./three.js/examples/textures/cube/skyboxsun25deg/";
var urls4 = [
    path4 + 'px' + format, path4 + 'nx' + format,
    path4 + 'py' + format, path4 + 'ny' + format,
    path4 + 'pz' + format, path4 + 'nz' + format
];
var env4 = new THREE.CubeTextureLoader().load(urls4);
var env4_refre = new THREE.CubeTextureLoader().load(urls4);
env4_refre.mapping = THREE.CubeRefractionMapping;

var path5 = "./three.js/examples/textures/cube/Bridge2/";
var urls5 = [
    path5 + 'posx' + format, path5 + 'negx' + format,
    path5 + 'posy' + format, path5 + 'negy' + format,
    path5 + 'posz' + format, path5 + 'negz' + format
];
var env5 = new THREE.CubeTextureLoader().load(urls5);
var env5_refre = new THREE.CubeTextureLoader().load(urls5);
env5_refre.mapping = THREE.CubeRefractionMapping;

var env6 = textureloader.load('./texture/5.jpg');
env6.mapping = THREE.EquirectangularReflectionMapping;
var env6_refre = textureloader.load('./texture/5.jpg');
env6_refre.mapping = THREE.EquirectangularRefractionMapping;

var env7 = textureloader.load('./texture/9.jpg');
env7.mapping = THREE.EquirectangularReflectionMapping;
var env7_refre = textureloader.load('./texture/9.jpg');
env7_refre.mapping = THREE.EquirectangularRefractionMapping;

var path8 = "./three.js/examples/textures/cube/Park3Med/";
var urls8 = [
    path8 + 'px' + format, path8 + 'nx' + format,
    path8 + 'py' + format, path8 + 'ny' + format,
    path8 + 'pz' + format, path8 + 'nz' + format
];
var env8 = new THREE.CubeTextureLoader().load(urls8);
var env8_refre = new THREE.CubeTextureLoader().load(urls8);
env8_refre.mapping = THREE.CubeRefractionMapping;

var env9 = textureloader.load('./texture/4.jpg');
env9.mapping = THREE.EquirectangularReflectionMapping;
var env9_refre = textureloader.load('./texture/4.jpg');
env9_refre.mapping = THREE.EquirectangularRefractionMapping;

var env10 = textureloader.load('./texture/1.jpg');
env10.mapping = THREE.EquirectangularReflectionMapping;
var env10_refre = textureloader.load('./texture/1.jpg');
env10_refre.mapping = THREE.EquirectangularRefractionMapping;

var env11 = textureloader.load('./texture/2.jpg');
env11.mapping = THREE.EquirectangularReflectionMapping;
var env11_refre = textureloader.load('./texture/2.jpg');
env11_refre.mapping = THREE.EquirectangularRefractionMapping;

var env12 = textureloader.load('./texture/3.jpg');
env12.mapping = THREE.EquirectangularReflectionMapping;
var env12_refre = textureloader.load('./texture/3.jpg');
env12_refre.mapping = THREE.EquirectangularRefractionMapping;

var env13 = textureloader.load('./texture/10.jpg');
env13.mapping = THREE.EquirectangularReflectionMapping;
var env13_refre = textureloader.load('./texture/10.jpg');
env13_refre.mapping = THREE.EquirectangularRefractionMapping;

var env14 = textureloader.load('./texture/6.jpg');
env14.mapping = THREE.EquirectangularReflectionMapping;
var env14_refre = textureloader.load('./texture/6.jpg');
env14_refre.mapping = THREE.EquirectangularRefractionMapping;

var env15 = textureloader.load('./texture/8.jpg');
env15.mapping = THREE.EquirectangularReflectionMapping;
var env15_refre = textureloader.load('./texture/8.jpg');
env15_refre.mapping = THREE.EquirectangularRefractionMapping;


var environment = {
    Square: env7, Park: env1, PlayingRoom: env2, Alley: env3, Sky: env4, Bridge: env5, Gallery: env6, None: null, Snow: env8, LivingRoom: env12, Street: env10, Church: env11, Restaurant: env13, BedRoom: env9, BathRoom: env14, Town: env15
}

var environment_light = {
    Square: [0.4, 0.2], Park: [0.4, 0.2], PlayingRoom: [0.6, 0.4], Alley: [0.5, 0.3], Sky: [0.5, 0.7], Bridge: [0.5, 0.2], Gallery: [0.4, 0.6], None: [0.7, 0.3], Snow: [0.4, 0.2], LivingRoom: [0.35, 0.65], Street: [0.4, 0.6], Church: [0.2, 0.8], Restaurant: [0.5, 0.35], BedRoom: [0.4, 0.5], BathRoom: [0.3, 0.7], Town: [0.3, 0.2]
}

var gui_options = {
    Reset_Camera: function () {
        controls.reset();
        controls_patch.reset();
    },
    Unselect: function () {
        select_recovery();
        cover_recovery();
        set_cursor(0)
    },
    reset: function () {
        select_recovery()
        let num = garment.children[0].children.length;
        garment.traverse(function (child) {
            if (child.type === "Mesh") {
                let o;
                for (let original_obj of original) { if (original_obj.name == child.name) { o = original_obj.clone(); break; } }
                if (Array.isArray(child.material)) {
                    for (let m = 0; m < child.material.length; m++) {
                        child.material[m] = o.material[m]
                    }
                }
                else {
                    child.material = o.material
                }
            }
        })
        reload_patch(garment, 1, num);
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
        gui_options.Overall_Reflectivity = NaN
    },
    set_default: function () {
        select_recovery()
        let num = garment.children[0].children.length;
        garment.traverse(function (child) {
            if (child.type === "Mesh") {
                if (Array.isArray(child.material)) {
                    for (let m = 0; m < child.material.length; m++) {
                        let default_set = default_material.clone()
                        default_set.color.set(randomColor())
                        child.material[m] = default_set
                    }
                }
                else {
                    let default_set = default_material.clone()
                    default_set.color.set(randomColor())
                    child.material = default_set
                }
            }
        })
        reload_patch(garment, 1, num);
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]);
        gui_options.Overall_Reflectivity = NaN
    },
    Overall_Reflectivity: 1,
    env: "None",
    Enable_Patch_Background: false,
    cut: false,
    Mode: "Customizing Material",
    focus: false,
    light: "Camera Light",
}




var Materials = {
    'MeshBasicMaterial': {
        color: 0xffffff,
        reflectivity: 0.5,
        wireframe: false,
    },
    'MeshLambertMaterial': {
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 1.0,
        reflectivity: 0.5,
        wireframe: false,
    },
    'MeshPhongMaterial': {
        bumpScale: 1.0,
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 1.0,
        flatShading: false,
        normalScale: new THREE.Vector2(1, 1),//vector2
        reflectivity: 0.5,
        shininess: 30,//0 to 100
        specular: 0x111111,
        wireframe: false,
    },
    'MeshToonMaterial': {
        bumpScale: 1.0,
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 1.0,
        normalScale: new THREE.Vector2(1, 1),//vector2
        wireframe: false,
    },
    'MeshStandardMaterial': {
        bumpScale: 1.0,
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 1.0,
        flatShading: false,
        metalness: 0.0,
        normalScale: new THREE.Vector2(1, 1),//vector2
        roughness: 0.5,
        wireframe: false,
    },
    'MeshPhysicalMaterial': {
        bumpScale: 1.0,
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 1.0,
        flatShading: false,
        metalness: 0.0,
        normalScale: new THREE.Vector2(1, 1),//vector2
        roughness: 0.5,
        wireframe: false,
        clearcoat: 0.0,
        clearcoatRoughness: 0.0,
        reflectivity: 0.5,
        sheenTint: 0x000000,//color
        transmission: 0,
        thickness: 0,
    },
}


var Material_Type_Folder = {
    MeshBasicMaterial: null,
    // MeshDepthMaterial: null,
    MeshLambertMaterial: null,
    MeshPhongMaterial: null,
    MeshToonMaterial: null,
    MeshStandardMaterial: null,
    MeshPhysicalMaterial: null,
}

var Material = {
    reset: function () {
        gui_options.Overall_Reflectivity = NaN
        if (selected.length == 2) {
            let name = selected[0].name
            for (var n of original) {
                if (n.name == name) {
                    selected[0].material[selected[1]] = n.material[selected[1]].clone()
                    selected_patch[0].material = n.material[selected[1]].clone()
                    load_material()

                    Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
                    return;
                }
            }
        }
        else if (selected.length == 1) {
            let name = selected[0].name
            for (var n of original) {
                if (n.name == name) {
                    selected[0].material = n.material.clone()
                    selected_patch[0].material = n.material.clone()
                    load_material()

                    Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
                    return;
                }
            }
        }
        else { return }
    },
    set_default: function () {
        gui_options.Overall_Reflectivity = NaN
        if (selected.length == 2) {
            let default_set = default_material.clone()
            default_set.color.set(randomColor())
            selected[0].material[selected[1]] = default_set
            selected_patch[0].material = selected[0].material[selected[1]].clone()
            load_material()

            Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
            return;

        }
        else if (selected.length == 1) {
            let default_set = default_material.clone()
            default_set.color.set(randomColor())
            selected[0].material = default_set
            selected_patch[0].material = selected[0].material.clone()
            load_material()

            Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
            return;
        }
        else { return }
    },
    material: "MeshPhongMaterial",
    opacity: 1.0,
    transparent: false,
    alphaTest: 0,
    side: "DoubleSide",
    visible: true,
}

var TextureParams = {
    current: "map",
    wrap: "clamp",
    reset_position: function () {
        reset_position = true;
        set_cursor(2);
    },
    remove: function () {

        if (selected.length == 2) {
            selected[0].material[selected[1]] = selected[0].material[selected[1]].clone()
            selected_patch[0].material = selected_patch[0].material.clone()
            selected[0].material[selected[1]][TextureParams.current] = null;
            selected_patch[0].material[TextureParams.current] = null;
        }
        else if (selected.length == 1) {
            selected[0].material = selected[0].material.clone()
            selected_patch[0].material = selected_patch[0].material.clone()
            selected[0].material[TextureParams.current] = null;
            selected_patch[0].material[TextureParams.current] = null;
        }

        Texture_to_GUI()

    },
};



init();
init_patch();
init_transform();
onWindowResize();
animate();

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

    // postprocessing
    composer = new EffectComposer(renderer);
    var renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);
    outlinePass.edgeStrength = outlinePass_params_cover.edgeStrength;
    outlinePass.edgeThickness = outlinePass_params_cover.edgeThickness;
    outlinePass.edgeGlow = outlinePass_params_cover.edgeGlow;
    outlinePass.pulsePeriod = outlinePass_params_cover.pulsePeriod;
    outlinePass.visibleEdgeColor.set(outlinePass_params_cover.visibleEdgeColor);
    outlinePass.hiddenEdgeColor.set(outlinePass_params_cover.hiddenEdgeColor);

    outlinePass_select = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass_select);
    outlinePass_select.edgeStrength = outlinePass_params_select.edgeStrength;
    outlinePass_select.edgeThickness = outlinePass_params_select.edgeThickness;
    outlinePass_select.edgeGlow = outlinePass_params_select.edgeGlow;
    outlinePass_select.pulsePeriod = outlinePass_params_select.pulsePeriod;
    outlinePass_select.visibleEdgeColor.set(outlinePass_params_select.visibleEdgeColor);
    outlinePass_select.hiddenEdgeColor.set(outlinePass_params_select.hiddenEdgeColor);

    composer.setPixelRatio(pixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);
    // controls

    controls = new CameraControls(camera, renderer.domElement);
    controls.dynamicSensitivity = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.rotateSpeed = 1.3;

    garment = obj_loader(garments_obj, garments_mtl, 1, true);
    scene.add(garment);

    scene.add(covered_obj);
    scene.add(line);
    scene.add(line1);


    var helper = new THREE.GridHelper(10, 50, 0x999999, 0x666666);
    helper.position.y = 0;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    directional_light = new THREE.DirectionalLight(0xffffff, 0.8);
    directional_light.castShadow = true;
    directional_light.shadow.camera.near = 0.1;
    directional_light.shadow.camera.far = 9;
    directional_light.shadow.bias = -0.001;
    directional_light.position.set(0, 3, 0);


    window.addEventListener("resize", onWindowResize);
    document.getElementById("container").addEventListener("mousedown", onmouseDown, false);
    document.getElementById("container_patch").addEventListener("mousedown", onmouseDown_patch, false);
    window.addEventListener("mouseup", onmouseUp, false);
    document.addEventListener("mousemove", mouseMove, false);
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    document.getElementById("container").addEventListener("wheel", onMouseWheel, false);


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

    composer_patch = new EffectComposer(renderer_patch);
    var renderPass_patch = new RenderPass(scene_patch, camera_patch);
    composer_patch.addPass(renderPass_patch);

    outlinePass_patch = new OutlinePass(new THREE.Vector2($("#container_patch").width(), window.innerHeight * 0.78), scene_patch, camera_patch);
    composer_patch.addPass(outlinePass_patch);
    outlinePass_patch.edgeStrength = outlinePass_params_cover.edgeStrength * 2;
    outlinePass_patch.edgeThickness = outlinePass_params_cover.edgeThickness * 1.5;
    outlinePass_patch.edgeGlow = outlinePass_params_cover.edgeGlow;
    outlinePass_patch.pulsePeriod = outlinePass_params_cover.pulsePeriod;
    outlinePass_patch.visibleEdgeColor.set(outlinePass_params_cover.visibleEdgeColor);
    outlinePass_patch.hiddenEdgeColor.set(outlinePass_params_cover.hiddenEdgeColor);

    outlinePass_patch_select = new OutlinePass(new THREE.Vector2($("#container_patch").width(), window.innerHeight * 0.78), scene_patch, camera_patch);
    composer_patch.addPass(outlinePass_patch_select);
    outlinePass_patch_select.edgeStrength = outlinePass_params_select.edgeStrength * 2;
    outlinePass_patch_select.edgeThickness = outlinePass_params_select.edgeThickness * 1.5;
    outlinePass_patch_select.edgeGlow = outlinePass_params_select.edgeGlow;
    outlinePass_patch_select.pulsePeriod = outlinePass_params_select.pulsePeriod;
    outlinePass_patch_select.visibleEdgeColor.set(outlinePass_params_select.visibleEdgeColor);
    outlinePass_patch_select.hiddenEdgeColor.set(outlinePass_params_select.hiddenEdgeColor);

    composer_patch.setPixelRatio(pixelRatio);
    composer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);

    controls_patch = new CameraControls(camera_patch, renderer_patch.domElement);

    controls_patch.dynamicSensitivity = false;
    controls_patch.enableDamping = true;
    controls_patch.dampingFactor = 0.15;
    controls_patch.enableKeys = false;

    controls_patch.enableRotate = false;


}

function init_transform() {
    scene_transform = new THREE.Scene();
    renderer_transform = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer_transform.setPixelRatio(pixelRatio);
    renderer_transform.setSize(window.innerHeight / 7, window.innerHeight / 7);
    document.getElementById("transform").appendChild(renderer_transform.domElement);
    camera_transform = new THREE.PerspectiveCamera(
        45,
        1,
        1,
        50
    );
    camera_transform.position.set(0, 0, 20);

    const dir = new THREE.Vector3(0, -1, 0);

    dir.normalize();

    const length = 10;
    const hex = 0xdddddd;

    controls_transform = new TransformControls(camera_transform, renderer_transform.domElement);
    controls_transform.setMode("rotate");
    controls_transform.setSpace("local");
    controls_transform.setSize(3.5);
    controls_transform.setRotationSnap(THREE.MathUtils.degToRad(0.01));

    arrow = new THREE.Object3D();
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(-2.5, 5.0, -2.5), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(-2.5, 5.0, 2.5), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(2.5, 5.0, 2.5), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(2.5, 5.0, -2.5), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(-1.5, 5.0, 0), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(1.5, 5.0, 0), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 5.0, -1.5), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 5.0, 1.5), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(-3.0, 5.0, 0), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(3.0, 5.0, 0), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 5.0, -3.0), length, hex, 0.2 * length, 0.08 * length));
    arrow.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 5.0, 3.0), length, hex, 0.2 * length, 0.08 * length));
    scene_transform.add(arrow);

    controls_transform.attach(arrow);
    scene_transform.add(controls_transform);
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
            old_garment = garment.clone()
            camera.position.set(0, obj_size / 2, obj_size * 2);
            controls.saveState();
            var lack = false;
            var all_empty = true;
            progress_obj = progress_mtl = -1;
            var num = garment.children[0].children.length;

            patch = patch_loader(garment, 1, num);
            patch.name = "patch";
            scene_patch.add(patch);
            camera_patch.position.set(0, 0, 2 * max_radius);
            controls_patch.saveState();
            camera_patch.far = max_radius * 50;
            camera_patch.near = max_radius * 0.01;
            controls_patch.maxZ = max_radius * 20;
            controls_patch.minZ = max_radius * 0.015;
            controls.maxDistance = 5;
            directional_light.shadow.mapSize.width = 4096;
            directional_light.shadow.mapSize.height = 4096;

            directional_light.shadow.camera.left = -obj_size * 1.5;
            directional_light.shadow.camera.right = obj_size * 1.5;
            directional_light.shadow.camera.top = obj_size * 1.5;
            directional_light.shadow.camera.bottom = -obj_size * 1.5;
            for (var i = 0; i < original.length; i++) {
                if (original[i].geometry.groups.length > 0) {
                    original[i].material = original[i].material.slice(0)
                }
            }

            $("#vertice_num").html("<p>Vertices: " + obj_vertices_count + "</p>")
            Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]);
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
            GUI_init();

        }
        else if (progress_obj + progress_mtl == -2 && garment.children[0].children !== undefined) {

            gui.updateDisplay();
            directional_light.position.copy(new THREE.Vector3(0, 3, 0).applyEuler(arrow.rotation));
            camera_transform.rotation.copy(camera.rotation)
            camera_transform.position.copy(new THREE.Vector3(0, 0, 20).applyEuler(camera.rotation))

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
    renderer_transform.render(scene_transform, camera_transform);
    controls.update();
    composer.render();
    if (render_patch_flag) {
        controls_patch.update();
        composer_patch.render();
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
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(pixelRatio);
    renderer_transform.setSize(window.innerHeight / 7, window.innerHeight / 7);
    renderer_transform.setPixelRatio(pixelRatio);

    if (render_patch_flag) {
        camera_patch.aspect = $("#container_patch").width() / window.innerHeight / 0.78;
        camera_patch.updateProjectionMatrix();
        renderer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);
        renderer_patch.setPixelRatio(pixelRatio);
        composer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);
        composer_patch.setPixelRatio(pixelRatio);
    }
}

function onKeyDown(e) {
    switch (e.keyCode) {
        case 16:
            let obj = document.getElementById("panel_box");
            let on_gui = pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)
            let on_transform = gui_options.light === "Directional Light" && pointer.x > - $('#transform').width() / window.innerWidth && pointer.x < $('#transform').width() / window.innerWidth && pointer.y > 1 - (40 + $('#transform').height()) / window.innerHeight * 2
            let on_patch = mouse_position.x > obj.offsetLeft
                && mouse_position.x < (obj.offsetLeft + obj.clientWidth)
                && mouse_position.y > obj.offsetTop
                && mouse_position.y < (obj.offsetTop + obj.clientHeight)
            if (!on_patch && !on_gui && !on_transform
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

function set_cursor(n) {

    if (n === 0) {
        document.getElementById("container").style.cursor = "auto"
    }
    else if (n === 1) {
        document.getElementById("container").style.cursor = "grab"
    }
    else if (n === 2) {
        document.getElementById("container").style.cursor = "pointer"
    }
    else if (n === 3) {
        document.getElementById("container").style.cursor = "grabbing"
    }
    else if (n === 4) {
        document.getElementById("container").style.cursor = "crosshair"
    }
}


function onmouseDown(event) {
    mouse_down = true;

    if (ctrl) {
        return;
    }
    if (event.button == 0) {
        controls.stop = true;
        controls_patch.stop = true;
    }
    if (event.button == 0 && gui_options.cut) {
        if (cut_obj.length > 0) {
            line.geometry.setFromPoints([]);
            line1.geometry.setFromPoints([]);
            draw_line = [];
            draw_line_show = [];
            draw_line_show_back = [];
            mouseMove(event)
            drawing = true;
        } else {
            select_cut(pointer, camera, event);
            if (cut_obj.length > 0) {
                hide_others(garment, cut_obj);
                set_cursor(4)
            }
            if (controls !== undefined) {
                if (cut_obj.length === 1) {
                    controls.target = cut_obj[0].geometry.boundingSphere.center.clone().multiply(cut_obj[0].parent.scale).add(cut_obj[0].parent.position);
                    controls.rotateSpeed = 2.5;
                }
            }
        }
    }
    else if (reset_position) {
        reset_position = false;
        if (shift) { set_cursor(1) } else { set_cursor(0) }
        raycaster.setFromCamera(pointer, camera);
        if (selected.length === 1 || selected.length === 2) var intersects = raycaster.intersectObject(selected_obj, true);
        if (intersects.length > 0) {
            reset_texture_position(intersects)
        }
    }
    else if (shift) {
        event.preventDefault()
        if (event.button == 0) {
            raycaster.setFromCamera(pointer, camera);
            if (selected.length === 1 || selected.length === 2) var intersects = raycaster.intersectObject(selected_obj, true);
            if (intersects.length > 0) {
                texture_state = 1;
                set_cursor(3)
            }
        }
        else if (event.button == 2) {
            raycaster.setFromCamera(pointer, camera);
            if (selected.length === 1 || selected.length === 2) intersects_scale = raycaster.intersectObject(selected_obj, true);
            if (intersects_scale.length > 0) {
                texture_state = 2;
                set_cursor(3)
            }
        }
    }
    else {
        if (event.button == 0) {
            pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

            if (!mouse_down && cover) { cover_recovery(); }
            if (cover) {
                select_material(pointer, camera);
                if (controls !== undefined) {
                    if (selected.length === 1) {
                        controls.target = selected[0].geometry.boundingSphere.center.clone().multiply(selected[0].parent.scale).add(selected[0].parent.position);
                        controls.rotateSpeed = 2.5;
                    } else if (selected.length === 2) {
                        selected_obj.geometry.computeBoundingSphere();
                        controls.target = selected_obj.geometry.boundingSphere.center.clone().multiply(selected_obj.scale).add(selected_obj.position);
                        controls.rotateSpeed = 2.5;
                    }

                }
                if (find_new) {
                    load_material()
                    find_new = false;
                }
            }
            cover = false;
        }
        else if (event.button == 1) { cover = false; }
        else if (event.button == 2) { cover = false; }
    }
}


function onmouseDown_patch(event) {

    mouse_down = true;
    let obj = document.getElementById("panel_box");

    if (ctrl) {
        return;
    }


    if (event.button == 0) {
        pointer_patch.x = (event.clientX / (renderer_patch.domElement.clientWidth)) * 2 - 1;
        pointer_patch.y = - ((event.clientY - obj.offsetTop - document.getElementById("patch_btn").clientHeight) / (renderer_patch.domElement.clientHeight)) * 2 + 1;
        if (!mouse_down && cover) { cover_recovery(); }
        if (cover) {
            select_material_patch(pointer_patch, camera_patch);
            if (controls !== undefined) {
                if (selected.length === 1) {
                    controls.target = selected[0].geometry.boundingSphere.center.clone().multiply(selected[0].parent.scale).add(selected[0].parent.position);
                    controls.rotateSpeed = 2.5;
                } else if (selected.length === 2) {
                    selected_obj.geometry.computeBoundingSphere();
                    controls.target = selected_obj.geometry.boundingSphere.center.clone().multiply(selected_obj.scale).add(selected_obj.position);
                    controls.rotateSpeed = 2.5;
                }

            } if (find_new) {
                load_material()
                find_new = false;
            }
        }
        cover = false;
    }
    else if (event.button == 1) { cover = false; }
    else if (event.button == 2) { cover = false; }

}

function onmouseUp(event) {

    mouse_down = false;
    if (event.button == 0) {
        controls.stop = false;
        controls_patch.stop = false;
    }
    if (event.button == 0 && gui_options.cut) {
        drawing = false;
    }
    else if (shift) {
        texture_state = 0;
        set_cursor(1)
        uv_offset = false;
        intersects_scale = false;
    }
    else {
        if (event.button == 0) {
            cover = true;
            cover_recovery()
        }
        else if (event.button == 1) {
            cover = true;
            cover_recovery()
        }
        else if (event.button == 2) {
            cover = true;
            cover_recovery()
        }
    }
}

function reset_texture_position(intersects) {
    if (intersects.length > 0) {
        var uv_deltaX = -(intersects[0].uv.x - 0.5)
        var uv_deltaY = -(intersects[0].uv.y - 0.5)
        if (selected.length === 1) {
            for (let i = 0; i < selected[0].geometry.attributes.uv.count; i++) {
                selected_obj.geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i) + uv_deltaX)
                selected_obj.geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i) + uv_deltaY)
                selected[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i))
                selected[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i))
                selected_patch[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i))
                selected_patch[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i))
            }
        }
        else if (selected.length === 2) {
            let start = selected[0].geometry.groups[selected[1]].start
            for (let i = start; i < start + selected[0].geometry.groups[selected[1]].count; i++) {
                selected_obj.geometry.attributes.uv.setX(i - start, selected_obj.geometry.attributes.uv.getX(i - start) + uv_deltaX)
                selected_obj.geometry.attributes.uv.setY(i - start, selected_obj.geometry.attributes.uv.getY(i - start) + uv_deltaY)
                selected[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i - start))
                selected[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i - start))
                selected_patch[0].geometry.attributes.uv.setX(i - start, selected_obj.geometry.attributes.uv.getX(i - start))
                selected_patch[0].geometry.attributes.uv.setY(i - start, selected_obj.geometry.attributes.uv.getY(i - start))
            }
        }
        selected[0].geometry.attributes.uv.needsUpdate = true;
        selected_obj.geometry.attributes.uv.needsUpdate = true;
        selected_patch[0].geometry.attributes.uv.needsUpdate = true;
    }

}

function mouseMove(event) {
    let last_position = mouse_position.clone();
    let obj = document.getElementById("panel_box");
    mouse_position.set(event.clientX, event.clientY)
    let deltaX = mouse_position.x - last_position.x
    let deltaY = last_position.y - mouse_position.y

    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    pointer_patch.x = (event.clientX / (renderer_patch.domElement.clientWidth)) * 2 - 1;
    pointer_patch.y = - ((event.clientY - obj.offsetTop - document.getElementById("patch_btn").clientHeight) / (renderer_patch.domElement.clientHeight)) * 2 + 1;


    if (!mouse_down && cover) { cover_recovery(); }

    if (gui_options.cut) {
        if (cut_obj.length > 0) {
            if (drawing) {
                let pointers = []
                if (Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1) {
                    let max_l = Math.max(Math.abs(deltaX), Math.abs(deltaY))*2;
                    for (let i = 1; i <= max_l; i++) {
                        pointers.push(new THREE.Vector2(((last_position.x + (deltaX) / max_l * i) / renderer.domElement.clientWidth) * 2 - 1, -((last_position.y + (-deltaY) / max_l * i) / renderer.domElement.clientHeight) * 2 + 1))
                    }
                }
                draw(pointers, camera, cut_obj)
            }
        }
        else {
            cover_cut(pointer, camera, event);
        }
    }
    else if (shift) {
        if (texture_state === 1) {
            raycaster.setFromCamera(pointer, camera);
            if (selected.length === 1 || selected.length === 2) var intersects = raycaster.intersectObject(selected_obj, true);
            if (intersects.length > 0) {
                if (!uv_offset) uv_offset = intersects[0].uv.clone();
                var uv_deltaX = -(intersects[0].uv.x - uv_offset.x)
                var uv_deltaY = -(intersects[0].uv.y - uv_offset.y)
                uv_offset.copy(intersects[0].uv.add(new THREE.Vector2(uv_deltaX, uv_deltaY)))
                if (selected.length === 1) {
                    for (let i = 0; i < selected[0].geometry.attributes.uv.count; i++) {
                        selected_obj.geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i) + uv_deltaX)
                        selected_obj.geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i) + uv_deltaY)
                        selected[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i))
                        selected[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i))
                        selected_patch[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i))
                        selected_patch[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i))
                    }
                }
                else if (selected.length === 2) {
                    let start = selected[0].geometry.groups[selected[1]].start
                    for (let i = start; i < start + selected[0].geometry.groups[selected[1]].count; i++) {
                        selected_obj.geometry.attributes.uv.setX(i - start, selected_obj.geometry.attributes.uv.getX(i - start) + uv_deltaX)
                        selected_obj.geometry.attributes.uv.setY(i - start, selected_obj.geometry.attributes.uv.getY(i - start) + uv_deltaY)
                        selected[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i - start))
                        selected[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i - start))
                        selected_patch[0].geometry.attributes.uv.setX(i - start, selected_obj.geometry.attributes.uv.getX(i - start))
                        selected_patch[0].geometry.attributes.uv.setY(i - start, selected_obj.geometry.attributes.uv.getY(i - start))
                    }
                }
                selected[0].geometry.attributes.uv.needsUpdate = true;
                selected_obj.geometry.attributes.uv.needsUpdate = true;
                selected_patch[0].geometry.attributes.uv.needsUpdate = true;
            }

        }
        if (texture_state === 2) {
            if (intersects_scale && intersects_scale.length > 0) {
                if (!uv_offset) uv_offset = intersects_scale[0].uv.clone();
                let scale = -(deltaY + deltaX) / 500;
                if (selected.length === 1) {
                    for (let i = 0; i < selected[0].geometry.attributes.uv.count; i++) {
                        selected_obj.geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i) + (selected_obj.geometry.attributes.uv.getX(i) - uv_offset.x) * scale)
                        selected_obj.geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i) + (selected_obj.geometry.attributes.uv.getY(i) - uv_offset.y) * scale)
                        selected[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i))
                        selected[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i))
                        selected_patch[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i))
                        selected_patch[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i))
                    }
                }
                else if (selected.length === 2) {
                    let start = selected[0].geometry.groups[selected[1]].start
                    for (let i = start; i < start + selected[0].geometry.groups[selected[1]].count; i++) {
                        selected_obj.geometry.attributes.uv.setX(i - start, selected_obj.geometry.attributes.uv.getX(i - start) + (selected_obj.geometry.attributes.uv.getX(i - start) - uv_offset.x) * scale)
                        selected_obj.geometry.attributes.uv.setY(i - start, selected_obj.geometry.attributes.uv.getY(i - start) + (selected_obj.geometry.attributes.uv.getY(i - start) - uv_offset.y) * scale)
                        selected[0].geometry.attributes.uv.setX(i, selected_obj.geometry.attributes.uv.getX(i - start))
                        selected[0].geometry.attributes.uv.setY(i, selected_obj.geometry.attributes.uv.getY(i - start))
                        selected_patch[0].geometry.attributes.uv.setX(i - start, selected_obj.geometry.attributes.uv.getX(i - start))
                        selected_patch[0].geometry.attributes.uv.setY(i - start, selected_obj.geometry.attributes.uv.getY(i - start))
                    }
                }
                selected[0].geometry.attributes.uv.needsUpdate = true;
                selected_obj.geometry.attributes.uv.needsUpdate = true;
                selected_patch[0].geometry.attributes.uv.needsUpdate = true;
            }

        }
    }
    else if (cover) {
        cover_material(pointer, camera, pointer_patch, camera_patch, event);
    }
}

function onMouseWheel(e) {
    if (shift && !mouse_down) {
        pointer.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
        pointer.y = - (e.clientY / renderer.domElement.clientHeight) * 2 + 1;
        let rotation = e.deltaY > 0 ? 0.015 : -0.015
        raycaster.setFromCamera(pointer, camera);
        if (selected.length === 1 || selected.length === 2) var intersects = raycaster.intersectObject(selected_obj, true);
        if (intersects.length > 0) {
            set_cursor(3)
            uv_offset = intersects[0].uv.clone();
            if (selected.length === 1) {
                for (let i = 0; i < selected[0].geometry.attributes.uv.count; i++) {
                    let vec2 = new THREE.Vector2(selected_obj.geometry.attributes.uv.getX(i), selected_obj.geometry.attributes.uv.getY(i))
                    vec2.rotateAround(uv_offset, rotation)
                    selected_obj.geometry.attributes.uv.setX(i, vec2.x)
                    selected_obj.geometry.attributes.uv.setY(i, vec2.y)
                    selected[0].geometry.attributes.uv.setX(i, vec2.x)
                    selected[0].geometry.attributes.uv.setY(i, vec2.y)
                    selected_patch[0].geometry.attributes.uv.setX(i, vec2.x)
                    selected_patch[0].geometry.attributes.uv.setY(i, vec2.y)
                }
            }
            else if (selected.length === 2) {
                let start = selected[0].geometry.groups[selected[1]].start
                for (let i = start; i < start + selected[0].geometry.groups[selected[1]].count; i++) {
                    let vec2 = new THREE.Vector2(selected_obj.geometry.attributes.uv.getX(i - start), selected_obj.geometry.attributes.uv.getY(i - start))
                    vec2.rotateAround(uv_offset, rotation)
                    selected_obj.geometry.attributes.uv.setX(i - start, vec2.x)
                    selected_obj.geometry.attributes.uv.setY(i - start, vec2.y)
                    selected[0].geometry.attributes.uv.setX(i, vec2.x)
                    selected[0].geometry.attributes.uv.setY(i, vec2.y)
                    selected_patch[0].geometry.attributes.uv.setX(i - start, vec2.x)
                    selected_patch[0].geometry.attributes.uv.setY(i - start, vec2.y)
                }
            }
            selected[0].geometry.attributes.uv.needsUpdate = true;
            selected_obj.geometry.attributes.uv.needsUpdate = true;
            selected_patch[0].geometry.attributes.uv.needsUpdate = true;
            uv_offset = false;
        }

    }
}


function cover_recovery() {
    covered_obj.traverse(function (obj) {
        if (obj.type === 'Mesh') {
            obj.geometry.dispose();
            obj.material.dispose();
        }
    })
    scene.remove(covered_obj);
    outlinePass.selectedObjects = []
    outlinePass_patch.selectedObjects = []
    last_cover = []
    last_cover_patch = []
}

function select_recovery() {
    selected_obj.traverse(function (obj) {
        if (obj.type === 'Mesh') {
            obj.geometry.dispose();
            obj.material.dispose();
        }
    })
    scene.remove(selected_obj);
    show_all(garment);
    material_folder.hide()
    outlinePass_select.selectedObjects = []
    outlinePass_patch_select.selectedObjects = []
    last_select = []
    last_select_patch = []
    selected = []
    selected_patch = []
    cut_obj = []
    line.geometry.setFromPoints([]);
    line1.geometry.setFromPoints([]);
    draw_line = [];
    draw_line_show = [];
    draw_line_show_back = [];
    if (controls !== undefined) {
        controls.target = false;
        controls.rotateSpeed = 1.3;
    }
    url = ""
    let liStr = "";
    $('.list-drag').html(liStr);
    $(".tip").show();
}

function draw(pointers, camera, cut_obj) {
    for (let pointer of pointers) {
        raycaster.setFromCamera(pointer, camera);
        var intersects = raycaster.intersectObject(cut_obj[0], true);
        if (intersects.length > 0) {
            let distance = Math.min(2.5,camera.position.distanceTo(intersects[0].point))
            draw_line.push(intersects[0].point)
            draw_line_show.push(intersects[0].point.clone().add(intersects[0].face.normal.clone().setLength(0.0001)))
            draw_line_show_back.push(intersects[0].point.clone().add(intersects[0].face.normal.clone().setLength(0.0001).negate()))
            if (draw_line.length == 1) {
                let position=intersects[0].point.clone();
                last_instance_position = position.clone()
            }
            if (draw_line.length > 1 && intersects[0].point.distanceTo(last_instance_position) >= 0.001 * Math.max(0.5, distance)) {
                let a = Math.floor(intersects[0].point.distanceTo(last_instance_position) / 0.001 / Math.max(0.5, distance))
                if (a < 5) {
                    let position = intersects[0].point.clone();
                    last_instance_position = position.clone()
                } else if (draw_line.length == 2) {
                    draw_line.pop()
                    draw_line.pop()
                    draw_line_show.pop()
                    draw_line_show.pop()
                    draw_line_show_back.pop()
                    draw_line_show_back.pop()
                } else {
                    draw_line.pop()
                    draw_line_show.pop()
                    draw_line_show_back.pop()
                }
            }
            line.geometry.setFromPoints(draw_line_show)
            line.frustumCulled = false;
            line1.geometry.setFromPoints(draw_line_show_back)
            line1.frustumCulled = false;
        }
    }
}

function cover_material(cover_pointer, cover_camera, cover_pointer_patch, cover_camera_patch, event) {

    let on_gui = pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)
    let on_transform = gui_options.light === "Directional Light" && pointer.x > - $('#transform').width() / window.innerWidth && pointer.x < $('#transform').width() / window.innerWidth && pointer.y > 1 - (40 + $('#transform').height()) / window.innerHeight * 2
    if (on_gui || on_transform) {
        cover_recovery();
        return;
    }
    if (progress_obj + progress_mtl != -2) {
        cover_recovery();
        return;
    }
    let obj = document.getElementById("panel_box");
    if (event.clientX > obj.offsetLeft
        && event.clientX < (obj.offsetLeft + obj.clientWidth)
        && event.clientY > obj.offsetTop
        && event.clientY < (obj.offsetTop + obj.clientHeight)) {

        raycaster.setFromCamera(cover_pointer_patch, cover_camera_patch);
        var intersects = raycaster.intersectObject(patch, true);
        if (intersects.length > 0) {
            if (intersects[0].object.parent instanceof THREE.Group) {
                var i = 0;
                for (i = 0; i < intersects[0].object.parent.children.length; i++) {
                    if (intersects[0].object.parent.children[i].name == intersects[0].object.name) { break; }
                }
                if (last_cover_patch.length != 1 || (last_cover_patch[0] != intersects[0].object)) {
                    covered_obj.traverse(function (obj) {
                        if (obj.type === 'Mesh') {
                            obj.geometry.dispose();
                            obj.material.dispose();
                        }
                    })
                    scene.remove(covered_obj);
                    outlinePass_patch.selectedObjects = [intersects[0].object];
                    last_cover_patch = []
                    last_cover_patch.push(intersects[0].object)

                    garment.traverse(function (obj) {
                        if (obj.type === "Mesh") {
                            if (obj.name == intersects[0].object.parent.name) {
                                var this_scale = obj.parent.scale;
                                var this_position = obj.parent.position;
                                var g = individual(obj.geometry, i)
                                covered_obj = new THREE.Mesh(g);
                                covered_obj.material.transparent = true;
                                covered_obj.material.opacity = 0;
                                covered_obj.scale.set(this_scale.x, this_scale.y, this_scale.z);
                                covered_obj.position.set(this_position.x, this_position.y, this_position.z);
                                scene.add(covered_obj)
                                outlinePass.selectedObjects = [covered_obj];
                            }
                        }
                    })
                }
            }
            else {
                if (last_cover_patch.length != 1 || (last_cover_patch[0] != intersects[0].object)) {
                    outlinePass_patch.selectedObjects = [intersects[0].object];
                    last_cover_patch = []
                    last_cover_patch.push(intersects[0].object)
                    garment.traverse(function (obj) {
                        if (obj.type === "Mesh" && obj.name == intersects[0].object.name) {
                            outlinePass.selectedObjects = [obj];
                        }
                    })
                }
            }
        } else { cover_recovery() }
    } else {
        raycaster.setFromCamera(cover_pointer, cover_camera);
        var intersects = raycaster.intersectObject(garment, true);
        if (intersects.length > 0) {
            var group_num = intersects[0].object.geometry.groups.length;
            var vertice_index = intersects[0].face.a;
            var i = 0;
            var num = patch ? patch.children.length : 0;
            if (group_num > 0) {
                for (i = 0; i < group_num; i++) {
                    if (intersects[0].object.geometry.groups[i].start <= vertice_index && (vertice_index < (intersects[0].object.geometry.groups[i].start + intersects[0].object.geometry.groups[i].count))) { break; }
                }
                if (last_cover.length != 2 || last_cover[1] != i || (last_cover[0] != intersects[0].object)) {
                    covered_obj.traverse(function (obj) {
                        if (obj.type === 'Mesh') {
                            obj.geometry.dispose();
                            obj.material.dispose();
                        }
                    })
                    scene.remove(covered_obj);
                    var this_scale = intersects[0].object.parent.scale;
                    var this_position = intersects[0].object.parent.position;
                    var g = individual(intersects[0].object.geometry, i)
                    covered_obj = new THREE.Mesh(g);
                    covered_obj.material.transparent = true;
                    covered_obj.material.opacity = 0;
                    covered_obj.scale.set(this_scale.x, this_scale.y, this_scale.z);
                    covered_obj.position.set(this_position.x, this_position.y, this_position.z);
                    scene.add(covered_obj)
                    outlinePass.selectedObjects = [covered_obj];
                    last_cover = []
                    last_cover.push(intersects[0].object, i)

                    for (var x = 0; x < num; x++) {
                        if (patch && intersects[0].object.name == patch.children[x].name) {
                            outlinePass_patch.selectedObjects = [patch.children[x].children[i]];
                            break;
                        }
                    }
                }
            }
            else {
                if (last_cover.length != 1 || (last_cover[0] != intersects[0].object)) {
                    outlinePass.selectedObjects = [intersects[0].object];
                    last_cover = []
                    last_cover.push(intersects[0].object)

                    for (var x = 0; x < num; x++) {
                        if (patch && intersects[0].object.name == patch.children[x].name) {
                            outlinePass_patch.selectedObjects = [patch.children[x]];
                            break;
                        }
                    }
                }
            }
        } else { cover_recovery() }
    }
}

function cover_cut(cover_pointer, cover_camera, event) {
    if (cut_obj.length > 0) return;

    let on_gui = pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)
    let on_transform = gui_options.light === "Directional Light" && pointer.x > - $('#transform').width() / window.innerWidth && pointer.x < $('#transform').width() / window.innerWidth && pointer.y > 1 - (40 + $('#transform').height()) / window.innerHeight * 2

    if (on_gui || on_transform) {
        cover_recovery();
        return;
    }
    if (progress_obj + progress_mtl != -2) {
        cover_recovery();
        return;
    }
    let obj = document.getElementById("panel_box");
    if (event.clientX < obj.offsetLeft
        || event.clientX > (obj.offsetLeft + obj.clientWidth)
        || event.clientY < obj.offsetTop
        || event.clientY > (obj.offsetTop + obj.clientHeight)) {
        raycaster.setFromCamera(cover_pointer, cover_camera);
        var intersects = raycaster.intersectObject(garment, true);
        if (intersects.length > 0) {
            var num = patch ? patch.children.length : 0;

            if (last_cover.length != 1 || (last_cover[0] != intersects[0].object)) {
                outlinePass.selectedObjects = [intersects[0].object];
                last_cover = []
                last_cover.push(intersects[0].object)

                for (var x = 0; x < num; x++) {
                    if (patch && intersects[0].object.name == patch.children[x].name) {
                        outlinePass_patch.selectedObjects = [patch.children[x]];
                        break;
                    }
                }
            }

        } else { cover_recovery() }
    }
}


function select_material(cover_pointer, cover_camera) {
    if (progress_obj + progress_mtl != -2) {
        select_recovery();
        return;
    }

    raycaster.setFromCamera(cover_pointer, cover_camera);
    var intersects = raycaster.intersectObject(garment, true);
    if (intersects.length > 0) {
        var group_num = intersects[0].object.geometry.groups.length;
        var vertice_index = intersects[0].face.a;
        var i = 0;
        var num = patch ? patch.children.length : 0;
        if (group_num > 0) {
            for (i = 0; i < group_num; i++) {
                if (intersects[0].object.geometry.groups[i].start <= vertice_index && (vertice_index < (intersects[0].object.geometry.groups[i].start + intersects[0].object.geometry.groups[i].count))) { break; }
            }
            if (last_select.length != 2 || last_select[1] != i || last_select[0] != intersects[0].object) {
                select_recovery()
                find_new = true;
                selected = [intersects[0].object, i]
                selected_obj.traverse(function (obj) {
                    if (obj.type === 'Mesh') {
                        obj.geometry.dispose();
                        obj.material.dispose();
                    }
                })
                scene.remove(selected_obj);
                var this_scale = intersects[0].object.parent.scale;
                var this_position = intersects[0].object.parent.position;
                var g = individual(intersects[0].object.geometry, i)
                selected_obj = new THREE.Mesh(g);
                selected_obj.material.transparent = true;
                selected_obj.material.opacity = 0;
                selected_obj.scale.set(this_scale.x, this_scale.y, this_scale.z);
                selected_obj.position.set(this_position.x, this_position.y, this_position.z);
                scene.add(selected_obj)
                outlinePass_select.selectedObjects = [selected_obj];
                last_select = []
                last_select_patch = []
                last_select.push(intersects[0].object, i)

                for (var x = 0; x < num; x++) {
                    if (patch && intersects[0].object.name == patch.children[x].name) {
                        selected_patch = [patch.children[x].children[i]];
                        outlinePass_patch_select.selectedObjects = [patch.children[x].children[i]];
                        break;
                    }
                }
            }
        }
        else {
            if (last_select.length != 1 || last_select[0] != intersects[0].object) {
                select_recovery()
                find_new = true;
                selected = [intersects[0].object];
                selected_obj.traverse(function (obj) {
                    if (obj.type === 'Mesh') {
                        obj.geometry.dispose();
                        obj.material.dispose();
                    }
                })
                scene.remove(selected_obj);
                var this_scale = intersects[0].object.parent.scale;
                var this_position = intersects[0].object.parent.position;
                var g = individual(intersects[0].object.geometry, i)
                selected_obj = new THREE.Mesh(g);
                selected_obj.material.transparent = true;
                selected_obj.material.opacity = 0;
                selected_obj.scale.set(this_scale.x, this_scale.y, this_scale.z);
                selected_obj.position.set(this_position.x, this_position.y, this_position.z);
                scene.add(selected_obj)
                outlinePass_select.selectedObjects = [intersects[0].object];
                last_select = []
                last_select_patch = []
                last_select.push(intersects[0].object)

                for (var x = 0; x < num; x++) {
                    if (patch && intersects[0].object.name == patch.children[x].name) {
                        selected_patch = [patch.children[x]];
                        outlinePass_patch_select.selectedObjects = [patch.children[x]];
                        break;
                    }
                }
            }
        }
    } else { select_recovery() }
}

function select_material_patch(cover_pointer_patch, cover_camera_patch) {
    if (progress_obj + progress_mtl != -2) {
        select_recovery();
        return;
    }
    raycaster.setFromCamera(cover_pointer_patch, cover_camera_patch);
    var intersects = raycaster.intersectObject(patch, true);
    if (intersects.length > 0) {
        if (intersects[0].object.parent instanceof THREE.Group) {
            var i = 0;
            for (i = 0; i < intersects[0].object.parent.children.length; i++) {
                if (intersects[0].object.parent.children[i].name == intersects[0].object.name) { break; }
            }
            if (last_select_patch.length != 1 || (last_select_patch[0] != intersects[0].object)) {
                select_recovery()
                find_new = true;
                selected_patch = [intersects[0].object];
                selected_obj.traverse(function (obj) {
                    if (obj.type === 'Mesh') {
                        obj.geometry.dispose();
                        obj.material.dispose();
                    }
                })
                scene.remove(selected_obj);
                outlinePass_patch_select.selectedObjects = [intersects[0].object];
                last_select_patch = []
                last_select = []
                last_select_patch.push(intersects[0].object)

                garment.traverse(function (obj) {
                    if (obj.type === "Mesh") {
                        if (obj.name == intersects[0].object.parent.name) {
                            selected = [obj, i]
                            var this_scale = obj.parent.scale;
                            var this_position = obj.parent.position;
                            var g = individual(obj.geometry, i)
                            selected_obj = new THREE.Mesh(g);
                            selected_obj.material.transparent = true;
                            selected_obj.material.opacity = 0;
                            selected_obj.scale.set(this_scale.x, this_scale.y, this_scale.z);
                            selected_obj.position.set(this_position.x, this_position.y, this_position.z);
                            scene.add(selected_obj)
                            outlinePass_select.selectedObjects = [selected_obj];
                        }
                    }
                })
            }
        }
        else {
            if (last_select_patch.length != 1 || (last_select_patch[0] != intersects[0].object)) {
                select_recovery()
                find_new = true;
                outlinePass_patch_select.selectedObjects = [intersects[0].object];
                last_select_patch = []
                last_select = []
                last_select_patch.push(intersects[0].object)
                selected_patch = [intersects[0].object];
                garment.traverse(function (obj) {
                    if (obj.type === "Mesh" && obj.name == intersects[0].object.name) {
                        outlinePass_select.selectedObjects = [obj];
                        selected = [obj];
                        selected_obj.traverse(function (obj) {
                            if (obj.type === 'Mesh') {
                                obj.geometry.dispose();
                                obj.material.dispose();
                            }
                        })
                        scene.remove(selected_obj);
                        var this_scale = obj.parent.scale;
                        var this_position = obj.parent.position;
                        var g = individual(obj.geometry, i)
                        selected_obj = new THREE.Mesh(g);
                        selected_obj.material.transparent = true;
                        selected_obj.material.opacity = 0;
                        selected_obj.scale.set(this_scale.x, this_scale.y, this_scale.z);
                        selected_obj.position.set(this_position.x, this_position.y, this_position.z);
                        scene.add(selected_obj)
                    }
                })
            }
        }
    } else { select_recovery() }
}


function select_cut(cover_pointer, cover_camera, event) {
    if (progress_obj + progress_mtl != -2) {
        select_recovery();
        return;
    }
    let obj = document.getElementById("panel_box");
    if (event.clientX < obj.offsetLeft
        || event.clientX > (obj.offsetLeft + obj.clientWidth)
        || event.clientY < obj.offsetTop
        || event.clientY > (obj.offsetTop + obj.clientHeight))
        raycaster.setFromCamera(cover_pointer, cover_camera);
    var intersects = raycaster.intersectObject(garment, true);
    if (intersects.length > 0) {
        var num = patch ? patch.children.length : 0;

        if (last_select.length != 1 || last_select[0] != intersects[0].object) {
            // if (Array.isArray(intersects[0].object.material)) {
            //     for (let m = 0; m < intersects[0].object.material.length; m++) {
            //         let default_set = default_material.clone()
            //         default_set.color.set(randomColor())
            //         intersects[0].object.material[m] = default_set
            //     }
            // }
            // else {
            //     let default_set = default_material.clone()
            //     default_set.color.set(randomColor())
            //     intersects[0].object.material = default_set
            // }
            // for (let o = 0; o < original.length; o++) {
            //     if (original[o].name === intersects[0].object.name) {
            //         original[o].geometry.dispose()
            //         if (Array.isArray(original[o].material)) {
            //             for (let m = 0; m < original[o].material.length; m++) {
            //                 original[o].material[m].dispose()
            //             }
            //         } else { original[o].material.dispose() }
            //         original[o] = intersects[0].object.clone()
            //     }
            // }
            cut_obj = [intersects[0].object];
            outlinePass_select.selectedObjects = [intersects[0].object];
            last_select = []
            last_select_patch = []
            last_select.push(intersects[0].object)

            for (var x = 0; x < num; x++) {
                if (patch && intersects[0].object.name == patch.children[x].name) {
                    outlinePass_patch_select.selectedObjects = [patch.children[x]];
                    break;
                }
            }
        }

    }

}

function hide_others(garment, cut_obj) {
    gui_options.focus = true;
    if (Array.isArray(cut_obj[0].material)) {
        for (let i in cut_obj[0].material) {
            cut_obj[0].material[i] = cut_obj[0].material[i].clone()
        }
    } else { cut_obj[0].material = cut_obj[0].material.clone() }

    garment.traverse(function (child) {
        if (child.type === "Mesh" && child !== cut_obj[0]) {
            if (Array.isArray(child.material)) {
                for (let i in child.material) {
                    child.material[i].visible = false;
                }
            }
            else {
                child.material.visible = false;
            }
        }
    })
}

function show_all(garment) {
    gui_options.focus = false;
    garment.traverse(function (child) {
        if (child.type === "Mesh") {
            if (Array.isArray(child.material)) {
                for (let i of child.material) {
                    i.visible = true;
                }
            }
            else {
                child.material.visible = true;
            }
        }
    })
}


function individual(bufGeom, ig) {
    try {
        var groups = bufGeom.groups;
        var origVerts = bufGeom.getAttribute('position').array;
        var origNormals = bufGeom.getAttribute('normal').array;
        var origUVs = bufGeom.getAttribute('uv').array;

        if (groups.length > 0) { var group = groups[ig]; }
        else { var group = { start: 0, count: bufGeom.getAttribute('position').count } }

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newNormals = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexOrig = 3 * (group.start + iv);
            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;
            newPositions[indexDest] = origVerts[indexOrig];
            newPositions[indexDest + 1] = origVerts[indexOrig + 1];
            newPositions[indexDest + 2] = origVerts[indexOrig + 2];

            newNormals[indexDest] = origNormals[indexOrig];
            newNormals[indexDest + 1] = origNormals[indexOrig + 1];
            newNormals[indexDest + 2] = origNormals[indexOrig + 2];

            newUVs[indexDestUV] = origUVs[indexOrigUV];
            newUVs[indexDestUV + 1] = origUVs[indexOrigUV + 1];

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));

        return newBufGeom;
    }
    catch (e) {
        var groups = bufGeom.groups;
        var origVerts = bufGeom.getAttribute('position').array;
        var origNormals = bufGeom.getAttribute('normal').array;

        if (groups.length > 0) { var group = groups[ig]; }
        else { var group = { start: 0, count: bufGeom.getAttribute('position').count } }

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newNormals = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexOrig = 3 * (group.start + iv);
            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;
            newPositions[indexDest] = origVerts[indexOrig];
            newPositions[indexDest + 1] = origVerts[indexOrig + 1];
            newPositions[indexDest + 2] = origVerts[indexOrig + 2];

            newNormals[indexDest] = origNormals[indexOrig];
            newNormals[indexDest + 1] = origNormals[indexOrig + 1];
            newNormals[indexDest + 2] = origNormals[indexOrig + 2];

            newUVs[indexDestUV] = 0;
            newUVs[indexDestUV + 1] = 0;

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));

        return newBufGeom;
    }
}

function individual_garmentToPatch(bufGeom, ig) {
    try {
        var groups = bufGeom.groups;
        var origNormals = bufGeom.getAttribute('normal').array;
        var origUVs = bufGeom.getAttribute('uv').array;

        if (groups.length > 0) { var group = groups[ig]; }
        else { var group = { start: 0, count: bufGeom.getAttribute('position').count } }

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newNormals = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexOrig = 3 * (group.start + iv);
            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;
            newPositions[indexDest] = origUVs[indexOrigUV];
            newPositions[indexDest + 1] = origUVs[indexOrigUV + 1];
            newPositions[indexDest + 2] = 0;

            newNormals[indexDest] = origNormals[indexOrig];
            newNormals[indexDest + 1] = origNormals[indexOrig + 1];
            newNormals[indexDest + 2] = origNormals[indexOrig + 2];

            newUVs[indexDestUV] = origUVs[indexOrigUV];
            newUVs[indexDestUV + 1] = origUVs[indexOrigUV + 1];

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));

        return newBufGeom;
    }
    catch (e) {
        var groups = bufGeom.groups;
        var origNormals = bufGeom.getAttribute('normal').array;

        if (groups.length > 0) { var group = groups[ig]; }
        else { var group = { start: 0, count: bufGeom.getAttribute('position').count } }

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newNormals = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexOrig = 3 * (group.start + iv);
            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;
            newPositions[indexDest] = 0;
            newPositions[indexDest + 1] = 0;
            newPositions[indexDest + 2] = 0;

            newNormals[indexDest] = 0;
            newNormals[indexDest + 1] = 0;
            newNormals[indexDest + 2] = 0;

            newUVs[indexDestUV] = 0;
            newUVs[indexDestUV + 1] = 0;

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));

        return newBufGeom;
    }


}


function seperateGroups(bufGeom) {
    var outGeometries = [];
    var groups = bufGeom.groups;

    var origVerts = bufGeom.getAttribute('position').array;
    var origNormals = bufGeom.getAttribute('normal').array;
    var origUVs = bufGeom.getAttribute('uv').array;
    for (var ig = 0, ng = groups.length; ig < ng; ig++) {
        var group = groups[ig];

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newNormals = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexOrig = 3 * (group.start + iv);
            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;

            newPositions[indexDest] = origVerts[indexOrig];
            newPositions[indexDest + 1] = origVerts[indexOrig + 1];
            newPositions[indexDest + 2] = origVerts[indexOrig + 2];

            newNormals[indexDest] = origNormals[indexOrig];
            newNormals[indexDest + 1] = origNormals[indexOrig + 1];
            newNormals[indexDest + 2] = origNormals[indexOrig + 2];

            newUVs[indexDestUV] = origUVs[indexOrigUV];
            newUVs[indexDestUV + 1] = origUVs[indexOrigUV + 1];

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));

        outGeometries.push(newBufGeom);

    }
    return outGeometries;

}

function seperateGroups_garmentToPatch(bufGeom) {
    var outGeometries = [];
    var groups = bufGeom.groups;

    var origNormals = bufGeom.getAttribute('normal').array;
    var origUVs = bufGeom.getAttribute('uv').array;
    for (var ig = 0, ng = groups.length; ig < ng; ig++) {
        var group = groups[ig];

        var destNumVerts = group.count;

        var newBufGeom = new THREE.BufferGeometry();
        var newPositions = new Float32Array(destNumVerts * 3);
        var newNormals = new Float32Array(destNumVerts * 3);
        var newUVs = new Float32Array(destNumVerts * 2);

        for (var iv = 0; iv < destNumVerts; iv++) {

            var indexOrig = 3 * (group.start + iv);
            var indexDest = 3 * iv;

            var indexOrigUV = 2 * (group.start + iv);
            var indexDestUV = 2 * iv;

            newPositions[indexDest] = origUVs[indexOrigUV];
            newPositions[indexDest + 1] = origUVs[indexOrigUV + 1];
            newPositions[indexDest + 2] = 0;

            newNormals[indexDest] = origNormals[indexOrig];
            newNormals[indexDest + 1] = origNormals[indexOrig + 1];
            newNormals[indexDest + 2] = origNormals[indexOrig + 2];

            newUVs[indexDestUV] = origUVs[indexOrigUV];
            newUVs[indexDestUV + 1] = origUVs[indexOrigUV + 1];

        }

        newBufGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newBufGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
        newBufGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));

        outGeometries.push(newBufGeom);

    }
    return outGeometries;

}



function Display(show_env, patch_env, light) {
    if (show_env) {
        scene.background = show_env;
        cameralight.intensity = light[0]
        directional_light.intensity = light[0]
        env_light.intensity = light[1]
        if (garment !== undefined) {
            garment.traverse(function (child) {
                if (child.material !== undefined) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(function (m) {
                            if (m.envMap !== undefined) { m.envMap = show_env; m.combine = THREE.MixOperation; }
                        })
                    } else {
                        if (child.material.envMap !== undefined) {
                            child.material.envMap = show_env; child.material.combine = THREE.MixOperation;
                        }
                    }
                }
            })
        }
        if (patch_env) {
            scene_patch.background = show_env;
            cameralight_patch.intensity = light[0]
            env_light_patch.intensity = light[1]
            if (patch !== undefined) {
                patch.traverse(function (child) {
                    if (child.material !== undefined) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(function (m) {
                                if (m.envMap !== undefined) { m.envMap = show_env; m.combine = THREE.MixOperation; }
                            })
                        } else {
                            if (child.material.envMap !== undefined) {
                                child.material.envMap = show_env; child.material.combine = THREE.MixOperation;
                            }
                        }
                    }
                })
            }
        } else {
            scene_patch.background = null;
            cameralight_patch.intensity = environment_light.None[0]
            env_light_patch.intensity = environment_light.None[1]
            if (patch !== undefined) {
                patch.traverse(function (child) {
                    if (child.material !== undefined) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(function (m) {
                                if (m.envMap !== undefined) {
                                    m.envMap = null;
                                }
                            })
                        } else {
                            if (child.material.envMap !== undefined) { child.material.envMap = null; }
                        }
                    }
                })
            }
        }
    }
    else {
        scene.background = new THREE.Color(0x181818);
        cameralight.intensity = environment_light.None[0]
        directional_light.intensity = environment_light.None[0]
        env_light.intensity = environment_light.None[1]
        if (garment !== undefined) {
            garment.traverse(function (child) {
                if (child.material !== undefined) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(function (m) {
                            if (m.envMap !== undefined) {
                                m.envMap = null;
                            }
                        })
                    } else {
                        if (child.material.envMap !== undefined) { child.material.envMap = null; }
                    }
                }
            })
        }
        scene_patch.background = null;
        cameralight_patch.intensity = environment_light.None[0]
        env_light_patch.intensity = environment_light.None[1]
        if (patch !== undefined) {
            patch.traverse(function (child) {
                if (child.material !== undefined) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(function (m) {
                            if (m.envMap !== undefined) {
                                m.envMap = null;
                            }
                        })
                    } else {
                        if (child.material.envMap !== undefined) { child.material.envMap = null; }
                    }
                }
            })
        }
    }
}


function obj_loader(url_obj, url_mtl, scale, double = true) {
    original = []
    let onProgress_obj = function (xhr) {
        if (xhr.lengthComputable) {
            let percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded(obj)");
            progress_obj = Math.round(percentComplete, 2);
        }
    };
    let onProgress_mtl = function (xhr) {
        if (xhr.lengthComputable) {
            let percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded(mtl)");
            progress_mtl = Math.round(percentComplete, 2);
        }
    };
    let newobj = obj3D.clone();
    let newmtl = new MTLLoader();
    if (double) {
        newmtl.setMaterialOptions({ side: THREE.DoubleSide });
    }
    if (!url_mtl) {
        progress_mtl = 100
        let objLoader = new OBJLoader();
        objLoader.load(
            url_obj,
            function (root) {
                let x_max = -Infinity, x_min = Infinity, y_max = -Infinity, y_min = Infinity, z_max = -Infinity, z_min = Infinity;
                root.traverse(function (child) {
                    if (child.type === 'Mesh') {
                        child.name = randomString();
                        original.push(child.clone())
                        obj_vertices_count += child.geometry.attributes.position.count;
                        child.material = []
                        if (child.geometry.groups.length > 0) {
                            for (let group_i = 0; group_i < child.geometry.groups.length; group_i++) {
                                let default_m = default_material.clone()
                                if (!double) { default_m.side = THREE.FrontSide }
                                default_m.color.set(randomColor())
                                child.material.push(default_m);
                            }
                        }
                        else {
                            let default_m = default_material.clone()
                            if (!double) { default_m.side = THREE.FrontSide }
                            default_m.color.set(randomColor())
                            child.material = default_m;
                        }
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.geometry.computeFaceNormals();

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
                root.position.set(-(x_min + x_max) / 2 / scale_value, -y_min / scale_value, -(z_min + z_max) / 2 / scale_value);
                root.scale.set(scale / scale_value, scale / scale_value, scale / scale_value);
                newobj.add(root);
            },
            onProgress_obj
        );
        return newobj;
    }
    else {
        newmtl.load(
            url_mtl,
            (mtl) => {
                mtl.preload();
                let objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load(
                    url_obj,
                    function (root) {
                        let x_max = -Infinity, x_min = Infinity, y_max = -Infinity, y_min = Infinity, z_max = -Infinity, z_min = Infinity;
                        root.traverse(function (child) {
                            if (child.type === 'Mesh') {
                                child.name = randomString();
                                original.push(child.clone())
                                obj_vertices_count += child.geometry.attributes.position.count;
                                if (!Array.isArray(child.material) && child.material.envMap !== undefined) { child.material.envMap = null }
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
                        root.position.set(-(x_min + x_max) / 2 / scale_value, -y_min / scale_value, -(z_min + z_max) / 2 / scale_value);
                        root.scale.set(scale / scale_value, scale / scale_value, scale / scale_value);
                        newobj.add(root);
                    },
                    onProgress_obj
                );
            },
            onProgress_mtl
        );
        return newobj;
    }
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


function patch_loader(garment, scale, num) {
    max_radius = 0;
    let first = false;
    let max_height = 0;
    let newobj = obj3D.clone();
    let last_x = -Infinity;
    let last_y = 4;
    for (let x = 0; x < num; x++) {
        let patch_geo = garment.children[0].children[x].geometry.clone();
        let patch_mtl = Array.isArray(garment.children[0].children[x].material) ? array_default_material_clone(garment.children[0].children[x].material, true) : garment.children[0].children[x].material.clone();

        if (patch_geo.groups && patch_geo.groups.length > 0) {
            let group_3d = new THREE.Group();
            for (let individual_i = 0; individual_i < patch_geo.groups.length; individual_i++) {
                if (last_x > scale * 5) {
                    last_x = -Infinity;
                    last_y -= max_height * 1.5;
                    max_height = 0
                }
                let individual_patch = individual_garmentToPatch(patch_geo, individual_i)
                let normals = [];
                let individual_uv = individual_patch.attributes.uv.array;
                for (let i = 0; i < individual_uv.length; i++) {
                    if ((i + 1) % 6 == 0) {
                        let x1 = individual_uv[i - 5]
                        let y1 = individual_uv[i - 4]
                        let x2 = individual_uv[i - 3]
                        let y2 = individual_uv[i - 2]
                        let x3 = individual_uv[i - 1]
                        let y3 = individual_uv[i]
                        let a = y3 - y1
                        let b = x1 - x3
                        let c = x3 * y1 - x1 * y3
                        if (a * x2 + b * y2 + c >= 0) {
                            normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
                        } else {
                            normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
                        }
                    }
                }
                individual_patch.deleteAttribute("normal");
                individual_patch.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
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
            patch_geo = individual_garmentToPatch(patch_geo, 0);
            let normals = [];
            let patch_geo_uv = patch_geo.attributes.uv.array;
            for (let i = 0; i < patch_geo_uv.length; i++) {
                if ((i + 1) % 6 == 0) {
                    let x1 = patch_geo_uv[i - 5]
                    let y1 = patch_geo_uv[i - 4]
                    let x2 = patch_geo_uv[i - 3]
                    let y2 = patch_geo_uv[i - 2]
                    let x3 = patch_geo_uv[i - 1]
                    let y3 = patch_geo_uv[i]
                    let a = y3 - y1
                    let b = x1 - x3
                    let c = x3 * y1 - x1 * y3
                    if (a * x2 + b * y2 + c >= 0) {
                        normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
                    } else {
                        normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
                    }
                }
            }
            patch_geo.deleteAttribute("normal");
            patch_geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
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


function reload_patch(garment, scale, num) {
    patch.traverse(function (child) {
        if (child.type === "Mesh") {
            child.geometry.dispose()
            if (Array.isArray(child.material)) {
                for (let m = 0; m < child.material.length; m++) {
                    child.material[m].dispose()
                }
            } else { child.material.dispose() }
        }
    })
    scene_patch.remove(patch)
    patch = patch_loader(garment, scale, num);
    patch.name = "patch";
    scene_patch.add(patch);
}





function GUI_init() {
    gui = new GUI({ width: 300, autoPlace: false, scrollable: true })

    document.getElementById('gui_container_gui').appendChild(gui.domElement);

    folder_basic = gui.addFolder("Basic")
    folder_basic.add(gui_options, 'Mode', ["Customizing Material", "Cutting Model"]).name("Mode").onChange(() => Change_Mode());
    folder_basic.add(gui_options, 'light', ["Camera Light", "Directional Light"]).onChange(() => Change_Light(gui_options.light));
    folder_basic.add(gui_options, 'Reset_Camera').name("Reset Camera");
    cut_component = folder_basic.addFolder("Cutting Control");
    cut_component.add(gui_options, 'Unselect');
    cut_component.add(gui_options, 'focus').name("Focus Mode").onChange(() => { if (gui_options.focus && cut_obj.length === 1) { hide_others(garment, cut_obj) } else { show_all(garment) } });
    cut_component.open();
    cut_component.hide();
    folder_basic.open()

    folder_env = gui.addFolder("Environment")
    folder_env.add(gui_options, "env", ["None", "Sky", "Alley", "LivingRoom", "BedRoom", "PlayingRoom", 'Street', 'Town', "Park", "Snow", "Bridge", "Restaurant"]).name("Background").onChange(() => Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]))
    folder_env.add(gui_options, 'Enable_Patch_Background').name("Patch Background").onChange(() => Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]));
    folder_env.add(gui_options, 'Overall_Reflectivity', 0, 1, 0.01).onChange(() => Reflectivity()).name('Reflectivity');
    // other options: "BathRoom", 'Church', "Gallery", "Square"

    // folder_material_global = gui.addFolder("Material Global Settings")
    // folder_material_global.add(gui_options, "reset").name('Materials Recovery')
    // folder_material_global.add(gui_options, "set_default").name('Random Materials')
    // folder_material_global.open()
    folder_env.open()

    material_folder = gui.addFolder("Material")
    material_folder.add(Material, "reset").name('Materials Recovery')
    material_folder.add(Material, "set_default").name('Random Material')
    material_folder.add(Material, "material", [...Object.keys(Materials)]).onChange(() => Change_material());
    //material_folder.add(Material, "alphaTest", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //material_folder.add(Material, "side", ["FrontSide", "BackSide", "DoubleSide"]).onChange(() => Material_Update_Param())
    //material_folder.add(Material, "visible").onChange(() => Material_Update_Param())
    material_folder.open()
    material_folder.hide()

    Material_Type_Folder.MeshBasicMaterial = material_folder.addFolder("Basic Material")
    Material_Type_Folder.MeshBasicMaterial.addColor(Materials.MeshBasicMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshBasicMaterial.add(Materials.MeshBasicMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshBasicMaterial.add(Material, "transparent").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshBasicMaterial.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshBasicMaterial.add(Materials.MeshBasicMaterial, "wireframe").onChange(() => Material_Update_Param())
    basic_texture = Material_Type_Folder.MeshBasicMaterial.addFolder("Texture")
    basic_texture.add(TextureParams, "current", ['map', 'alphaMap', 'specularMap']).name("map").onChange(() => Texture_to_GUI())
    basic_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    basic_texture.add(TextureParams, "reset_position").name("Reset Position")
    basic_texture.add(TextureParams, "remove").name("Remove Texture")
    basic_texture.open()
    Material_Type_Folder.MeshBasicMaterial.open()


    Material_Type_Folder.MeshLambertMaterial = material_folder.addFolder("Lambert Material")
    Material_Type_Folder.MeshLambertMaterial.addColor(Materials.MeshLambertMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.addColor(Materials.MeshLambertMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.add(Materials.MeshLambertMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshLambertMaterial.add(Material, "transparent").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.add(Materials.MeshLambertMaterial, "wireframe").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshLambertMaterial.add(Materials.MeshLambertMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    lambert_texture = Material_Type_Folder.MeshLambertMaterial.addFolder("Texture")
    lambert_texture.add(TextureParams, "current", ['map', 'alphaMap', 'specularMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    lambert_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    lambert_texture.add(TextureParams, "reset_position").name("Reset Position")
    lambert_texture.add(TextureParams, "remove").name("Remove Texture")
    lambert_texture.open()
    Material_Type_Folder.MeshLambertMaterial.open()


    Material_Type_Folder.MeshPhongMaterial = material_folder.addFolder("Phong Material")
    Material_Type_Folder.MeshPhongMaterial.addColor(Materials.MeshPhongMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.addColor(Materials.MeshPhongMaterial, "specular").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.addColor(Materials.MeshPhongMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "shininess", 0, 200, 1).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Material, "transparent").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "wireframe").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    phong_texture = Material_Type_Folder.MeshPhongMaterial.addFolder("Texture")
    phong_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', 'specularMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    phong_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    phong_texture.add(TextureParams, "reset_position").name("Reset Position")
    phong_texture.add(TextureParams, "remove").name("Remove Texture")
    phong_texture.open()
    Material_Type_Folder.MeshPhongMaterial.open()


    Material_Type_Folder.MeshToonMaterial = material_folder.addFolder("Toon Material")
    Material_Type_Folder.MeshToonMaterial.addColor(Materials.MeshToonMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.addColor(Materials.MeshToonMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Material, "transparent").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial, "wireframe").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    toon_texture = Material_Type_Folder.MeshToonMaterial.addFolder("Texture")
    toon_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    toon_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    toon_texture.add(TextureParams, "reset_position").name("Reset Position")
    toon_texture.add(TextureParams, "remove").name("Remove Texture")
    toon_texture.open()
    Material_Type_Folder.MeshToonMaterial.open()


    Material_Type_Folder.MeshStandardMaterial = material_folder.addFolder("Standard Material")
    Material_Type_Folder.MeshStandardMaterial.addColor(Materials.MeshStandardMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.addColor(Materials.MeshStandardMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "metalness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "roughness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Material, "transparent").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "wireframe").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    standard_texture = Material_Type_Folder.MeshStandardMaterial.addFolder("Texture")
    standard_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    standard_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    standard_texture.add(TextureParams, "reset_position").name("Reset Position")
    standard_texture.add(TextureParams, "remove").name("Remove Texture")
    standard_texture.open()
    Material_Type_Folder.MeshStandardMaterial.open()


    Material_Type_Folder.MeshPhysicalMaterial = material_folder.addFolder("Physical Material")
    Material_Type_Folder.MeshPhysicalMaterial.addColor(Materials.MeshPhysicalMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.addColor(Materials.MeshPhysicalMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.addColor(Materials.MeshPhysicalMaterial, "sheenTint").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "metalness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "roughness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "clearcoat", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "clearcoatRoughness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "transmission", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "thickness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Material, "transparent").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "wireframe").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    //Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    physical_texture = Material_Type_Folder.MeshPhysicalMaterial.addFolder("Texture")
    physical_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    physical_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    physical_texture.add(TextureParams, "reset_position").name("Reset Position")
    physical_texture.add(TextureParams, "remove").name("Remove Texture")
    physical_texture.open()
    Material_Type_Folder.MeshPhysicalMaterial.open()


    Change_Mode()
    gui_options.Overall_Reflectivity = NaN

}


function Change_Light(light) {
    if (light === "Camera Light") {
        scene.remove(directional_light);
        camera.remove(cameralight);
        camera.add(cameralight);
        $("#transform").fadeOut();
    }
    if (light === "Directional Light") {
        scene.remove(directional_light);
        camera.remove(cameralight);
        scene.add(directional_light);
        $("#transform").fadeIn();
    }
}


function Reflectivity() {
    if (gui_options.Overall_Reflectivity === NaN) return;
    garment.traverse(function (child) {
        if (child.type === "Mesh") {
            if (Array.isArray(child.material)) {
                for (let m = 0; m < child.material.length; m++) {
                    child.material[m] = child.material[m].clone()
                    if (child.material[m].reflectivity !== undefined) child.material[m].reflectivity = gui_options.Overall_Reflectivity
                }
            } else {
                child.material = child.material.clone()
                if (child.material.reflectivity !== undefined) child.material.reflectivity = gui_options.Overall_Reflectivity
            }
        }
    })
    patch.traverse(function (child) {
        if (child.type === "Mesh") {
            if (Array.isArray(child.material)) {
                for (let m = 0; m < child.material.length; m++) {
                    child.material[m] = child.material[m].clone()
                    if (child.material[m].reflectivity !== undefined) child.material[m].reflectivity = gui_options.Overall_Reflectivity
                }
            } else {
                child.material = child.material.clone()
                if (child.material.reflectivity !== undefined) child.material.reflectivity = gui_options.Overall_Reflectivity
            }
        }
    })

    Materials.MeshBasicMaterial.reflectivity = gui_options.Overall_Reflectivity
    Materials.MeshLambertMaterial.reflectivity = gui_options.Overall_Reflectivity
    Materials.MeshPhongMaterial.reflectivity = gui_options.Overall_Reflectivity
    Materials.MeshPhysicalMaterial.reflectivity = gui_options.Overall_Reflectivity

    if (selected.length == 2 || selected.length == 1) {
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
    }
}


function Texture_to_GUI() {
    let obj_material
    if (selected.length == 2) { obj_material = selected[0].material[selected[1]] }
    else if (selected.length == 1) { obj_material = selected[0].material }
    else {
        url = ""
        let liStr = "";
        $('.list-drag').html(liStr);
        $(".tip").show();
        return
    }

    let current = TextureParams.current
    if (!obj_material[current]) {
        url = ""
        let liStr = "";
        $('.list-drag').html(liStr);
        $(".tip").show();
        return;
    }
    TextureParams.wrap = obj_material[current].wrapS === THREE.ClampToEdgeWrapping ? "clamp" : obj_material[current].wrapS === THREE.MirroredRepeatWrapping ? "mirror" : "repeat"
    url = obj_material[current].image.src
    let liStr = `<img src="${url}"/>`;
    $('.list-drag').html(liStr);
    $(".tip").hide();
    GUI_to_Texture()

}

function GUI_to_Texture() {
    let obj_material
    if (selected.length == 2) { obj_material = selected[0].material[selected[1]].clone() }
    else if (selected.length == 1) { obj_material = selected[0].material.clone() }
    else return
    let current = TextureParams.current
    if (url) {
        obj_material[current] = textureloader.load(url)
        obj_material[current].wrapS = obj_material[current].wrapT = TextureParams.wrap === "clamp" ? THREE.ClampToEdgeWrapping : TextureParams.wrap === "mirror" ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping
    } else {
        obj_material[current] = null
    }
    if (selected.length == 2) {
        selected[0].material[selected[1]] = obj_material
        selected_patch[0].material = obj_material.clone()
    }
    else if (selected.length == 1) {
        selected[0].material = obj_material
        selected_patch[0].material = obj_material.clone()
    }
    Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
}

function Obj_to_GUI(obj_material) {
    obj_material = obj_material.clone();
    Material.opacity = obj_material.opacity
    Material.transparent = obj_material.transparent
    Material.alphaTest = obj_material.alphaTest
    Material.side = obj_material.side === THREE.FrontSide ? "FrontSide" : obj_material.side === THREE.BackSide ? "BackSide" : "DoubleSide"
    Material.visible = obj_material.visible
    TextureParams.current = "map"
    Texture_to_GUI()

    switch (Material.material) {
        case "MeshBasicMaterial":
            Materials.MeshBasicMaterial.color = obj_material.color.getHex()
            Materials.MeshBasicMaterial.reflectivity = obj_material.reflectivity
            Materials.MeshBasicMaterial.wireframe = obj_material.wireframe
            break;

        case "MeshLambertMaterial":
            Materials.MeshLambertMaterial.color = obj_material.color.getHex()
            Materials.MeshLambertMaterial.emissive = obj_material.emissive.getHex()
            Materials.MeshLambertMaterial.emissiveIntensity = obj_material.emissiveIntensity
            Materials.MeshLambertMaterial.reflectivity = obj_material.reflectivity
            Materials.MeshLambertMaterial.wireframe = obj_material.wireframe
            break;

        case "MeshPhongMaterial":
            Materials.MeshPhongMaterial.color = obj_material.color.getHex()
            Materials.MeshPhongMaterial.emissive = obj_material.emissive.getHex()
            Materials.MeshPhongMaterial.specular = obj_material.specular.getHex()
            Materials.MeshPhongMaterial.emissiveIntensity = obj_material.emissiveIntensity
            Materials.MeshPhongMaterial.bumpScale = obj_material.bumpScale
            Materials.MeshPhongMaterial.flatShading = obj_material.flatShading
            Materials.MeshPhongMaterial.normalScale.set(obj_material.normalScale.x, obj_material.normalScale.y)
            Materials.MeshPhongMaterial.reflectivity = obj_material.reflectivity
            Materials.MeshPhongMaterial.shininess = obj_material.shininess
            Materials.MeshPhongMaterial.wireframe = obj_material.wireframe
            break;

        case "MeshToonMaterial":
            Materials.MeshToonMaterial.color = obj_material.color.getHex()
            Materials.MeshToonMaterial.emissive = obj_material.emissive.getHex()
            Materials.MeshToonMaterial.emissiveIntensity = obj_material.emissiveIntensity
            Materials.MeshToonMaterial.bumpScale = obj_material.bumpScale
            Materials.MeshToonMaterial.normalScale.set(obj_material.normalScale.x, obj_material.normalScale.y)
            Materials.MeshToonMaterial.wireframe = obj_material.wireframe
            break;

        case "MeshStandardMaterial":
            Materials.MeshStandardMaterial.color = obj_material.color.getHex()
            Materials.MeshStandardMaterial.emissive = obj_material.emissive.getHex()
            Materials.MeshStandardMaterial.emissiveIntensity = obj_material.emissiveIntensity
            Materials.MeshStandardMaterial.bumpScale = obj_material.bumpScale
            Materials.MeshStandardMaterial.flatShading = obj_material.flatShading
            Materials.MeshStandardMaterial.normalScale.set(obj_material.normalScale.x, obj_material.normalScale.y)
            Materials.MeshStandardMaterial.metalness = obj_material.metalness
            Materials.MeshStandardMaterial.roughness = obj_material.roughness
            Materials.MeshStandardMaterial.wireframe = obj_material.wireframe
            break;

        case "MeshPhysicalMaterial":
            Materials.MeshPhysicalMaterial.color = obj_material.color.getHex()
            Materials.MeshPhysicalMaterial.sheenTint = obj_material.sheenTint.getHex()
            Materials.MeshPhysicalMaterial.emissive = obj_material.emissive.getHex()
            Materials.MeshPhysicalMaterial.emissiveIntensity = obj_material.emissiveIntensity
            Materials.MeshPhysicalMaterial.bumpScale = obj_material.bumpScale
            Materials.MeshPhysicalMaterial.flatShading = obj_material.flatShading
            Materials.MeshPhysicalMaterial.clearcoat = obj_material.clearcoat
            Materials.MeshPhysicalMaterial.clearcoatRoughness = obj_material.clearcoatRoughness
            Materials.MeshPhysicalMaterial.reflectivity = obj_material.reflectivity
            Materials.MeshPhysicalMaterial.transmission = obj_material.transmission
            Materials.MeshPhysicalMaterial.thickness = obj_material.thickness
            Materials.MeshPhysicalMaterial.normalScale.set(obj_material.normalScale.x, obj_material.normalScale.y)
            Materials.MeshPhysicalMaterial.metalness = obj_material.metalness
            Materials.MeshPhysicalMaterial.roughness = obj_material.roughness
            Materials.MeshPhysicalMaterial.wireframe = obj_material.wireframe
            break;
    }
}

function Material_Update(reflectivity_change = false) {
    if (reflectivity_change) {
        gui_options.Overall_Reflectivity = NaN
    }
    if (selected.length == 2) {
        material_folder.show()
        GUI_to_Obj(selected[0].material[selected[1]])

    }
    else if (selected.length == 1) {
        material_folder.show()
        GUI_to_Obj(selected[0].material)

    }
}


function Material_Update_Param(reflectivity_change = false) {
    if (reflectivity_change) {
        gui_options.Overall_Reflectivity = NaN
    }
    if (selected.length == 2) {
        material_folder.show()
        GUI_to_Obj_Param(selected[0].material[selected[1]], selected_patch[0].material)

    }
    else if (selected.length == 1) {
        material_folder.show()
        GUI_to_Obj_Param(selected[0].material, selected_patch[0].material)

    }
}

function GUI_to_Obj_Param(obj_material, obj_material1) {
    if (Material.material === "MeshPhysicalMaterial" && Materials.MeshPhysicalMaterial.transmission > 0 && Material.opacity < 1) {
        Material.opacity = 1;
        $("#alert_transmission").html('<div id="transmission_alert" class="alert alert-info fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Notice!&nbsp;</b></strong>Enable transmission will disable opacity! To adjustment opacity, please set transmission to 0!&nbsp;&nbsp;</div>');
        setTimeout(function () { $("#transmission_alert").fadeOut(500); }, 3000)
        setTimeout(function () { $("#alert_transmission").html("") }, 3500)
    }

    obj_material.opacity = Material.opacity
    obj_material.transparent = Material.transparent
    obj_material.alphaTest = Material.alphaTest
    obj_material.side = Material.side === "FrontSide" ? THREE.FrontSide : Material.side === "BackSide" ? THREE.BackSide : THREE.DoubleSide
    obj_material.visible = Material.visible
    obj_material1.opacity = Material.opacity
    obj_material1.transparent = Material.transparent
    obj_material1.alphaTest = Material.alphaTest
    obj_material1.side = Material.side === "FrontSide" ? THREE.FrontSide : Material.side === "BackSide" ? THREE.BackSide : THREE.DoubleSide
    obj_material1.visible = Material.visible

    switch (Material.material) {
        case "MeshBasicMaterial":
            obj_material.color.setHex(Materials.MeshBasicMaterial.color)
            obj_material.reflectivity = Materials.MeshBasicMaterial.reflectivity
            obj_material.wireframe = Materials.MeshBasicMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshBasicMaterial.color)
            obj_material1.reflectivity = Materials.MeshBasicMaterial.reflectivity
            obj_material1.wireframe = Materials.MeshBasicMaterial.wireframe
            break;

        case "MeshLambertMaterial":
            obj_material.color.setHex(Materials.MeshLambertMaterial.color)
            obj_material.emissive.setHex(Materials.MeshLambertMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshLambertMaterial.emissiveIntensity
            obj_material.reflectivity = Materials.MeshLambertMaterial.reflectivity
            obj_material.wireframe = Materials.MeshLambertMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshLambertMaterial.color)
            obj_material1.emissive.setHex(Materials.MeshLambertMaterial.emissive)
            obj_material1.emissiveIntensity = Materials.MeshLambertMaterial.emissiveIntensity
            obj_material1.reflectivity = Materials.MeshLambertMaterial.reflectivity
            obj_material1.wireframe = Materials.MeshLambertMaterial.wireframe
            break;

        case "MeshPhongMaterial":
            obj_material.color.setHex(Materials.MeshPhongMaterial.color)
            obj_material.emissive.setHex(Materials.MeshPhongMaterial.emissive)
            obj_material.specular.setHex(Materials.MeshPhongMaterial.specular)
            obj_material.emissiveIntensity = Materials.MeshPhongMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshPhongMaterial.bumpScale
            obj_material.flatShading = Materials.MeshPhongMaterial.flatShading
            obj_material.normalScale.set(Materials.MeshPhongMaterial.normalScale.x, Materials.MeshPhongMaterial.normalScale.y)
            obj_material.reflectivity = Materials.MeshPhongMaterial.reflectivity
            obj_material.shininess = Materials.MeshPhongMaterial.shininess
            obj_material.wireframe = Materials.MeshPhongMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshPhongMaterial.color)
            obj_material1.emissive.setHex(Materials.MeshPhongMaterial.emissive)
            obj_material1.specular.setHex(Materials.MeshPhongMaterial.specular)
            obj_material1.emissiveIntensity = Materials.MeshPhongMaterial.emissiveIntensity
            obj_material1.bumpScale = Materials.MeshPhongMaterial.bumpScale
            obj_material1.flatShading = Materials.MeshPhongMaterial.flatShading
            obj_material1.normalScale.set(Materials.MeshPhongMaterial.normalScale.x, Materials.MeshPhongMaterial.normalScale.y)
            obj_material1.reflectivity = Materials.MeshPhongMaterial.reflectivity
            obj_material1.shininess = Materials.MeshPhongMaterial.shininess
            obj_material1.wireframe = Materials.MeshPhongMaterial.wireframe
            break;

        case "MeshToonMaterial":
            obj_material.color.setHex(Materials.MeshToonMaterial.color)
            obj_material.emissive.setHex(Materials.MeshToonMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshToonMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshToonMaterial.bumpScale
            obj_material.normalScale.set(Materials.MeshToonMaterial.normalScale.x, Materials.MeshToonMaterial.normalScale.y)
            obj_material.wireframe = Materials.MeshToonMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshToonMaterial.color)
            obj_material1.emissive.setHex(Materials.MeshToonMaterial.emissive)
            obj_material1.emissiveIntensity = Materials.MeshToonMaterial.emissiveIntensity
            obj_material1.bumpScale = Materials.MeshToonMaterial.bumpScale
            obj_material1.normalScale.set(Materials.MeshToonMaterial.normalScale.x, Materials.MeshToonMaterial.normalScale.y)
            obj_material1.wireframe = Materials.MeshToonMaterial.wireframe
            break;

        case "MeshStandardMaterial":
            obj_material.color.setHex(Materials.MeshStandardMaterial.color)
            obj_material.emissive.setHex(Materials.MeshStandardMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshStandardMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshStandardMaterial.bumpScale
            obj_material.flatShading = Materials.MeshStandardMaterial.flatShading
            obj_material.normalScale.set(Materials.MeshStandardMaterial.normalScale.x, Materials.MeshStandardMaterial.normalScale.y)
            obj_material.metalness = Materials.MeshStandardMaterial.metalness
            obj_material.roughness = Materials.MeshStandardMaterial.roughness
            obj_material.wireframe = Materials.MeshStandardMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshStandardMaterial.color)
            obj_material1.emissive.setHex(Materials.MeshStandardMaterial.emissive)
            obj_material1.emissiveIntensity = Materials.MeshStandardMaterial.emissiveIntensity
            obj_material1.bumpScale = Materials.MeshStandardMaterial.bumpScale
            obj_material1.flatShading = Materials.MeshStandardMaterial.flatShading
            obj_material1.normalScale.set(Materials.MeshStandardMaterial.normalScale.x, Materials.MeshStandardMaterial.normalScale.y)
            obj_material1.metalness = Materials.MeshStandardMaterial.metalness
            obj_material1.roughness = Materials.MeshStandardMaterial.roughness
            obj_material1.wireframe = Materials.MeshStandardMaterial.wireframe
            break;

        case "MeshPhysicalMaterial":
            obj_material.color.setHex(Materials.MeshPhysicalMaterial.color)
            if (obj_material.sheenTint) obj_material.sheenTint.setHex(Materials.MeshPhysicalMaterial.sheenTint)
            else obj_material.sheenTint = new THREE.Color(Materials.MeshPhysicalMaterial.sheenTint)
            obj_material.emissive.setHex(Materials.MeshPhysicalMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshPhysicalMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshPhysicalMaterial.bumpScale
            obj_material.flatShading = Materials.MeshPhysicalMaterial.flatShading
            obj_material.clearcoat = Materials.MeshPhysicalMaterial.clearcoat
            obj_material.clearcoatRoughness = Materials.MeshPhysicalMaterial.clearcoatRoughness
            obj_material.reflectivity = Materials.MeshPhysicalMaterial.reflectivity
            obj_material.transmission = Materials.MeshPhysicalMaterial.transmission
            obj_material.thickness = Materials.MeshPhysicalMaterial.thickness
            obj_material.normalScale.set(Materials.MeshPhysicalMaterial.normalScale.x, Materials.MeshPhysicalMaterial.normalScale.y)
            obj_material.metalness = Materials.MeshPhysicalMaterial.metalness
            obj_material.roughness = Materials.MeshPhysicalMaterial.roughness
            obj_material.wireframe = Materials.MeshPhysicalMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshPhysicalMaterial.color)
            if (obj_material1.sheenTint) obj_material1.sheenTint.setHex(Materials.MeshPhysicalMaterial.sheenTint)
            else obj_material1.sheenTint = new THREE.Color(Materials.MeshPhysicalMaterial.sheenTint)
            obj_material1.emissive.setHex(Materials.MeshPhysicalMaterial.emissive)
            obj_material1.emissiveIntensity = Materials.MeshPhysicalMaterial.emissiveIntensity
            obj_material1.bumpScale = Materials.MeshPhysicalMaterial.bumpScale
            obj_material1.flatShading = Materials.MeshPhysicalMaterial.flatShading
            obj_material1.clearcoat = Materials.MeshPhysicalMaterial.clearcoat
            obj_material1.clearcoatRoughness = Materials.MeshPhysicalMaterial.clearcoatRoughness
            obj_material1.reflectivity = Materials.MeshPhysicalMaterial.reflectivity
            obj_material1.transmission = Materials.MeshPhysicalMaterial.transmission
            obj_material1.thickness = Materials.MeshPhysicalMaterial.thickness
            obj_material1.normalScale.set(Materials.MeshPhysicalMaterial.normalScale.x, Materials.MeshPhysicalMaterial.normalScale.y)
            obj_material1.metalness = Materials.MeshPhysicalMaterial.metalness
            obj_material1.roughness = Materials.MeshPhysicalMaterial.roughness
            obj_material1.wireframe = Materials.MeshPhysicalMaterial.wireframe
            break;
    }
}



function GUI_to_Obj(obj_material_original) {
    let obj_material = obj_material_original.clone()
    obj_material.opacity = Material.opacity
    obj_material.transparent = Material.transparent
    obj_material.alphaTest = Material.alphaTest
    obj_material.side = Material.side === "FrontSide" ? THREE.FrontSide : Material.side === "BackSide" ? THREE.BackSide : THREE.DoubleSide
    obj_material.visible = Material.visible


    switch (Material.material) {
        case "MeshBasicMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshBasicMaterial.color)
            obj_material.reflectivity = Materials.MeshBasicMaterial.reflectivity
            obj_material.wireframe = Materials.MeshBasicMaterial.wireframe
            break;

        case "MeshLambertMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshLambertMaterial.color)
            obj_material.emissive.setHex(Materials.MeshLambertMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshLambertMaterial.emissiveIntensity
            obj_material.reflectivity = Materials.MeshLambertMaterial.reflectivity
            obj_material.wireframe = Materials.MeshLambertMaterial.wireframe
            break;

        case "MeshPhongMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshPhongMaterial.color)
            obj_material.emissive.setHex(Materials.MeshPhongMaterial.emissive)
            obj_material.specular.setHex(Materials.MeshPhongMaterial.specular)
            obj_material.emissiveIntensity = Materials.MeshPhongMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshPhongMaterial.bumpScale
            obj_material.flatShading = Materials.MeshPhongMaterial.flatShading
            obj_material.normalScale.set(Materials.MeshPhongMaterial.normalScale.x, Materials.MeshPhongMaterial.normalScale.y)
            obj_material.reflectivity = Materials.MeshPhongMaterial.reflectivity
            obj_material.shininess = Materials.MeshPhongMaterial.shininess
            obj_material.wireframe = Materials.MeshPhongMaterial.wireframe
            break;

        case "MeshToonMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshToonMaterial({ side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshToonMaterial.color)
            obj_material.emissive.setHex(Materials.MeshToonMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshToonMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshToonMaterial.bumpScale
            obj_material.normalScale.set(Materials.MeshToonMaterial.normalScale.x, Materials.MeshToonMaterial.normalScale.y)
            obj_material.wireframe = Materials.MeshToonMaterial.wireframe
            break;

        case "MeshStandardMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshStandardMaterial.color)
            obj_material.emissive.setHex(Materials.MeshStandardMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshStandardMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshStandardMaterial.bumpScale
            obj_material.flatShading = Materials.MeshStandardMaterial.flatShading
            obj_material.normalScale.set(Materials.MeshStandardMaterial.normalScale.x, Materials.MeshStandardMaterial.normalScale.y)
            obj_material.metalness = Materials.MeshStandardMaterial.metalness
            obj_material.roughness = Materials.MeshStandardMaterial.roughness
            obj_material.wireframe = Materials.MeshStandardMaterial.wireframe
            break;

        case "MeshPhysicalMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshPhysicalMaterial.color)
            if (obj_material.sheenTint) obj_material.sheenTint.setHex(Materials.MeshPhysicalMaterial.sheenTint)
            else obj_material.sheenTint = new THREE.Color(Materials.MeshPhysicalMaterial.sheenTint)
            obj_material.emissive.setHex(Materials.MeshPhysicalMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshPhysicalMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshPhysicalMaterial.bumpScale
            obj_material.flatShading = Materials.MeshPhysicalMaterial.flatShading
            obj_material.clearcoat = Materials.MeshPhysicalMaterial.clearcoat
            obj_material.clearcoatRoughness = Materials.MeshPhysicalMaterial.clearcoatRoughness
            obj_material.reflectivity = Materials.MeshPhysicalMaterial.reflectivity
            obj_material.transmission = Materials.MeshPhysicalMaterial.transmission
            obj_material.thickness = Materials.MeshPhysicalMaterial.thickness
            obj_material.normalScale.set(Materials.MeshPhysicalMaterial.normalScale.x, Materials.MeshPhysicalMaterial.normalScale.y)
            obj_material.metalness = Materials.MeshPhysicalMaterial.metalness
            obj_material.roughness = Materials.MeshPhysicalMaterial.roughness
            obj_material.wireframe = Materials.MeshPhysicalMaterial.wireframe
            break;
    }
    if (selected.length == 2) {
        selected[0].material[selected[1]] = obj_material
        selected_patch[0].material = obj_material
    }
    else if (selected.length == 1) {
        selected[0].material = obj_material
        selected_patch[0].material = obj_material
    }
    GUI_to_Texture()
}

function load_material() {
    if (selected.length == 2) {
        selected[0].material[selected[1]] = selected[0].material[selected[1]].clone()
        selected_patch[0].material = selected_patch[0].material.clone()
        Material.material = selected[0].material[selected[1]].type;
        for (var eachtype of Object.keys(Material_Type_Folder)) { if (Material.material != eachtype) Material_Type_Folder[eachtype].hide() }
        Material_Type_Folder[Material.material].show()
        material_folder.show()
        Obj_to_GUI(selected[0].material[selected[1]])

    }
    else if (selected.length == 1) {
        selected[0].material = selected[0].material.clone()
        selected_patch[0].material = selected_patch[0].material.clone()
        Material.material = selected[0].material.type;
        for (var eachtype of Object.keys(Material_Type_Folder)) { if (Material.material != eachtype) Material_Type_Folder[eachtype].hide() }
        Material_Type_Folder[Material.material].show()
        material_folder.show()
        Obj_to_GUI(selected[0].material)

    }
    else { Texture_to_GUI() }
}


function Change_Mode() {
    if (gui_options.Mode == "Cutting Model") {
        $("#alert_cut").html('<div id="cut_alert" class="alert alert-info fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Notice!&nbsp;</b></strong>After drawing a line for cutting, we will remove its materials and they cannot be recovered!&nbsp;&nbsp;</div>');
        gui_options.cut = true;
        cut_component.show();
        cut_component.open();
        setTimeout(function () { $("#cut_alert").fadeOut(500); }, 3000)
        setTimeout(function () { $("#alert_cut").html("") }, 3500)
    }
    else if (gui_options.Mode == "Customizing Material") {
        cut_component.hide();
        gui_options.cut = false;
    }

    cover_recovery()
    select_recovery()
    return;
}

function Change_material() {
    for (var eachtype of Object.keys(Material_Type_Folder)) { if (Material.material != eachtype) Material_Type_Folder[eachtype].hide() }
    Material_Type_Folder[Material.material].show()
    TextureParams.current = "map"
    Texture_to_GUI()
    Material_Update()
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

document.querySelector('.up-area').addEventListener('click', texture_click)
function texture_click() {
    $('#fileDrag').click();
}
$('#fileDrag').change((event) => {
    var files = event.target.files;
    appendFile(files);
})


var dragbox = document.querySelector('.dragFile');
dragbox.addEventListener('dragover', function (e) {
    e.preventDefault();
}, false);
dragbox.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    appendFile(files)
}, false);

function appendFile(files) {
    for (var file of files) {
        var fileType = file.type.substr(file.type.lastIndexOf("/")).toUpperCase();
        if (fileType != "/PNG" && fileType != "/JPG" && fileType != "/JPEG") {
            $("#alert_img").html('<div id="img_alert" class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Notice!&nbsp;</b></strong>Only <b>JPG</b>, <b>PNG</b> or <b>JPEG</b> image files are acceptable!&nbsp;&nbsp;</div>');
            setTimeout(function () { $("#img_alert").fadeOut(500); }, 3000)
            setTimeout(function () { $("#alert_img").html("") }, 3500)
            return
        }
        url = window.URL.createObjectURL(file);
        let liStr = `<img src="${url}"/>`;
        $('.list-drag').html(liStr);
        $(".tip").hide();
        GUI_to_Texture()
        document.getElementById("fileDrag").value = "";
    }
}