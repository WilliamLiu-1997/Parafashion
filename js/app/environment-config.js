import * as THREE from 'three';

const CUBE_TEXTURE_EXTENSION = '.jpg';
const POS_NEG_CUBE_FACES = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'];
const PX_NX_CUBE_FACES = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

function buildCubeFaceUrls(basePath, faceNames, extension = CUBE_TEXTURE_EXTENSION) {
    return faceNames.map((faceName) => `${basePath}${faceName}${extension}`);
}

function loadCubeReflectionMap(cubeLoader, basePath, faceNames) {
    const urls = buildCubeFaceUrls(basePath, faceNames);
    return cubeLoader.load(urls);
}

function loadEquirectangularReflectionMap(textureLoader, imagePath) {
    const texture = textureLoader.load(imagePath);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
}

export function createEnvironmentConfig(textureLoader) {
    const cubeLoader = new THREE.CubeTextureLoader();

    const envPark = loadCubeReflectionMap(cubeLoader, "./images/three-textures/cube/Park2/", POS_NEG_CUBE_FACES);
    const envPlayingRoom = loadEquirectangularReflectionMap(textureLoader, './images/11.jpg');
    const envAlley = loadEquirectangularReflectionMap(textureLoader, './images/7.jpg');
    const envSky = loadCubeReflectionMap(cubeLoader, "./images/three-textures/cube/skyboxsun25deg/", PX_NX_CUBE_FACES);
    const envBridge = loadCubeReflectionMap(cubeLoader, "./images/three-textures/cube/Bridge2/", POS_NEG_CUBE_FACES);
    const envGallery = loadEquirectangularReflectionMap(textureLoader, './images/5.jpg');
    const envSquare = loadEquirectangularReflectionMap(textureLoader, './images/9.jpg');
    const envSnow = loadCubeReflectionMap(cubeLoader, "./images/three-textures/cube/Park3Med/", PX_NX_CUBE_FACES);
    const envBedRoom = loadEquirectangularReflectionMap(textureLoader, './images/4.jpg');
    const envStreet = loadEquirectangularReflectionMap(textureLoader, './images/1.jpg');
    const envChurch = loadEquirectangularReflectionMap(textureLoader, './images/2.jpg');
    const envLivingRoom = loadEquirectangularReflectionMap(textureLoader, './images/3.jpg');
    const envRestaurant = loadEquirectangularReflectionMap(textureLoader, './images/10.jpg');
    const envBathRoom = loadEquirectangularReflectionMap(textureLoader, './images/6.jpg');
    const envTown = loadEquirectangularReflectionMap(textureLoader, './images/8.jpg');

    const environmentMaps = {
        Square: envSquare,
        Park: envPark,
        PlayingRoom: envPlayingRoom,
        Alley: envAlley,
        Sky: envSky,
        Bridge: envBridge,
        Gallery: envGallery,
        None: null,
        Snow: envSnow,
        LivingRoom: envLivingRoom,
        Street: envStreet,
        Church: envChurch,
        Restaurant: envRestaurant,
        BedRoom: envBedRoom,
        BathRoom: envBathRoom,
        Town: envTown,
    };

    const environmentLightPresets = {
        Square: [0.4, 0.2],
        Park: [0.4, 0.2],
        PlayingRoom: [0.6, 0.4],
        Alley: [0.5, 0.3],
        Sky: [0.5, 0.7],
        Bridge: [0.5, 0.2],
        Gallery: [0.4, 0.6],
        None: [0.7, 0.3],
        Snow: [0.4, 0.2],
        LivingRoom: [0.35, 0.65],
        Street: [0.4, 0.6],
        Church: [0.2, 0.8],
        Restaurant: [0.5, 0.35],
        BedRoom: [0.4, 0.5],
        BathRoom: [0.3, 0.7],
        Town: [0.3, 0.2],
    };

    return { environmentMaps, environmentLightPresets };
}
