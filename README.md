## How to use it

1. Open command palette (CMD/ctrl + shift + P)
2. Type "wttm"
3. See the available commands
4. Execute the one you need

## Features

- Time Travel To Commit - switches repository to the specific commit + switches other repositories to the closest by the date commits.
- Time Travel To Branch - switches repository to the specific branch. If branch is not found it stays as it is.
- Time Travel To Default Branch - switches each repository to the default branches. The default branch can be configured in VSCode settings
- Pull All - Pulls coming code in each repository
- Merge All - Merges branch by name to all repositories current branch
- Discard Changes - Discard changes in each repository
- Commit All - Commits all staged files in each repository
- Push All - Pushes all commits in each repository

## Install

Just simply execute: `yarn install` and you are ready to go

## Release Notes

### 0.0.1

- Initial release of the "Workspace Time Travel Machine"

### 0.1.1

vAdded travel by branch name

### 0.1.2

- Renamed extension
- Renamed Travel To Master -> Travel To Default Branch
- Cropped icon
- Grouped Time Travel features into one group

### 0.1.3

- Fixes icon size

### 0.1.4

- Added "Merge All" feature
- Added ability to Discard changes for staged files
- Removed "Invalid option" error

### 0.1.5

- Added "Commit Changes" feature
- Added "Push All Commits" feature
- Fixed readme
