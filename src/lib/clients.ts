export interface ClientConfig {
  id: string;
  name: string;
  metaAdAccountId: string;
}

/**
 * CLIENTS env var is a JSON array: [{"id":"acme","name":"Acme Co","metaAdAccountId":"act_123"}, ...]
 * Falls back to a single "default" client built from META_AD_ACCOUNT_ID so existing
 * single-account setups keep working without changing env vars.
 */
export function getClients(): ClientConfig[] {
  const raw = process.env.CLIENTS;
  if (raw) {
    const parsed = JSON.parse(raw) as ClientConfig[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("CLIENTS must be a non-empty JSON array");
    }
    for (const c of parsed) {
      if (!c.id || !c.name || !c.metaAdAccountId) {
        throw new Error(`Invalid client entry: ${JSON.stringify(c)} (needs id, name, metaAdAccountId)`);
      }
    }
    return parsed;
  }

  const singleAccountId = process.env.META_AD_ACCOUNT_ID;
  if (singleAccountId) {
    return [{ id: "default", name: "Default Account", metaAdAccountId: singleAccountId }];
  }

  throw new Error("No clients configured: set CLIENTS (JSON array) or META_AD_ACCOUNT_ID");
}

export function getClientById(id: string): ClientConfig {
  const client = getClients().find((c) => c.id === id);
  if (!client) throw new Error(`Unknown client id: ${id}`);
  return client;
}
