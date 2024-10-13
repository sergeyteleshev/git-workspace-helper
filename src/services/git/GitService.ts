import vscode from 'vscode';
import { API, GitExtension } from '../../types/git.js';
import { injectable } from '@wroud/di';

@injectable()
export class GitService {
  API: API;

  constructor() {
    const gitExtension =
      vscode.extensions.getExtension<GitExtension>('vscode.git');

    if (!gitExtension) {
      throw new Error('Git extension not found');
    }

    this.API = gitExtension.exports.getAPI(1);
  }
}
