#!/usr/bin/env node
import program from "commander";
import { openLink } from "../../tables/openLink.js";

export default function openRepo() {
    program.command("openRepo").action(() => {
        openLink("repo");
    });
}
