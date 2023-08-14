export function createJsonResponse(
  body: Record<string, unknown>,
  extra: Record<string, unknown> = {},
): Response {
  const headers = {
    'content-type': 'application/json;charset=UTF-8',
  };

  const response = new Response(JSON.stringify(body), {
    headers,
    ...extra,
  });

  return response;
}

export async function sendInteractionResponse(
  interactionId: string,
  token: string,
  response: Record<string, unknown>,
) {
  await fetch(`https://discord.com/api/v10/interactions/${interactionId}/${token}/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  });
}

export async function editInteractionResponse(
  interactionId: string,
  token: string,
  response: Record<string, unknown>,
) {
  await fetch(`https://discord.com/api/v10/webhooks/${interactionId}/${token}/messages/@original`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  });
}
