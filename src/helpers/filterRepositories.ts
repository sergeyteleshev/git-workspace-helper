import { Repository } from '../types/git.js';
import { getRepositoryName } from './getRepositoryName.js';
import { isNotNullDefined } from './isNotNullDefined.js';

export function filterRepositories(repos: Repository[], repoNames: string[]) {
  const destReposNamesSet = new Set(repoNames);

  return repos.filter((repo) => {
    const name = getRepositoryName(repo);

    if (!isNotNullDefined(name)) {
      return false;
    }

    return destReposNamesSet.has(name);
  });
}
