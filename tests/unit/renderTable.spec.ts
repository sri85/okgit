import { describe, it, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { renderTable } from "../../lib/tables/utils/renderTable";

describe("renderTable", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("prints a table from headers and mapped rows", () => {
        const log = sinon.stub(console, "log");

        renderTable(
            ["Name", "Count"],
            [{ name: "octo", count: 2 }],
            item => [item.name, item.count]
        );

        expect(log.calledOnce).to.equal(true);
        expect(String(log.firstCall.args[0])).to.contain("Name");
        expect(String(log.firstCall.args[0])).to.contain("octo");
        expect(String(log.firstCall.args[0])).to.contain("2");
    });

    it("can skip printing empty tables", () => {
        const log = sinon.stub(console, "log");

        renderTable(["Name"], [], item => [String(item)], {
            printEmpty: false,
        });

        expect(log.notCalled).to.equal(true);
    });
});
