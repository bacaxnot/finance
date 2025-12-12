import type { Context } from "hono";
import { DomainError } from "@repo/core/_shared/domain/domain-error";
import { domainError, internalServerError } from "./http-response";

export async function executeWithErrorHandling<T extends DomainError>(
  c: Context,
  fn: () => Promise<Response>,
  onError: (error: T) => Response | void = () => undefined,
): Promise<Response> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      const response = onError(error as T);

      if (response) {
        return response;
      }

      // Default handling - return serialized domain error
      return domainError(c, error, 400);
    }

    // Unknown error
    console.error(error);
    return internalServerError(c);
  }
}
