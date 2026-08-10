export function getBentoShape(index: number): string {
  // 6-slot repeating pattern:
  // Slot 0: Large (span 2 cols, 2 rows)
  // Slot 1: Standard (span 1 col, 1 row)
  // Slot 2: Tall (span 1 col, 2 rows) - Good for vertical
  // Slot 3: Standard (span 1 col, 1 row)
  // Slot 4: Wide (span 2 cols, 1 row)
  // Slot 5: Standard (span 1 col, 1 row)
  
  const position = index % 6;
  
  switch (position) {
    case 0:
      return 'bento-shape-large';
    case 1:
      return 'bento-shape-standard';
    case 2:
      return 'bento-shape-tall';
    case 3:
      return 'bento-shape-standard';
    case 4:
      return 'bento-shape-wide';
    case 5:
      return 'bento-shape-standard';
    default:
      return 'bento-shape-standard';
  }
}
