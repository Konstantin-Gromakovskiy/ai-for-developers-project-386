import "@typespec/http";

using Http;

namespace BookingApi;

@route("/health")
@get
op health(): {
  status: "ok";
};

@route("/event-types")
@get
op listPublicEventTypes(): PublicEventTypeSummary[];

@route("/event-types/{slug}")
@get
op getPublicEventType(@path slug: Slug): PublicEventType | NotFoundError;

@route("/event-types/{slug}/slots")
@get
op listEventTypeSlots(@path slug: Slug): Slot[] | NotFoundError;

@route("/bookings")
@post
op createBooking(@body input: CreateBookingRequest):
  | CreatedBookingResponse
  | ValidationError
  | NotFoundError
  | ConflictError;
