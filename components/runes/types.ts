export interface RuneTree {
  id: number;
  name: string;
  key: string;
  icon: string;
  slots: Array<{
    name: string;
    runes: Array<{
      id: number;
      name: string;
      icon: string;
      shortDesc: string;
    }>;
  }>;
}

export interface SelectedRune {
  id: number;
  name: string;
  icon: string;
  slotNumber: number;
  style: string;
}

export const TREE_COLORS = {
  8000: "border-yellow-500", // Chuẩn Xác (Precision)
  8100: "border-red-500", // Áp Đảo (Domination)
  8200: "border-purple-500", // Pháp Thuật (Sorcery)
  8300: "border-blue-500", // Cảm Hứng (Inspiration)
  8400: "border-green-500", // Kiên Định (Resolve)
} as const;

export const getTreeColor = (treeId: number): string => {
  return TREE_COLORS[treeId as keyof typeof TREE_COLORS] || "border-gray-500";
};

export interface SelectedShard {
  id: number;
  name: string;
  icon: string;
  slotIndex: number;
  category: string;
}
