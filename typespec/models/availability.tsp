import "@typespec/http";

using Http;

namespace BookingApi;

model WeeklyAvailabilityRule {
  id: string;
  dayOfWeek: DayOfWeek;
  startLocalTime: plainTime;
  endLocalTime: plainTime;
}

model WeeklyAvailabilityRuleInput {
  dayOfWeek: DayOfWeek;
  startLocalTime: plainTime;
  endLocalTime: plainTime;
}

model AvailabilityConfiguration {
  timezone: IanaTimeZone;
  weeklyRules: WeeklyAvailabilityRule[];
}

model ReplaceAvailabilityRequest {
  timezone: IanaTimeZone;
  weeklyRules: WeeklyAvailabilityRuleInput[];
}

model AvailabilityOverride {
  id: string;
  startUtc: utcDateTime;
  endUtc: utcDateTime;
  isAvailable: boolean;
}

model CreateAvailabilityOverrideRequest {
  startUtc: utcDateTime;
  endUtc: utcDateTime;
  isAvailable: boolean;
}

model UpdateAvailabilityOverrideRequest {
  startUtc?: utcDateTime;
  endUtc?: utcDateTime;
  isAvailable?: boolean;
}

model CreatedAvailabilityOverrideResponse {
  @statusCode statusCode: 201;
  availabilityOverride: AvailabilityOverride;
}
