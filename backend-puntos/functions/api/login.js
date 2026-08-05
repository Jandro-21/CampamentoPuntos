export async function onRequestPost(context) {
  const { username, password } = await context.request.json();
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM users WHERE username = ? AND password = ?"
  ).bind(username, password).all();
  
  if (results.length > 0) {
    // Devolvemos un token (simulado) y el nombre del monitor exacto que ha entrado
    return new Response(JSON.stringify({ token: "admin-token", monitor: results[0].username }), { status: 200 });
  }
  return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
}