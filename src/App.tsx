import React from 'react';
import song from './bach';
import * as THREE from 'three';

export default class App extends React.Component {
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
  constructor(props: any) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }
  public render() {
    return (
      <div
        className="three"
        ref={el => {
          this.three = el;
        }}
      />
    );
  }

  // onWindowResize() {
  //   this.camera.aspect = window.innerWidth / window.innerHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);
  // }
  public readJson() {
    return song.data;
  }

  public componentDidMount() {
    const data = this.readJson();
    // this.updateDimensions();
    // window.addEventListener('resize', this.updateDimensions.bind(this));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
    this.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
    this.camera.position.z = 2550;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.three.appendChild(this.renderer.domElement);

    this.time = Date.now();
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < data.length; i++) {
      // positions
      const x = data[i].x * 10000.0 / data[i].voice;
      const y = Math.log(data[i].y) * 100 - 500;
      const z = data[i].t * 5;
      positions.push(x, y, z);
      // colors
      const vx = data[i].y / 555.0;
      const vy = data[i].voice / 85.0;
      const vz = data[i].z;
      color.setRGB(vx, vy, vz);
      colors.push(color.r, color.g, color.b);
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    //
    const material = new THREE.PointsMaterial({ size: 15, vertexColors: THREE.VertexColors });
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    // window.addEventListener('resize', this.onWindowResize, false)
    this.animate();
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.time = Date.now() * 0.001;
    // this.points.rotation.x = this.time * 0.5;
    this.points.rotation.y = this.time * 0.3;
    // this.points.rotation.y = 0.25;
    this.render();
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
