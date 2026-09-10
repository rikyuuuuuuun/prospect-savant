import { ANNUAL_CONVERSION_DEFINITION } from '../../scripts/annual-conversion-source.mjs';
export function conversionRows(asOf, teams) {
  const ids = ['A', 'B', 'C', 'D'];
  const fy = Number(asOf.slice(0, 4)) - (Number(asOf.slice(5, 7)) < 4 ? 1 : 0);
  const fields = ['trials', 'admissions', 'previousTrials', 'previousAdmissions'];
  return [
    ['チーム', '年度', '年度実体験', '体験→入会', '前年同期間実体験', '前年同期間体験→入会', '集計基準日', '集計定義'],
    ...ids.map(id => [id, fy, ...fields.map(key => teams[id][key]), asOf, ANNUAL_CONVERSION_DEFINITION]),
    ['合計', fy, ...fields.map(key => ids.reduce((n, id) => n + teams[id][key], 0)), asOf, ANNUAL_CONVERSION_DEFINITION],
  ];
}
