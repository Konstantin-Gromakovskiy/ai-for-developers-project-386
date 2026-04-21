import "@typespec/http";

using Http;

namespace BookingApi;

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

model PublicEventTypeSummary {
  slug: Slug;
  title: string;
  description?: string;
  durationMinutes: int32;
}

model PublicEventType extends PublicEventTypeSummary {}

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

model CreatedEventTypeResponse {
  @statusCode statusCode: 201;
  eventType: EventType;
}
