// api/key.js
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key is not configured on the server.' }),
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
