import { PublicViewer, Reflector, THREE } from '@s0rt/3d-viewer';

import chessboard from './assets/chess.gltf';
import configureControls from './configureControls';

export default class App extends THREE.EventDispatcher {
  public viewer: PublicViewer;

  constructor(viewer: PublicViewer) {
    super();
    this.viewer = viewer;
  }

  public async start() {
    let scene = this.viewer.viewer.getScene("chess");

    if (!scene) {
      scene = this.viewer.viewer.createScene("chess");
      this.viewer.viewer.setScene(scene);

      this.viewer.addTasks({
        parallelTasks: [
          { task: async () => await this.viewer.loadAsset(chessboard) }
        ]
      });
      await this.viewer.launchTasks();
      this.setBoardReflections();
      this.viewer.playAllAnimations();
      this.setPawnAnimationOffets();
    }

    this.viewer.viewer.setScene(scene);

    configureControls(this.viewer.viewer);
    this.setCameraPosition();
    (this.viewer.viewer.scene.getObjectByName('chess-reflector') as Reflector).start(this.viewer.viewer);
  }

  public stop() {
    (this.viewer.viewer.scene.getObjectByName('chess-reflector') as Reflector).stop(this.viewer.viewer);
  }

  private setCameraPosition() {
    this.viewer.viewer.camera.position.x = -9.1;
    this.viewer.viewer.camera.position.y = 5.7;
    this.viewer.viewer.camera.position.z = -8.1;
  }

  private setPawnAnimationOffets() {
    this.viewer.getAllAnimations()
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
      this.viewer.viewer, board, { textureWidth: 1024, textureHeight: 1024 });
    reflector.name = "chess-reflector";
    reflector.rotateX(-Math.PI / 2);
    this.viewer.viewer.scene.add(reflector);
  }
}
