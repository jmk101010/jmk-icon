// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';

// 모든 개별 아이콘 컴포넌트를 Rollup의 엔트리 포인트로 지정
const ICON_DIR = 'src/icons';
const iconFiles = fs.readdirSync(ICON_DIR).filter((file) => file.endsWith('.tsx'));

const config = {
  input: iconFiles.map((file) => path.resolve(ICON_DIR, file)), // 모든 아이콘 파일을 입력
  output: {
    dir: 'dist/icons', // 개별 아이콘 파일을 dist/icons 폴더에 출력
    format: 'esm',
    exports: 'named',
    preserveModules: true, // 트리 쉐이킹을 위해 모듈 구조 유지
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({ useTsconfigExtended: true, clean: true }), // TS 컴파일
  ],
  external: ['react', 'react-dom'], // React는 번들링에서 제외
};

// 모든 아이콘을 한 번에 내보내는 index.ts를 위한 별도 설정
const indexConfig = {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs.js', format: 'cjs' },
    { file: 'dist/index.esm.js', format: 'esm' },
  ],
  plugins: [resolve(), commonjs(), typescript({ useTsconfigExtended: true, clean: true })],
  external: ['react', 'react-dom'],
};

export default [config, indexConfig];
