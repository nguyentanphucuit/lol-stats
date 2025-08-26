import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Champion, GameMode, RuneTree, SelectedRune, SelectedShard, SelectedItem, SelectedSpell } from '@/types';

export interface BuildState {
  // Core selections
  champion: Champion | null;
  mode: GameMode | null;
  primaryTree: RuneTree | null;
  secondaryTree: RuneTree | null;
  
  // Build components
  runes: SelectedRune[];
  shards: SelectedShard[];
  items1: SelectedItem[];
  items2: SelectedItem[];
  spells: SelectedSpell[];
  
  // Actions
  setChampion: (champion: Champion | null) => void;
  setMode: (mode: GameMode | null) => void;
  setPrimaryTree: (tree: RuneTree | null) => void;
  setSecondaryTree: (tree: RuneTree | null) => void;
  setRune: (rune: SelectedRune) => void;
  removeRune: (slotNumber: number, style: string) => void;
  setShard: (shard: SelectedShard) => void;
  setItem: (item: SelectedItem, buildIndex: 1 | 2) => void;
  removeItem: (slotIndex: number, buildIndex: 1 | 2) => void;
  setSpell: (spell: SelectedSpell) => void;
  removeSpell: (slotIndex: number) => void;
  resetBuild: () => void;
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      // Initial state
      champion: null,
      mode: null,
      primaryTree: null,
      secondaryTree: null,
      runes: [],
      shards: [],
      items1: [],
      items2: [],
      spells: [],
      
      // Actions
      setChampion: (champion) => set({ champion }),
      
      setMode: (mode) => set({ mode }),
      
      setPrimaryTree: (tree) => {
        set((state) => ({
          primaryTree: tree,
          // Clear runes when primary tree changes
          runes: state.runes.filter(r => r.style !== tree?.name),
          // Reset secondary tree when primary changes
          secondaryTree: null,
        }));
      },
      
      setSecondaryTree: (tree) => set({ secondaryTree: tree }),
      
      setRune: (rune) => {
        set((state) => {
          // Remove any existing rune in the same slot and style
          const filtered = state.runes.filter(
            r => !(r.slotNumber === rune.slotNumber && r.style === rune.style)
          );
          
          // For secondary tree, ensure max 2 runes
          if (rune.style === state.secondaryTree?.name) {
            const secondaryRunes = filtered.filter(r => r.style === rune.style);
            if (secondaryRunes.length >= 2) {
              // Remove oldest secondary rune
              const oldest = secondaryRunes[0];
              const withoutOldest = filtered.filter(r => r.id !== oldest.id);
              return { runes: [...withoutOldest, rune] };
            }
          }
          
          return { runes: [...filtered, rune] };
        });
      },
      
      removeRune: (slotNumber, style) => {
        set((state) => ({
          runes: state.runes.filter(
            r => !(r.slotNumber === slotNumber && r.style === style)
          ),
        }));
      },
      
      setShard: (shard) => {
        set((state) => {
          // Remove any existing shard in the same slot
          const filtered = state.shards.filter(s => s.slotIndex !== shard.slotIndex);
          return { shards: [...filtered, shard] };
        });
      },
      
      setItem: (item, buildIndex) => {
        set((state) => {
          const targetArray = buildIndex === 1 ? 'items1' : 'items2';
          const filtered = state[targetArray].filter(i => i.slotIndex !== item.slotIndex);
          return { [targetArray]: [...filtered, item] };
        });
      },
      
      removeItem: (slotIndex, buildIndex) => {
        set((state) => {
          const targetArray = buildIndex === 1 ? 'items1' : 'items2';
          return {
            [targetArray]: state[targetArray].filter(i => i.slotIndex !== slotIndex),
          };
        });
      },
      
      setSpell: (spell) => {
        set((state) => {
          // Remove any existing spell in the same slot
          const filtered = state.spells.filter(s => s.slotIndex !== spell.slotIndex);
          return { spells: [...filtered, spell] };
        });
      },
      
      removeSpell: (slotIndex) => {
        set((state) => ({
          spells: state.spells.filter(s => s.slotIndex !== slotIndex),
        }));
      },
      
      resetBuild: () => set({
        champion: null,
        runes: [],
        shards: [],
        items1: [],
        items2: [],
        spells: [],
        // Note: mode, primaryTree, secondaryTree are kept as they're global preferences
      }),
    }),
    {
      name: 'rune-build-storage',
      partialize: (state) => ({
        // Only persist user preferences, not the full build
        mode: state.mode,
        primaryTree: state.primaryTree,
        secondaryTree: state.secondaryTree,
      }),
    }
  )
);
