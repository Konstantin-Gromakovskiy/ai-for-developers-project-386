import "@typespec/http";

using Http;

namespace BookingApi;

@route("/admin/event-types")
@get
op listAdminEventTypes(): EventType[];

@route("/admin/event-types")
@post
op createEventType(
  @body input: CreateEventTypeRequest,
): CreatedEventTypeResponse | ValidationError | ConflictError;

@route("/admin/event-types/{id}")
@patch
op updateEventType(@path id: string, @body input: UpdateEventTypeRequest):
  | EventType
  | ValidationError
  | NotFoundError
  | ConflictError;

@route("/admin/event-types/{id}")
@delete
op deleteEventType(@path id: string): NoContentResponse | NotFoundError;

@route("/admin/availability")
@get
op getAvailability(): AvailabilityConfiguration;

@route("/admin/availability")
@put
op replaceAvailability(
  @body input: ReplaceAvailabilityRequest,
): AvailabilityConfiguration | ValidationError;

@route("/admin/availability-overrides")
@get
op listAvailabilityOverrides(): AvailabilityOverride[];

@route("/admin/availability-overrides")
@post
op createAvailabilityOverride(
  @body input: CreateAvailabilityOverrideRequest,
): CreatedAvailabilityOverrideResponse | ValidationError;

@route("/admin/availability-overrides/{id}")
@patch
op updateAvailabilityOverride(
  @path id: string,
  @body input: UpdateAvailabilityOverrideRequest,
): AvailabilityOverride | ValidationError | NotFoundError;

@route("/admin/availability-overrides/{id}")
@delete
op deleteAvailabilityOverride(
  @path id: string,
): NoContentResponse | NotFoundError;

@route("/admin/bookings")
@get
op listAdminBookings(): Booking[];
