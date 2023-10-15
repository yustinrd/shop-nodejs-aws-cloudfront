module.exports = {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": [
        "**/?(*.)+(spec|test).(ts|tsx)"
     ],
    moduleNameMapper: {
        "^@libs/(.*)$": "<rootDir>/src/libs/$1",
        "^@functions/(.*)$": "<rootDir>/src/functions/$1",
    },
}
