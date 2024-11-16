import { DefaultLogFields, ListLogLine } from 'simple-git';

export type Stash = DefaultLogFields &
  ListLogLine & {
    index: number;
  };
