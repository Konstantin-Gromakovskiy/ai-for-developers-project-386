import "@typespec/http";

using Http;

namespace BookingApi;

/**
 * Administrative representation of a bookable meeting type.
 */
model EventType {
  id: string;
  slug: Slug;

  @minLength(1)
  @maxLength(120)
  title: string;

  @maxLength(2000)
  description?: string;

  @minValue(1)
  durationMinutes: int32;

  isActive: boolean;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

/**
 * Lightweight public view of a bookable event type.
 */
model PublicEventTypeSummary {
  slug: Slug;
  title: string;
  description?: string;
  durationMinutes: int32;
}

/**
 * Full public representation of a single bookable event type.
 */
model PublicEventType extends PublicEventTypeSummary {}

/**
 * Request payload used to create a new event type.
 */
model CreateEventTypeRequest {
  @minLength(1)
  @maxLength(120)
  title: string;

  @maxLength(2000)
  description?: string;

  @minValue(1)
  durationMinutes: int32;

  isActive?: boolean;
}

/**
 * Request payload used to update an existing event type.
 */
model UpdateEventTypeRequest {
  @minLength(1)
  @maxLength(120)
  title?: string;

  @maxLength(2000)
  description?: string;

  @minValue(1)
  durationMinutes?: int32;

  isActive?: boolean;
}

/**
 * Response returned after successfully creating an event type.
 */
model CreatedEventTypeResponse {
  @statusCode statusCode: 201;
  eventType: EventType;
}
