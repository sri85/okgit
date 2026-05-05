import { execFile } from "child_process";

export type ExecFileRunner = (
    command: string,
    args: string[]
) => Promise<void>;

export const execFileAsync: ExecFileRunner = (command, args) => {
    return new Promise((resolve, reject) => {
        execFile(command, args, error => {
            if (error !== null) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};
