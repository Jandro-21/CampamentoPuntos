export async function onRequestPatch(context) {
  const { id, action, monitor } = await context.request.json();
  
  const pointsModifier = action === "add" ? "+ 1" : "- 1";
  const logAction = action === "add" ? "+1" : "-1";

  // 1. Actualizar puntos
  await context.env.DB.prepare(`UPDATE teams SET points = points ${pointsModifier} WHERE id = ?`).bind(id).run();
  
  // 2. Registrar la acción en el log
  await context.env.DB.prepare(
    "INSERT INTO logs (monitor, team_id, action) VALUES (?, ?, ?)"
  ).bind(monitor, id, logAction).run();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}