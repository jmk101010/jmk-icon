## 🛠️ 통합 아이콘 라이브러리 제작 및 배포 계획 (GEMINI.md)

이 문서는 **Google Material Icons**와 **IBM UI Icons**를 통합하여 **Apache License 2.0**을 준수하는 **트리 쉐이킹 가능**한 React 컴포넌트 라이브러리를 구축하고, **GitHub Packages**를 통해 배포하는 과정을 자동화하기 위한 실행 계획입니다.

### 📌 1단계: 프로젝트 목표 및 기본 설정

| 항목          | 목표                                                     | 핵심 기술 및 라이선스                         |
| :------------ | :------------------------------------------------------- | :-------------------------------------------- |
| **목표**      | 두 소스의 SVG를 통합하여 단일 React 패키지 제작 및 배포. | React, TypeScript, Rollup, SVGO, SVGR         |
| **초기 배포** | 개인 공개 GitHub 레포지토리에 배포하여 프로세스 검증.    | Public GitHub Repository, GitHub Packages     |
| **최종 포맷** | ESM (Tree Shaking), CJS, TypeScript 타입 파일 제공.      | Apache License 2.0 (원본 및 통합본 모두 준수) |

---

### 2\. 📁 파일 구조 및 `package.json` 설정

프로젝트의 기본 구조를 설정하고, 빌드 및 배포에 필요한 정보를 정의합니다.

#### 2.1. 폴더 구조

```
icon-library/
├── svg/              # 📥 1차: 원본 SVG 파일 저장
│   ├── material/
│   └── ibm/
├── src/              # 💻 2차: TypeScript 소스 코드 (types.ts, index.ts 등)
│   └── icons/        # (SVGR에 의해 자동 생성될 컴포넌트 폴더)
├── dist/             # 📦 3차: 최종 번들링 결과물 (배포 전용)
├── .github/          # ⚙️ CI/CD 설정
│   └── workflows/
│       └── publish.yml
├── LICENSE           # 라이선스 전문
├── NOTICE            # 원 저작권자 고지
├── package.json
└── ... (설정 파일)
```

#### 2.2. `package.json` 핵심 설정

```json
{
  "name": "integrated-icon-library",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "LICENSE", "NOTICE"],
  "scripts": {
    "clean": "rm -rf dist src/icons",
    "optimize:svg": "svgo --config svgo.config.js -f svg -o svg/optimized",
    "build:icons": "svgr --config-file svgr.config.js --out-dir src/icons svg/optimized",
    "build:rollup": "rollup -c",
    "build": "npm run clean && npm run optimize:svg && npm run build:icons && npm run build:rollup",
    "prepublishOnly": "npm run build"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "dependencies": {
    "react": ">=16.8.0"
  },
  "devDependencies": {
    "typescript": "...",
    "@svgr/cli": "...",
    "svgo": "...",
    "rollup": "..."
  }
}
```

---

### 3\. ⚙️ 자동화 빌드 파이프라인 (SVGO, SVGR, Rollup)

모든 SVG 파일을 React 컴포넌트로 변환하는 무인 자동화 스크립트입니다.

#### 3.1. `svgo.config.js` (최적화)

SVG 마크업을 최소화하고 일관성을 확보합니다.

```javascript
// svgo.config.js
module.exports = {
  plugins: [
    { name: 'preset-default' },
    { name: 'removeAttrs', params: { attrs: '(fill|stroke|width|height|data-name|xmlns)' } },
    { name: 'removeViewBox', active: false },
  ],
};
```

#### 3.2. `svgr.config.js` (컴포넌트 변환)

`size`와 `color` Props를 받는 React 컴포넌트 템플릿을 정의합니다.

```javascript
// svgr.config.js
module.exports = {
  svgoConfig: require('./svgo.config.js'),
  typescript: true,
  icon: true,
  dimensions: false,
  template: (variables, { tpl }) => {
    return tpl`
      import * as React from 'react';
      import { IconProps } from '../types';

      const ${variables.componentName} = ({ size = 24, color = 'currentColor', ...props }: IconProps) => (
        ${variables.jsx}
      );

      export default ${variables.componentName};
    `;
  },
};
```

#### 3.3. `rollup.config.js` (번들링)

개별 아이콘 파일을 ESM 포맷으로 유지하여 **트리 쉐이킹**을 활성화하고, `index.ts`를 CJS/ESM 엔트리 포인트로 번들링합니다.

_(이전 답변의 Rollup 설정 코드 블록 참고)_

---

### 4\. 🔑 라이선스 준수 및 고지

Apache 2.0 라이선스 의무를 충족하는 핵심 단계입니다.

#### 4.1. `NOTICE` 파일 내용

```
NOTICE - Attribution for Integrated Icon Library

This product includes icons derived from the following open-source projects:

1. Google Material Icons
   Copyright (c) [Original Year Range] Google. All rights reserved.
   Licensed under the Apache License, Version 2.0.

2. IBM UI Icons (Carbon Design System)
   Copyright (c) [Original Year Range] International Business Machines Corporation.
   Licensed under the Apache License, Version 2.0.
```

#### 4.2. `README.md` 고지

패키지 사용법 하단에 다음 섹션을 포함합니다.

```markdown
## License & Attribution

This integrated icon library is licensed under the Apache License, Version 2.0.

This library includes derivative works from:

- **Google Material Icons** (Apache 2.0)
- **IBM UI Icons (Carbon Design System)** (Apache 2.0)

For full attribution details, please see the [NOTICE](NOTICE) file.
```

---

### 5\. 🚀 CI/CD 및 배포 자동화 (개인 공개 테스트 환경)

개인 레포지토리에 GitHub Packages를 사용하여 배포를 자동화합니다.

#### 5.1. GitHub Actions 워크플로우 (`.github/workflows/publish.yml`)

`GITHUB_TOKEN`을 사용하여 PAT 만료 문제없이 자동 배포합니다.

```yaml
name: NPM Package Publish

on:
  release:
    types: [created] # 새 릴리스 생성 시 배포 실행

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://npm.pkg.github.com'
          scope: '@${{ github.repository_owner }}' # 개인 계정명 자동 사용

      - run: npm install
      - run: npm run build

      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 5.2. 테스트 프로젝트 설치

패키지를 사용할 테스트 프로젝트에서 `.npmrc` 파일을 설정하여 인증합니다.

```
# 테스트 프로젝트의 .npmrc 파일
@integrated-icon-library:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${PAT_TOKEN_FOR_INSTALL} # 개인 PAT 또는 GITHUB_TOKEN
```

---

### 6\. 🛠️ 버전 관리 및 향후 계획

1.  **버전업:** `npm version minor` 또는 `npm version patch` 명령어로 버전을 올리고 Git Tag를 생성합니다. (릴리스가 생성되면 5.1의 워크플로우가 자동으로 실행되어 배포됨)
2.  **테스트 완료 후:** 개인 공개 레포지토리에서 테스트가 완료되면, 이 전체 코드를 사내 프라이빗 레포지토리로 복사하고, `package.json`의 `name`과 `publishConfig`만 사내 스코프로 변경하여 사내 환경에 배포합니다.
