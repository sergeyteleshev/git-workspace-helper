import { Repository } from '../types/git.js';

export function getRepositoryName(repository: Repository) {
  return repository.rootUri.path.split('/').at(-1);
}
