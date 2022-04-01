import React, { useEffect, useRef, useState } from "react";
import { StyledPageHome } from "./styled/StyledPageHome";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export const PageHome: React.FC = () => {
    const rendererContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mixer: THREE.AnimationMixer;

        const clock = new THREE.Clock();
        const container = rendererContainerRef.current;
        if (!container) {
            return;
        }

        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xbfe3dd);
        scene.environment = pmremGenerator.fromScene(
            new RoomEnvironment(),
            0.04
        ).texture;

        const camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            1,
            100
        );
        camera.position.set(5, 2, 8);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.5, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath("js/libs/draco/gltf/");

        const loader = new GLTFLoader();
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            require("../../assets/demo1.glb"),
            function (gltf) {
                console.log(gltf);
                const model = gltf.scene;
                model.position.set(1, 1, 0);
                model.scale.set(1, 1, 1);
                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                mixer.clipAction(gltf.animations[0]).play();

                animate();
            },
            void 0,
            function (e) {
                console.error(e);
            }
        );

        window.onresize = function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            mixer.update(delta);

            controls.update();

            renderer.render(scene, camera);
        }
    }, []);

    return (
        <StyledPageHome>
            <div ref={rendererContainerRef}></div>
        </StyledPageHome>
    );
};
