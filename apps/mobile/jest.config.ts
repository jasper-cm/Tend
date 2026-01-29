export default {
  displayName: 'mobile',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['../../apps/web/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/mobile',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.(html|svg)$' },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(@ionic|@stencil|ionicons|.*\\.mjs$))'],
};
