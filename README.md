# [Git Workspace Helper](https://marketplace.visualstudio.com/items?itemName=stelesh.git-workspace-helper)

![Version](https://img.shields.io/github/package-json/v/sergeyteleshev/git-workspace-helper)
![GitHub top language](https://img.shields.io/github/languages/top/sergeyteleshev/git-workspace-helper)

## How to use it

#### UI:

1. Go to Source Control feature
2. See the commands in the header ("..." - also here)
3. Execute the one you need

![ui feature preview](https://github.com/user-attachments/assets/4bdd915f-4a76-4d9c-b755-6b143503c053)

#### Command palette:

1. Open command palette (CMD/ctrl + shift + P)
2. Type "gwh"
3. See the available commands
4. Execute the one you need

![command palette feature preview](https://github.com/user-attachments/assets/eaf5aa32-5d4a-4cf9-8ee4-58b2b9e22ef0)

#### Settings

1. Go to VSCode settings
2. Search for "git workspace helper"
3. Configure the settings as you need

![settings preview](https://github.com/user-attachments/assets/4cb52417-d018-422d-8db2-a5386a22f252)

## Features

- Commit All - Commits all staged files in each repository
- Push All - Pushes all commits in each repository
- Merge All To Current Branch - Merges branch by name to all repositories current branch
- Pull All - Pulls coming code in each repository
- Create branch - Creates new branch for for all selected repositories
- Delete branch - Deletes branch for all selected repositories
- Stash Changes - Stashes changes in each repository
- Apply Stash - Applies/pops stash in each repository
- Drop Stash - Drops stash in each repository
- Configure Active Repositories - Sets active repositories which will be used for other listed commands. By default all repositories in workspace are selected
- Checkout To Commit - switches repository to the specific commit + switches other repositories to the closest by the date commits.
- Checkout To Branch - switches repository to the specific branch. If branch is not found it stays as it is.
- Checkout To Default Branch - switches each repository to the default branches. The default branch can be configured in VSCode settings
- Fetch - Fetches a data for each repository
- Create Tag - Creates new tag for for all selected repositories
- Delete Tag - Deletes tag for all selected repositories
- Discard Changes - Discard changes in each repository
- Stage All - Stages all changes in each repository
- Unstage All - Unstages all changes in each repository

## Install

Just simply execute: `yarn install` and you are ready to go
