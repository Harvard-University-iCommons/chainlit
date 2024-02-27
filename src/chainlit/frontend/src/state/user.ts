import { DefaultValue, atom, selector } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { wsEndpoint } from '../api';

export const accessTokenState = atom<string | undefined>({
  key: 'AccessToken',
  default: undefined
});

const sessionIdAtom = atom<string>({
  key: 'SessionId',
  default: uuidv4()
});

export const sessionIdState = selector({
  key: 'SessionIdSelector',
  get: ({ get }) => get(sessionIdAtom),
  set: ({ set }, newValue) =>
    set(sessionIdAtom, newValue instanceof DefaultValue ? uuidv4() : newValue)
});

export type Role = 'USER' | 'ADMIN' | 'OWNER' | 'ANONYMOUS' | undefined;

export interface IMember {
  name: string;
  email: string;
  role: Role;
}

export const roleState = atom<Role>({
  key: 'Role',
  default: undefined
});

const localUserEnv = localStorage.getItem('userEnv');

export const userEnvState = atom<Record<string, string>>({
  key: 'UserEnv',
  default: localUserEnv ? JSON.parse(localUserEnv) : {}
});

export const userSandboxState = atom<{
  projects: string[];
}>({
  key: 'projects',
  default: selector({
    key: 'projects/default',
    get: async ({ get }) => {
      const sessionId = get(sessionIdState); // Get sessionId
      const res = await fetch(`${wsEndpoint}/projects/${sessionId}`, {
        headers: {
          'content-type': 'application/json'
        },
        method: 'GET'
      });
      return res.json();
    }
  })
});
