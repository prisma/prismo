import chalk from "chalk";

export function log(message: string, context?: string[]) {
    process.stdout.write(`${LOG_TAG} ${prettyContext(context)}${chalk.white(message)}\n`);
}

export function warn(message: string, context?: string[]) {
    process.stdout.write(`${WARN_TAG} ${prettyContext(context)}${chalk.yellow(message)}\n`);
}

export function error(message: string, context?: string[]) {
    process.stderr.write(`${ERROR_TAG} ${prettyContext(context)}${chalk.red(message)}\n`);
}

function prettyContext(context?: string[]) {
    if (!context) return "";
    return chalk.dim(`[${context.join(" > ")}] `);
}

export function prettyArray(array: string[], options?: { prefix?: string, suffix?: string, separator?: string, empty?: string, lastSeparator?: string }) {
    const parsedOptions = options ?? {
        prefix: "", 
        separator: ", ", 
        empty: "", 
        suffix: "",
        lastSeparator: " and "
    };
    const empty = parsedOptions.empty ?? "";
    const prefix = parsedOptions.prefix ?? "";
    const suffix = parsedOptions.suffix ?? "";
    const separator = parsedOptions.separator ?? ", ";
    const lastSeparator = parsedOptions.lastSeparator ?? " and ";

    if(array.length == 0) return empty;
    if(array.length == 1) return prefix + array[0] + suffix;
    const last = array[array.length - 1];
    return prefix + array.slice(0, array.length - 1).join(separator) + lastSeparator + last + suffix;
}

const LOG_TAG = chalk.black.bold.bgBlue(" LOG ");
const WARN_TAG = chalk.black.bold.bgYellow(" WARN ");
const ERROR_TAG = chalk.black.bold.bgRed(" ERROR ");