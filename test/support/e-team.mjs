const serial = value => (Date.parse(value) - Date.UTC(1899, 11, 30)) / 86400000;

export function eMetricSourceRows(e) {
  const m = e.metrics;
  const rows = Array.from({ length: 62 }, () => []);
  const member = Array(31).fill('');
  member[0] = 'E'; member[1] = e.members; member[8] = m.admissions;
  m.retention.periods.forEach((period, index) => {
    member[14 + index * 2] = period.sample;
    member[15 + index * 2] = period.rate === null ? '' : period.rate / 100;
  });
  member[30] = `0件実移動確認／0件過去基準維持／0件課金停止確認／0件名簿退会日確認／${m.unknownWithdrawals}件退会日不明`;
  rows[0] = member;
  rows[3] = ['E', m.growth.top10, m.growth.top10to20, m.growth.top20to30, '', m.growth.top30Children, m.growth.weightedPoints, m.growth.status];
  rows[5] = ['E', m.family.trialPoints, m.family.siblingPoints, m.family.points, '', m.family.definition, e.members, m.family.rate === null ? '' : m.family.rate / 100, '', '', 0.7, 0.3];
  rows[7] = ['E', m.event.eventCount, m.event.averageRate === null ? '' : m.event.averageRate / 100, '', '', m.event.participants, m.event.repeated, m.event.repeatRate === null ? '' : m.event.repeatRate / 100];
  rows[8] = ['E', ...m.schoolAge.samples.flatMap((sample, index) => [sample, m.schoolAge.rates[index] === null ? '' : m.schoolAge.rates[index] / 100])];
  m.events.forEach((event, index) => { rows[10 + index] = [serial(event.startDate), serial(event.endDate), event.participants ?? '', event.members ?? '', event.rate === null ? '' : event.rate / 100]; });
  m.curve.forEach((point, index) => { rows[10 + index][6] = point.months; rows[10 + index][7] = point.rate === null ? '' : point.rate / 100; rows[10 + index][8] = point.sample; });
  return rows;
}
