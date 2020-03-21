import { describe, it } from "mocha";
import { expect } from "chai";
import createAPIBaseURL from "../lib/utils/helpers.js";

describe("Helper", () => {
    it("should return formatted url when a valid org is passed", () => {
        expect(createAPIBaseURL("getndazn")).to.equal(
            "https://api.github.com/repos/getndazn"
        );
    });
    it("should return undefined when org is undefined", () => {
        expect(createAPIBaseURL(undefined)).to.equal(undefined);
    });
    it("should be of type of string", () => {
        expect(createAPIBaseURL("getndazn")).to.be.a("string");
    });
});
