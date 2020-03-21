import { describe, it } from "mocha";
import { expect } from "chai";
import tableGenerator from "../lib/tables/utils/createTable";

describe("TableGenerator", () => {
    it("should return a object", () => {
        expect(tableGenerator(["test"])).to.be.an("object");
    });
    it("should have a property options", () => {
        expect(tableGenerator(["test"])).to.have.a.property("options");
    });
    it("should throw type error when the parameter is of type array", () => {
        expect(() => {
            tableGenerator("test");
        }).to.throw(TypeError, "Expected type Array , instead got type string");
    });
    it("should throw type error when the parameter is of type object", () => {
        expect(() => {
            tableGenerator({ key: "value" });
        }).to.throw(TypeError, "Expected type Array , instead got type object");
    });
    it("should throw type error when the parameter is of type string", () => {
        expect(() => {
            tableGenerator("");
        }).to.throw(TypeError, "Expected type Array , instead got type string");
    });
});
