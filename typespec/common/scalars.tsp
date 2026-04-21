namespace BookingApi;

@pattern("^[a-z0-9]+(?:-[a-z0-9]+)*$")
scalar Slug extends string;

@format("email")
scalar EmailAddress extends string;

scalar IanaTimeZone extends string;

enum DayOfWeek {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday",
}
