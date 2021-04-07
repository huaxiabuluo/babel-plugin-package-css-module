import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const noDeclarationFiles = { compilerOptions: { declaration: false } };

export default [
  // UMD Production
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Abmate',
      indent: false,
      globals: {
        react: 'React'
      }
    },
    external: ['react'],
    plugins: [
      nodeResolve({
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.js', '.ts'],
        browser: true
        // preferBuiltins: true
      }),
      typescript({ useTsconfigDeclarationDir: noDeclarationFiles }),
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      }),
      commonjs(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
