import { run } from './run';

const config = process.argv[2];
const combinedFile = process.argv[3];
const errorFile = process.argv[4];

// Electron fork
run();

// if (config) {
//     run(JSON.parse(config), combinedFile, errorFile);
// } else {

// }
