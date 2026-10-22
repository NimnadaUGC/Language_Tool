/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.py?raw' {
  const source: string;
  export default source;
}
