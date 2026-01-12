export interface Context<Req = unknown, Res = unknown, State = {}> {
  request: Req;
  response: Res;
  state: State;
  error?: Error;
}