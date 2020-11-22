module.exports = {
  roots: ['./src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["./src/setupTests.ts"],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};