#!/usr/bin/env node
import program from "commander";
import { openLink } from "../../tables/openLink";

export default function openRepo() {
    program.command("openRepo").action(() => {
        openLink("repo");
    });
}
