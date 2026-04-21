import "@typespec/http";

using Http;

namespace BookingApi;

/**
 * Returns all event types, including inactive ones, for the admin panel.
 */
@route("/admin/event-types")
@get
op listAdminEventTypes(): EventType[];

/**
 * Creates a new event type managed by the owner.
 */
@route("/admin/event-types")
@post
op createEventType(
  @body input: CreateEventTypeRequest,
): CreatedEventTypeResponse | ValidationError | ConflictError;

/**
 * Updates an existing event type by its internal identifier.
 */
@route("/admin/event-types/{id}")
@patch
op updateEventType(@path id: string, @body input: UpdateEventTypeRequest):
  | EventType
  | ValidationError
  | NotFoundError
  | ConflictError;

/**
 * Deletes an event type by its internal identifier.
 */
@route("/admin/event-types/{id}")
@delete
op deleteEventType(@path id: string): NoContentResponse | NotFoundError;

/**
 * Returns the owner's timezone and recurring weekly availability rules.
 */
@route("/admin/availability")
@get
op getAvailability(): AvailabilityConfiguration;

/**
 * Replaces the full recurring availability configuration for the owner.
 */
@route("/admin/availability")
@put
op replaceAvailability(
  @body input: ReplaceAvailabilityRequest,
): AvailabilityConfiguration | ValidationError;

/**
 * Returns all concrete availability overrides configured by the owner.
 */
@route("/admin/availability-overrides")
@get
op listAvailabilityOverrides(): AvailabilityOverride[];

/**
 * Creates a concrete availability override for a specific UTC interval.
 */
@route("/admin/availability-overrides")
@post
op createAvailabilityOverride(
  @body input: CreateAvailabilityOverrideRequest,
): CreatedAvailabilityOverrideResponse | ValidationError;

/**
 * Updates one availability override by its internal identifier.
 */
@route("/admin/availability-overrides/{id}")
@patch
op updateAvailabilityOverride(
  @path id: string,
  @body input: UpdateAvailabilityOverrideRequest,
): AvailabilityOverride | ValidationError | NotFoundError;

/**
 * Deletes one availability override by its internal identifier.
 */
@route("/admin/availability-overrides/{id}")
@delete
op deleteAvailabilityOverride(
  @path id: string,
): NoContentResponse | NotFoundError;

/**
 * Returns the owner's bookings for admin review.
 */
@route("/admin/bookings")
@get
op listAdminBookings(): Booking[];

