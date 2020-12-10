module.exports = {
  roots: ['./src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/setup-tests.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
