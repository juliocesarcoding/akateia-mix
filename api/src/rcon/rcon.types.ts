export type RconTarget = {
  host: string;
  port: number;
  password: string;
};

export type RconExecOptions = {
  timeoutMs?: number; // timeout por comando
  retries?: number; // tentativas (ex: 1-2)
  retryDelayMs?: number; // atraso entre tentativas
};

export type PlayerInfo = {
  id?: number;
  time?: string;
  ping?: number;
  loss?: number;
  state?: string;
  adr?: string;
  name: string;
  steamId?: string;
  connected?: string;
};
