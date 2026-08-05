export const onRequest = async (context) => {
  // 1. Petición de "pre-vuelo" (OPTIONS)
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    // 2. Ejecutar la petición normal
    const response = await context.next();
    const corsResponse = new Response(response.body, response);
    
    // Inyectar CORS a las peticiones exitosas
    corsResponse.headers.set("Access-Control-Allow-Origin", "*");
    corsResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    corsResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return corsResponse;
  } catch (error) {
    // 3. Si explota (Error 500), devolvemos el error PERO con CORS para poder leerlo en el front
    return new Response(JSON.stringify({ error: "Error interno del servidor", detalle: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
};