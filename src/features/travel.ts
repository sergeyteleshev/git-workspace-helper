import vscode from 'vscode';
import { GitRepositoryTravelService } from '../services/git/GitRepositoryTravelService';
import { DIContainerService } from '../DI/DIContainer';
import { isSha } from '../helpers/isSha';

export async function travel() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryTravelService = dIContainerService.getByClassName(
    GitRepositoryTravelService
  );

  const shaCandidate = (
    await vscode.window.showInputBox({
      placeHolder: 'Enter commit SHA',
      title: 'Commit SHA',
    })
  )?.trim();

  if (!shaCandidate) {
    return;
  }

  if (!isSha(shaCandidate)) {
    vscode.window.showErrorMessage('Invalid commit SHA');
    return;
  }

  gitRepositoryTravelService.travelBySha(shaCandidate);
}
