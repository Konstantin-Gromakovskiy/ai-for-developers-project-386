namespace BookingApi;

/**
 * Public human-readable identifier used in URLs.
 */
@pattern("^[a-z0-9]+(?:-[a-z0-9]+)*$")
scalar Slug extends string;

/**
 * Guest email address used for booking contact details.
 */
@format("email")
scalar EmailAddress extends string;

/**
 * IANA timezone name used to interpret recurring availability rules.
 */
scalar IanaTimeZone extends string;

/**
 * Day of week used by recurring weekly availability rules.
 */
enum DayOfWeek {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday",
}
