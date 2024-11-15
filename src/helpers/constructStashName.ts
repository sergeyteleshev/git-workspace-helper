import { Stash } from '../types/stash.js';

export function constructStashName(stash: Stash) {
  const date = new Date(stash.date);

  return `${stash.message} (${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()})`;
}
