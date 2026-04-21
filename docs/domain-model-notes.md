# Domain Model Notes

## Base Principles

- `Owner` is not modeled as a separate entity because the system has one predefined owner.
- `ScheduleSettings` is not used as a separate entity.
- `Slot` is not stored in the database and must be computed on demand.
- `TypeSpec` is the single source of truth for the API contract.

## Entities

### 1. EventType

Represents a type of meeting that the guest can book.

Why it exists:
- the owner manages a list of bookable meeting types
- the guest chooses which meeting to book
- the meeting duration comes from the selected event type

Fields:
- `id` - internal technical identifier
- `slug` - public human-readable identifier used in URLs
- `title` - event type name
- `description?` - optional public description
- `durationMinutes` - meeting duration
- `isActive` - whether the event type is publicly bookable
- `createdAt`
- `updatedAt`

Notes:
- `slug` is used in public routes and public booking links
- `id` remains useful as an internal identifier in admin flows and persistence

### 2. WeeklyAvailabilityRule

Represents the owner's recurring weekly availability.

Why it exists:
- it defines the default working schedule by weekday
- most available booking slots are generated from these rules

Fields:
- `id`
- `dayOfWeek`
- `startLocalTime` - for example `09:00`
- `endLocalTime` - for example `17:00`

Why it is not stored in UTC:
- it is a recurring rule, not a concrete instant in time
- the meaning is: "every Monday from 09:00 to 17:00 in the owner's timezone"
- storing recurring weekly rules in UTC breaks the expected schedule when daylight saving time changes

### 3. AvailabilityOverride

Represents exceptions to the default weekly schedule.

Why it exists:
- close a specific day or interval
- open an extra interval outside the default schedule
- support holidays, vacations, and one-off changes

Fields:
- `id`
- `startUtc`
- `endUtc`
- `isAvailable`

How it works:
- `isAvailable = false` blocks a concrete interval
- `isAvailable = true` adds a concrete available interval

Why it uses UTC:
- this is a concrete interval on a concrete date
- UTC is the safest representation for precise overrides

### 4. Booking

Represents a confirmed booking.

Why it exists:
- marks a slot as taken
- participates in overlap checks
- appears in the owner's upcoming bookings list

Fields:
- `id`
- `eventTypeId`
- `guestName`
- `guestEmail`
- `guestNotes?`
- `startUtc`
- `endUtc`
- `createdAt`

Important rule:
- booking duration must not come from the client as the source of truth
- `endUtc` must be computed on the backend from `startUtc + EventType.durationMinutes`

### 5. Slot

Represents a potentially available time range shown to the guest.

Why it exists:
- used in API responses for the booking flow
- shows which time ranges can be selected

Fields:
- `startUtc`
- `endUtc`

Important:
- `Slot` is not a persistence entity
- slots are computed from:
  - `EventType.durationMinutes`
  - `WeeklyAvailabilityRule`
  - `AvailabilityOverride`
  - existing `Booking`
  - the 14-day booking window

## Persistence

Stored in the database:
- `EventType`
- `WeeklyAvailabilityRule`
- `AvailabilityOverride`
- `Booking`

Not stored in the database:
- `Slot`

## Deliberately Excluded from MVP

- `Owner`
- `ScheduleSettings`
- `BookingStatus`
- `User`
- authentication-related entities

## Time Handling

- `WeeklyAvailabilityRule` is stored as a local recurring rule
- `AvailabilityOverride` is stored in UTC because it represents concrete intervals
- `Booking` is stored in UTC
- `Slot` is computed and returned in UTC
- frontend can display local time for the current user, but backend logic remains deterministic

## Additional Note About Timezone

Even without a separate `ScheduleSettings` entity, the system still needs a canonical owner timezone to interpret recurring weekly availability.

That timezone can live in:
- owner profile/configuration in the backend
- availability API payloads
- application configuration

It does not need to be modeled as a standalone domain entity for MVP.

## Final MVP Domain Set

1. `EventType`
2. `WeeklyAvailabilityRule`
3. `AvailabilityOverride`
4. `Booking`
5. `Slot` as a computed response model
