import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { mkdirSync, writeFileSync } from 'fs';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/esm/index.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'dist/cjs/index.js',
      format: 'umd',
      name: 'medplum.mock',
      sourcemap: true,
      globals: {
        '@medplum/core': 'medplum.core',
      },
    },
    {
      file: 'dist/cjs/index.min.js',
      format: 'umd',
      name: 'medplum.mock',
      plugins: [terser()],
      sourcemap: true,
      globals: {
        '@medplum/core': 'medplum.core',
      },
    },
  ],
  plugins: [
    resolve({ extensions }),
    typescript(),
    json(),
    {
      buildEnd: () => {
        mkdirSync('./dist/cjs', { recursive: true });
        mkdirSync('./dist/esm', { recursive: true });
        writeFileSync('./dist/cjs/package.json', '{"type": "commonjs"}');
        writeFileSync('./dist/esm/package.json', '{"type": "module"}');
      },
    },
  ],
  external: ['@medplum/core'],
};
