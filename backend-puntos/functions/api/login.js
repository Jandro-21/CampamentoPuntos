// 1. Responde de inmediato a la prueba de CORS del navegador (Preflight)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

// 2. Tu lógica normal del login cuando llega el POST
export async function onRequestPost(context) {
  try {
    const { username, password } = await context.request.json();
    const db = context.env.DB;

    // --- AQUÍ VA TU LÓGICA DE CONSULTA A LA BASE DE DATOS D1 ---
    // Ejemplo rápido:
    // const { results } = await db.prepare("SELECT * FROM usuarios WHERE ...").all();

    // Respuesta exitosa con las cabeceras CORS obligatorias
    const responseData = { success: true, message: "Login correcto" };
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}