import "@typespec/http";

using Http;

namespace BookingApi;

model Booking {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: EmailAddress;
  guestNotes?: string;
  startUtc: utcDateTime;
  endUtc: utcDateTime;
  createdAt: utcDateTime;
}

model CreateBookingRequest {
  eventTypeSlug: Slug;
  startUtc: utcDateTime;
  guestName: string;
  guestEmail: EmailAddress;
  guestNotes?: string;
}

model Slot {
  startUtc: utcDateTime;
  endUtc: utcDateTime;
}

model CreatedBookingResponse {
  @statusCode statusCode: 201;
  booking: Booking;
}
