// Myers' O(ND) difference algorithm over token lists, used to compare two documents' text.

/** A run of equal, deleted (only in a) or inserted (only in b) tokens, starting at a[a] and b[b]. */
export type DiffRun = { kind: "equal" | "del" | "ins"; a: number; b: number; n: number };

/**
 * The shortest edit script turning `a` into `b`, as runs. Returns null when the texts differ in more than
 * `maxEdits` tokens (the caller then compares page by page): memory grows with the square of the edits.
 */
function diffTokens(a: string[], b: string[], maxEdits = 4000): DiffRun[] | null {
  // Common start and end are cheap and usually most of the text.
  let start = 0, endA = a.length, endB = b.length;
  while (start < endA && start < endB && a[start] === b[start]) start++;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) (endA--, endB--);
  const n = endA - start, m = endB - start, max = n + m, runs: DiffRun[] = [];
  const push = (kind: DiffRun["kind"], ai: number, bi: number) => {
    const last = runs[runs.length - 1];
    if (last && last.kind === kind && last.a + (kind === "ins" ? 0 : last.n) === ai && last.b + (kind === "del" ? 0 : last.n) === bi) last.n++;
    else runs.push({ kind, a: ai, b: bi, n: 1 });
  };
  if (start) runs.push({ kind: "equal", a: 0, b: 0, n: start });
  if (n || m) {
    const offset = max + 1, v = new Int32Array(2 * max + 3), trace: Int32Array[] = [];
    let found = false;
    for (let d = 0; d <= max && d <= maxEdits; d++) {
      trace.push(v.slice(offset - d - 1, offset + d + 2));
      for (let k = -d; k <= d; k += 2) {
        let x = k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1]) ? v[offset + k + 1] : v[offset + k - 1] + 1, y = x - k;
        while (x < n && y < m && a[start + x] === b[start + y]) (x++, y++);
        v[offset + k] = x;
        if (x >= n && y >= m) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) return null;
    // Walk back through the saved frontiers to recover the path.
    const steps: [DiffRun["kind"], number, number][] = [];
    let x = n, y = m;
    for (let d = trace.length - 1; d >= 0; d--) {
      const vd = trace[d], at = (k: number) => vd[k + d + 1], k = x - y;
      const prevK = d === 0 ? 0 : k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1;
      const prevX = d === 0 ? 0 : at(prevK), prevY = prevX - prevK;
      while (x > prevX && y > prevY) steps.push(["equal", --x, --y]);
      if (d > 0) {
        if (x === prevX) steps.push(["ins", x, --y]);
        else steps.push(["del", --x, y]);
      }
      x = prevX;
      y = prevY;
    }
    while (x > 0 && y > 0) steps.push(["equal", --x, --y]);
    for (let i = steps.length - 1; i >= 0; i--) push(steps[i][0], start + steps[i][1], start + steps[i][2]);
  }
  if (a.length > endA) {
    const last = runs[runs.length - 1], tail = a.length - endA;
    if (last && last.kind === "equal" && last.a + last.n === endA && last.b + last.n === endB) last.n += tail;
    else runs.push({ kind: "equal", a: endA, b: endB, n: tail });
  }
  return runs;
}

export { diffTokens };
