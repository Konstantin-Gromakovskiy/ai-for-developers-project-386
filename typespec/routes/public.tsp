import "@typespec/http";

using Http;

namespace BookingApi;

/**
 * Returns a lightweight health response for uptime and connectivity checks.
 */
@route("/health")
@get
op health(): {
  status: "ok";
};

/**
 * Returns all active public event types that a guest can choose from.
 */
@route("/event-types")
@get
op listPublicEventTypes(): PublicEventTypeSummary[];

/**
 * Returns the public details for one event type identified by its slug.
 */
@route("/event-types/{slug}")
@get
op getPublicEventType(@path slug: Slug): PublicEventType | NotFoundError;

/**
 * Returns computed available slots for the next 14 days for the selected event type.
 */
@route("/event-types/{slug}/slots")
@get
op listEventTypeSlots(@path slug: Slug): Slot[] | NotFoundError;

/**
 * Creates a booking for the selected event type and start time.
 *
 * The event type is identified by the public slug in the route.
 * The backend derives the final booking interval from the event type duration.
 */
@route("/event-types/{slug}/bookings")
@post
op createBooking(@path slug: Slug, @body input: CreateBookingRequest):
  | CreatedBookingResponse
  | ValidationError
  | NotFoundError
  | ConflictError;

