import * as TWEEN from '@tweenjs/tween.js';
import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Controls = require('three-orbit-controls')(THREE);

interface State {
  n: number;
  ready: boolean;
  play: boolean;
  height: number;
  width: number;
}

interface Props {
  song: string;
}

interface Point {
  l: number;
  t: number;
  x: number;
  y: number;
  z: number;
  event_type: string;
  voice: number;
}

export default class Renderer extends React.Component<Props, State> {
  private static fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;
      uniform float time;
      
      void main() {
          vec3 p = mod((gl_FragCoord.xyz), 100.0); 
          float r = fract(sin(dot(p.xyz ,vec3(12.9898,78.233, 24.3421))) * 43758.5453);
          gl_FragColor = vec4(sin(colorA.r + r), sin(colorA.g + r) - 0.05, sin(colorA.b + r), 0.03);
      }
  `;
  }

  private static vertexShader() {
    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;
  }
  private static calculateXPos(x: number): number {
    const rand = 3 * (Math.random() * 2 - 1);
    return -(((x * 4) / 5) * window.innerWidth) + rand;
  }

  private static calculateYPos(y: number): number {
    return Math.log(y) * 500 - 3200;
  }

  private static calculateZPos(t: number, l: number): number {
    return t * 150 - 1500 + l * 50;
  }
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry: any;
  private container: Element | null;
  private controls!: OrbitControls;
  private songDataJson!: Point[];
  private n: number;
  private t: number;
  private audio!: HTMLAudioElement;
  private id: number | null;
  constructor(props: Props) {
    super(props);
    this.n = 0;
    this.t = 0.0;
    this.container = null;
    this.id = null;

    this.state = {
      height: window.innerHeight,
      n: 0,
      play: false,
      ready: false,
      width: window.innerWidth,
    };
  }
  public render() {
    return (
      <div>
        {this.renderStartButton()}
        <div
          ref={el => {
            this.container = el;
          }}
        />
      </div>
    );
  }

  public startAnimation = () => {
    this.t = Date.now();
    this.audio.play();
    this.animate();
    this.setState({
      ...this.state,
      play: true,
    });
  };

  public renderStartButton = () => {
    if (this.state.play && this.state.ready) {
      return;
    } else if (this.state.ready) {
      return (
        <div onClick={this.startAnimation} style={{ position: 'absolute', backgroundColor: 'red' }}>
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>
            Start
          </p>
        </div>
      );
    } else {
      return (
        <div style={{ position: 'absolute', backgroundColor: 'Blue' }}>
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>
            Wait.
          </p>
        </div>
      );
    }
  };

  public async componentDidMount() {
    await this.getData(this.props.song);
    this.setUpThreeJS();
    this.setState({
      ...this.state,
      ready: true,
    });
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  public componentWillUpdate() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public setupContainer() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  public setupScene() {
    this.scene.background = new THREE.Color(0x404040);
    // const light = new THREE.AmbientLight(0xffaa00);
    // this.scene.add(light);
  }

  public setUpThreeJS() {
    this.scene = new THREE.Scene();
    this.setupScene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 30000);
    this.controls = new Controls(this.camera, this.container);

    this.camera.lookAt(this.scene.position);
    this.camera.position.set(0, 0, 500);
    this.controls.update();
    const last = this.songDataJson[this.songDataJson.length - 1];
    this.tweenCamera(this.camera, this.controls, last.t, last.l);

    this.geometry = new THREE.BoxBufferGeometry(20, 20, 20);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    }
  }

  public animate() {
    if (this.n < this.songDataJson.length) {
      this.renderPoints();
    }

    this.render();
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    this.id = requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();
  }
  public updateDimensions() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  public componentWillUnmount() {
    this.audio.pause();
    if (this.id) {
      window.cancelAnimationFrame(this.id);
    }
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  public async getData(song: string) {
    const url = `/songs/${song}.mp3`;
    this.audio = new Audio(url);
    this.songDataJson = await this.readJson(song);
  }
  public readJson = async (song: string): Promise<Point[]> => {
    const response = await fetch(`/songs/${song}.socool.json`);
    return response.json();
  };
  public getPoints = (currentTime: number) => {
    let go = true;
    const points = [];
    while (go) {
      const point = this.songDataJson[this.n];
      if (point && point.t < currentTime) {
        points.push(point);
        this.n += 1;
      } else {
        go = false;
      }
    }
    return points;
  };
  public renderPoints = () => {
    const currentTime = (Date.now() - this.t) / 1000;
    const points = this.getPoints(currentTime);
    for (const point of points) {
      if (this.songDataJson.length > 0) {
        if (point.z > 0.0 && point.y > 20.0 && point.event_type === 'On') {
          let object;
          // if (
          //   point.l > 0.3 ||
          //   this.props.song === 'bach_prelude_2' ||
          //   this.props.song === 'bach_prelude_3' ||
          //   this.props.song === 'template' ||
          //   this.props.song === 'bach_fugue_1'
          // ) {
          object = this.createObject(point);
          // } else {
          //   object = this.createSprite(point);
          // }
          this.scene.add(object);
        }
      }
    }
  };

  public createObject(point: Point): THREE.Mesh {
    const uniforms = {
      colorA: { type: 'vec3', value: new THREE.Color((point.voice / 50) * 0xffffff) },
      colorB: { type: 'vec3', value: new THREE.Color((point.voice / 50) * 0xffffee) },
    };

    const material = new THREE.ShaderMaterial({
      fragmentShader: Renderer.fragmentShader(),
      uniforms,
      vertexShader: Renderer.vertexShader(),
    });
    // const material = new THREE.MeshLambertMaterial({ color: (point.voice / 50) * 0xffffff });
    const object = new THREE.Mesh(this.geometry, material);

    const time = point.t * 150 - 1500 + point.l * 50;
    const scale = Math.exp(point.z) - 0.15;
    object.position.x = Renderer.calculateXPos(point.x);
    object.position.y = Renderer.calculateYPos(point.y);
    object.position.z = Renderer.calculateZPos(point.t, point.l);

    if (point.l < 0.3) {
      object.scale.x = scale;
      object.scale.y = scale;
      object.scale.z = point.l * 8;
    } else {
      object.scale.x = 0.00001;
      object.scale.y = 0.00001;
      object.scale.z = 0.00001;
      this.tweenObject(object, point.l, time, scale);
    }
    // object.lookAt(this.camera.position);
    return object;
  }

  public createSprite(point: Point): THREE.Sprite {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: (point.voice / 50) * 0xffffff })
    );
    const scale = Math.exp(point.z) - 0.5 * 30;
    sprite.position.set(
      Renderer.calculateXPos(point.x),
      Renderer.calculateYPos(point.y),
      Renderer.calculateZPos(point.t, point.l)
    );
    sprite.scale.set(scale / 2, scale, scale * 10);

    return sprite;
  }

  public tweenObject(o: THREE.Mesh, l: number, t: number, scale: number) {
    new TWEEN.Tween({
      position: l * 80,
      scale: 0,
    })
      .to(
        {
          position: 0,
          scale: l * 8,
        },
        l * 1000
      )
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .onUpdate(function(this: any) {
        o.scale.x = scale;
        o.scale.y = scale;
        o.scale.z = this._object.scale;
        o.position.z = t - this._object.position + l * 2;
      })
      .start();
  }

  public tweenCamera(camera: THREE.PerspectiveCamera, controls: any, t: number, l: number) {
    new TWEEN.Tween({
      position: 0,
    })
      .to(
        {
          position: Renderer.calculateZPos(t, l),
        },
        t * 1000
      )
      .onUpdate(function(this: any) {
        // camera.position.z = camera.position.z + (1 / t) * 70;
        // controls.target.z = controls.target.z + (1 / t) * 70;
        camera.position.z += this._object.position - camera.position.z + 1000;
        controls.target.z += this._object.position - controls.target.z - 2000;
      })
      .start();
  }
}
