// svgo.config.js
module.exports = {
  plugins: [
    { name: 'preset-default' },
    // React 컴포넌트 Props를 사용하기 위해 기본 width, height, fill 속성을 제거
    { name: 'removeAttrs', params: { attrs: '(fill|stroke|width|height|data-name|xmlns)' } },
    { name: 'removeViewBox', active: false }, // viewBox는 유지하여 크기 조절 가능하게 함
  ],
};
