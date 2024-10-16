import { SingleServiceImplementation } from '@wroud/di/types';
import { IDependencyType } from './IDependencyType.js';

export type IManifest = [SingleServiceImplementation<any>, IDependencyType][];
