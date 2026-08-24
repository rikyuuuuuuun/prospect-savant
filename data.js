window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-08-25-0730",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-08-25",
  "asOfLabel": "2026年8月25日",
  "admissions": {
    "asOf": "2026-08-25",
    "definition": "member-master-admission-date-annual-v1",
    "fiscalYear": "2026",
    "futureAdmissionCount": 0,
    "reEnrollmentPolicy": "including-reenrollment",
    "teams": {
      "A": {
        "cumulative": 101
      },
      "B": {
        "cumulative": 83
      },
      "C": {
        "cumulative": 67
      },
      "D": {
        "cumulative": 53
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1058,
    "monthlyDelta": 31,
    "admissionRate": 72.6,
    "admissionPreviousRate": 68.5,
    "admissionYoYDelta": 4.3,
    "latestEventParticipants": 124
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-08-24",
    "previousAsOfLabel": "2026年8月24日",
    "headline": {
      "members": 1058,
      "monthlyDelta": 31,
      "admissionRate": 72.6,
      "admissionPreviousRate": 68.5,
      "admissionYoYDelta": 4.3,
      "latestEventParticipants": 124
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 333,
        "overall": 77,
        "metrics": {
          "retention": 81,
          "admission": 88,
          "event": 66,
          "growth": 88,
          "family": 55
        }
      },
      {
        "id": "B",
        "rank": 2,
        "members": 309,
        "overall": 60,
        "metrics": {
          "retention": 48,
          "admission": 63,
          "event": 76,
          "growth": 63,
          "family": 63
        }
      },
      {
        "id": "C",
        "rank": 3,
        "members": 224,
        "overall": 34,
        "metrics": {
          "retention": 17,
          "admission": 38,
          "event": 50,
          "growth": 38,
          "family": 42
        }
      },
      {
        "id": "D",
        "rank": 4,
        "members": 192,
        "overall": 27,
        "metrics": {
          "retention": 33,
          "admission": 13,
          "event": 43,
          "growth": 13,
          "family": 38
        }
      }
    ],
    "memberDefinition": {
      "id": "operational-person-v1",
      "label": "人物単位運用会員"
    },
    "admissions": {
      "asOf": "2026-08-24",
      "definition": "member-master-admission-date-annual-v1",
      "fiscalYear": "2026",
      "futureAdmissionCount": 0,
      "reEnrollmentPolicy": "including-reenrollment",
      "teams": {
        "A": {
          "cumulative": 101
        },
        "B": {
          "cumulative": 83
        },
        "C": {
          "cumulative": 67
        },
        "D": {
          "cumulative": 53
        }
      }
    }
  },
  "scoreGuide": [
    {
      "value": 0,
      "label": "LOW"
    },
    {
      "value": 50,
      "label": "MID"
    },
    {
      "value": 80,
      "label": "STRONG"
    },
    {
      "value": 100,
      "label": "MAX"
    }
  ],
  "weights": [
    {
      "key": "retention",
      "label": "定着力",
      "value": 30
    },
    {
      "key": "admission",
      "label": "年度入会力",
      "value": 20
    },
    {
      "key": "growth",
      "label": "成長力",
      "value": 20
    },
    {
      "key": "event",
      "label": "イベント力",
      "value": 15
    },
    {
      "key": "family",
      "label": "家庭継続力",
      "value": 15
    }
  ],
  "metricLabels": {
    "retention": "定着力",
    "admission": "年度入会力",
    "event": "イベント力",
    "growth": "成長力",
    "family": "家庭継続力"
  },
  "teams": [
    {
      "id": "A",
      "rank": 1,
      "members": 333,
      "monthlyDelta": 23,
      "overall": 73,
      "status": "算出済",
      "metrics": {
        "retention": 72,
        "admission": 88,
        "event": 66,
        "growth": 88,
        "family": 47
      },
      "benchmark": {
        "retention12mRate": 82.4,
        "retention12mSample": 494,
        "admissionRate": 86.9,
        "admissionPreviousRate": 82.7,
        "admissionYoYDelta": 4.2,
        "eventRate": 18.8,
        "repeatRate": 37.5
      }
    },
    {
      "id": "B",
      "rank": 2,
      "members": 309,
      "monthlyDelta": 5,
      "overall": 64,
      "status": "算出済",
      "metrics": {
        "retention": 57,
        "admission": 63,
        "event": 76,
        "growth": 63,
        "family": 71
      },
      "benchmark": {
        "retention12mRate": 79.3,
        "retention12mSample": 387,
        "admissionRate": 76.6,
        "admissionPreviousRate": 80.6,
        "admissionYoYDelta": -4,
        "eventRate": 20.8,
        "repeatRate": 45.5
      }
    },
    {
      "id": "C",
      "rank": 3,
      "members": 224,
      "monthlyDelta": 2,
      "overall": 34,
      "status": "算出済",
      "metrics": {
        "retention": 17,
        "admission": 38,
        "event": 50,
        "growth": 38,
        "family": 42
      },
      "benchmark": {
        "retention12mRate": 69.4,
        "retention12mSample": 271,
        "admissionRate": 63,
        "admissionPreviousRate": 59.5,
        "admissionYoYDelta": 3.4,
        "eventRate": 11.4,
        "repeatRate": 38.3
      }
    },
    {
      "id": "D",
      "rank": 4,
      "members": 192,
      "monthlyDelta": 1,
      "overall": 27,
      "status": "算出済（参考）",
      "metrics": {
        "retention": 33,
        "admission": 13,
        "event": 43,
        "growth": 13,
        "family": 38
      },
      "benchmark": {
        "retention12mRate": 77.8,
        "retention12mSample": 144,
        "admissionRate": 57.1,
        "admissionPreviousRate": 63.6,
        "admissionYoYDelta": -6.5,
        "eventRate": 10.3,
        "repeatRate": 31.1
      },
      "note": "家庭継続力は評価対象が十分に蓄積するまで暫定です。イベント力は2025年4月のチーム発足後だけを評価しています。"
    }
  ],
  "methodology": [
    {
      "title": "指標ごとに正規化",
      "body": "定着・入会・成長・家庭継続はパーセンタイル、イベント力は対象実績の歴代MAX到達度で表示します。"
    },
    {
      "title": "イベント力は一般会員対象のみ",
      "body": "合同練習会など一般会員が参加できる開催回の平均実参加率70％＋継続参加率30％。参加率の分母は開催日時点の人物単位運用会員です。大会参加者限定の練習は除外します。"
    },
    {
      "title": "発足前・欠損は推測しない",
      "body": "Dチームは2025年4月の発足後だけを評価します。利用できない指標は除外し、参考値・推定値は明記します。"
    }
  ],
  "quality": {
    "completeness": 100,
    "eventCount": 6,
    "eventRecordCount": 8,
    "excludedEventCount": 2,
    "dEvaluationStart": "2025-04-01",
    "competitionCount": 2,
    "competitionRows": 1068,
    "note": "一般会員対象イベント6件を掲載（開催済み練習会の記録8件のうち、大会参加者限定練習2件を除外）。Dは2025年4月発足後のみ評価。会員個人情報・会場名・金額は公開データに含めていません。"
  },
  "memberDefinition": {
    "id": "operational-person-v1",
    "label": "人物単位運用会員"
  }
});
