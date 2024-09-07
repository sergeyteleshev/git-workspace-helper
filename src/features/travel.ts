import vscode from 'vscode';
import { GitRepositoryTravelService } from '../services/git/GitRepositoryTravelService';
import { DIContainerService } from '../DI/DIContainer';
import { isSha } from '../helpers/isSha';

enum TravelType {
  BranchName = 'By branch name',
  CommitSha = 'By commit SHA',
  DefaultBranch = 'To default branch',
}

const TRAVEL_OPTIONS: TravelType[] = [
  TravelType.BranchName,
  TravelType.CommitSha,
  TravelType.DefaultBranch,
];

async function travelByBranchName() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryTravelService = dIContainerService.getByClassName(
    GitRepositoryTravelService
  );

  const branchNameCandidate = (
    await vscode.window.showInputBox({
      placeHolder: 'Enter branch name',
      title: 'Branch name',
    })
  )?.trim();

  if (!branchNameCandidate) {
    return;
  }

  gitRepositoryTravelService.travelByBranchName(branchNameCandidate);
}

async function travelBySha() {
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

export async function travelToDefaultBranch() {
  const dIContainerService = new DIContainerService();
  const gitRepositoryTravelService = dIContainerService.getByClassName(
    GitRepositoryTravelService
  );

  gitRepositoryTravelService.travelToDefaultBranch();
}

export async function travel() {
  const result = await vscode.window.showQuickPick(TRAVEL_OPTIONS);

  if (!result) {
    return;
  }

  if (result === TravelType.BranchName) {
    travelByBranchName();
    return;
  }

  if (result === TravelType.CommitSha) {
    travelBySha();
    return;
  }

  if (result === TravelType.DefaultBranch) {
    travelToDefaultBranch();
    return;
  }
}
