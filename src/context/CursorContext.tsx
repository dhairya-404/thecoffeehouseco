import React, { createContext, useContext, useState } from 'react';
import type { CursorVariant, CursorState } from '../types';

interface CursorContextType {
  cursorState: CursorState;
  setCursor: (variantOrText: CursorVariant | string, text?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorState: { variant: 'default' },
  setCursor: () => {},
  resetCursor: () => {},
});

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorState, setCursorState] = useState<CursorState>({ variant: 'default' });

  const setCursor = (variantOrText: CursorVariant | string, text?: string) => {
    if (text !== undefined) {
      setCursorState({ variant: variantOrText as CursorVariant, text });
    } else {
      // If single string passed like 'VIEW', 'TASTE', 'EXPLORE', 'RESERVE', set as text and active variant
      setCursorState({ variant: 'active', text: variantOrText });
    }
  };

  const resetCursor = () => {
    setCursorState({ variant: 'default', text: undefined });
  };

  return (
    <CursorContext.Provider value={{ cursorState, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
