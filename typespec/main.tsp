import "@typespec/http";
import "@typespec/openapi3";

import "./common/scalars.tsp";
import "./common/errors.tsp";
import "./models/event-types.tsp";
import "./models/availability.tsp";
import "./models/bookings.tsp";
import "./routes/public.tsp";
import "./routes/admin.tsp";

using Http;

@service(#{ title: "Meeting Booking API" })
@server("http://localhost:3000", "Local development server")
namespace BookingApi;
