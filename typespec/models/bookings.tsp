import "@typespec/http";

using Http;

namespace BookingApi;

/**
 * Confirmed booking created by a guest for a concrete UTC interval.
 */
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

/**
 * Request payload used to create a booking for a public event type.
 */
model CreateBookingRequest {
  startUtc: utcDateTime;
  guestName: string;
  guestEmail: EmailAddress;
  guestNotes?: string;
}

/**
 * Computed bookable time range returned by the public booking flow.
 */
model Slot {
  startUtc: utcDateTime;
  endUtc: utcDateTime;
}

/**
 * Response returned after successfully creating a booking.
 */
model CreatedBookingResponse {
  @statusCode statusCode: 201;
  booking: Booking;
}
