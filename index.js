const { runCli } = require('./src/index');

runCli().catch(() => process.exit(1));
