import { log } from "~Logger";
import fs from "fs/promises";
import path from 'path';

export default async function loadEnvironmentVariables() {
    if (process.env.NODE_ENV == "development" || process.argv.includes("--load-env")) {
        (await import("dotenv")).config();
        log("Loaded environment variables from .env file", [__filename])
    }
}

export const config: Config = await (async () => {
    const currentCwd = process.cwd();

    log(`Loading config from ${path.join(currentCwd, "./config.json")}`, [__filename]);
    const config = await fs.readFile(path.join(currentCwd, "./config.json"), { encoding: "utf-8" });

    const parsed = JSON.parse(config);
    return parsed;
})();

type Config = {
    general: {
        guildId: string,
        clientId: string
    },
    features: {
        solved: {
            tags: {
                unsolved: string,
                solved: string
            },
            channels: string[]
        },
        crosspost: {
            channels: {
                "orm-help": string,
            }
        }
    }
};