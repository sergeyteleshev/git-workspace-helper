## How to use it

1. Open command palette (CMD/ctrl + shift + P)
2. Type "gwh"
3. See the available commands
4. Execute the one you need

## Features

- Commit All - Commits all staged files in each repository
- Push All - Pushes all commits in each repository
- Merge All To Current Branch - Merges branch by name to all repositories current branch
- Pull All - Pulls coming code in each repository
- Configure Active Repositories - Sets active repositories which will be used for other listed commands. By default all repositories in workspace are selected
- Checkout To Commit - switches repository to the specific commit + switches other repositories to the closest by the date commits.
- Checkout To Branch - switches repository to the specific branch. If branch is not found it stays as it is.
- Checkout To Default Branch - switches each repository to the default branches. The default branch can be configured in VSCode settings
- Discard Changes - Discard changes in each repository
- Stage All - Stages all changes in each repository
- Unstage All - Unstages all changes in each repository

## Install

Just simply execute: `yarn install` and you are ready to go
