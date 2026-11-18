import { createContext, useContext } from 'react';
import type { Persona } from '../data/kpis';
import { initialPriorities, type Priority } from '../data/priorities';

export const PersonaContext = createContext<Persona>('CTO');
export const usePersona = () => useContext(PersonaContext);

export interface PrioritiesState {
  items: Priority[];
  setVotes: (id: string, field: 'teamVotes' | 'superVotes', value: number) => void;
  reset: () => void;
}

export const PrioritiesContext = createContext<PrioritiesState>({ items: initialPriorities, setVotes: () => {}, reset: () => {} });
export const usePriorities = () => useContext(PrioritiesContext);

