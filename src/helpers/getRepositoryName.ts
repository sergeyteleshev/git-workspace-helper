import { Repository } from '../types/git';

export function getRepositoryName(repository: Repository) {
  return repository.rootUri.path.split('/').at(-1);
}
