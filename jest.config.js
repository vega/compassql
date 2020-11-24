module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(vega-lite/))"
  ],
  testPathIgnorePatterns: [
    "node_modules",
    "<rootDir>/build",
    "scripts",
    "src"
  ],
  coverageDirectory: "./coverage/",
  collectCoverage: true
};
