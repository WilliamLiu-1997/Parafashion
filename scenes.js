import { GUI } from './js/dat.gui.module.js';
import { OBJLoader } from "./three.js/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "./three.js/examples/jsm/loaders/MTLLoader.js";
import { EffectComposer } from './three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './three.js/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './three.js/examples/jsm/shaders/FXAAShader.js';
import Stats from './three.js/examples/jsm/libs/stats.module.js';

let camera, cameralight, controls, scene, renderer, garment, gui, env_light, stats, point_helper_geo, point_helper;
let camera_patch, cameralight_patch, controls_patch, scene_patch, renderer_patch, patch, env_light_patch;
var tanFOV;
var windowHeight;
var tanFOV_patch;
let obj_vertices_count = 0;
let drawing = false, cover = true;
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
let default_texture = textureloader.load("./texture/default.jpg");
let default_material = new THREE.MeshPhongMaterial({ color: randomColor(), reflectivity: 0.3 })
let obj_size = 1;

var url = ""

let composer, outlinePass, outlinePass_select, effectFXAA, composer_patch, outlinePass_patch, outlinePass_patch_select, effectFXAA_patch;
var folder_basic, folder_env, folder_env_global, material_folder, basic_texture, lambert_texture, phong_texture, matcap_texture, toon_texture, standard_texture, physical_texture;


var garments_obj = "./leggins/leggins_patch.obj";
var garments_mtl = "./leggins/leggins_patch.obj.mtl";
var garments_mtl = "./leggins/patch.mtl"
var garments_obj = "./leggins/patch.obj"
var garments_mtl = "./leggins/patch_smooth.mtl"
var garments_obj = "./leggins/patch_smooth.obj"
var garments_mtl = "./obj/village1/village_final.mtl"
var garments_obj = "./obj/village1/village_final.obj"
var garments_mtl = "./obj/tower/tower3.mtl"
var garments_obj = "./obj/tower/tower3.obj"
// var garments_mtl = "./obj/city2/city2.mtl"
// var garments_obj = "./obj/city2/city2.obj"
// var garments_mtl = "./obj/S/S.mtl"
// var garments_obj = "./obj/S/S.obj"
//garments_mtl=false


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
    hiddenEdgeColor: "#333333"
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
    Square: [0.4, 0.2], Park: [0.4, 0.2], PlayingRoom: [0.6, 0.4], Alley: [0.5, 0.3], Sky: [0.5, 0.7], Bridge: [0.5, 0.2], Gallery: [0.4, 0.6], None: [0.8, 0.2], Snow: [0.4, 0.2], LivingRoom: [0.35, 0.65], Street: [0.4, 0.6], Church: [0.2, 0.8], Restaurant: [0.5, 0.35], BedRoom: [0.4, 0.5], BathRoom: [0.35, 0.75], Town: [0.3, 0.2]
}

function Overall_Reflectivity_NaN() {
    gui_options.Overall_Reflectivity = 0
    gui.updateDisplay()
    gui_options.Overall_Reflectivity = NaN
    gui.updateDisplay()
}

function Reflectivity() {
    if (gui_options.Overall_Reflectivity === NaN) return;
    garment.traverse(function (child) {
        if (child.type === "Mesh") {
            if (Array.isArray(child.material)) {
                for (let m = 0; m < child.material.length; m++) {
                    child.material[m] = child.material[m].clone()
                    child.material[m].reflectivity = gui_options.Overall_Reflectivity
                }
            } else {
                child.material = child.material.clone()
                child.material.reflectivity = gui_options.Overall_Reflectivity
            }
        }
    })
    patch.traverse(function (child) {
        if (child.type === "Mesh") {
            if (Array.isArray(child.material)) {
                for (let m = 0; m < child.material.length; m++) {
                    child.material[m] = child.material[m].clone()
                    child.material[m].reflectivity = gui_options.Overall_Reflectivity
                }
            } else {
                child.material = child.material.clone()
                child.material.reflectivity = gui_options.Overall_Reflectivity
            }
        }
    })

    Materials.MeshBasicMaterial.reflectivity = gui_options.Overall_Reflectivity
    Materials.MeshLambertMaterial.reflectivity = gui_options.Overall_Reflectivity
    Materials.MeshPhongMaterial.reflectivity = gui_options.Overall_Reflectivity
    Materials.MeshPhysicalMaterial.reflectivity = gui_options.Overall_Reflectivity

    if (selected.length == 2) {
        gui.updateDisplay()
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
    }
    else if (selected.length == 1) {
        gui.updateDisplay()
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
    }
}
var gui_options = {
    Reset_Camera: function () {
        controls.reset();
        controls_patch.reset();
        if (gui) { gui.updateDisplay() }
    },
    Unselect: function () {
        select_recovery();
        cover_recovery();
        if (gui) { gui.updateDisplay() }
    },
    reset: function () {
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
        patch = patch_loader(garment, 1, num);
        patch.name = "patch";
        scene_patch.add(patch);
        select_recovery()
        url = ""
        let liStr = "";
        $('.list-drag').html(liStr);
        $(".tip").show();
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
        Overall_Reflectivity_NaN()
    },
    set_default: function () {
        let num = garment.children[0].children.length;
        garment.traverse(function (child) {
            if (child.type === "Mesh") {
                if (Array.isArray(child.material)) {
                    for (let m = 0; m < child.material.length; m++) {
                        let default_set = default_material.clone()
                        default_set.map = default_texture;
                        default_set.color.set(randomColor())
                        child.material[m] = default_set
                    }
                }
                else {
                    let default_set = default_material.clone()
                    default_set.map = default_texture;
                    default_set.color.set(randomColor())
                    child.material = default_set
                }
            }
        })
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
        patch = patch_loader(garment, 1, num);
        patch.name = "patch";
        scene_patch.add(patch);
        select_recovery()
        url = ""
        let liStr = "";
        $('.list-drag').html(liStr);
        $(".tip").show();
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]);
        Overall_Reflectivity_NaN()
    },
    Overall_Reflectivity: 0,
    env: "None",
    Enable_Patch_Background: false,
    cut: false,
    Mode: "Customizing Material",
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
    'MeshMatcapMaterial': {
        bumpScale: 1.0,
        color: 0xffffff,
        flatShading: false,
        normalScale: new THREE.Vector2(1, 1),//vector2
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
        roughness: 1.0,
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
        roughness: 1.0,
        wireframe: false,
        clearcoat: 0.0,
        clearcoatRoughness: 0.0,
        reflectivity: 0.5,
        sheen: 0x000000,//color
        transmission: 0.0,
    },
}


var Material_Type_Folder = {
    MeshBasicMaterial: null,
    // MeshDepthMaterial: null,
    MeshLambertMaterial: null,
    MeshPhongMaterial: null,
    MeshMatcapMaterial: null,
    MeshToonMaterial: null,
    MeshStandardMaterial: null,
    MeshPhysicalMaterial: null,
}

var Material = {
    reset: function () {
        Overall_Reflectivity_NaN()
        if (selected.length == 2) {
            let name = selected[0].name
            for (var n of original) {
                if (n.name == name) {
                    selected[0].material[selected[1]] = n.material[selected[1]].clone()
                    selected_patch[0].material = n.material[selected[1]].clone()
                    Obj_to_GUI(n.material[selected[1]])
                    gui.updateDisplay()
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
                    Obj_to_GUI(n.material)
                    gui.updateDisplay()
                    Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
                    return;
                }
            }
        }
        else { return }
    },
    set_default: function () {
        Overall_Reflectivity_NaN()
        if (selected.length == 2) {
            let default_set = default_material.clone()
            default_set.map = default_texture;
            default_set.color.set(randomColor())
            selected[0].material[selected[1]] = default_set
            selected_patch[0].material = selected[0].material[selected[1]].clone()
            Obj_to_GUI(selected[0].material[selected[1]])
            gui.updateDisplay()
            Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env])
            return;

        }
        else if (selected.length == 1) {
            let default_set = default_material.clone()
            default_set.map = default_texture;
            default_set.color.set(randomColor())
            selected[0].material = default_set
            selected_patch[0].material = selected[0].material.clone()
            Obj_to_GUI(selected[0].material)
            gui.updateDisplay()
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
    offset: new THREE.Vector2(0, 0),
    repeat: new THREE.Vector2(1, 1),
    rotation: 0,
    center: new THREE.Vector2(0.5, 0.5),
    remove: function () {
        if (TextureParams.current == "map") {
            if (selected.length == 2) {
                selected[0].material[selected[1]] = selected[0].material[selected[1]].clone()
                selected_patch[0].material = selected_patch[0].material.clone()
                selected[0].material[selected[1]].map = default_texture;
                selected_patch[0].material.map = default_texture;
            }
            else if (selected.length == 1) {
                selected[0].material = selected[0].material.clone()
                selected_patch[0].material = selected_patch[0].material.clone()
                selected[0].material.map = default_texture;
                selected_patch[0].material.map = default_texture;
            }
        }
        else {
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
        }
        Texture_to_GUI()
        gui.updateDisplay()
    },
};


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
    TextureParams.offset.set(obj_material.map.offset.x, obj_material.map.offset.y)
    TextureParams.repeat.set(obj_material.map.repeat.x, obj_material.map.repeat.y)
    TextureParams.rotation = obj_material.map.rotation
    TextureParams.center.set(obj_material.map.center.x, obj_material.map.center.y)
    url = obj_material[current].image.src
    let liStr = `<img src="${url}"/>`;
    $('.list-drag').html(liStr);
    $(".tip").hide();
    if (url) {
        obj_material[current] = textureloader.load(url)
        selected_patch[0].material[current] = textureloader.load(url)
    }
    GUI_to_Texture()
    gui.updateDisplay()
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
        obj_material.map.offset.set(TextureParams.offset.x, TextureParams.offset.y)
        obj_material.map.repeat.set(TextureParams.repeat.x, TextureParams.repeat.y)
        obj_material.map.rotation = TextureParams.rotation
        obj_material.map.center.set(TextureParams.center.x, TextureParams.center.y)
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

function GUI_to_Texture_Param() {
    let obj_material
    if (selected.length == 2) { obj_material = selected[0].material[selected[1]] }
    else if (selected.length == 1) { obj_material = selected[0].material }
    else return
    obj_material.map.offset.set(TextureParams.offset.x, TextureParams.offset.y)
    obj_material.map.repeat.set(TextureParams.repeat.x, TextureParams.repeat.y)
    obj_material.map.rotation = TextureParams.rotation
    obj_material.map.center.set(TextureParams.center.x, TextureParams.center.y)
    selected_patch[0].material.map.offset.set(TextureParams.offset.x, TextureParams.offset.y)
    selected_patch[0].material.map.repeat.set(TextureParams.repeat.x, TextureParams.repeat.y)
    selected_patch[0].material.map.rotation = TextureParams.rotation
    selected_patch[0].material.map.center.set(TextureParams.center.x, TextureParams.center.y)

}

function Obj_to_GUI(obj_material) {
    obj_material = obj_material.clone();
    if (obj_material.map === null) obj_material.map = default_texture;
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

        case "MeshMatcapMaterial":
            Materials.MeshMatcapMaterial.color = obj_material.color.getHex()
            Materials.MeshMatcapMaterial.bumpScale = obj_material.bumpScale
            Materials.MeshMatcapMaterial.flatShading = obj_material.flatShading
            Materials.MeshMatcapMaterial.normalScale.set(obj_material.normalScale.x, obj_material.normalScale.y)
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
            Materials.MeshPhysicalMaterial.sheen = obj_material.sheen.getHex()
            Materials.MeshPhysicalMaterial.emissive = obj_material.emissive.getHex()
            Materials.MeshPhysicalMaterial.emissiveIntensity = obj_material.emissiveIntensity
            Materials.MeshPhysicalMaterial.bumpScale = obj_material.bumpScale
            Materials.MeshPhysicalMaterial.flatShading = obj_material.flatShading
            Materials.MeshPhysicalMaterial.clearcoat = obj_material.clearcoat
            Materials.MeshPhysicalMaterial.clearcoatRoughness = obj_material.clearcoatRoughness
            Materials.MeshPhysicalMaterial.reflectivity = obj_material.reflectivity
            Materials.MeshPhysicalMaterial.transmission = obj_material.transmission
            Materials.MeshPhysicalMaterial.normalScale.set(obj_material.normalScale.x, obj_material.normalScale.y)
            Materials.MeshPhysicalMaterial.metalness = obj_material.metalness
            Materials.MeshPhysicalMaterial.roughness = obj_material.roughness
            Materials.MeshPhysicalMaterial.wireframe = obj_material.wireframe
            break;
    }
}

function Material_Update(reflecttivity_change = false) {
    if (reflecttivity_change) {
        gui_options.Overall_Reflectivity = 0
        gui.updateDisplay()
        gui_options.Overall_Reflectivity = NaN
    }
    if (selected.length == 2) {
        material_folder.show()
        GUI_to_Obj(selected[0].material[selected[1]])
        gui.updateDisplay()
    }
    else if (selected.length == 1) {
        material_folder.show()
        GUI_to_Obj(selected[0].material)
        gui.updateDisplay()
    }
}


function Material_Update_Param(reflecttivity_change = false) {
    if (reflecttivity_change) {
        gui_options.Overall_Reflectivity = 0
        gui.updateDisplay()
        gui_options.Overall_Reflectivity = NaN
    }
    if (selected.length == 2) {
        material_folder.show()
        GUI_to_Obj_Param(selected[0].material[selected[1]], selected_patch[0].material)
        gui.updateDisplay()
    }
    else if (selected.length == 1) {
        material_folder.show()
        GUI_to_Obj_Param(selected[0].material, selected_patch[0].material)
        gui.updateDisplay()
    }
}

function GUI_to_Obj_Param(obj_material, obj_material1) {
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

        case "MeshMatcapMaterial":
            obj_material.color.setHex(Materials.MeshMatcapMaterial.color)
            obj_material.bumpScale = Materials.MeshMatcapMaterial.bumpScale
            obj_material.flatShading = Materials.MeshMatcapMaterial.flatShading
            obj_material.normalScale.set(Materials.MeshMatcapMaterial.normalScale.x, Materials.MeshMatcapMaterial.normalScale.y)
            obj_material1.color.setHex(Materials.MeshMatcapMaterial.color)
            obj_material1.bumpScale = Materials.MeshMatcapMaterial.bumpScale
            obj_material1.flatShading = Materials.MeshMatcapMaterial.flatShading
            obj_material1.normalScale.set(Materials.MeshMatcapMaterial.normalScale.x, Materials.MeshMatcapMaterial.normalScale.y)
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
            if (obj_material.sheen) obj_material.sheen.setHex(Materials.MeshPhysicalMaterial.sheen)
            else obj_material.sheen = new THREE.Color(Materials.MeshPhysicalMaterial.sheen)
            obj_material.emissive.setHex(Materials.MeshPhysicalMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshPhysicalMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshPhysicalMaterial.bumpScale
            obj_material.flatShading = Materials.MeshPhysicalMaterial.flatShading
            obj_material.clearcoat = Materials.MeshPhysicalMaterial.clearcoat
            obj_material.clearcoatRoughness = Materials.MeshPhysicalMaterial.clearcoatRoughness
            obj_material.reflectivity = Materials.MeshPhysicalMaterial.reflectivity
            obj_material.transmission = Materials.MeshPhysicalMaterial.transmission
            obj_material.normalScale.set(Materials.MeshPhysicalMaterial.normalScale.x, Materials.MeshPhysicalMaterial.normalScale.y)
            obj_material.metalness = Materials.MeshPhysicalMaterial.metalness
            obj_material.roughness = Materials.MeshPhysicalMaterial.roughness
            obj_material.wireframe = Materials.MeshPhysicalMaterial.wireframe
            obj_material1.color.setHex(Materials.MeshPhysicalMaterial.color)
            if (obj_material1.sheen) obj_material1.sheen.setHex(Materials.MeshPhysicalMaterial.sheen)
            else obj_material1.sheen = new THREE.Color(Materials.MeshPhysicalMaterial.sheen)
            obj_material1.emissive.setHex(Materials.MeshPhysicalMaterial.emissive)
            obj_material1.emissiveIntensity = Materials.MeshPhysicalMaterial.emissiveIntensity
            obj_material1.bumpScale = Materials.MeshPhysicalMaterial.bumpScale
            obj_material1.flatShading = Materials.MeshPhysicalMaterial.flatShading
            obj_material1.clearcoat = Materials.MeshPhysicalMaterial.clearcoat
            obj_material1.clearcoatRoughness = Materials.MeshPhysicalMaterial.clearcoatRoughness
            obj_material1.reflectivity = Materials.MeshPhysicalMaterial.reflectivity
            obj_material1.transmission = Materials.MeshPhysicalMaterial.transmission
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
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshBasicMaterial({ map: default_texture, side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshBasicMaterial.color)
            obj_material.reflectivity = Materials.MeshBasicMaterial.reflectivity
            obj_material.wireframe = Materials.MeshBasicMaterial.wireframe
            break;

        case "MeshLambertMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshLambertMaterial({ map: default_texture, side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshLambertMaterial.color)
            obj_material.emissive.setHex(Materials.MeshLambertMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshLambertMaterial.emissiveIntensity
            obj_material.reflectivity = Materials.MeshLambertMaterial.reflectivity
            obj_material.wireframe = Materials.MeshLambertMaterial.wireframe
            break;

        case "MeshPhongMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshPhongMaterial({ map: default_texture, side: THREE.DoubleSide }) }
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

        case "MeshMatcapMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshMatcapMaterial({ map: default_texture, side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshMatcapMaterial.color)
            obj_material.bumpScale = Materials.MeshMatcapMaterial.bumpScale
            obj_material.flatShading = Materials.MeshMatcapMaterial.flatShading
            obj_material.normalScale.set(Materials.MeshMatcapMaterial.normalScale.x, Materials.MeshMatcapMaterial.normalScale.y)
            break;

        case "MeshToonMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshToonMaterial({ map: default_texture, side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshToonMaterial.color)
            obj_material.emissive.setHex(Materials.MeshToonMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshToonMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshToonMaterial.bumpScale
            obj_material.normalScale.set(Materials.MeshToonMaterial.normalScale.x, Materials.MeshToonMaterial.normalScale.y)
            obj_material.wireframe = Materials.MeshToonMaterial.wireframe
            break;

        case "MeshStandardMaterial":
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshStandardMaterial({ map: default_texture, side: THREE.DoubleSide }) }
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
            if (obj_material.type != Material.material) { obj_material = new THREE.MeshPhysicalMaterial({ map: default_texture, side: THREE.DoubleSide }) }
            obj_material.color.setHex(Materials.MeshPhysicalMaterial.color)
            if (obj_material.sheen) obj_material.sheen.setHex(Materials.MeshPhysicalMaterial.sheen)
            else obj_material.sheen = new THREE.Color(Materials.MeshPhysicalMaterial.sheen)
            obj_material.emissive.setHex(Materials.MeshPhysicalMaterial.emissive)
            obj_material.emissiveIntensity = Materials.MeshPhysicalMaterial.emissiveIntensity
            obj_material.bumpScale = Materials.MeshPhysicalMaterial.bumpScale
            obj_material.flatShading = Materials.MeshPhysicalMaterial.flatShading
            obj_material.clearcoat = Materials.MeshPhysicalMaterial.clearcoat
            obj_material.clearcoatRoughness = Materials.MeshPhysicalMaterial.clearcoatRoughness
            obj_material.reflectivity = Materials.MeshPhysicalMaterial.reflectivity
            obj_material.transmission = Materials.MeshPhysicalMaterial.transmission
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
        for (var eachtype of Object.keys(Material_Type_Folder)) { Material_Type_Folder[eachtype].hide() }
        Material_Type_Folder[Material.material].show()
        material_folder.show()
        Obj_to_GUI(selected[0].material[selected[1]])
        gui.updateDisplay()
    }
    else if (selected.length == 1) {
        selected[0].material = selected[0].material.clone()
        selected_patch[0].material = selected_patch[0].material.clone()
        Material.material = selected[0].material.type;
        for (var eachtype of Object.keys(Material_Type_Folder)) { Material_Type_Folder[eachtype].hide() }
        Material_Type_Folder[Material.material].show()
        material_folder.show()
        Obj_to_GUI(selected[0].material)
        gui.updateDisplay()
    }
    else { Texture_to_GUI() }
}


function GUI_init() {
    gui = new GUI({ width: 300, autoPlace: false, scrollable: true })

    document.getElementById('gui_container_gui').appendChild(gui.domElement);

    folder_basic = gui.addFolder("Basic")
    folder_basic.add(gui_options, 'Mode', ["Customizing Material", "Cutting Model"]).name("Mode").onChange(() => Change_Mode());
    folder_basic.add(gui_options, 'Unselect');
    folder_basic.add(gui_options, 'Reset_Camera').name("Reset Camera");
    folder_basic.open()

    folder_env = gui.addFolder("Environment")
    folder_env.add(gui_options, "env", ["None", "Sky", "Alley", "LivingRoom", "BedRoom", "PlayingRoom", 'Street', 'Town', "Park", "Snow", "Bridge", "Restaurant"]).name("Background").onChange(() => Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]))
    folder_env.add(gui_options, 'Enable_Patch_Background').name("Patch Background").onChange(() => Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]));
    // other options: "BathRoom", 'Church', "Gallery", "Square"
    folder_env_global = folder_env.addFolder("Material Global Settings")
    folder_env_global.add(gui_options, 'Overall_Reflectivity', 0, 1, 0.01).onChange(() => Reflectivity()).name('Reflectivity');
    folder_env_global.add(gui_options, "reset").name('Materials Recovery')
    folder_env_global.add(gui_options, "set_default").name('Random Materials')
    folder_env_global.open()
    folder_env.open()

    material_folder = gui.addFolder("Material")
    material_folder.add(Material, "reset").name('Materials Recovery')
    material_folder.add(Material, "set_default").name('Random Material')
    material_folder.add(Material, "material", [...Object.keys(Materials)]).onChange(() => Change_material());
    material_folder.add(Material, "transparent").onChange(() => Material_Update_Param())
    material_folder.add(Material, "opacity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    material_folder.add(Material, "alphaTest", 0, 1, 0.01).onChange(() => Material_Update_Param())
    material_folder.add(Material, "side", ["FrontSide", "BackSide", "DoubleSide"]).onChange(() => Material_Update_Param())
    material_folder.add(Material, "visible").onChange(() => Material_Update_Param())
    material_folder.open()
    material_folder.hide()

    Material_Type_Folder.MeshBasicMaterial = material_folder.addFolder("Basic Material")
    Material_Type_Folder.MeshBasicMaterial.addColor(Materials.MeshBasicMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshBasicMaterial.add(Materials.MeshBasicMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshBasicMaterial.add(Materials.MeshBasicMaterial, "wireframe").onChange(() => Material_Update_Param())
    basic_texture = Material_Type_Folder.MeshBasicMaterial.addFolder("Texture")
    basic_texture.add(TextureParams, "current", ['map', 'alphaMap', 'specularMap']).name("map").onChange(() => Texture_to_GUI())
    basic_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    basic_texture.add(TextureParams.offset, "x", -10, 10, 0.1).name("offset.x").onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams.offset, "y", -10, 10, 0.1).name("offset.y").onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.1).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.1).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    basic_texture.add(TextureParams, "remove").name("Remove Texture")
    basic_texture.open()
    Material_Type_Folder.MeshBasicMaterial.open()


    Material_Type_Folder.MeshLambertMaterial = material_folder.addFolder("Lambert Material")
    Material_Type_Folder.MeshLambertMaterial.addColor(Materials.MeshLambertMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.add(Materials.MeshLambertMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshLambertMaterial.add(Materials.MeshLambertMaterial, "wireframe").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.addColor(Materials.MeshLambertMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshLambertMaterial.add(Materials.MeshLambertMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    lambert_texture = Material_Type_Folder.MeshLambertMaterial.addFolder("Texture")
    lambert_texture.add(TextureParams, "current", ['map', 'alphaMap', 'specularMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    lambert_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    lambert_texture.add(TextureParams.offset, "x", -10, 10, 0.1).name("offset.x").onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams.offset, "y", -10, 10, 0.1).name("offset.y").onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.1).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.1).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    lambert_texture.add(TextureParams, "remove").name("Remove Texture")
    lambert_texture.open()
    Material_Type_Folder.MeshLambertMaterial.open()


    Material_Type_Folder.MeshPhongMaterial = material_folder.addFolder("Phong Material")
    Material_Type_Folder.MeshPhongMaterial.addColor(Materials.MeshPhongMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "shininess", 0, 200, 1).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "wireframe").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.addColor(Materials.MeshPhongMaterial, "specular").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.addColor(Materials.MeshPhongMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhongMaterial.add(Materials.MeshPhongMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    phong_texture = Material_Type_Folder.MeshPhongMaterial.addFolder("Texture")
    phong_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', 'specularMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    phong_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    phong_texture.add(TextureParams.offset, "x", -10, 10, 0.1).name("offset.x").onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams.offset, "y", -10, 10, 0.1).name("offset.y").onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.1).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.1).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    phong_texture.add(TextureParams, "remove").name("Remove Texture")
    phong_texture.open()
    Material_Type_Folder.MeshPhongMaterial.open()

    Material_Type_Folder.MeshMatcapMaterial = material_folder.addFolder("Matcap Material")
    Material_Type_Folder.MeshMatcapMaterial.addColor(Materials.MeshMatcapMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshMatcapMaterial.add(Materials.MeshMatcapMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshMatcapMaterial.add(Materials.MeshMatcapMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshMatcapMaterial.add(Materials.MeshMatcapMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshMatcapMaterial.add(Materials.MeshMatcapMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    matcap_texture = Material_Type_Folder.MeshMatcapMaterial.addFolder("Texture")
    matcap_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', 'matcap']).name("map").onChange(() => Texture_to_GUI())
    matcap_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    matcap_texture.add(TextureParams.offset, "x", -10, 10, 0.1).name("offset.x").onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams.offset, "y", -10, 10, 0.1).name("offset.y").onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.1).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.1).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    matcap_texture.add(TextureParams, "remove").name("Remove Texture")
    matcap_texture.open()
    Material_Type_Folder.MeshMatcapMaterial.open()


    Material_Type_Folder.MeshToonMaterial = material_folder.addFolder("Toon Material")
    Material_Type_Folder.MeshToonMaterial.addColor(Materials.MeshToonMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial, "wireframe").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.addColor(Materials.MeshToonMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshToonMaterial.add(Materials.MeshToonMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    toon_texture = Material_Type_Folder.MeshToonMaterial.addFolder("Texture")
    toon_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    toon_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    toon_texture.add(TextureParams.offset, "x", -10, 10, 0.1).name("offset.x").onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams.offset, "y", -10, 10, 0.1).name("offset.y").onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.1).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.1).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    toon_texture.add(TextureParams, "remove").name("Remove Texture")
    toon_texture.open()
    Material_Type_Folder.MeshToonMaterial.open()


    Material_Type_Folder.MeshStandardMaterial = material_folder.addFolder("Standard Material")
    Material_Type_Folder.MeshStandardMaterial.addColor(Materials.MeshStandardMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "metalness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "roughness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "wireframe").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.addColor(Materials.MeshStandardMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshStandardMaterial.add(Materials.MeshStandardMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    standard_texture = Material_Type_Folder.MeshStandardMaterial.addFolder("Texture")
    standard_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    standard_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    standard_texture.add(TextureParams.offset, "x", -10, 10, 0.1).name("offset.x").onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams.offset, "y", -10, 10, 0.1).name("offset.y").onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.1).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.1).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    standard_texture.add(TextureParams, "remove").name("Remove Texture")
    standard_texture.open()
    Material_Type_Folder.MeshStandardMaterial.open()


    Material_Type_Folder.MeshPhysicalMaterial = material_folder.addFolder("Physical Material")
    Material_Type_Folder.MeshPhysicalMaterial.addColor(Materials.MeshPhysicalMaterial, "color").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "metalness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "roughness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "reflectivity", 0, 1, 0.01).onChange(() => Material_Update_Param(true))
    Material_Type_Folder.MeshPhysicalMaterial.addColor(Materials.MeshPhysicalMaterial, "sheen").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "clearcoat", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "clearcoatRoughness", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "transmission", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "flatShading").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "wireframe").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.addColor(Materials.MeshPhysicalMaterial, "emissive").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "emissiveIntensity", 0, 1, 0.01).onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial.normalScale, "x", 0, 1, 0.01).name("normalScale.x").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial.normalScale, "y", 0, 1, 0.01).name("normalScale.y").onChange(() => Material_Update_Param())
    Material_Type_Folder.MeshPhysicalMaterial.add(Materials.MeshPhysicalMaterial, "bumpScale", 0, 1, 0.01).onChange(() => Material_Update_Param())
    physical_texture = Material_Type_Folder.MeshPhysicalMaterial.addFolder("Texture")
    physical_texture.add(TextureParams, "current", ['map', 'normalMap', 'bumpMap', 'alphaMap', "emissiveMap"]).name("map").onChange(() => Texture_to_GUI())
    physical_texture.add(TextureParams, "wrap", ["clamp", "repeat", "mirror"]).onChange(() => GUI_to_Texture())
    physical_texture.add(TextureParams.offset, "x", 0, 1, 0.01).name("offset.x").onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams.offset, "y", 0, 1, 0.01).name("offset.y").onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams.repeat, "x", 0.1, 10, 0.01).name("repeat.x").onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams.repeat, "y", 0.1, 10, 0.01).name("repeat.y").onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams, "rotation", -Math.PI, Math.PI, 0.01).onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams.center, "x", 0, 1, 0.01).name("center.x").onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams.center, "y", 0, 1, 0.01).name("center.y").onChange(() => GUI_to_Texture_Param())
    physical_texture.add(TextureParams, "remove").name("Remove Texture")
    physical_texture.open()
    Material_Type_Folder.MeshPhysicalMaterial.open()


    Change_Mode()
    gui_options.Overall_Reflectivity = NaN
    gui.updateDisplay()
}


function Change_Mode() {
    if (gui_options.Mode == "Cutting Model") {
        $("#alert_cut").html('<div id="cut_alert" class="alert alert-info fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Notice!&nbsp;</b></strong>After marking a model for cutting, we will remove its materials and they cannot be recovered!&nbsp;&nbsp;</div>');
        setTimeout(function () { $("#cut_alert").fadeOut(500); }, 3000)
        setTimeout(function () { $("#alert_cut").html("") }, 3500)
    }
    gui_options.Mode == "Customizing Material" ? gui_options.cut = false : gui_options.cut = true;
    cover_recovery()
    select_recovery()
    url = ""
    let liStr = "";
    $('.list-drag').html(liStr);
    $(".tip").show();
    return;
}

function Change_material() {
    for (var eachtype of Object.keys(Material_Type_Folder)) { Material_Type_Folder[eachtype].hide() }
    Material_Type_Folder[Material.material].show()
    TextureParams.current = "map"
    Texture_to_GUI()
    Material_Update()
}

init();
init_patch();
GUI_init();
animate();


function init() {

    if (window.innerWidth < 1080) {
        $("#alert_size").html('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Warning!&nbsp;</b></strong>Your window width is too small. This web application is <b>NOT</b> compatible!&nbsp;&nbsp;</div>');
        setTimeout(function () { $("#size_alert").fadeOut(500); }, 5000)
        setTimeout(function () { $("#alert_size").html("") }, 5500)
    }
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x303030);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);
    stats = new Stats();
    document.getElementById("container").appendChild(stats.dom);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    );
    camera.position.set(0, 0, 2);

    cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.8);

    camera.add(cameralight);
    scene.add(camera);
    env_light = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(env_light);


    point_helper_geo = new THREE.ConeGeometry(0.001, 0.01, 10, 10);
    point_helper_geo.translate(0, 0.005, 0);
    point_helper_geo.rotateX(Math.PI / 2);
    point_helper = new THREE.Mesh(point_helper_geo, new THREE.MeshNormalMaterial({ visible: false }));
    scene.add(point_helper);


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

    effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth / window.devicePixelRatio, 1 / window.innerHeight / window.devicePixelRatio);
    composer.addPass(effectFXAA);
    composer.setPixelRatio(window.devicePixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);
    // controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.2;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 50;
    controls.mouseButtons = { ORBIT: THREE.MOUSE.MIDDLE, ZOOM: false, PAN: THREE.MOUSE.RIGHT };

    garment = obj_loader(garments_obj, garments_mtl, 1, true);
    scene.add(garment);

    scene.add(covered_obj);


    var helper = new THREE.GridHelper(200, 200);
    helper.position.y = -0.5;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    tanFOV = Math.tan(((Math.PI / 180) * camera.fov / 2));
    windowHeight = window.innerHeight;

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousedown", onmouseDown, false);
    window.addEventListener("mouseup", onmouseUp, false);
}


function init_patch() {
    scene_patch = new THREE.Scene();
    renderer_patch = new THREE.WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });

    renderer_patch.setPixelRatio(window.devicePixelRatio);
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
    cameralight_patch.position.set(0, 0.5, 0)
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

    effectFXAA_patch = new ShaderPass(FXAAShader);
    effectFXAA_patch.uniforms['resolution'].value.set(1 / $("#container_patch").width() / window.devicePixelRatio, 1 / window.innerHeight / 0.78 / window.devicePixelRatio);
    composer_patch.addPass(effectFXAA_patch);
    composer_patch.setPixelRatio(window.devicePixelRatio);
    composer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);

    controls_patch = new THREE.OrbitControls(camera_patch, renderer_patch.domElement);

    controls_patch.enableDamping = true;
    controls_patch.dampingFactor = 0.1;
    controls_patch.rotateSpeed = 0.2;
    controls_patch.screenSpacePanning = false;
    controls_patch.minDistance = 0.1;
    controls_patch.maxDistance = 1000;

    controls_patch.mouseButtons = { ORBIT: THREE.MOUSE.MIDDLE, ZOOM: false, PAN: THREE.MOUSE.RIGHT };

    controls_patch.enableRotate = false;
    // controls_patch.maxPolarAngle = Math.PI * 0.9;
    // controls_patch.minPolarAngle = Math.PI * 0.1;
    // controls_patch.maxAzimuthAngle = Math.PI * 0.4;
    // controls_patch.minAzimuthAngle = -Math.PI * 0.4;


    tanFOV_patch = Math.tan(((Math.PI / 180) * camera_patch.fov / 2));

}


function show_progress() {
    $("#progress").css({ "width": Math.min(100, (progress_obj + progress_mtl) / 2) + "%", "aria- valuenow": Math.min(100, (progress_obj + progress_mtl) / 2) })
}

function animate() {
    stats.begin();
    if (patch_panel_width != $("#container_patch").css("width")) {
        patch_panel_width = $("#container_patch").css("width")
        onWindowResize()
    }

    if (progress_obj + progress_mtl == 200 && garment) {
        camera.position.set(0, 0, obj_size + 1)
        var lack = false;
        var all_empty = true;
        progress_obj = progress_mtl = -1;
        var num = garment.children[0].children.length;

        patch = patch_loader(garment, 1, num);
        patch.name = "patch";
        scene_patch.add(patch);
        camera_patch.position.set(0, 0, 1 + Math.max(1, max_radius))
        controls_patch.maxDistance = max_radius * 20;
        controls.maxDistance = Math.min(100, obj_size * 10);
        camera_patch.far = max_radius * 50;

        for (var i = 0; i < original.length; i++) {
            if (original[i].geometry.groups.length > 0) {
                original[i].material = original[i].material.slice(0)
            }
        }

        document.addEventListener("mousemove", mouseMove, false);

        $("#info").html("<p><font size='3'>Parafashion</font><br /><font size='1' color='#a0a0a0'>Vertices: " + obj_vertices_count + "</font></p>")
        Display(environment[gui_options.env], gui_options.Enable_Patch_Background, environment_light[gui_options.env]);
        onWindowResize();

        $("#progress_bar").hide();


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
        if (lack || all_empty) { $("#alert_uv").html('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong><b>Warning!&nbsp;</b></strong>The imported model lacks of partial UVs. This means that the patches we can get are <b>NOT</b> complete! Part of the textures may also cannot be set!&nbsp;&nbsp;</div>'); }

    }
    else if (progress_obj + progress_mtl == -2) {


    }
    else {
        show_progress()
    }
    $("#texture_container").css({ "max-height": window.innerHeight * 0.91*0.45 })
    $(".up-area").css({ "width": $(".dg.main").css("width") })
    $("#gui_container_gui").css({ "max-height": window.innerHeight * 0.91 - 50 - $('#texture_container').height() })
    if (patch_scaled) { $(".panel_box").css({ width: Math.max(window.innerWidth * 0.2, window.innerWidth - 2 - $("#gui_container").width()) }); }
    requestAnimationFrame(animate);
    render();
    stats.end();
}

function render() {
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
        setTimeout(function () { $("#size_alert").fadeOut(500); }, 5000)
        setTimeout(function () { $("#alert_size").html("") }, 5500)
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight));
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth / window.devicePixelRatio, 1 / window.innerHeight / window.devicePixelRatio);

    if (render_patch_flag) {
        camera_patch.aspect = $("#container_patch").width() / window.innerHeight / 0.78;
        camera_patch.fov = (360 / Math.PI) * Math.atan(tanFOV_patch * (window.innerHeight / windowHeight));
        camera_patch.updateProjectionMatrix();
        renderer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);
        composer_patch.setSize($("#container_patch").width(), window.innerHeight * 0.78);
        effectFXAA_patch.uniforms['resolution'].value.set(1 / $("#container_patch").width() / window.devicePixelRatio, 1 / window.innerHeight / 0.78 / window.devicePixelRatio);
    }
}


function onmouseDown(event) {
    mouse_down = true;
    if (event.button == 0 && gui_options.cut) {
        if (cut_obj.length > 0) {
            controls.enabled = false; controls_patch.enabled = false;
            mouseMove(event)
            drawing = true;
        } else {
            select_cut(pointer, camera, event);
        }
    }
    else if (event.button == 0) {
        let obj = document.getElementById("panel_box");
        pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        pointer_patch.x = (event.clientX / (renderer_patch.domElement.clientWidth)) * 2 - 1;
        pointer_patch.y = - ((event.clientY - obj.offsetTop - document.getElementById("patch_btn").clientHeight) / (renderer_patch.domElement.clientHeight)) * 2 + 1;

        if (!mouse_down && cover) { cover_recovery(); }
        if (cover) {
            select_material(pointer, camera, pointer_patch, camera_patch, event);
            if (pointer.x < 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) || pointer.y < (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)) load_material()
        }
        cover = false;
    }
    else if (event.button == 1) { cover = false; }
    else if (event.button == 2) { cover = false; }
}

function onmouseUp(event) {
    mouse_down = false;
    if (event.button == 0 && gui_options.cut) {
        controls.enabled = true; controls_patch.enabled = true;
        drawing = false;
    }
    else if (event.button == 0) {
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

function mouseMove(event) {
    let obj = document.getElementById("panel_box");
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    pointer_patch.x = (event.clientX / (renderer_patch.domElement.clientWidth)) * 2 - 1;
    pointer_patch.y = - ((event.clientY - obj.offsetTop - document.getElementById("patch_btn").clientHeight) / (renderer_patch.domElement.clientHeight)) * 2 + 1;
    if (!mouse_down && cover) { cover_recovery(); }
    if (cut_obj.length > 0) {
        on_cut(pointer, camera, event)
    }
    if (drawing) {

    }
    else if (gui_options.cut) { cover_cut(pointer, camera, event); }
    else if (cover) {
        cover_material(pointer, camera, pointer_patch, camera_patch, event);
    }
}


function cover_recovery() {
    outlinePass.selectedObjects = []
    outlinePass_patch.selectedObjects = []
    last_cover = []
    last_cover_patch = []
}

function select_recovery() {
    material_folder.hide()
    outlinePass_select.selectedObjects = []
    outlinePass_patch_select.selectedObjects = []
    last_select = []
    last_select_patch = []
    selected = []
    selected_patch = []
    cut_obj = []
}

function cover_material(cover_pointer, cover_camera, cover_pointer_patch, cover_camera_patch, event) {

    if (pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)) {
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
            // console.log(intersects[ 0 ].face)
            // console.log(intersects[ 0 ].point)
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
            // console.log(intersects[ 0 ].face)
            // console.log(intersects[ 0 ].point)
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
    if (pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2)) {
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
            // console.log(intersects[ 0 ].face)
            // console.log(intersects[ 0 ].point)
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

function select_material(cover_pointer, cover_camera, cover_pointer_patch, cover_camera_patch, event) {
    let on_patch_button = event.clientX > document.getElementById("panel_box").offsetLeft && event.clientX < document.getElementById("panel_box").offsetLeft + document.getElementById("patch_btn").clientWidth && event.clientY > document.getElementById("panel_box").offsetTop && event.clientY < document.getElementById("panel_box").offsetTop + document.getElementById("patch_btn").clientHeight
    if (on_patch_button || (pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2))) {
        return;
    }
    if (progress_obj + progress_mtl != -2) {
        select_recovery();
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
            // console.log(intersects[ 0 ].face)
            // console.log(intersects[ 0 ].point)
            if (intersects[0].object.parent instanceof THREE.Group) {
                var i = 0;
                for (i = 0; i < intersects[0].object.parent.children.length; i++) {
                    if (intersects[0].object.parent.children[i].name == intersects[0].object.name) { break; }
                }
                if (last_select_patch.length != 1 || (last_select_patch[0] != intersects[0].object)) {
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
                    outlinePass_patch_select.selectedObjects = [intersects[0].object];
                    last_select_patch = []
                    last_select = []
                    last_select_patch.push(intersects[0].object)
                    selected_patch = [intersects[0].object];
                    garment.traverse(function (obj) {
                        if (obj.type === "Mesh" && obj.name == intersects[0].object.name) {
                            outlinePass_select.selectedObjects = [obj];
                            selected = [obj];
                        }
                    })
                }
            }
        } else { select_recovery() }
    } else {
        raycaster.setFromCamera(cover_pointer, cover_camera);
        var intersects = raycaster.intersectObject(garment, true);
        if (intersects.length > 0) {
            // console.log(intersects[ 0 ].face)
            // console.log(intersects[ 0 ].point)
            //console.log(intersects[0].object)
            var group_num = intersects[0].object.geometry.groups.length;
            var vertice_index = intersects[0].face.a;
            var i = 0;
            var num = patch ? patch.children.length : 0;
            if (group_num > 0) {
                for (i = 0; i < group_num; i++) {
                    if (intersects[0].object.geometry.groups[i].start <= vertice_index && (vertice_index < (intersects[0].object.geometry.groups[i].start + intersects[0].object.geometry.groups[i].count))) { break; }
                }
                if (last_select.length != 2 || last_select[1] != i || last_select[0] != intersects[0].object) {
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
                    selected = [intersects[0].object];
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
}

function on_cut(cover_pointer, cover_camera, event) {
    let on_patch_button = event.clientX > document.getElementById("panel_box").offsetLeft && event.clientX < document.getElementById("panel_box").offsetLeft + document.getElementById("patch_btn").clientWidth && event.clientY > document.getElementById("panel_box").offsetTop && event.clientY < document.getElementById("panel_box").offsetTop + document.getElementById("patch_btn").clientHeight
    if (on_patch_button || (pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2))) {
        point_helper.material.visible = false;
        return;
    }
    if (progress_obj + progress_mtl != -2) {
        point_helper.material.visible = false;
        select_recovery();
        return;
    }
    let obj = document.getElementById("panel_box");
    if (event.clientX < obj.offsetLeft
        || event.clientX > (obj.offsetLeft + obj.clientWidth)
        || event.clientY < obj.offsetTop
        || event.clientY > (obj.offsetTop + obj.clientHeight))
        raycaster.setFromCamera(cover_pointer, cover_camera);
    var intersects = raycaster.intersectObject(cut_obj[0], true);
    if (intersects.length > 0) {
        point_helper.material.visible = true;
        point_helper.position.set(0, 0, 0);
        point_helper.lookAt(intersects[0].face.normal);
        point_helper.position.copy(intersects[0].point);
    } else {
        point_helper.material.visible = false;
    }
}


function select_cut(cover_pointer, cover_camera, event) {
    let on_patch_button = event.clientX > document.getElementById("panel_box").offsetLeft && event.clientX < document.getElementById("panel_box").offsetLeft + document.getElementById("patch_btn").clientWidth && event.clientY > document.getElementById("panel_box").offsetTop && event.clientY < document.getElementById("panel_box").offsetTop + document.getElementById("patch_btn").clientHeight
    if (on_patch_button || (pointer.x > 1 - (($('#gui_container').width() + 5) / window.innerWidth * 2) && pointer.y > (1 - (document.getElementById('gui_container_gui').offsetHeight + document.getElementById('texture_container').offsetHeight + window.innerHeight * 0.05 + 50) / window.innerHeight * 2))) {
        return;
    }
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
        // console.log(intersects[ 0 ].face)
        // console.log(intersects[ 0 ].point)
        //console.log(intersects[0].object)
        var num = patch ? patch.children.length : 0;

        if (last_select.length != 1 || last_select[0] != intersects[0].object) {
            if (Array.isArray(intersects[0].object.material)) {
                for (let m = 0; m < intersects[0].object.material.length; m++) {
                    let default_set = default_material.clone()
                    default_set.map = default_texture;
                    default_set.color.set(randomColor())
                    intersects[0].object.material[m] = default_set
                }
            }
            else {
                let default_set = default_material.clone()
                default_set.map = default_texture;
                default_set.color.set(randomColor())
                intersects[0].object.material = default_set
            }
            for (let o = 0; o < original.length; o++) {
                if (original[o].name === intersects[0].object.name) {
                    original[o].geometry.dispose()
                    if (Array.isArray(original[o].material)) {
                        for (let m = 0; m < original[o].material.length; m++) {
                            original[o].material[m].dispose()
                        }
                    } else { original[o].material.dispose() }
                    original[o] = intersects[0].object.clone()
                }
            }
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
        scene.background = new THREE.Color(0x303030);
        cameralight.intensity = environment_light.None[0]
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


function obj_loader(url_obj, url_mtl, scale, double = false) {
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
        default_material.side = THREE.DoubleSide;
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
                                default_m.map = default_texture;
                                default_m.color.set(randomColor())
                                child.material.push(default_m);
                            }
                        }
                        else {
                            let default_m = default_material.clone()
                            default_m.map = default_texture;
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
                if (scale_value > 1) { scale_value /= Math.sqrt(scale_value) }
                obj_size = Math.max(1, scale_value)
                root.position.set(-(x_min + x_max) / 2 / scale_value, -y_min / scale_value - 0.5, -(z_min + z_max) / 2 / scale_value);
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
                                if (child.material.map === null) { child.material.map = default_texture; }
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
                        if (scale_value > 1) { scale_value /= Math.sqrt(scale_value) }
                        obj_size = Math.max(1, scale_value)
                        root.position.set(-(x_min + x_max) / 2 / scale_value, -y_min / scale_value - 0.5, -(z_min + z_max) / 2 / scale_value);
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
        if (array[i].map === null) { array[i].map = default_texture; }
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
    if (max_radius > 1) { max_radius /= Math.sqrt(max_radius) }
    newobj.traverse(function (child) {
        if (child.type === 'Mesh') {
            child.scale.multiplyScalar(scale / max_radius)
            child.position.multiplyScalar(scale / max_radius)
        }
    })
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
    let c = Math.random() * 0xffffff
    while (c > 0xccffff) { c = Math.random() * 0xffffff }
    return c
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