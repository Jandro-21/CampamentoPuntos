export const onRequest = async (context) => {
  // Permitir de forma abierta cualquier pre-vuelo (OPTIONS)
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*", // Permitir cualquier cabecera inyectada
      },
    });
  }

  try {
    const response = await context.next();
    const corsResponse = new Response(response.body, response);
    
    // Inyectar CORS abiertos en todas las respuestas
    corsResponse.headers.set("Access-Control-Allow-Origin", "*");
    corsResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    corsResponse.headers.set("Access-Control-Allow-Headers", "*");
    
    return corsResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno", detalle: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
};