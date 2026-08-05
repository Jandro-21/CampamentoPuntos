export async function onRequestGet(context) {
  // Hacemos un JOIN simple para sacar el nombre y el color del equipo
  const { results } = await context.env.DB.prepare(`
    SELECT logs.id, logs.monitor, logs.action, logs.created_at, teams.name as team_name, teams.color 
    FROM logs 
    JOIN teams ON logs.team_id = teams.id 
    ORDER BY logs.created_at DESC 
    LIMIT 20
  `).all();
  
  return new Response(JSON.stringify(results), { status: 200 });
}