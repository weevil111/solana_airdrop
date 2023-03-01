export async function POST(request) {
  const { pubkey } = request.body;
  if (!pubkey) {
    return Response.json({ message: "No public key found" }, { status: 404 });
  }
}
