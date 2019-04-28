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
  private container: Element | null;
  private controls!: any;
  private songDataJson!: Point[];
  private n: number;
  private t: number;
  private audio!: HTMLAudioElement;
  private song: string;
  private play: boolean;
  private id: number | null;
  constructor(props: Props) {
    super(props);
    this.n = 0;
    this.t = 0.0;
    this.song = this.props.song;
    this.container = null;
    this.play = true;
    this.id = null;

    this.state = {
      height: window.innerHeight,
      n: 0,
      width: window.innerWidth,
    };
  }
  public render() {
    return (
      <div>
        <div onClick={this.startRender} style={{ position: 'absolute', backgroundColor: 'red' }}>
          <p style={{ paddingLeft: '5px', paddingRight: '5px', color: 'white', size: '14px' }}>
            Start
          </p>
        </div>
        <div
          ref={el => {
            this.container = el;
          }}
        />
      </div>
    );
  }

  public async getData(song: string) {
    const url = `/${song}.mp3`;
    this.audio = new Audio(url);
    this.songDataJson = await this.readJson(song);
  }

  public async componentDidMount() {
    await this.getData(this.props.song);
    this.setUpThreeJS();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  public readJson = async (song: string): Promise<Point[]> => {
    const response = await fetch(`/${song}.socool.json`);
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
          const object = this.createObject(point);
          this.scene.add(object);
        }
      }
    }
  };
  public createObject(point: Point): THREE.Mesh {
    const material = new THREE.MeshBasicMaterial({ color: (point.voice / 50) * 0xffffff })
    // material.wireframe = true;
    const object = new THREE.Mesh(
      this.geometry,
      material
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

  public createSprite(point: Point): THREE.Sprite {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: (point.voice / 50) * 0xffffff }) );
    const rand = 3 * (Math.random() * 2 - 1);
    const time = point.t * 150 - 1500 + point.l * 50;
    const scale = Math.exp(point.z) - 0.5 * 50;
    sprite.position.set(point.x * 1300 + rand, Math.log(point.y) * 500 - 3200, time);
    // sprite.position.x = point.x * 1300 + rand;
    // sprite.position.y = Math.log(point.y) * 500 - 3200;
    // sprite.position.z = time;
    sprite.scale.set(scale, scale, scale);
    // sprite.scale.x = scale;
    // sprite.scale.y = scale;
    // sprite.scale.z = point.l * 8;

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

  public tweenCamera(camera: THREE.PerspectiveCamera, controls: any, t: number) {
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
        camera.position.z = camera.position.z + (1 / t) * 70;
        controls.target.z = controls.target.z + (1 / t) * 70;
      })
      .start();
  }

  public setupContainer() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  public setupScene() {
    this.scene.background = new THREE.Color(0x404040);
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    this.scene.add(light);
  }

  public setUpThreeJS() {
    this.scene = new THREE.Scene();
    this.setupScene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 30000);
    this.controls = new OrbitControls(this.camera, this.container);

    this.camera.lookAt(this.scene.position);
    this.camera.position.set(3000, 400, -100);
    this.controls.update();
    this.tweenCamera(this.camera, this.controls, this.songDataJson[this.songDataJson.length - 1].t)
    // this.camera.position.set(0, 0, 300);

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
    // if (this.play === true) {
    this.id = requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();
    // }
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
  public componentWillUnmount() {
    this.audio.pause();
    if (this.id) {
      window.cancelAnimationFrame(this.id);
    }
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  public startRender = () => {
    this.t = Date.now();
    this.audio.play();
    this.animate();
  };
}
