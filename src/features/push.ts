import vscode from 'vscode';
import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';

export async function push() {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  const answer = (
    await vscode.window.showQuickPick(['Yes', 'No'], {
      title: 'Push All Commits',
      placeHolder:
        'All of the commits will be pushed to the remote repository. Are you sure?',
    })
  )?.trim();

  if (answer === 'Yes') {
    gitRepositoriesService.push();
  }
}
