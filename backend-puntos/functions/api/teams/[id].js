export async function onRequestDelete(context) {
  try {
    // Obtenemos el ID de la URL y el nombre del monitor por parámetro de consulta
    const id = context.params.id;
    const url = new URL(context.request.url);
    const monitor = url.searchParams.get("monitor");

    // Bloqueo de seguridad en el backend: solo 'alejandro' puede borrar
    if (monitor !== "alejandro") {
      return new Response(JSON.stringify({ error: "No tienes permisos para borrar equipos" }), { status: 403 });
    }

    // 1. Borramos primero los logs (historial) vinculados a este equipo
    await context.env.DB.prepare("DELETE FROM logs WHERE team_id = ?").bind(id).run();
    
    // 2. Borramos el equipo
    await context.env.DB.prepare("DELETE FROM teams WHERE id = ?").bind(id).run();
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}