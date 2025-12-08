module.exports = {
  // SVGO 설정 파일을 사용하도록 지정
  svgoConfig: require('./svgo.config.cjs'),
  typescript: true,
  icon: false,
  dimensions: true,
  // Props를 받아 크기와 색상을 제어하는 템플릿 사용
    template: (variables, { tpl }) => {
      variables.jsx.openingElement.attributes.push(
        {
          type: "JSXAttribute",
          name: { type: "JSXIdentifier", name: "width" },
          value: { type: "JSXExpressionContainer", expression: { type: "Identifier", name: "size" } }
        },
        {
          type: "JSXAttribute",
          name: { type: "JSXIdentifier", name: "height" },
          value: { type: "JSXExpressionContainer", expression: { type: "Identifier", name: "size" } }
        },
        {
          type: "JSXAttribute",
          name: { type: "JSXIdentifier", name: "fill" },
          value: { type: "JSXExpressionContainer", expression: { type: "Identifier", name: "color" } }
        }
      );
  
      return tpl`
        import * as React from 'react';
        import { IconProps } from '../types';
  
        const ${variables.componentName} = ({ size = 24, color = 'currentColor', ...props }: IconProps) => (
          ${variables.jsx}
        );
  
        export default ${variables.componentName};
      `;
    },  // 파일명을 PascalCase로 자동 변환 (예: home-icon.svg -> HomeIcon)
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
};
