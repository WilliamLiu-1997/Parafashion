import * as THREE from 'three';

export function createDefaultMaterialPresets() {
    return {
        MeshBasicMaterial: {
            color: 0xffffff,
            reflectivity: 0.5,
            wireframe: false,
        },
        MeshLambertMaterial: {
            color: 0xffffff,
            emissive: 0x000000,
            emissiveIntensity: 1.0,
            reflectivity: 0.5,
            wireframe: false,
        },
        MeshPhongMaterial: {
            bumpScale: 1.0,
            color: 0xffffff,
            emissive: 0x000000,
            emissiveIntensity: 1.0,
            flatShading: false,
            normalScale: new THREE.Vector2(1, 1),
            reflectivity: 0.5,
            shininess: 30,
            specular: 0x111111,
            wireframe: false,
        },
        MeshToonMaterial: {
            bumpScale: 1.0,
            color: 0xffffff,
            emissive: 0x000000,
            emissiveIntensity: 1.0,
            normalScale: new THREE.Vector2(1, 1),
            wireframe: false,
        },
        MeshStandardMaterial: {
            bumpScale: 1.0,
            color: 0xffffff,
            emissive: 0x000000,
            emissiveIntensity: 1.0,
            flatShading: false,
            metalness: 0.0,
            normalScale: new THREE.Vector2(1, 1),
            roughness: 0.5,
            wireframe: false,
        },
        MeshPhysicalMaterial: {
            bumpScale: 1.0,
            color: 0xffffff,
            emissive: 0x000000,
            emissiveIntensity: 1.0,
            flatShading: false,
            metalness: 0.0,
            normalScale: new THREE.Vector2(1, 1),
            roughness: 0.5,
            wireframe: false,
            clearcoat: 0.0,
            clearcoatRoughness: 0.0,
            reflectivity: 0.5,
            sheenTint: 0x000000,
            transmission: 0,
            thickness: 0,
        },
    };
}

export function createMaterialFolderState() {
    return {
        MeshBasicMaterial: null,
        MeshLambertMaterial: null,
        MeshPhongMaterial: null,
        MeshToonMaterial: null,
        MeshStandardMaterial: null,
        MeshPhysicalMaterial: null,
    };
}
