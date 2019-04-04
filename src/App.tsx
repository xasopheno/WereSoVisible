import React from 'react';
import * as THREE from 'three';
import song from './tokyo';
const OrbitControls = require('three-orbit-controls')(THREE);

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
  private container: any;
  private theta: any;
  private controls: any;
  private data: any;
  private n: number;
  constructor(props: any) {
    super(props);
    this.theta = 0.0;
    this.n = 0;

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }
  public render(): any {
    // const theta = 0.1;
    // this.camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // this.camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    // this.camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    // this.camera.lookAt( this.scene.position );
    // this.camera.updateMatrixWorld();
    // // find intersections

    // this.renderer.render( this.scene, this.camera );
    return <div />;
  }

  // onWindowResize() {
  //   this.camera.aspect = window.innerWidth / window.innerHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);
  // }
  public readJson() {
    return song.data;
  }
  public render_points() {
    for (let i = this.n; i < this.data.length; i++) {
      if (this.data[i].z > 0.0 && this.data[i].y > 20.0 && this.data[i].event_type === 'On') {
        const point = this.data[i];
        const object = new THREE.Mesh(
          this.geometry,
          new THREE.MeshLambertMaterial({ color: (point.voice / 50) * 0xffffff })
        );
        object.position.x = point.x * 500;
        object.position.y = Math.log(point.y) * 200 - 1000;
        object.position.z = point.t * 150;
        // object.rotation.x = Math.random() * 2 * Math.PI;
        // object.rotation.y = Math.random() * 2 * Math.PI;
        // object.rotation.z = Math.random() * 2 * Math.PI;
        const scale = Math.exp(point.z) - 0.5;
        object.scale.x = scale;
        object.scale.y = scale;
        object.scale.z = point.l * scale;

        this.scene.add(object);
        this.n += 100;
      }
    }
  }

  public componentDidMount() {
    this.data = this.readJson();
    // this.updateDimensions();
    // window.addEventListener('resize', this.updateDimensions.bind(this));
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

    this.camera.position.set(0, 0, 600);
    this.controls.update();

    // this.camera.position.z = 600;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x404040);
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    this.scene.add(light);
    // const light = new THREE.DirectionalLight( 0xffffff, 1 );
    // light.position.set( 1, 1, 1 ).normalize();
    this.scene.add(light);
    this.geometry = new THREE.BoxBufferGeometry(20, 20, 20);


    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.container.appendChild(this.renderer.domElement);

    // window.addEventListener('resize', this.onWindowResize, false)
    this.animate();
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    // this.theta += 0.1;
    // this.camera.position.x = 100 * Math.sin( THREE.Math.degToRad( this.theta ) );
    // this.camera.position.y = 100 * Math.sin( THREE.Math.degToRad( this.theta ) );
    // this.camera.position.z = 100 * Math.cos( THREE.Math.degToRad( this.theta ) );
    // this.camera.lookAt( this.scene.position );
    // this.camera.updateMatrixWorld();
    // this.time = Date.now() * 0.001;
    // this.points.rotation.x = 0.01;
    // this.points.rotation.y = this.time * 0.4;
    // this.points.rotation.y = 0.25;

    // this.controls.update();

    this.render_points();

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
