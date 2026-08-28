declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react/jsx-runtime' {
  export function jsx(...args: any[]): any;
  export function jsxs(...args: any[]): any;
  export function jsxDEV(...args: any[]): any;
  export const Fragment: any;
}

declare module 'react' {
  export function createContext<T>(value: T): any;
  export function useContext<T>(context: any): T;
  export function useState<T>(initial?: T | (() => T)):
    [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export type ReactNode = any;
  const ReactDefault: any;
  export default ReactDefault;
}
