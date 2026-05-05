import { expect } from "chai";
import { describe, it } from "mocha";
import {
    getProviderErrorStatus,
    ProviderRequestError,
    toProviderRequestError,
    withLegacyProviderErrorHandling,
} from "../../lib/api/providerErrors";

describe("provider errors", () => {
    it("extracts status codes from common HTTP error shapes", () => {
        expect(getProviderErrorStatus({ status: 404 })).to.equal(404);
        expect(getProviderErrorStatus({ statusCode: 401 })).to.equal(401);
        expect(getProviderErrorStatus({ response: { status: 500 } })).to.equal(
            500
        );
        expect(getProviderErrorStatus(new Error("boom"))).to.equal(undefined);
    });

    it("wraps unknown failures in typed provider errors", () => {
        const cause = { response: { status: 403 } };
        const error = toProviderRequestError(cause, {
            action: "list",
            resource: "octo/test",
        });

        expect(error).to.be.instanceOf(ProviderRequestError);
        expect(error.statusCode).to.equal(403);
        expect(error.cause).to.equal(cause);
    });

    it("preserves provider request errors that are already typed", () => {
        const error = new ProviderRequestError(
            { action: "list", resource: "octo/test" },
            { status: 422 }
        );

        expect(
            toProviderRequestError(error, {
                action: "ignored",
                resource: "ignored",
            })
        ).to.equal(error);
    });

    it("returns the fallback when legacy handling catches a failed request", async () => {
        const fallback: string[] = [];
        const result = await withLegacyProviderErrorHandling(
            Promise.reject({ status: 404 }),
            { action: "list", resource: "octo/test" },
            fallback
        );

        expect(result).to.equal(fallback);
    });
});
