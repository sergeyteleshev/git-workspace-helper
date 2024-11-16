import { Stash } from '../types/stash.js';

export function getStashFullDate(stash: Stash) {
  const date = new Date(stash.date);

  return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
