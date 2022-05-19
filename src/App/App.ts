import {PublicViewer, Reflector, THREE} from '@s0rt/3d-viewer';
import {Texture} from 'three';
import {AnimationMixer} from 'three/src/animation/AnimationMixer';
import {Mesh} from 'three/src/objects/Mesh';

import chessboard from './assets/chess.gltf';

export default class App extends THREE.EventDispatcher {
  private viewer: PublicViewer;

  public async launch(elementId: string, iblPath: string, iblName: string) {
    this.viewer = new PublicViewer();
    this.viewer.addEventListener('taskCompleted', ({progression}) => {
      this.dispatchEvent({type: 'taskCompleted', progression});
    });

    this.viewer.addTasks({
      parallelTasks: [
        {
          task: async () => {
            await this.viewer.loadIbl(iblPath, iblName);
            this.viewer.setIblInViewSpace();
          }
        },
        {task: async () => await this.viewer.loadAsset(chessboard)}
      ]
    });
    await this.viewer.launch(elementId);
    this.viewer.addSkybox();
    this.setCameraPosition();
    this.viewer.playAllAnimations();
    this.setPawnAnimationOffets();
    this.setBoardReflections();
  }

  private setCameraPosition() {
    this.viewer.viewer.camera.position.x = -9.1;
    this.viewer.viewer.camera.position.y = 5.7;
    this.viewer.viewer.camera.position.z = -8.1;
  }

  private setPawnAnimationOffets() {
    this.viewer.getAllAnimations()
        .filter((animationMixer: AnimationMixer) => {
          const mesh = animationMixer.getRoot() as Mesh;
          return mesh.name.includes('Pawn') && mesh.type == 'SkinnedMesh';
        })
        .forEach((animationMixer: AnimationMixer, index: number) => {
          animationMixer.setTime(index / 16);
        });
  }

  private setBoardReflections() {
    const board =
        this.viewer.viewer.scene.getObjectByName('Chessboard') as Mesh;

    const reflector = new Reflector(
        this.viewer.viewer, board, {textureWidth: 1024, textureHeight: 1024});
    reflector.rotateX(-Math.PI / 2);
    this.viewer.viewer.scene.add(reflector);
  }
}
