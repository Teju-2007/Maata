export function normalizePhrase(value: string): string {
  return value.toLocaleLowerCase().trim().replace(/[.!?,;:]/g, '').replace(/\s+/g, ' ');
}

export function editDistance(a: string, b: string): number {
  const left = a.toLocaleLowerCase().replace(/[^a-z]/g, '');
  const right = b.toLocaleLowerCase().replace(/[^a-z]/g, '');
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = row[0]!; row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const above = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, diagonal + Number(left[i - 1] !== right[j - 1]));
      diagonal = above;
    }
  }
  return row[right.length]!;
}

export function isNearTelish(input: string, expected: string): boolean {
  const distance = editDistance(input, expected);
  return input.replace(/[^a-z]/gi, '').length >= 5 && distance <= Math.max(1, Math.floor(expected.replace(/[^a-z]/gi, '').length * 0.12));
}
