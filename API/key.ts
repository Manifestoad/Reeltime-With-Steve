// api/key.ts
export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key is not configured.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify({ apiKey }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}