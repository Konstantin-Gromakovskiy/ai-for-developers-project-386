import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using Http;
using Rest;

@service(#{ title: "Meeting Booking API" })
@server("http://localhost:3000", "Local development server")
namespace BookingApi;

@route("/health")
op health(): {
  status: "ok";
};
