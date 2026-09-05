const HASH_KEY = 's95_state';

function envOrThrow(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

async function redisCommand(command: (string | number)[]) {
  const url = envOrThrow('KV_REST_API_URL');
  const token = envOrThrow('KV_REST_API_TOKEN');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(body.error || `Redis command failed (${res.status})`);
  }
  return body.result;
}

async function redisPipeline(commands: (string | number)[][]) {
  const url = envOrThrow('KV_REST_API_URL');
  const token = envOrThrow('KV_REST_API_TOKEN');
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Redis pipeline failed (${res.status})`);
  return body as { result?: unknown; error?: string }[];
}

export async function getAllState(): Promise<Record<string, unknown>> {
  const flat = (await redisCommand(['HGETALL', HASH_KEY])) as string[] | null;
  const out: Record<string, unknown> = {};
  if (!flat) return out;
  for (let i = 0; i < flat.length; i += 2) {
    const key = flat[i];
    const raw = flat[i + 1];
    try {
      out[key] = JSON.parse(raw);
    } catch {
      out[key] = raw;
    }
  }
  return out;
}

export async function setState(key: string, value: unknown) {
  await redisCommand(['HSET', HASH_KEY, key, JSON.stringify(value)]);
}

export async function setStateMany(rows: { key: string; value: unknown }[]) {
  if (!rows.length) return;
  const commands = rows.map((r) => [
    'HSET',
    HASH_KEY,
    r.key,
    JSON.stringify(r.value),
  ]);
  const results = await redisPipeline(commands);
  const failed = results.find((r) => r.error);
  if (failed) throw new Error(failed.error);
}

export async function deleteState(key: string) {
  await redisCommand(['HDEL', HASH_KEY, key]);
}
