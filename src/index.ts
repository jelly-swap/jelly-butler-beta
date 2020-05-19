import { run } from './run';

const config = process.argv[2];

// Electron fork
if (config) {
    run(JSON.parse(config));
} else {
    run();
}
