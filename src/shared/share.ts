import { GRADE_LABEL, type DayResult } from './result';

/** One exam call per square: right, wrong, or not reached. */
export const squareGrid = (
  correct: readonly boolean[],
  total: number
): string =>
  Array.from({ length: total }, (_, i) => {
    const c = correct[i];
    return c === undefined ? '⬛' : c ? '🟩' : '🟥';
  }).join('');

/** The spoiler-free comment a player can post. Never includes the rule. */
export const shareText = (args: {
  doorNumber: number;
  difficulty: string;
  result: DayResult;
  correct: readonly boolean[];
  total: number;
}): string => {
  const { doorNumber, difficulty, result, correct, total } = args;
  const head = `Velvet Rope · Door #${doorNumber} (${difficulty})`;
  const verdict =
    result.status === 'passed'
      ? `Door cracked · ${GRADE_LABEL[result.grade]}`
      : 'Thrown out';
  const guests = `${result.probes} ${result.probes === 1 ? 'guest' : 'guests'} sent`;
  return [
    head,
    squareGrid(correct, total),
    `${verdict} · ${guests}`,
    `Day streak: ${result.streak}`,
  ].join('\n\n');
};
