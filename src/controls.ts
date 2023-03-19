import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import camera from './camera';

const controls = new OrbitControls(camera);

export {
  controls,
}