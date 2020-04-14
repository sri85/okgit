#!/usr/bin/env node
import program from "commander";
import { version } from "../../../package.json";

export default function showVersion() {
    program.version(
        `v${version}`,
        "-v, --version",
        "output the current version"
    );
}
