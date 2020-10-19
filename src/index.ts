import { run } from './run';

const config = process.argv[2];
const combinedFile = process.argv[3];
const errorFile = process.argv[4];

// Electron fork
if (config) {
    run(JSON.parse(config), combinedFile, errorFile).then((result) => {
        if (result) {
            process.send && process.send({TYPE: 'SERVER', DATA: { msg: `SERVER_STARTED`}});
        }
    });
} else {
    run();
}
