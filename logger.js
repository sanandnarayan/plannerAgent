const LogLevels = {
  ERROR: 0,
  DEBUG: 1,
  INFO: 2,
};

// ANSI escape codes for color and formatting
const Colors = {
  HEADER: "\x1b[95m",
  OKBLUE: "\x1b[94m",
  OKCYAN: "\x1b[96m",
  OKGREEN: "\x1b[92m",
  WARNING: "\x1b[93m",
  FAIL: "\x1b[91m",
  ENDC: "\x1b[0m",
  BOLD: "\x1b[1m",
  UNDERLINE: "\x1b[4m",
};

const getLogLevel = () => {
  const arg = process.argv.find((arg) => arg.startsWith("--log-level="));
  const level = arg ? arg.split("=")[1].toUpperCase() : "INFO";
  return LogLevels[level] || LogLevels.INFO;
};

const currentLevel = getLogLevel();

const logger = {
  log: (message, ...args) => {
    console.log(Colors.ENDC, message, ...args);
  },
  debug: (message, ...args) => {
    if (currentLevel >= LogLevels.DEBUG) {
      console.log(Colors.OKBLUE, `[DEBUG] `, message, ...args);
    }
  },
  info: (message, ...args) => {
    if (currentLevel >= LogLevels.INFO) {
      console.log(Colors.OKCYAN, `[INFO]`, message, ...args);
    }
  },
  error: (message, ...args) => {
    if (currentLevel >= LogLevels.ERROR) {
      console.log(Colors.FAIL, `[ERROR]`, message, ...args);
    }
  },
};

module.exports = logger;
