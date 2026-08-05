export const onRequest = async (context) => {
  // Si es la petición de comprobación del navegador, respondemos con un OK limpio
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  // Dejamos pasar la petición a tu endpoint de login o base de datos
  const response = await context.next();

  // Clonamos y añadimos las cabeceras CORS a la respuesta real
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  newResponse.headers.set("Access-Control-Allow-Headers", "*");

  return newResponse;
};