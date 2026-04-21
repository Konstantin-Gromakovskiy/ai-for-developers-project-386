import "@typespec/http";

using Http;

namespace BookingApi;

model ValidationError {
  @statusCode statusCode: 400;
  code: "validation_error";
  message: string;
}

model NotFoundError {
  @statusCode statusCode: 404;
  code: "not_found";
  message: string;
}

model ConflictError {
  @statusCode statusCode: 409;
  code: "conflict";
  message: string;
}

model NoContentResponse {
  @statusCode statusCode: 204;
}
