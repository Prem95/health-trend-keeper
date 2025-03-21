/**
 * This file provides polyfills for Node.js modules in the browser environment
 * It's used to prevent errors when using libraries that import Node.js built-in modules
 */

// Empty shim for fs module
const fs = {
  readFileSync: () => null,
  writeFileSync: () => null,
  existsSync: () => false,
  readdirSync: () => [],
  statSync: () => ({ isDirectory: () => false }),
  mkdirSync: () => null,
};

// Empty shim for path module
const path = {
  join: (...args: string[]) => args.join('/'),
  resolve: (...args: string[]) => args.join('/'),
  dirname: (p: string) => p.split('/').slice(0, -1).join('/'),
  basename: (p: string) => p.split('/').pop() || '',
  extname: (p: string) => {
    const base = p.split('/').pop() || '';
    return base.includes('.') ? `.${base.split('.').pop()}` : '';
  },
};

// Empty shim for crypto module
const crypto = {
  randomBytes: (size: number) => new Uint8Array(size),
  createHash: () => ({
    update: () => ({
      digest: () => '',
    }),
  }),
};

// Export for both named and default imports
export { fs, path, crypto };
export default { fs, path, crypto }; 