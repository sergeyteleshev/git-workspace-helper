import { injectable } from '@wroud/di';
import { getStashFullDate } from '../../helpers/getStashFullDate.js';
import vscode, { QuickPickOptions } from 'vscode';
import { SimpleGitRepositoriesService } from '../git/SimpleGitRepositoriesService.js';

@injectable(() => [SimpleGitRepositoriesService])
export class PickStashService {
  constructor(
    private readonly simpleGitRepositoriesService: SimpleGitRepositoriesService
  ) {}

  async pickStash(options: QuickPickOptions) {
    const activeRepositories =
      await this.simpleGitRepositoriesService.getActiveRepositories();

    if (activeRepositories.length === 0) {
      vscode.window.showErrorMessage('No active repositories');
      return;
    }

    const stashesWithoutCollisions =
      await this.simpleGitRepositoriesService.getStashesWithoutCollisions();

    if (stashesWithoutCollisions.length === 0) {
      vscode.window.showErrorMessage('No stashes found');
      return;
    }

    const selectedStash = await vscode.window.showQuickPick(
      stashesWithoutCollisions.map((stash) => ({
        label: stash.message,
        description: getStashFullDate(stash),
        value: stash.index,
      })),
      options
    );

    if (!selectedStash) {
      return;
    }

    return stashesWithoutCollisions.find(
      (stash) =>
        stash.index === selectedStash.value &&
        stash.message === selectedStash.label &&
        selectedStash.description === getStashFullDate(stash)
    );
  }
}
