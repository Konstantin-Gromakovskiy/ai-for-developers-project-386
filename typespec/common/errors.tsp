import "@typespec/http";

using Http;

namespace BookingApi;

/**
 * Returned when the request payload or parameters fail validation.
 */
model ValidationError {
  @statusCode statusCode: 400;
  code: "validation_error";
  message: string;
}

/**
 * Returned when the requested resource does not exist.
 */
model NotFoundError {
  @statusCode statusCode: 404;
  code: "not_found";
  message: string;
}

/**
 * Returned when the request conflicts with the current state of the system.
 */
model ConflictError {
  @statusCode statusCode: 409;
  code: "conflict";
  message: string;
}

/**
 * Returned when a delete operation succeeds without a response body.
 */
model NoContentResponse {
  @statusCode statusCode: 204;
}
