import * as TWEEN from '@tweenjs/tween.js';
import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Data, { Point } from './Data';
import { fragmentShader, vertexShader } from './Shaders';
import Sound from './Sound';
import Start from './Start';
const Controls = require('three-orbit-controls')(THREE);


interface State {
  ready: boolean;
  play: boolean;
}

interface Props {
  song: string;
}

const timeMul = 150;
const lengthMul = 50;
const timeOffset = 1100;


export default class Renderer extends React.Component<Props, State> {
  private static calculateXPos(x: number): number {
    return -(x * window.innerWidth);
  }

  private static calculateYPos(y: number): number {
    return y * 2 * window.innerHeight - window.innerHeight;
  }

  private static calculateZPos(t: number, l: number): number {
    return t * timeMul - timeOffset + l * lengthMul;
  }
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry: any;
  private container: Element | null;
  private controls!: OrbitControls;
  private t: number;
  private id: number | null;
  private data!: Data;
  private audio: Sound | null;
  constructor(props: Props) {
    super(props);
    this.t = 0.0;
    this.container = null;
    this.id = null;
    this.audio = null;

    this.state = {
      play: false,
      ready: false,
    }!;
  }

  public render() {
    return (
      <div>
        <Start
          ready={this.state.ready}
          play={this.state.play}
          startAnimation={this.startAnimation}
        />
        <div
          ref={el => {
            this.container = el;
          }}
        />
      </div>
    );
  }

  public startAnimation = async () => {
    this.t = Date.now();
    if (this.audio) {
      await this.audio.play();
    }
    this.animate();
    const last = this.data.events[this.data.events.length - 1];
    this.tweenCamera(this.camera, this.controls, last.t, last.l);
    this.setState({
      ...this.state,
      play: true,
    });
  };

  public async componentDidMount() {
    this.setUpThreeJS();
    this.setState({
      ...this.state,
      ready: true,
    });
    window.addEventListener('resize', this.updateDimensions.bind(this));
    window.addEventListener('keydown', async e => {
      if (this.state.ready && !this.state.play && e.code === 'Space') {
        e.preventDefault();
        await this.startAnimation();
      }
    });
    await this.getData(this.props.song);
  }

  public async componentWillUnmount() {
    if (this.audio) {
      this.audio.fadeOut();
    }
    if (this.id) {
      window.cancelAnimationFrame(this.id);
    }

    window.removeEventListener('resize', this.updateDimensions.bind(this));
    window.removeEventListener('keydown', async e => {
      if (this.state.ready && !this.state.play && e.code === 'Space') {
        e.preventDefault();
        await this.startAnimation();
      }
    });
  }

  public componentWillUpdate() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, true);
  }

  public setupScene() {
    this.scene.background = new THREE.Color(0x404040);
  }

  public setUpThreeJS() {
    this.scene = new THREE.Scene();
    this.setupScene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 30000);
    this.controls = new Controls(this.camera, this.container);

    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 0, 0);
    this.controls.update();

    this.geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    }
  }

  public animate() {
    if (this.data.n < this.data.events.length) {
      this.renderPoints();
    }

    this.render();
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    this.id = requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();
  }

  public updateDimensions() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight, true);
  }

  public async getData(song: string) {
    this.audio = new Sound(song);
    this.data = new Data();
    await this.data.getData(song);
  }

  public renderPoints = () => {
    const currentTime = (Date.now() - this.t) / 1000;
    const points = this.data.getPoints(currentTime);
    for (const point of points) {
      if (this.data.events.length > 0) {
        let object;
        object = this.createObject(point);
        this.scene.add(object);
      }
    }
  };

  public createObject(point: Point): THREE.Mesh {
    const ta = 3.0;
    const uniforms = {
      colorA: { type: 'vec3', value: new THREE.Color((point.voice / 50) * 0xffffff) },
      colorB: { type: 'vec3', value: new THREE.Color((point.voice / 50) * 0xffffee) },
      ta: { type: 'f', value: ta },
    };

    const material = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader(),
      uniforms,
      vertexShader: vertexShader(),
    });
    // const material = new THREE.MeshLambertMaterial({ color: (point.voice / 50) * 0xffffff });
    const object = new THREE.Mesh(this.geometry, material);

    const time = point.t * timeMul - timeOffset + point.l * lengthMul;
    const scale = Math.exp(point.z);
    object.position.x = Renderer.calculateXPos(point.x);
    object.position.y = Renderer.calculateYPos(point.y);
    object.position.z = Renderer.calculateZPos(point.t, point.l);

    object.scale.x = 0.00001;
    object.scale.y = 0.00001;
    object.scale.z = 0.00001;
    this.tweenObject(object, point.l, time, scale);
    return object;
  }

  public tweenObject(o: THREE.Mesh, l: number, t: number, scale: number) {
    new TWEEN.Tween({
      position: l * lengthMul,
      scale: 1.5,
      scale_z: 0,
    })
      .to(
        {
          position: 0,
          scale: 1,
          scale_z: l * 7,
        },
        l * 1000
      )
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .onUpdate(function(this: any) {
        o.scale.x = scale * this._object.scale;
        o.scale.y = scale * this._object.scale;
        o.scale.z = this._object.scale_z;
        o.position.z = t - this._object.position + l * 2;
      })
      .start();
  }

  public tweenCamera = (camera: THREE.PerspectiveCamera, controls: any, t: number, l: number) => {
    new TWEEN.Tween({
      position: 0,
    })
      .to(
        {
          position: this.data.length * timeMul,
        },
        this.data.length * 1000
      )
      .onUpdate(function(this: any) {
        camera.position.z = this._object.position + timeOffset;
        controls.target.z = this._object.position;
      })
      .start();
  };
}
