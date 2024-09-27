## How to use it

1. Open command palette (CMD/ctrl + shift + P)
2. Type "wttm"
3. See the available commands
4. Execute the one you need

## Features

- Checkout To Commit - switches repository to the specific commit + switches other repositories to the closest by the date commits.
- Checkout To Branch - switches repository to the specific branch. If branch is not found it stays as it is.
- Checkout To Default Branch - switches each repository to the default branches. The default branch can be configured in VSCode settings
- Configure Active Repositories - Sets active repositories which will be used for other listed commands. By default all repositories in workspace are selected
- Pull All - Pulls coming code in each repository
- Merge All To Current Branch - Merges branch by name to all repositories current branch
- Discard Changes - Discard changes in each repository
- Commit All - Commits all staged files in each repository
- Push All - Pushes all commits in each repository
- Stage All - Stages all changes in each repository
- Unstage All - Unstages all changes in each repository

## Install

Just simply execute: `yarn install` and you are ready to go

## Release Notes

### 0.0.1

- Initial release of the "Workspace Git Helper"

### 0.1.1

- Added checkout by branch name

### 0.1.2

- Renamed extension
- Renamed Checkout To Master -> Checkout To Default Branch
- Cropped icon
- Grouped Checkout features into one group

### 0.1.3

- Fixes icon size

### 0.1.4

- Added "Merge All To Current Branch" feature
- Added ability to Discard changes for staged files
- Removed "Invalid option" error

### 0.1.5

- Added "Commit Changes" feature
- Added "Push All Commits" feature
- Fixed readme

### 0.1.6

- Added Stage Changes
- Added Unstage Changes

### 0.1.7

- Improves branch picker in "Checkout By Branch Name" feature

### 0.1.8

- Fixes remote branch switching for "Checkout By Branch Name" feature
- Adds feature "Configure Active Repositories"

### 0.1.9

- Adds branch selector to "Merge All To Current Branch" feature
