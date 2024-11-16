import { Stash } from '../types/stash.js';

const EPSILON_TIME_IN_MILLISECONDS = 3000;

export function hasNoStashCollision(stash1: Stash, stash2: Stash) {
  return (
    stash1.message === stash2.message &&
    Math.abs(
      new Date(stash1.date).getTime() - new Date(stash2.date).getTime()
    ) <= EPSILON_TIME_IN_MILLISECONDS
  );
}
