import { TEAM_IDS } from './metric-retention-evidence.mjs';

export const EXPLANATION_PREFIX = '評価根拠｜';
export const OPERATION_NOTE_PREFIX = '\n運用注記｜';

function signed(value, digits = 1, unit = '') {
  const numeric = Number(value);
  const text = numeric > 0 ? `+${numeric.toFixed(digits)}` : numeric.toFixed(digits);
  return `${text}${unit}`;
}
function metricScore(team, key) {
  const value = team?.metrics?.[key];
  return Number.isFinite(value) ? value : null;
}
function retentionPeriodText(period) {
  return `${period.label} ${period.retained}/${period.sample}人継続・非継続${period.exited}人（${period.rate.toFixed(1)}%・相対点${period.relativeScore.toFixed(1)}）`;
}
function peerCrossingText(teamId, period, previousPeriod, currentEvidence, previousEvidence) {
  if (!currentEvidence || !previousEvidence) return '';
  const currentTeamRate = period?.rate;
  const previousTeamRate = previousPeriod?.rate;
  if (!Number.isFinite(currentTeamRate) || !Number.isFinite(previousTeamRate)) return '';
  const direction = Number(period.relativeScore) - Number(previousPeriod.relativeScore);
  const candidates = [];
  for (const peerId of TEAM_IDS) {
    if (peerId === teamId) continue;
    const currentPeer = currentEvidence[peerId]?.retention?.periods?.find((item) => item.key === period.key);
    const previousPeer = previousEvidence[peerId]?.retention?.periods?.find((item) => item.key === period.key);
    if (!currentPeer || !previousPeer || !Number.isFinite(currentPeer.rate) || !Number.isFinite(previousPeer.rate)) continue;
    const crossedDown = direction < 0 && previousPeer.relativeScore < previousPeriod.relativeScore && currentPeer.relativeScore > period.relativeScore;
    const crossedUp = direction > 0 && previousPeer.relativeScore > previousPeriod.relativeScore && currentPeer.relativeScore < period.relativeScore;
    if (crossedDown || crossedUp) candidates.push({ peerId, currentPeer, previousPeer });
  }
  if (!candidates.length) return '';
  const peer = candidates[0];
  return `${peer.peerId} TEAMが${peer.previousPeer.retained}/${peer.previousPeer.sample}人・${peer.previousPeer.rate.toFixed(1)}%から${peer.currentPeer.retained}/${peer.currentPeer.sample}人・${peer.currentPeer.rate.toFixed(1)}%へ動き、${teamId} TEAMの${currentTeamRate.toFixed(1)}%を${direction < 0 ? '上回った' : '下回った'}`;
}

function explainRetention(id, current, previous, currentAll, previousAll, currentScore, previousScore, previousLabel) {
  const scored = current?.periods?.filter((period) => period.scored && Number.isFinite(period.relativeScore)) || [];
  const basis = scored.length ? scored.map(retentionPeriodText).join('、') : '比較可能な期間がありません';
  let text = `【定着力】${basis}。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果${currentScore}点です。`;
  if (!Number.isFinite(previousScore) || currentScore === previousScore) return text;
  if (!previous?.periods?.length) return `${text} ${previousLabel || '前回'}の匿名内訳が旧snapshotに保存されていないため、点数変化の理由は完全比較できません。`;
  const previousByKey = new Map(previous.periods.map((period) => [period.key, period]));
  const changes = scored.flatMap((period) => {
    const before = previousByKey.get(period.key);
    if (!before || !Number.isFinite(before.relativeScore) || before.relativeScore === period.relativeScore) return [];
    return [{ period, before, impact: (period.relativeScore - before.relativeScore) * period.weight }];
  }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  if (!changes.length) return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点ですが、公開済み匿名内訳だけでは差分要因を特定できません。`;
  const denominator = scored.reduce((sum, period) => sum + period.weight, 0);
  const top = changes.slice(0, 2).map(({ period, before }) => {
    const ownChange = Math.abs(period.rate - before.rate) >= 0.05
      ? `${id} TEAM自身は${before.retained}/${before.sample}人・${before.rate.toFixed(1)}%→${period.retained}/${period.sample}人・${period.rate.toFixed(1)}%`
      : `${id} TEAM自身の率は${before.rate.toFixed(1)}%→${period.rate.toFixed(1)}%で実質不変`;
    const crossing = peerCrossingText(id, period, before, currentAll, previousAll);
    const contribution = denominator ? (period.relativeScore - before.relativeScore) * period.weight / denominator : 0;
    return `${period.label}は${ownChange}${crossing ? `。一方で${crossing}` : ''}ため、相対点が${before.relativeScore.toFixed(1)}→${period.relativeScore.toFixed(1)}となり、定着力へ約${signed(contribution, 1, '点')}影響`;
  }).join('。');
  return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点の主因は、${top}です。`;
}

function explainAdmission(current, previous, currentScore, previousScore, previousLabel) {
  const basis = current?.trials && current?.admissions !== null
    ? `${current.trials}人体験のうち${current.admissions}人入会、年度入会率${current.rate.toFixed(1)}%（前年同期間${current.previousRate.toFixed(1)}%）`
    : '年度入会の匿名内訳不足';
  let text = `【年度入会力】${basis}。A〜Dの年度入会率を相対評価して${currentScore}点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。`;
  if (!Number.isFinite(previousScore) || currentScore === previousScore) return text;
  if (!previous?.trials || previous.admissions === null || previous.rate === null) return `${text} ${previousLabel || '前回'}の人数内訳がないため、変化理由は完全比較できません。`;
  return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点。実績は${previous.admissions}/${previous.trials}人・${previous.rate.toFixed(1)}%→${current.admissions}/${current.trials}人・${current.rate.toFixed(1)}%です。`;
}

function explainEvent(current, previous, currentScore, previousScore, previousLabel) {
  let text = `【イベント力】一般会員対象イベントの平均参加率${current.averageRate.toFixed(1)}%と継続参加率${current.repeatRate.toFixed(1)}%を、参加${current.participationWeight}%・継続${current.repeatWeight}%で統合して${currentScore}点です。大会参加者限定練習は除外しています。`;
  if (!Number.isFinite(previousScore) || currentScore === previousScore) return text;
  if (!previous) return `${text} ${previousLabel || '前回'}の内訳がないため、変化理由は完全比較できません。`;
  return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点。平均参加率は${previous.averageRate.toFixed(1)}%→${current.averageRate.toFixed(1)}%、継続参加率は${previous.repeatRate.toFixed(1)}%→${current.repeatRate.toFixed(1)}%です。`;
}

function explainGrowth(current, previous, currentScore, previousScore, previousLabel) {
  let text = `【成長力】${current.competitionCount}大会・順位${current.competitionRows.toLocaleString('ja-JP')}件を対象に、上位10% ${current.top10}件、10〜20% ${current.top10to20}件、20〜30% ${current.top20to30}件、上位30%の子ども${current.top30Children}人、加重点${current.weightedPoints}点。A〜Dの相対評価で${currentScore}点です。`;
  if (!Number.isFinite(previousScore) || currentScore === previousScore) return text;
  if (!previous) return `${text} ${previousLabel || '前回'}の大会内訳は旧snapshotに保存されていないため、点数変化の理由は完全比較できません。`;
  return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点。上位30%加重点は${previous.weightedPoints}→${current.weightedPoints}、対象児童は${previous.top30Children}→${current.top30Children}人です。`;
}

function componentBasis(component) {
  if (!component || component.denominator === null || component.numerator === null || component.rate === null) return `${component?.label || '指標'}は対象不足`;
  const suffix = component.key === 'sibling' ? '世帯' : '人';
  return `${component.label} ${component.numerator}/${component.denominator}${suffix}・${component.rate.toFixed(1)}%（相対点${component.relativeScore.toFixed(1)}）`;
}
function explainFamily(id, current, previous, currentAll, previousAll, currentScore, previousScore, previousLabel) {
  const components = Object.values(current?.components || {});
  const basis = components.map(componentBasis).join('、');
  let text = `【家庭継続力】${basis}。兄弟姉妹25・2年継続20・再入会20・イベント継続15の設定重みを、利用可能項目の合計で正規化して相対評価し${currentScore}点です。`;
  if (!Number.isFinite(previousScore) || currentScore === previousScore) return text;
  const fullPrevious = previous?.version === 'metric-evidence-v1';
  const currentAvailable = components.filter((component) => Number.isFinite(component.relativeScore));
  const denominator = currentAvailable.reduce((sum, component) => sum + component.weight, 0);
  const knownChanges = [];
  for (const [key, component] of Object.entries(current?.components || {})) {
    if (!Number.isFinite(component?.relativeScore)) continue;
    const before = previous?.components?.[key];
    if (!before || !Number.isFinite(before.relativeScore) || before.relativeScore === component.relativeScore) continue;
    knownChanges.push({ component, before, contribution: denominator ? (component.relativeScore - before.relativeScore) * component.weight / denominator : 0 });
  }
  if (!knownChanges.length) return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点ですが、旧snapshotの匿名内訳不足により差分要因を特定できません。`;
  knownChanges.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const details = knownChanges.slice(0, 2).map(({ component, before, contribution }) => {
    let peerText = '';
    if (component.key === 'retention2y') {
      const currentPeriod = currentAll[id]?.retention?.periods?.find((period) => period.months === 24);
      const previousPeriod = previousAll[id]?.retention?.periods?.find((period) => period.months === 24);
      peerText = peerCrossingText(id, currentPeriod, previousPeriod, currentAll, previousAll);
    }
    const raw = before.rate !== null && component.rate !== null ? `${before.rate.toFixed(1)}%→${component.rate.toFixed(1)}%` : '前回率不明';
    return `${component.label}は${raw}${peerText ? `。${peerText}` : ''}ため相対点${before.relativeScore.toFixed(1)}→${component.relativeScore.toFixed(1)}、家庭継続力へ約${signed(contribution, 1, '点')}影響`;
  }).join('。');
  const coverage = fullPrevious ? '' : ' なお旧snapshotでは兄弟世帯率・再入会率など一部の前回匿名内訳を保持していなかったため、その部分は推測せず比較対象外としています。';
  return `${text} ${previousLabel || '前回'}${previousScore}点→${currentScore}点について、確認できる主因は${details}です。${coverage}`.trim();
}

export function baseNote(note) {
  if (typeof note !== 'string' || !note.trim()) return '';
  if (!note.startsWith(EXPLANATION_PREFIX)) return note.trim();
  const marker = note.indexOf(OPERATION_NOTE_PREFIX);
  return marker >= 0 ? note.slice(marker + OPERATION_NOTE_PREFIX.length).trim() : '';
}

export function buildTeamMetricExplanation({ team, previousTeam, currentEvidence, previousEvidence, allCurrentEvidence, allPreviousEvidence, previousLabel }) {
  const id = team.id;
  return [
    explainRetention(id, currentEvidence.retention, previousEvidence?.retention, allCurrentEvidence, allPreviousEvidence, metricScore(team, 'retention'), metricScore(previousTeam, 'retention'), previousLabel),
    explainAdmission(currentEvidence.admission, previousEvidence?.admission, metricScore(team, 'admission'), metricScore(previousTeam, 'admission'), previousLabel),
    explainEvent(currentEvidence.event, previousEvidence?.event, metricScore(team, 'event'), metricScore(previousTeam, 'event'), previousLabel),
    explainGrowth(currentEvidence.growth, previousEvidence?.growth, metricScore(team, 'growth'), metricScore(previousTeam, 'growth'), previousLabel),
    explainFamily(id, currentEvidence.family, previousEvidence?.family, allCurrentEvidence, allPreviousEvidence, metricScore(team, 'family'), metricScore(previousTeam, 'family'), previousLabel),
  ].join(' ');
}
