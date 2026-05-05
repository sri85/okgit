import errorHandler from "../tables/utils/errorHandler";

export interface ProviderErrorContext {
    action: string;
    resource: string;
}

export class ProviderRequestError extends Error {
    readonly statusCode: number | undefined;
    readonly cause: unknown;

    constructor(context: ProviderErrorContext, cause: unknown) {
        super(`Provider request failed while trying to ${context.action}`);
        this.name = "ProviderRequestError";
        this.statusCode = getProviderErrorStatus(cause);
        this.cause = cause;
    }
}

export function getProviderErrorStatus(err: unknown): number | undefined {
    if (typeof err !== "object" || err === null) {
        return undefined;
    }

    if ("status" in err && typeof err.status === "number") {
        return err.status;
    }

    if ("statusCode" in err && typeof err.statusCode === "number") {
        return err.statusCode;
    }

    if (
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "status" in err.response &&
        typeof err.response.status === "number"
    ) {
        return err.response.status;
    }

    return undefined;
}

export function toProviderRequestError(
    err: unknown,
    context: ProviderErrorContext
): ProviderRequestError {
    if (err instanceof ProviderRequestError) {
        return err;
    }
    return new ProviderRequestError(context, err);
}

export async function withLegacyProviderErrorHandling<T>(
    request: Promise<T>,
    context: ProviderErrorContext,
    fallback: T
): Promise<T> {
    try {
        return await request;
    } catch (err) {
        const providerError = toProviderRequestError(err, context);
        errorHandler(providerError.statusCode, context.action, context.resource);
        return fallback;
    }
}
