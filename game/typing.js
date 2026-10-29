export const MIN_WPM = 50;
const phrases = [
  'ciche lapy mijaja drzwi nocny patrol szuka cienia kot zna droge do piwnicy i wraca bez sladu',
  'stary dom zasypia kot mija puste krzesla za sciana czeka skarb a pod oknem stoi male auto',
  'noc otula dachy cichy kot schodzi po schodach omija swiatlo chowa skarby i znika za rogiem',
  'za oknem pada deszcz w domu milczy radio male lapy szukaja klucza zanim wroci nocny patrol',
];

export function createTypingChallenge(attempt = 0) {
  return {
    target: phrases[attempt % phrases.length],
    typed: '',
    startedAt: null,
    lastTime: 0,
    finishedAt: null,
    inserted: 0,
    mistakes: 0,
    status: 'waiting',
  };
}

export function typingMetrics(challenge, now = challenge.lastTime) {
  const end = challenge.finishedAt ?? Math.max(challenge.lastTime, now);
  const seconds =
    challenge.startedAt === null ? 0 : Math.max(0, (end - challenge.startedAt) / 1000);
  const correct = [...challenge.typed].filter((char, i) => char === challenge.target[i]).length;
  // 5 znakow = 1 slowo
  const wpm = seconds > 0 ? (correct * 12000) / (end - challenge.startedAt) : 0;
  const accuracy = challenge.inserted
    ? ((challenge.inserted - challenge.mistakes) / challenge.inserted) * 100
    : 100;
  return { wpm, accuracy, seconds, correct };
}

export function updateTyping(challenge, value, now) {
  if (
    !['waiting', 'typing'].includes(challenge.status) ||
    typeof value !== 'string' ||
    value.length > challenge.target.length ||
    !Number.isFinite(now) ||
    now < 0
  )
    return;
  let prefix = 0;
  while (prefix < value.length && value[prefix] === challenge.typed[prefix]) prefix++;
  let previousEnd = challenge.typed.length;
  let nextEnd = value.length;
  while (
    previousEnd > prefix &&
    nextEnd > prefix &&
    challenge.typed[previousEnd - 1] === value[nextEnd - 1]
  ) {
    previousEnd--;
    nextEnd--;
  }
  const added = value.slice(prefix, nextEnd);
  // blokada wklejania / autouzupelniania
  if (added.length > 1) return;
  if (added.length && challenge.startedAt === null) challenge.startedAt = now;
  challenge.lastTime = Math.max(challenge.lastTime, now);
  if (added.length) {
    challenge.inserted++;
    if (added !== challenge.target[prefix]) challenge.mistakes++;
  }
  challenge.typed = value;
  if (challenge.startedAt !== null) challenge.status = 'typing';
  if (value === challenge.target) {
    challenge.finishedAt = challenge.lastTime;
    challenge.status = typingMetrics(challenge).wpm >= MIN_WPM ? 'passed' : 'failed';
  }
}
