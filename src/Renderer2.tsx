import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
//import * as TWEEN from '@tweenjs/tween.js';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Data, { Point } from './Data';
import { fragmentShader, vertexShader } from './Shaders';
import Sound from './Sound';
import Start from './Start';
const Controls = require('three-orbit-controls')(THREE);
//import styled from 'styled-components';

const timeMul = 150;
const lengthMul = 50;
const timeOffset = 1100;

const calculateXPos = (x: number): number => {
  return -(x * window.outerWidth * 0.8);
};

const calculateYPos = (y: number): number => {
  return y * (1.8 * window.outerHeight) - window.outerHeight * 0.9;
};

const calculateZPos = (t: number, l: number): number => {
  return t * timeMul + l * lengthMul;
};
const Renderer2 = (props: { data: Data; audio: Sound }) => {
  console.log(props);
  const [renderSpace, setRenderSpace] = useState<Element | null>();
  const [t, setT] = useState<number | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x404040);
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 30000);
  camera.updateProjectionMatrix();

  const controls = new Controls(camera, renderSpace);
  camera.lookAt(scene.position);
  camera.position.set(0, 0, 0);
  controls.update();

  const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
  renderer.render(scene, camera);

  useEffect(() => {
    if (renderSpace) {
      renderSpace.appendChild(renderer.domElement);
    }
  }, []);

  //useEffect(() => {
  //if (renderSpace && playing) {
  //startAnimation();
  //}
  //}, [renderSpace, playing]);

  const startAnimation = () => {
    setT(Date.now());
    const last = props.data.events[props.data.events.length - 1];
    props.audio.play();
    //animate();
    setPlaying(true);
    //tweenCamera(camera, controls, last.t, last.l)
  };

  //const animate = () => {
  //if (props.data.n < props.data.events.length) {
  //console.log('animate');
  //renderPoints();
  //}

  ////render();
  //controls.update();

  //renderer.render(scene, camera);
  //setId(requestAnimationFrame(animate));
  ////TWEEN.update();
  //};

  //const renderPoints = () => {
  //console.log(renderPoints);
  //if (t) {
  //const currentTime = (Date.now() - t) / 1000;
  //const points = props.data.getPoints(currentTime);
  //for (const point of points) {
  //if (props.data.events.length > 0) {
  //let object;
  //object = createObject(point);
  //scene.add(object);
  //}
  //}
  //}
  //};

  //const createObject = (point: Point): THREE.Mesh => {
  //const ta = 3.0;
  //const uniforms = {
  //colorA: { type: 'vec3', value: new THREE.Color((point.voice / 50) * 0xffffff) },
  //colorB: { type: 'vec3', value: new THREE.Color((point.voice / 50) * 0xffffee) },
  //ta: { type: 'f', value: ta },
  //};

  //const material = new THREE.ShaderMaterial({
  //fragmentShader: fragmentShader(),
  //uniforms,
  //vertexShader: vertexShader(),
  //});
  //// const material = new THREE.MeshLambertMaterial({ color: (point.voice / 50) * 0xffffff });
  //const object = new THREE.Mesh(geometry, material);

  //const time = point.t * timeMul - timeOffset + point.l * lengthMul;
  //const scale = Math.exp(point.z);
  //object.position.x = calculateXPos(point.x);
  //object.position.y = calculateYPos(point.y);
  //object.position.z = calculateZPos(point.t, point.l);

  //object.scale.x = 0.00001;
  //object.scale.y = 0.00001;
  //object.scale.z = 0.00001;
  ////this.tweenObject(object, point.l, time, scale);
  //return object;
  //};

  return (
    <div>
      <Start ready={true} play={false} startAnimation={startAnimation} />

      <div
        ref={el => {
          setRenderSpace(el);
        }}
      />
    </div>
  );
};

export default Renderer2;
