export async function GET() {
  const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
    headers: { "x-access-token": "915c32d9a5e78e37088264f481025f5fab410df3c3095a27f8ba0748a32634f1" },
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data);
}
