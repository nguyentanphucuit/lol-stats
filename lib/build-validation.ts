import type { Champion, GameMode, RuneTree, SelectedRune, SelectedShard, SelectedItem, SelectedSpell } from '@/types';

interface BuildValidationState {
  champion: Champion | null;
  mode: GameMode | null;
  primaryTree: RuneTree | null;
  secondaryTree: RuneTree | null;
  runes: SelectedRune[];
  shards: SelectedShard[];
  items1: SelectedItem[];
  items2: SelectedItem[];
  spells: SelectedSpell[];
}

export function validateBuild(buildState: BuildValidationState): boolean {
  const {
    champion,
    mode,
    primaryTree,
    secondaryTree,
    runes,
    shards,
    items1,
    items2,
    spells,
  } = buildState;

  // Check if core selections are made
  if (!champion || !mode || !primaryTree || !secondaryTree) {
    return false;
  }

  // Check if we have all 4 primary runes (slots 1-4)
  const primaryRunes = runes.filter(r => r.style === primaryTree.name);
  if (primaryRunes.length < 4) {
    return false;
  }

  // Check if we have exactly 2 secondary runes
  const secondaryRunes = runes.filter(r => r.style === secondaryTree.name);
  if (secondaryRunes.length < 2) {
    return false;
  }

  // Check if we have all 3 stat shards
  if (shards.length < 3) {
    return false;
  }

  // Check if we have all 6 items in Item Build 1 (required)
  if (items1.length < 6) {
    return false;
  }

  // Item Build 2 validation: if started (has items), must have 6 items
  if (items2.length > 0 && items2.length < 6) {
    return false;
  }

  // Check if we have exactly 2 spells
  if (spells.length < 2) {
    return false;
  }

  return true;
}
