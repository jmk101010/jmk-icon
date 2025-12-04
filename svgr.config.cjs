module.exports = {
  // SVGO 설정 파일을 사용하도록 지정
  svgoConfig: require('./svgo.config.cjs'),
  typescript: true, // TypeScript 파일로 생성
  icon: true, // ViewBox를 상속받아 아이콘으로 처리
  dimensions: false, // SVG 자체의 width/height 속성은 제거 (props로 제어)
  // Props를 받아 크기와 색상을 제어하는 템플릿 사용
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
  // 파일명을 PascalCase로 자동 변환 (예: home-icon.svg -> HomeIcon)
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
};
