window.PROSPECT_EVENT_HISTORY = Object.freeze({
  "snapshotId": "savant-2026-09-11-0730-trial-ytd-v1",
  "asOf": "2026-09-11",
  "latestEventId": "event-2026-high",
  "scoringVersion": "v7-operational-member-denominator",
  "memberDefinition": {
    "id": "operational-person-v1",
    "label": "人物単位運用会員"
  },
  "denominatorDefinition": {
    "id": "operational-person-at-event-v1",
    "label": "開催日時点の人物単位運用会員",
    "exceptionEffectiveFrom": "2025-11-24"
  },
  "scoreWeights": {
    "participation": 70,
    "repeat": 30
  },
  "historicalMaxRate": 31.9,
  "repeatMaxRate": 46.9,
  "teams": {
    "A": {
      "averageRate": 21.4,
      "participationScore": 67.2,
      "repeatRate": 45.6,
      "repeatScore": 97.3,
      "score": 76
    },
    "B": {
      "averageRate": 21.8,
      "participationScore": 68.3,
      "repeatRate": 46.9,
      "repeatScore": 100,
      "score": 78
    },
    "C": {
      "averageRate": 12.4,
      "participationScore": 38.8,
      "repeatRate": 38.4,
      "repeatScore": 81.9,
      "score": 52
    },
    "D": {
      "averageRate": 11.9,
      "participationScore": 37.3,
      "repeatRate": 37.9,
      "repeatScore": 80.8,
      "score": 50
    }
  },
  "upcomingEvents": [],
  "events": [
    {
      "id": "event-2026-high",
      "startDate": "2026-08-09",
      "endDate": "2026-08-23",
      "name": "2026高難度特化練習会",
      "shortName": "高難度特化",
      "total": {
        "participants": 224,
        "members": 1054,
        "rate": 21.3
      },
      "teams": {
        "A": {
          "participants": 97,
          "members": 331,
          "rate": 29.3
        },
        "B": {
          "participants": 62,
          "members": 306,
          "rate": 20.3
        },
        "C": {
          "participants": 28,
          "members": 224,
          "rate": 12.5
        },
        "D": {
          "participants": 37,
          "members": 193,
          "rate": 19.2
        }
      },
      "note": "8/9・8/23を1イベントとして合算。参加人数は124人＋100人＝延べ224人。8/23の2コマ参加2人は各2人分として計上。開催時会員数は開始日8/9時点、継続参加率は両日を同一イベントとして人物単位で計算します。"
    },
    {
      "id": "event-2026-summer",
      "startDate": "2026-06-28",
      "endDate": "2026-07-26",
      "name": "2026夏トランポリン練習会",
      "shortName": "夏トランポリン",
      "total": {
        "participants": 133,
        "members": 1036,
        "rate": 12.8
      },
      "teams": {
        "A": {
          "participants": 54,
          "members": 314,
          "rate": 17.2
        },
        "B": {
          "participants": 50,
          "members": 301,
          "rate": 16.6
        },
        "C": {
          "participants": 12,
          "members": 229,
          "rate": 5.2
        },
        "D": {
          "participants": 17,
          "members": 192,
          "rate": 8.9
        }
      }
    },
    {
      "id": "event-2026-joint",
      "startDate": "2026-02-22",
      "endDate": "2026-02-22",
      "name": "2026合同練習会",
      "shortName": "合同練習会",
      "total": {
        "participants": 117,
        "members": 933,
        "rate": 12.5
      },
      "teams": {
        "A": {
          "participants": 43,
          "members": 288,
          "rate": 14.9
        },
        "B": {
          "participants": 50,
          "members": 281,
          "rate": 17.8
        },
        "C": {
          "participants": 10,
          "members": 203,
          "rate": 4.9
        },
        "D": {
          "participants": 14,
          "members": 161,
          "rate": 8.7
        }
      }
    },
    {
      "id": "event-2025-autumn",
      "startDate": "2025-11-24",
      "endDate": "2025-12-14",
      "name": "2025秋の合同練習会",
      "shortName": "秋の合同",
      "total": {
        "participants": 173,
        "members": 959,
        "rate": 18,
        "unassignedParticipants": 1
      },
      "teams": {
        "A": {
          "participants": 54,
          "members": 292,
          "rate": 18.5
        },
        "B": {
          "participants": 62,
          "members": 284,
          "rate": 21.8
        },
        "C": {
          "participants": 34,
          "members": 223,
          "rate": 15.2
        },
        "D": {
          "participants": 22,
          "members": 160,
          "rate": 13.8
        }
      }
    },
    {
      "id": "event-2025-summer",
      "startDate": "2025-08-03",
      "endDate": "2025-08-03",
      "name": "2025夏合同練習会",
      "shortName": "夏合同",
      "total": {
        "participants": 201,
        "members": 886,
        "rate": 22.7
      },
      "teams": {
        "A": {
          "participants": 90,
          "members": 282,
          "rate": 31.9
        },
        "B": {
          "participants": 69,
          "members": 265,
          "rate": 26
        },
        "C": {
          "participants": 30,
          "members": 206,
          "rate": 14.6
        },
        "D": {
          "participants": 12,
          "members": 133,
          "rate": 9
        }
      }
    },
    {
      "id": "event-2024-summer",
      "startDate": "2024-08-03",
      "endDate": "2024-08-25",
      "name": "2024夏合同練習会",
      "shortName": "2024夏合同",
      "total": {
        "participants": 148,
        "members": 675,
        "rate": 21.9
      },
      "teams": {
        "A": {
          "participants": 51,
          "members": 303,
          "rate": 16.8
        },
        "B": {
          "participants": 70,
          "members": 248,
          "rate": 28.2
        },
        "C": {
          "participants": 27,
          "members": 124,
          "rate": 21.8
        },
        "D": {
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false,
          "statusLabel": "未設立・評価対象外",
          "note": "Dチームは2025年4月発足のため対象外"
        }
      }
    }
  ],
  "note": "一般会員が参加できる合同練習会などだけを掲載・評価します。大会参加者限定の大会用・大会特別練習は履歴を保持したまま非集計です。参加率は開催日時点の人物単位運用会員を分母に算出し、休会・退会予定を含め、退会・削除を除外します。Dチームは2025年4月の発足後だけを評価します。イベント力は平均実参加率70％＋累積継続参加率30％を、それぞれ対象実績のMAX＝100点で換算します。開催前の回は予定・暫定として別表示し、点数・参加率・ランキング・開催回数には含めません。"
});
