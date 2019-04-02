import React from 'react';
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
  /**
   * Constructor
   */
  constructor(props: any) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }

  /**
   * Rendering
   */
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

  /**
   * Initialization
   */
  public componentDidMount() {
    // this.updateDimensions();
    // window.addEventListener('resize', this.updateDimensions.bind(this));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
    this.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
    this.camera.position.z = 2750;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.three.appendChild(this.renderer.domElement);

    this.time = Date.now();
    const particles = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();
    const n = 1000;
    const n2 = n / 2; // particles spread in the cube
    for (let i = 0; i < particles; i++) {
      // positions
      const x = Math.random() * n - n2;
      const y = Math.random() * n - n2;
      const z = Math.random() * n - n2;
      positions.push(x, y, z);
      // colors
      const vx = x / n + 0.5;
      const vy = y / n + 0.5;
      const vz = z / n + 0.5;
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

  /**
   * Animation loop
   */
  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.time = Date.now() * 0.001;
    this.points.rotation.x = this.time * 0.05;
    this.points.rotation.y = this.time * 0.05;
    this.render();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize operation handler, updating dimensions.
   * Setting state will invalidate the component
   * and call `componentWillUpdate()`.
   */
  public updateDimensions() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  /**
   * Invalidation handler, updating layout
   */
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
