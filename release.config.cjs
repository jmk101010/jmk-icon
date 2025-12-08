module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer', // 커밋 메시지 분석 (fix, feat, breaking change 등)
    '@semantic-release/release-notes-generator', // 릴리스 노트 생성
    '@semantic-release/changelog', // CHANGELOG.md 업데이트
    '@semantic-release/npm', // package.json 버전 업데이트 및 배포
    [
      '@semantic-release/git', // 변경된 파일(package.json, CHANGELOG.md)을 Git에 커밋
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github', // GitHub 릴리스 생성
  ],
};
