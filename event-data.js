window.PROSPECT_EVENT_HISTORY = Object.freeze({
  "snapshotId": "savant-2026-09-01-0730",
  "asOf": "2026-09-01",
  "latestEventId": "EV-2026-HIGH",
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
  "repeatMaxRate": 45.5,
  "teams": {
    "A": {
      "averageRate": 18.8,
      "participationScore": 58.8,
      "repeatRate": 37.5,
      "repeatScore": 82.4,
      "score": 66
    },
    "B": {
      "averageRate": 20.8,
      "participationScore": 65,
      "repeatRate": 45.5,
      "repeatScore": 100,
      "score": 76
    },
    "C": {
      "averageRate": 11.4,
      "participationScore": 35.7,
      "repeatRate": 38.3,
      "repeatScore": 84.1,
      "score": 50
    },
    "D": {
      "averageRate": 10.3,
      "participationScore": 32.4,
      "repeatRate": 31.1,
      "repeatScore": 68.5,
      "score": 43
    }
  },
  "upcomingEvents": [
    {
      "id": "UPCOMING-2026-HIGH-0823",
      "startDate": "2026-08-23",
      "endDate": "2026-08-23",
      "name": "2026高難度特化練習会｜8/23開催予定",
      "shortName": "高難度｜8/23",
      "status": "provisional",
      "statusLabel": "開催予定・暫定",
      "aggregate": false,
      "note": "開催前のため現時点では暫定扱いです。開催後に実参加を確定してから、参加率・ランキング・開催回数へ反映します。"
    }
  ],
  "events": [
    {
      "id": "EV-2026-HIGH",
      "startDate": "2026-08-09",
      "endDate": "2026-08-09",
      "name": "2026高難度特化練習会｜8/9開催済",
      "shortName": "高難度｜8/9",
      "total": {
        "participants": 124,
        "members": 1054,
        "rate": 11.8
      },
      "teams": {
        "A": {
          "participants": 44,
          "members": 331,
          "rate": 13.3
        },
        "B": {
          "participants": 43,
          "members": 306,
          "rate": 14.1
        },
        "C": {
          "participants": 15,
          "members": 224,
          "rate": 6.7
        },
        "D": {
          "participants": 22,
          "members": 193,
          "rate": 11.4
        }
      }
    },
    {
      "id": "EV-2026-SUMMER",
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
      "id": "EV-2026-JOINT",
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
      "id": "EV-2025-AUTUMN",
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
      "id": "EV-2025-SUMMER",
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
      "id": "EV-2024-SUMMER",
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
