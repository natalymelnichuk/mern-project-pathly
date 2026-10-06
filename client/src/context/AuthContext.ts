import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Create a context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

