import type { PlayerInfo } from '../rcon.types';

export function parseHumanCountFromStatus(text: string): number {
  // Ex CS2: "players  : 1 humans, 0 bots ..."
  const m = text.match(/players\s*:?\s*(\d+)\s+humans/i);
  return m ? parseInt(m[1], 10) : 0;
}

export function parsePlayersFromStatus(text: string): PlayerInfo[] {
  const lines = text.split('\n').map((l) => l.trimEnd());

  // acha o início do bloco de players
  const startIdx = lines.findIndex((l) =>
    l.includes('---------players--------'),
  );
  if (startIdx === -1) return [];

  const block = lines.slice(startIdx + 1);

  // pula cabeçalho "id time ping..."
  // e captura linhas que contenham nome em aspas simples
  const players: PlayerInfo[] = [];

  for (const raw of block) {
    const line = raw.trim();
    if (!line) continue;

    // se aparecer outro separador, para (segurança)
    if (line.startsWith('---------')) break;

    // ignora cabeçalho
    if (
      line.startsWith('id') &&
      line.includes('state') &&
      line.includes('name')
    )
      continue;

    // pega nome entre aspas simples
    const nameMatch = line.match(/'([^']*)'\s*$/);
    const name = nameMatch?.[1]?.trim() ?? '';

    // ignora linhas fantasmas: id 65535, NoChan, name vazio
    if (!name) continue;
    if (line.includes('[NoChan]')) continue;

    // vamos parsear colunas principais (bem tolerante)
    // Ex:
    // 65281    10:13    8    0     active 786432 189.36.252.12:34091 'mkzera'
    const parts = line
      .replace(/'[^']*'\s*$/, '') // remove o nome do fim
      .trim()
      .split(/\s+/);

    const id = parseInt(parts[0], 10);
    const time = parts[1];
    const ping = parseInt(parts[2], 10);
    const loss = parseInt(parts[3], 10);
    const state = parts[4]; // active/challenging etc
    const adr = parts[6]; // ip:porta costuma cair aqui (varia, mas ok)

    // pega só quem está active (você pode mudar isso se quiser)
    if (state?.toLowerCase() !== 'active') continue;

    players.push({
      id: Number.isFinite(id) ? id : -1,
      time,
      ping: Number.isFinite(ping) ? ping : undefined,
      loss: Number.isFinite(loss) ? loss : undefined,
      state,
      adr,
      name,
    });
  }

  return players;
}
