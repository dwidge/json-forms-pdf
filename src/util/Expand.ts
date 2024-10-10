// Copyright DWJ 2024.
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

// https://stackoverflow.com/a/57683652

export type Expand<T> = T extends infer O
  ? {
      [K in keyof O]: O[K];
    }
  : never;

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? {
        [K in keyof O]: ExpandRecursively<O[K]>;
      }
    : never
  : T;

// Utility type for React component props
export type ReactComponentProps<T> =
  T extends React.ComponentType<infer P>
    ? Expand<P>
    : T extends React.ForwardRefExoticComponent<infer P>
      ? Expand<P>
      : never;

// Utility type for function parameters
export type FunctionParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? Expand<P>
  : never;

// Utility type for function return type
export type FunctionReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? Expand<R>
  : never;
