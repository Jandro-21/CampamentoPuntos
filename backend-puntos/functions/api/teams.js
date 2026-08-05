export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare("SELECT * FROM teams").all();
  return new Response(JSON.stringify(results), { status: 200 });
}

export async function onRequestPost(context) {
  const { name, color } = await context.request.json();
  await context.env.DB.prepare(
    "INSERT INTO teams (name, color) VALUES (?, ?)"
  ).bind(name, color).run();
  return new Response(JSON.stringify({ success: true }), { status: 201 });
}