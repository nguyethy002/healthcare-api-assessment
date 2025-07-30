class Logger {
  static info(message) {
    console.log(`INFO: ${message}`);
  }

  static success(message) {
    console.log(`SUCCESS: ${message}`);
  }

  static warning(message) {
    console.log(`WARNING: ${message}`);
  }

  static error(message) {
    console.error(`ERROR: ${message}`);
  }

  static debug(message) {
    console.log(`DEBUG: ${message}`);
  }

  static step(stepNumber, title) {
    console.log(`\nStep ${stepNumber}: ${title}...`);
  }

  static progress(message) {
    console.log(`PROGRESS: ${message}`);
  }

  static summary(title, data) {
    console.log(`${title}:`);
    Object.entries(data).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
  }

  static results(category, items) {
    console.log(`${category}:`, items);
  }
}

module.exports = Logger; 