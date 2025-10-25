export default {
  async fetch(request, env) {
    const key = "visits";
    let count = parseInt(await env.COUNTER_KV.get(key)) || 0;
    count++;
    await env.COUNTER_KV.put(key, count);
    return new Response(JSON.stringify({ visits: count }), {
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*", // allows your GitHub Pages to fetch it
      },
    });
  },
};
