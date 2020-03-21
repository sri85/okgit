import shell from "shelljs";
export async function printCheckoutPR(prId) {
    shell.exec(`git fetch origin pull/${prId}/head:pr-${prId}`);
    shell.exec(`git checkout pr-${prId}`);
    shell.echo(`Checked out the PR successfully`);
}
