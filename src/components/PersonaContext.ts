import { createContext, useContext } from 'react';
import type { Persona } from '../data/kpis';

export const PersonaContext = createContext<Persona>('CTO');
export const usePersona = () => useContext(PersonaContext);
