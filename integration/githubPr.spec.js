// import { it, describe } from "mocha";
// import { expect } from "chai";
// import shell from "shelljs";
//
// describe("Github PR", () => {
//     describe("Pull-request Files", () => {
//
//         it("should show the right column names and changed files", done => {
//             const filesResponse = shell.exec("gicli pr 7 --files").toString();
//             const columnNames = [
//                 "Status",
//                 "FileName",
//                 "Additions",
//                 "Deletions",
//                 "Status",
//                 "Changes",
//             ];
//             for (let i = 0; i < columnNames.length; i++) {
//                 expect(filesResponse).to.include(columnNames[i]);
//             }
//             done();
//         });
//         it("should show the error message when pr is invalid ", done => {
//             const filesErrorResponse = shell
//                 .exec("gicli pr ewqewqew --files")
//                 .stderr.toString();
//             const errorMessage =
//                 "Something went wrong while processing the request Error: Request failed with status code 404";
//             expect(filesErrorResponse).to.include(errorMessage);
//             done();
//         });
//     });
//
//     describe("Pull Request-Summary", () => {
//         it("should show the summary of a PR ", done => {
//             const summaryResponse = shell
//                 .exec("gicli pr 7 --summary")
//                 .toString();
//             const columnNames = [
//                 "Is Merged",
//                 "Lines Added",
//                 "Lines Deleted",
//                 "Files Changed",
//                 "In Sync with Base?",
//                 "Total Commits",
//                 "Total Comments",
//                 "Review Comments",
//             ];
//             for (let i = 0; i < columnNames.length; i++) {
//                 expect(summaryResponse).to.include(columnNames[i]);
//             }
//             done();
//         });
//         it("should not display summary when pr id is invalid", done => {
//             const summaryErrorResponse = shell
//                 .exec("gicli pr ewqewqew --summary")
//                 .stderr.toString();
//             const errorMessage =
//                 "Something has gone wrong! Error: Request failed with status code 404";
//             expect(summaryErrorResponse).to.include(errorMessage);
//             done();
//         });
//     });
//     describe("Pull Request-Commits", () => {
//         it("should show the commits in a PR ", done => {
//             const commitResponse = shell
//                 .exec("gicli pr 7 --commits")
//                 .toString();
//             const columnNames = ["Author", "Commit Message", "Commit Link"];
//             for (let i = 0; i < columnNames.length; i++) {
//                 expect(commitResponse).to.include(columnNames[i]);
//             }
//             done();
//         });
//         it("should not display commit table when pr id is invalid", done => {
//             const commitErrorResponse = shell
//                 .exec("gicli pr ewqewqew --commits")
//                 .stderr.toString();
//             const errorMessage =
//                 "Failed with error Error: Request failed with status code 404";
//             expect(commitErrorResponse).to.include(errorMessage);
//             done();
//         });
//     });
// });
