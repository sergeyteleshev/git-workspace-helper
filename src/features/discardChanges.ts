import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoryTravelService } from '../services/git/GitRepositoryTravelService';
import vscode from 'vscode';

export async function discardChanges() {
  const diContainerService = new DIContainerService();
  const gitRepositoryTravelService = diContainerService.getByClassName(
    GitRepositoryTravelService
  );

  const shouldDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
    title: 'Discard changes',
    placeHolder: 'All of the changes will be removed. Are you sure?',
  });

  if (shouldDelete === 'Yes') {
    gitRepositoryTravelService.discardChanges();
  }
}
