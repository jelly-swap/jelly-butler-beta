import { format, addColors } from 'winston';

export const Config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7,
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'green',
        info: 'grey',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow',
    },
};

addColors(Config.colors);

const baseFormat = [
    format.json(),
    format.timestamp(),
    format.align(),
    format.printf((log) => `${new Date(log.timestamp).toLocaleString()} ${log.level}: ${log.message}`),
];

export const fileFormat = format.combine(...baseFormat);

export const consoleFormat = format.combine(format.colorize(), ...baseFormat);
