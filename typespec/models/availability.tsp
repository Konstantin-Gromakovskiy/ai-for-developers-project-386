import "@typespec/http";

using Http;

namespace BookingApi;

/**
 * Recurring weekly rule that defines when the owner is available.
 */
model WeeklyAvailabilityRule {
  id: string;
  dayOfWeek: DayOfWeek;
  startLocalTime: plainTime;
  endLocalTime: plainTime;
}

/**
 * Input shape used to replace recurring weekly availability rules.
 */
model WeeklyAvailabilityRuleInput {
  dayOfWeek: DayOfWeek;
  startLocalTime: plainTime;
  endLocalTime: plainTime;
}

/**
 * Full recurring availability configuration used by the admin panel.
 */
model AvailabilityConfiguration {
  timezone: IanaTimeZone;
  weeklyRules: WeeklyAvailabilityRule[];
}

/**
 * Request payload used to replace the full recurring availability configuration.
 */
model ReplaceAvailabilityRequest {
  timezone: IanaTimeZone;
  weeklyRules: WeeklyAvailabilityRuleInput[];
}

/**
 * Concrete availability exception applied to a specific UTC interval.
 */
model AvailabilityOverride {
  id: string;
  startUtc: utcDateTime;
  endUtc: utcDateTime;
  isAvailable: boolean;
}

/**
 * Request payload used to create a concrete availability override.
 */
model CreateAvailabilityOverrideRequest {
  startUtc: utcDateTime;
  endUtc: utcDateTime;
  isAvailable: boolean;
}

/**
 * Request payload used to update a concrete availability override.
 */
model UpdateAvailabilityOverrideRequest {
  startUtc?: utcDateTime;
  endUtc?: utcDateTime;
  isAvailable?: boolean;
}

/**
 * Response returned after successfully creating an availability override.
 */
model CreatedAvailabilityOverrideResponse {
  @statusCode statusCode: 201;
  availabilityOverride: AvailabilityOverride;
}

