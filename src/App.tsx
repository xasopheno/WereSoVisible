import React from 'react';
import * as THREE from 'three';
import song from './tokyo';
import * as TWEEN from '@tweenjs/tween.js';

const OrbitControls = require('three-orbit-controls')(THREE);

// interface Props {}

interface State {
  n: any;
  height: any;
  width: any;
  audio: any;
}

export default class App extends React.Component<{}, State> {
  private three: any;
  private scene: any;
  private camera: any;
  private renderer: any;
  private points: any;
  private directionalLight: any;
  private hemisphereLight: any;
  private geometry: any;
  private material: any;
  private cube: any;
  private time: any;
  private container: any;
  private theta: any;
  private controls: any;
  private data: any;
  private n: number;
  private t: number;
  private audio: any;
  private interval: any;
  constructor(props: any) {
    super(props);
    this.n = 0;
    this.t = 0.0;

    this.state = {
      audio: null,
      height: window.innerHeight,
      n: 0,
      width: window.innerWidth,
    };
  }
  public render(): any {
    return (
      <div>
        <div
          onClick={() => this.start()}
          style={{ position: 'absolute', backgroundColor: 'red' }}
        >
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>Start</p>
        </div>
        <div style={{ touchAction: 'none' }} />
      </div>
    );
  }

  // public getAudio = async () => {
  //   this.setState({
  //     ...this.state,
  //     audio: audio,
  //   });
  // }


  public readJson = async () => {
    return await song.data;
  }

  public getPoints = () => {
    const currentTime = (Date.now() - this.t) / 1000;
    let go = true;
    const points = [];
    while (go === true) {
      const point = this.data[this.n];
      if (point && point.t < currentTime) {
        points.push(point);
        this.n += 1;
      } else {
        go = false;
      }
    }
    return points;
  }

  public renderPoints = () => {
    const points = this.getPoints();
    for (const point of points) {
      if (this.data.length > 0) {
        if (point.z > 0.0 && point.y > 20.0 && point.event_type === 'On') {
          const object = new THREE.Mesh(
            this.geometry,
            new THREE.MeshLambertMaterial({ color: (point.voice / 50) * 0xffffff })
          );

          // const rand = point.voice * 0.2 * (Math.random() * 2) - 1; // * rand
          // const rand = point.voice * 0.01 * (Math.random() * 2) - 1;
          const rand = 3 * (Math.random() * 2 - 1);
          // const rand = 1.0;

          object.position.x = point.x * 800 + rand;
          object.position.y = Math.log(point.y) * 500 - 3200;
          object.position.z = point.t * 150 - 1500 + (point.l * 50);

          const scale = Math.exp(point.z) - 0.5;
          object.scale.x = scale;
          object.scale.y = scale;
          this.tweenObject(object, point.l, point.t);
          // object.scale.z = point.l * 9;

          this.scene.add(object);
        }
      }
    }
  }

  public tweenObject(o: any, l: number, t: number) {
    // TWEEN.removeAll();
    new TWEEN.Tween(o.scale)
      .to({ z: l * 9 }, t)
      // .onUpdate( this.render )
      .start();
  }

  public setUpThreeJS = () => {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    const info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    this.container.appendChild(info);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    this.controls = new OrbitControls(this.camera);

    // this.camera.position.set(-4000, 1000, 0);
    // this.camera.position.set(-400, 100, 4500);
    this.camera.position.set(3000, 400, 300);
    this.controls.update();

    this.scene = new THREE.Scene();
    this.camera.lookAt(this.scene.position);
    this.scene.background = new THREE.Color(0x404040);
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    this.scene.add(light);
    this.geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.container.appendChild(this.renderer.domElement);
  }

  public componentDidMount = async () => {
    const url = 'http://localhost:9000/tokyo.mp3';
    this.audio = await new Audio(url);
    this.data = await this.readJson();

    this.setUpThreeJS();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  public start = () => {
    this.t = Date.now();
    this.audio.play();
    this.animate();
  };

  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();

    if (this.n < this.data.length) {
      this.renderPoints();
    }

    this.render();
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  public updateDimensions() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  public componentWillUpdate() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  /**
   * Dipose
   */
  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }
}
