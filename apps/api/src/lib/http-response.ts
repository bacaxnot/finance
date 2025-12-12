import type { DomainError } from "@repo/core/_shared/domain/domain-error";
import type { Context } from "hono";

export function domainError(
	c: Context,
	error: DomainError,
	statusCode: number,
): Response {
	return c.json(
		{
			error: error.toPrimitives(),
		},
		statusCode as any,
	);
}

export function badRequest(c: Context, message: string): Response {
	return c.json(
		{
			error: {
				type: "InvalidRequest",
				description: message,
				data: {},
			},
		},
		400,
	);
}

export function internalServerError(c: Context): Response {
	return c.json(
		{
			error: {
				type: "InternalServerError",
				description: "Internal server error",
				data: {},
			},
		},
		500,
	);
}

export function created(c: Context): Response {
	return c.body(null, 201);
}

export function noContent(c: Context): Response {
	return c.body(null, 204);
}

export function json<JsonBody>(c: Context, data: JsonBody): Response {
	return c.json(data, 200);
}
