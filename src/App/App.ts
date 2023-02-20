import { PublicViewer, Reflector, THREE, Scene } from '@s0rt/3d-viewer';

import chessboard from './assets/chess.gltf';
import configureControls from './configureControls';

export default class App extends THREE.EventDispatcher {
  public viewer: PublicViewer;

  private scene: Scene;

  constructor(viewer: PublicViewer) {
    super();
    this.viewer = viewer;
  }

  public async start() {
    let scene = this.viewer.viewer.getScene("chess");

    if (!scene) {
      scene = this.viewer.viewer.createScene("chess");
      this.scene = scene;
      this.viewer.viewer.setScene(scene);

      this.viewer.addTasks({
        parallelTasks: [
          { task: async () => await this.scene.loadAsset(chessboard) }
        ]
      });
      await this.viewer.launchTasks();
      this.setBoardReflections();
      this.scene.playAllAnimations();
      this.setPawnAnimationOffets();
    }

    this.viewer.viewer.setScene(scene);

    configureControls(this.viewer.viewer);
    this.setCameraPosition();
    (scene.getObjectByName('chess-reflector') as Reflector).start();
  }

  public stop() {
    (this.viewer.viewer.scene.getObjectByName('chess-reflector') as Reflector).stop();
  }

  private setCameraPosition() {
    const { camera, controls } = this.viewer.viewer;

    camera.position.set(-0.637, 0.399, -0.567);

    camera.fov = 50;
    camera.updateProjectionMatrix();

    controls.minDistance = 0.01;
    controls.maxDistance = 1;
    controls.update();
  }

  private setPawnAnimationOffets() {
    this.scene.getAllAnimations()
      .filter((animationMixer: THREE.AnimationMixer) => {
        const mesh = animationMixer.getRoot() as THREE.Mesh;
        return mesh.name.includes('Pawn') && mesh.type == 'SkinnedMesh';
      })
      .forEach((animationMixer: THREE.AnimationMixer, index: number) => {
        animationMixer.setTime(index / 16);
      });
  }

  private setBoardReflections() {
    const board =
      this.viewer.viewer.scene.getObjectByName('Chessboard') as THREE.Mesh;

    const reflector = new Reflector(
      this.viewer.viewer, this.scene, board, { textureWidth: 1024, textureHeight: 1024 });
    reflector.name = "chess-reflector";
    reflector.rotateX(-Math.PI / 2);
    this.viewer.viewer.scene.add(reflector);
  }

  public dispose() {
    (this.viewer.viewer.scene.getObjectByName('chess-reflector') as Reflector).dispose();
    this.viewer.dispose();
  }
}
