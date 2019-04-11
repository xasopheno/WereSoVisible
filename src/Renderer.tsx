import * as TWEEN from '@tweenjs/tween.js';
import React from 'react';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

interface State {
  n: number;
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
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry: any;
  private container!: Element;
  private controls!: any;
  private songDataJson!: Point[];
  private n: number;
  private t: number;
  private audio!: HTMLAudioElement;
  private song: string;
  constructor(props: Props) {
    super(props);
    this.n = 0;
    this.t = 0.0;
    this.song = this.props.song;

    this.state = {
      height: window.innerHeight,
      n: 0,
      width: window.innerWidth,
    };
  }
  public render() {
    return (
      <div>
        <div onClick={this.start} style={{ position: 'absolute', backgroundColor: 'red' }}>
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>
            Start
          </p>
        </div>
        <div style={{ touchAction: 'none' }} />
      </div>
    );
  }

  public async componentDidMount() {
    const url = `/${this.song}.mp3`;
    this.audio = await new Audio(url);
    this.songDataJson = await this.readJson();

    this.setupContainer();
    this.setUpThreeJS();
    window.addEventListener('resize', this.updateDimensions.bind(this));
    window.addEventListener('touchstart', function(e) { if (e.targetTouches.length === 2) { e.preventDefault(); } }, { passive: false } );
  }

  public readJson = async (): Promise<Point[]> => {
    const response = await fetch(`/${this.song}.socool.json`);
    return response.json();
  };

  public getPoints = () => {
    const currentTime = (Date.now() - this.t) / 1000;
    let go = true;
    const points = [];
    while (go === true) {
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
    const points = this.getPoints();
    for (const point of points) {
      if (this.songDataJson.length > 0) {
        if (point.z > 0.0 && point.y > 20.0 && point.event_type === 'On') {
          const object = this.createObject(point);
          this.scene.add(object);
        }
      }
    }
  };
  public createObject(point: Point): THREE.Mesh {
    const object = new THREE.Mesh(
      this.geometry,
      new THREE.MeshLambertMaterial({ color: (point.voice / 50) * 0xffffff })
    );

    const rand = 3 * (Math.random() * 2 - 1);
    const time = point.t * 150 - 1500 + point.l * 50;
    const scale = Math.exp(point.z) - 0.5;
    object.position.x = point.x * 1300 + rand;
    object.position.y = Math.log(point.y) * 500 - 3200;
    object.position.z = time;

    if (point.l < 0.3) {
      object.scale.x = scale;
      object.scale.y = scale;
      object.scale.z = point.l * 8;
    } else {
      object.scale.x = 0;
      object.scale.y = 0;
      object.scale.z = 0;
      this.tweenObject(object, point.l, time, scale);
    }

    return object;
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

  public tweenCamera(camera: THREE.PerspectiveCamera, t: number) {
    new TWEEN.Tween({
      position: 0,
    })
      .to(
        {
          position: t * 200,
        },
        t * 1000
      )
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(function(this: any) {
        camera.position.z = camera.position.z + 1 / t * 200
      })
      .start();
  }

  public setupContainer() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    const info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    this.container.appendChild(info);
  }

  public setUpThreeJS() {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    this.controls = new OrbitControls(this.camera);

    // this.camera.position.set(3000, 400, 300);
    this.camera.position.set(0, 0, 300);
    this.controls.update();

    this.scene = new THREE.Scene();
    this.camera.lookAt(this.scene.position);

    this.tweenCamera(this.camera, this.songDataJson[this.songDataJson.length - 1].t);

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

  public animate() {
    if (this.n < this.songDataJson.length) {
      this.renderPoints();
    }

    this.render();
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();
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

  public start = () => {
    this.t = Date.now();
    this.audio.play();
    this.animate();
  };
}