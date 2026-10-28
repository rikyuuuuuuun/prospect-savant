window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-10-28-0730-trial-ytd-v1",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-10-28",
  "asOfLabel": "2026年10月28日",
  "admissions": {
    "asOf": "2026-10-28",
    "definition": "member-master-admission-date-annual-v1",
    "fiscalYear": "2026",
    "futureAdmissionCount": 0,
    "reEnrollmentPolicy": "including-reenrollment",
    "teams": {
      "A": {
        "cumulative": 132
      },
      "B": {
        "cumulative": 106
      },
      "C": {
        "cumulative": 79
      },
      "D": {
        "cumulative": 72
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1104,
    "monthlyDelta": 25,
    "admissionRate": 74.3,
    "admissionPreviousRate": 70.1,
    "admissionYoYDelta": 4.1,
    "latestEventParticipants": 224
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-10-27",
    "previousAsOfLabel": "2026年10月27日",
    "headline": {
      "members": 1101,
      "monthlyDelta": 22,
      "admissionRate": 74,
      "admissionPreviousRate": 70.1,
      "admissionYoYDelta": 3.9,
      "latestEventParticipants": 224
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 348,
        "overall": 72,
        "metrics": {
          "retention": 68,
          "admission": 88,
          "event": 76,
          "growth": 88,
          "family": 38
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-10-27",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 633,
                "retained": 624,
                "exited": 9,
                "rate": 98.6,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 567,
                "retained": 540,
                "exited": 27,
                "rate": 95.2,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 503,
                "retained": 416,
                "exited": 87,
                "rate": 82.7,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 423,
                "retained": 245,
                "exited": 178,
                "rate": 57.9,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 281,
                "retained": 115,
                "exited": 166,
                "rate": 40.9,
                "relativeScore": 75,
                "scored": true
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 166,
                "retained": 52,
                "exited": 114,
                "rate": 31.3,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 24,
                "retained": 4,
                "exited": 20,
                "rate": 16.7,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y6",
                "label": "6年",
                "months": 72,
                "weight": 8,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              }
            ],
            "weightedIndex": 68.3
          },
          "admission": {
            "trials": 139,
            "admissions": 121,
            "rate": 87.1,
            "previousRate": 82.9,
            "yoyDelta": 4.2,
            "relativeScore": 87.5
          },
          "event": {
            "averageRate": 21.4,
            "participationScore": 67.2,
            "repeatRate": 45.6,
            "repeatScore": 97.3,
            "score": 76,
            "participationWeight": 70,
            "repeatWeight": 30
          },
          "growth": {
            "top10": 69,
            "top10to20": 48,
            "top20to30": 46,
            "relativeScore": 87.5,
            "top30Children": 86,
            "weightedPoints": 349,
            "status": "算出済",
            "competitionCount": 2,
            "competitionRows": 1068
          },
          "family": {
            "definition": "referral-volume-rate-v2",
            "fiscalYear": "2026",
            "asOf": "2026-10-27",
            "trialPoints": 5,
            "siblingPoints": 9,
            "points": 14,
            "calculatedScore": 37.5,
            "members": 348,
            "rate": 4.022988505747127,
            "pointScore": 37.5,
            "rateScore": 37.5,
            "weights": {
              "points": 70,
              "rate": 30
            },
            "status": "算出可能",
            "denominatorBasis": "operational-members-at-asof"
          }
        }
      },
      {
        "id": "B",
        "rank": 2,
        "members": 319,
        "overall": 61,
        "metrics": {
          "retention": 52,
          "admission": 63,
          "event": 78,
          "growth": 63,
          "family": 63
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-10-27",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 510,
                "retained": 503,
                "exited": 7,
                "rate": 98.6,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 461,
                "retained": 435,
                "exited": 26,
                "rate": 94.4,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 407,
                "retained": 323,
                "exited": 84,
                "rate": 79.4,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 323,
                "retained": 188,
                "exited": 135,
                "rate": 58.2,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 177,
                "retained": 59,
                "exited": 118,
                "rate": 33.3,
                "relativeScore": 25,
                "scored": true
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y6",
                "label": "6年",
                "months": 72,
                "weight": 8,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              }
            ],
            "weightedIndex": 51.7
          },
          "admission": {
            "trials": 137,
            "admissions": 104,
            "rate": 75.9,
            "previousRate": 82.1,
            "yoyDelta": -6.2,
            "relativeScore": 62.5
          },
          "event": {
            "averageRate": 21.8,
            "participationScore": 68.3,
            "repeatRate": 46.9,
            "repeatScore": 100,
            "score": 78,
            "participationWeight": 70,
            "repeatWeight": 30
          },
          "growth": {
            "top10": 31,
            "top10to20": 37,
            "top20to30": 39,
            "relativeScore": 62.5,
            "top30Children": 65,
            "weightedPoints": 206,
            "status": "算出済",
            "competitionCount": 2,
            "competitionRows": 1068
          },
          "family": {
            "definition": "referral-volume-rate-v2",
            "fiscalYear": "2026",
            "asOf": "2026-10-27",
            "trialPoints": 6,
            "siblingPoints": 12,
            "points": 18,
            "calculatedScore": 62.5,
            "members": 319,
            "rate": 5.6426332288401255,
            "pointScore": 62.5,
            "rateScore": 62.5,
            "weights": {
              "points": 70,
              "rate": 30
            },
            "status": "算出可能",
            "denominatorBasis": "operational-members-at-asof"
          }
        }
      },
      {
        "id": "C",
        "rank": 4,
        "members": 229,
        "overall": 29,
        "metrics": {
          "retention": 15,
          "admission": 38,
          "event": 52,
          "growth": 38,
          "family": 13
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-10-27",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 380,
                "retained": 369,
                "exited": 11,
                "rate": 97.1,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 335,
                "retained": 302,
                "exited": 33,
                "rate": 90.1,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 298,
                "retained": 213,
                "exited": 85,
                "rate": 71.5,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 170,
                "retained": 80,
                "exited": 90,
                "rate": 47.1,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y6",
                "label": "6年",
                "months": 72,
                "weight": 8,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              }
            ],
            "weightedIndex": 15
          },
          "admission": {
            "trials": 104,
            "admissions": 68,
            "rate": 65.4,
            "previousRate": 66.1,
            "yoyDelta": -0.7,
            "relativeScore": 37.5
          },
          "event": {
            "averageRate": 12.4,
            "participationScore": 38.8,
            "repeatRate": 38.4,
            "repeatScore": 81.9,
            "score": 52,
            "participationWeight": 70,
            "repeatWeight": 30
          },
          "growth": {
            "top10": 12,
            "top10to20": 14,
            "top20to30": 20,
            "relativeScore": 37.5,
            "top30Children": 32,
            "weightedPoints": 84,
            "status": "算出済",
            "competitionCount": 2,
            "competitionRows": 1068
          },
          "family": {
            "definition": "referral-volume-rate-v2",
            "fiscalYear": "2026",
            "asOf": "2026-10-27",
            "trialPoints": 1,
            "siblingPoints": 5,
            "points": 6,
            "calculatedScore": 12.5,
            "members": 229,
            "rate": 2.6200873362445414,
            "pointScore": 12.5,
            "rateScore": 12.5,
            "weights": {
              "points": 70,
              "rate": 30
            },
            "status": "算出可能",
            "denominatorBasis": "operational-members-at-asof"
          }
        }
      },
      {
        "id": "D",
        "rank": 3,
        "members": 205,
        "overall": 42,
        "metrics": {
          "retention": 55,
          "admission": 13,
          "event": 50,
          "growth": 13,
          "family": 88
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-10-27",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 248,
                "retained": 240,
                "exited": 8,
                "rate": 96.8,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 212,
                "retained": 197,
                "exited": 15,
                "rate": 92.9,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 170,
                "retained": 133,
                "exited": 37,
                "rate": 78.2,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 37,
                "retained": 23,
                "exited": 14,
                "rate": 62.2,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y6",
                "label": "6年",
                "months": 72,
                "weight": 8,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              }
            ],
            "weightedIndex": 55
          },
          "admission": {
            "trials": 101,
            "admissions": 63,
            "rate": 62.4,
            "previousRate": 63.2,
            "yoyDelta": -0.8,
            "relativeScore": 12.5
          },
          "event": {
            "averageRate": 11.9,
            "participationScore": 37.3,
            "repeatRate": 37.9,
            "repeatScore": 80.8,
            "score": 50,
            "participationWeight": 70,
            "repeatWeight": 30
          },
          "growth": {
            "top10": 5,
            "top10to20": 10,
            "top20to30": 9,
            "relativeScore": 12.5,
            "top30Children": 19,
            "weightedPoints": 44,
            "status": "算出済",
            "competitionCount": 2,
            "competitionRows": 1068
          },
          "family": {
            "definition": "referral-volume-rate-v2",
            "fiscalYear": "2026",
            "asOf": "2026-10-27",
            "trialPoints": 8,
            "siblingPoints": 11,
            "points": 19,
            "calculatedScore": 87.5,
            "members": 205,
            "rate": 9.268292682926829,
            "pointScore": 87.5,
            "rateScore": 87.5,
            "weights": {
              "points": 70,
              "rate": 30
            },
            "status": "算出可能",
            "denominatorBasis": "operational-members-at-asof"
          }
        }
      }
    ],
    "memberDefinition": {
      "id": "operational-person-v1",
      "label": "人物単位運用会員"
    },
    "admissions": {
      "asOf": "2026-10-27",
      "definition": "member-master-admission-date-annual-v1",
      "fiscalYear": "2026",
      "futureAdmissionCount": 0,
      "reEnrollmentPolicy": "including-reenrollment",
      "teams": {
        "A": {
          "cumulative": 131
        },
        "B": {
          "cumulative": 106
        },
        "C": {
          "cumulative": 79
        },
        "D": {
          "cumulative": 71
        }
      }
    },
    "metricDefinitions": {
      "family": "referral-volume-rate-v2",
      "retention": "historical-retained-forward-confirmed-v2"
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
      "label": "紹介力",
      "value": 15
    }
  ],
  "metricLabels": {
    "retention": "定着力",
    "admission": "年度入会力",
    "event": "イベント力",
    "growth": "成長力",
    "family": "紹介力"
  },
  "teams": [
    {
      "id": "A",
      "rank": 1,
      "members": 351,
      "monthlyDelta": 15,
      "overall": 72,
      "status": "算出済",
      "metrics": {
        "retention": 68,
        "admission": 88,
        "event": 76,
        "growth": 88,
        "family": 38
      },
      "benchmark": {
        "retention12mRate": 82.8,
        "retention12mSample": 505,
        "admissionRate": 87.8,
        "admissionPreviousRate": 82.9,
        "admissionYoYDelta": 4.9,
        "eventRate": 21.4,
        "repeatRate": 45.6,
        "referralPoints": 15,
        "referralRate": 4.273504273504273,
        "referralMembers": 351
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-28",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 634,
              "retained": 625,
              "exited": 9,
              "rate": 98.6,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 569,
              "retained": 542,
              "exited": 27,
              "rate": 95.3,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 505,
              "retained": 418,
              "exited": 87,
              "rate": 82.8,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 423,
              "retained": 245,
              "exited": 178,
              "rate": 57.9,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 281,
              "retained": 115,
              "exited": 166,
              "rate": 40.9,
              "relativeScore": 75,
              "scored": true
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 167,
              "retained": 52,
              "exited": 115,
              "rate": 31.1,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 24,
              "retained": 4,
              "exited": 20,
              "rate": 16.7,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y6",
              "label": "6年",
              "months": 72,
              "weight": 8,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            }
          ],
          "weightedIndex": 68.3
        },
        "admission": {
          "trials": 139,
          "admissions": 122,
          "rate": 87.8,
          "previousRate": 82.9,
          "yoyDelta": 4.9,
          "relativeScore": 87.5
        },
        "event": {
          "averageRate": 21.4,
          "participationScore": 67.2,
          "repeatRate": 45.6,
          "repeatScore": 97.3,
          "score": 76,
          "participationWeight": 70,
          "repeatWeight": 30
        },
        "growth": {
          "top10": 69,
          "top10to20": 48,
          "top20to30": 46,
          "relativeScore": 87.5,
          "top30Children": 86,
          "weightedPoints": 349,
          "status": "算出済",
          "competitionCount": 2,
          "competitionRows": 1068
        },
        "family": {
          "definition": "referral-volume-rate-v2",
          "fiscalYear": "2026",
          "asOf": "2026-10-28",
          "trialPoints": 5,
          "siblingPoints": 10,
          "points": 15,
          "calculatedScore": 37.5,
          "members": 351,
          "rate": 4.273504273504273,
          "pointScore": 37.5,
          "rateScore": 37.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 625/634人継続・非継続9人（98.6%・相対点62.5）、6か月 542/569人継続・非継続27人（95.3%・相対点87.5）、12か月 418/505人継続・非継続87人（82.8%・相対点87.5）、2年 245/423人継続・非継続178人（57.9%・相対点37.5）、3年 115/281人継続・非継続166人（40.9%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果68点です。 【年度入会力】139人体験のうち122人入会、年度の体験→入会率87.8%（前年同期間82.9%）。A〜Dの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.4%と継続参加率45.6%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。A〜Dの相対評価で88点です。 【紹介力】2026年度の紹介15ポイント（紹介体験5人・兄弟姉妹入会10人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は15pt÷基準日の会員351人＝4.27％。人数相対点37.5×70％＋紹介率相対点37.5×30％で38点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月27日の14→15ポイント。"
    },
    {
      "id": "B",
      "rank": 2,
      "members": 319,
      "monthlyDelta": 0,
      "overall": 61,
      "status": "算出済",
      "metrics": {
        "retention": 52,
        "admission": 63,
        "event": 78,
        "growth": 63,
        "family": 63
      },
      "benchmark": {
        "retention12mRate": 79.4,
        "retention12mSample": 407,
        "admissionRate": 75.9,
        "admissionPreviousRate": 82.1,
        "admissionYoYDelta": -6.2,
        "eventRate": 21.8,
        "repeatRate": 46.9,
        "referralPoints": 18,
        "referralRate": 5.6426332288401255,
        "referralMembers": 319
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-28",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 510,
              "retained": 503,
              "exited": 7,
              "rate": 98.6,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 463,
              "retained": 437,
              "exited": 26,
              "rate": 94.4,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 407,
              "retained": 323,
              "exited": 84,
              "rate": 79.4,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 323,
              "retained": 188,
              "exited": 135,
              "rate": 58.2,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 181,
              "retained": 61,
              "exited": 120,
              "rate": 33.7,
              "relativeScore": 25,
              "scored": true
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y6",
              "label": "6年",
              "months": 72,
              "weight": 8,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            }
          ],
          "weightedIndex": 51.7
        },
        "admission": {
          "trials": 137,
          "admissions": 104,
          "rate": 75.9,
          "previousRate": 82.1,
          "yoyDelta": -6.2,
          "relativeScore": 62.5
        },
        "event": {
          "averageRate": 21.8,
          "participationScore": 68.3,
          "repeatRate": 46.9,
          "repeatScore": 100,
          "score": 78,
          "participationWeight": 70,
          "repeatWeight": 30
        },
        "growth": {
          "top10": 31,
          "top10to20": 37,
          "top20to30": 39,
          "relativeScore": 62.5,
          "top30Children": 65,
          "weightedPoints": 206,
          "status": "算出済",
          "competitionCount": 2,
          "competitionRows": 1068
        },
        "family": {
          "definition": "referral-volume-rate-v2",
          "fiscalYear": "2026",
          "asOf": "2026-10-28",
          "trialPoints": 6,
          "siblingPoints": 12,
          "points": 18,
          "calculatedScore": 62.5,
          "members": 319,
          "rate": 5.6426332288401255,
          "pointScore": 62.5,
          "rateScore": 62.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 503/510人継続・非継続7人（98.6%・相対点87.5）、6か月 437/463人継続・非継続26人（94.4%・相対点62.5）、12か月 323/407人継続・非継続84人（79.4%・相対点62.5）、2年 188/323人継続・非継続135人（58.2%・相対点62.5）、3年 61/181人継続・非継続120人（33.7%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果52点です。 【年度入会力】137人体験のうち104人入会、年度の体験→入会率75.9%（前年同期間82.1%）。A〜Dの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.8%と継続参加率46.9%を、参加70%・継続30%で統合して78点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。A〜Dの相対評価で63点です。 【紹介力】2026年度の紹介18ポイント（紹介体験6人・兄弟姉妹入会12人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は18pt÷基準日の会員319人＝5.64％。人数相対点62.5×70％＋紹介率相対点62.5×30％で63点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月27日の18→18ポイント。"
    },
    {
      "id": "C",
      "rank": 4,
      "members": 228,
      "monthlyDelta": 4,
      "overall": 29,
      "status": "算出済",
      "metrics": {
        "retention": 15,
        "admission": 38,
        "event": 52,
        "growth": 38,
        "family": 13
      },
      "benchmark": {
        "retention12mRate": 71.7,
        "retention12mSample": 297,
        "admissionRate": 65.4,
        "admissionPreviousRate": 66.1,
        "admissionYoYDelta": -0.7,
        "eventRate": 12.4,
        "repeatRate": 38.4,
        "referralPoints": 6,
        "referralRate": 2.631578947368421,
        "referralMembers": 228
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-28",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 379,
              "retained": 368,
              "exited": 11,
              "rate": 97.1,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 334,
              "retained": 301,
              "exited": 33,
              "rate": 90.1,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 297,
              "retained": 213,
              "exited": 84,
              "rate": 71.7,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 169,
              "retained": 80,
              "exited": 89,
              "rate": 47.3,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y6",
              "label": "6年",
              "months": 72,
              "weight": 8,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            }
          ],
          "weightedIndex": 15
        },
        "admission": {
          "trials": 104,
          "admissions": 68,
          "rate": 65.4,
          "previousRate": 66.1,
          "yoyDelta": -0.7,
          "relativeScore": 37.5
        },
        "event": {
          "averageRate": 12.4,
          "participationScore": 38.8,
          "repeatRate": 38.4,
          "repeatScore": 81.9,
          "score": 52,
          "participationWeight": 70,
          "repeatWeight": 30
        },
        "growth": {
          "top10": 12,
          "top10to20": 14,
          "top20to30": 20,
          "relativeScore": 37.5,
          "top30Children": 32,
          "weightedPoints": 84,
          "status": "算出済",
          "competitionCount": 2,
          "competitionRows": 1068
        },
        "family": {
          "definition": "referral-volume-rate-v2",
          "fiscalYear": "2026",
          "asOf": "2026-10-28",
          "trialPoints": 1,
          "siblingPoints": 5,
          "points": 6,
          "calculatedScore": 12.5,
          "members": 228,
          "rate": 2.631578947368421,
          "pointScore": 12.5,
          "rateScore": 12.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 368/379人継続・非継続11人（97.1%・相対点37.5）、6か月 301/334人継続・非継続33人（90.1%・相対点12.5）、12か月 213/297人継続・非継続84人（71.7%・相対点12.5）、2年 80/169人継続・非継続89人（47.3%・相対点12.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果15点です。 【年度入会力】104人体験のうち68人入会、年度の体験→入会率65.4%（前年同期間66.1%）。A〜Dの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率12.4%と継続参加率38.4%を、参加70%・継続30%で統合して52点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。A〜Dの相対評価で38点です。 【紹介力】2026年度の紹介6ポイント（紹介体験1人・兄弟姉妹入会5人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は6pt÷基準日の会員228人＝2.63％。人数相対点12.5×70％＋紹介率相対点12.5×30％で13点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月27日の6→6ポイント。"
    },
    {
      "id": "D",
      "rank": 3,
      "members": 206,
      "monthlyDelta": 6,
      "overall": 42,
      "status": "算出済",
      "metrics": {
        "retention": 55,
        "admission": 13,
        "event": 50,
        "growth": 13,
        "family": 88
      },
      "benchmark": {
        "retention12mRate": 78.4,
        "retention12mSample": 171,
        "admissionRate": 62.7,
        "admissionPreviousRate": 63.3,
        "admissionYoYDelta": -0.6,
        "eventRate": 11.9,
        "repeatRate": 37.9,
        "referralPoints": 19,
        "referralRate": 9.223300970873787,
        "referralMembers": 206
      },
      "note": "評価根拠｜【定着力】3か月 241/249人継続・非継続8人（96.8%・相対点12.5）、6か月 198/213人継続・非継続15人（93.0%・相対点37.5）、12か月 134/171人継続・非継続37人（78.4%・相対点37.5）、2年 24/38人継続・非継続14人（63.2%・相対点87.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果55点です。 【年度入会力】102人体験のうち64人入会、年度の体験→入会率62.7%（前年同期間63.3%）。A〜Dの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.9%と継続参加率37.9%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。A〜Dの相対評価で13点です。 【紹介力】2026年度の紹介19ポイント（紹介体験8人・兄弟姉妹入会11人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は19pt÷基準日の会員206人＝9.22％。人数相対点87.5×70％＋紹介率相対点87.5×30％で88点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月27日の19→19ポイント。\n運用注記｜イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-28",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 249,
              "retained": 241,
              "exited": 8,
              "rate": 96.8,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 213,
              "retained": 198,
              "exited": 15,
              "rate": 93,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 171,
              "retained": 134,
              "exited": 37,
              "rate": 78.4,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 38,
              "retained": 24,
              "exited": 14,
              "rate": 63.2,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y6",
              "label": "6年",
              "months": 72,
              "weight": 8,
              "sample": 0,
              "retained": null,
              "exited": null,
              "rate": null,
              "relativeScore": null,
              "scored": false
            }
          ],
          "weightedIndex": 55
        },
        "admission": {
          "trials": 102,
          "admissions": 64,
          "rate": 62.7,
          "previousRate": 63.3,
          "yoyDelta": -0.6,
          "relativeScore": 12.5
        },
        "event": {
          "averageRate": 11.9,
          "participationScore": 37.3,
          "repeatRate": 37.9,
          "repeatScore": 80.8,
          "score": 50,
          "participationWeight": 70,
          "repeatWeight": 30
        },
        "growth": {
          "top10": 5,
          "top10to20": 10,
          "top20to30": 9,
          "relativeScore": 12.5,
          "top30Children": 19,
          "weightedPoints": 44,
          "status": "算出済",
          "competitionCount": 2,
          "competitionRows": 1068
        },
        "family": {
          "definition": "referral-volume-rate-v2",
          "fiscalYear": "2026",
          "asOf": "2026-10-28",
          "trialPoints": 8,
          "siblingPoints": 11,
          "points": 19,
          "calculatedScore": 87.5,
          "members": 206,
          "rate": 9.223300970873787,
          "pointScore": 87.5,
          "rateScore": 87.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      }
    }
  ],
  "methodology": [
    {
      "title": "指標ごとに正規化",
      "body": "定着・入会・成長はパーセンタイル、イベント力は対象実績の歴代MAX到達度。紹介力は紹介人数の相対点70％＋会員数に対する紹介率の相対点30％で表示します。"
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
  },
  "memberMonthlyComparison": {
    "definition": "previous-month-end-v1",
    "previousAsOf": "2026-09-30",
    "previousAsOfLabel": "2026年9月30日",
    "headline": {
      "members": 1079
    },
    "teams": [
      {
        "id": "A",
        "members": 336
      },
      {
        "id": "B",
        "members": 319
      },
      {
        "id": "C",
        "members": 224
      },
      {
        "id": "D",
        "members": 200
      }
    ],
    "memberDefinition": {
      "id": "operational-person-v1",
      "label": "人物単位運用会員"
    },
    "estimate": {
      "method": "unconfirmed-month-end-daily-snapshot",
      "sourceAsOf": "2026-09-30"
    }
  },
  "memberDeltaDefinition": "previous-month-end-v1",
  "metricDefinitions": {
    "family": "referral-volume-rate-v2",
    "retention": "historical-retained-forward-confirmed-v2"
  },
  "admissionHistory": {
    "definition": "member-master-admission-date-monthly-v1",
    "asOf": "2026-10-28",
    "fiscalYear": "2026",
    "months": [
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
      "2026-12",
      "2027-01",
      "2027-02",
      "2027-03"
    ],
    "teams": {
      "A": [
        30,
        31,
        13,
        21,
        7,
        17,
        13,
        null,
        null,
        null,
        null,
        null
      ],
      "B": [
        44,
        22,
        6,
        11,
        2,
        13,
        8,
        null,
        null,
        null,
        null,
        null
      ],
      "C": [
        22,
        25,
        13,
        6,
        2,
        3,
        8,
        null,
        null,
        null,
        null,
        null
      ],
      "D": [
        21,
        18,
        8,
        6,
        1,
        10,
        8,
        null,
        null,
        null,
        null,
        null
      ]
    },
    "total": [
      117,
      96,
      40,
      44,
      12,
      43,
      37,
      null,
      null,
      null,
      null,
      null
    ]
  },
  "withdrawalHistory": {
    "definition": "member-retirement-explicit-stop-detected-v1",
    "asOf": "2026-10-28",
    "fiscalYear": "2026",
    "months": [
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
      "2026-12",
      "2027-01",
      "2027-02",
      "2027-03"
    ],
    "teams": {
      "A": {
        "unknownMonth": 304,
        "months": [
          {
            "month": "2026-04",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-05",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-06",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-07",
            "explicit": 3,
            "stopped": 0,
            "detected": 0,
            "count": 3,
            "cohortCount": 3,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-08",
            "explicit": 4,
            "stopped": 0,
            "detected": 0,
            "count": 4,
            "cohortCount": 4,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-09",
            "explicit": 7,
            "stopped": 0,
            "detected": 0,
            "count": 7,
            "cohortCount": 7,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-10",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          null,
          null,
          null,
          null,
          null
        ]
      },
      "B": {
        "unknownMonth": 203,
        "months": [
          {
            "month": "2026-04",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-05",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-06",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-07",
            "explicit": 2,
            "stopped": 0,
            "detected": 0,
            "count": 2,
            "cohortCount": 2,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-08",
            "explicit": 4,
            "stopped": 0,
            "detected": 0,
            "count": 4,
            "cohortCount": 4,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-09",
            "explicit": 9,
            "stopped": 0,
            "detected": 0,
            "count": 9,
            "cohortCount": 9,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-10",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          null,
          null,
          null,
          null,
          null
        ]
      },
      "C": {
        "unknownMonth": 146,
        "months": [
          {
            "month": "2026-04",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-05",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-06",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-07",
            "explicit": 2,
            "stopped": 0,
            "detected": 0,
            "count": 2,
            "cohortCount": 2,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-08",
            "explicit": 1,
            "stopped": 0,
            "detected": 1,
            "count": 2,
            "cohortCount": 2,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-09",
            "explicit": 5,
            "stopped": 0,
            "detected": 0,
            "count": 5,
            "cohortCount": 5,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-10",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          null,
          null,
          null,
          null,
          null
        ]
      },
      "D": {
        "unknownMonth": 50,
        "months": [
          {
            "month": "2026-04",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-05",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-06",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-07",
            "explicit": 3,
            "stopped": 0,
            "detected": 0,
            "count": 3,
            "cohortCount": 3,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-08",
            "explicit": 4,
            "stopped": 0,
            "detected": 1,
            "count": 5,
            "cohortCount": 5,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-09",
            "explicit": 2,
            "stopped": 0,
            "detected": 0,
            "count": 2,
            "cohortCount": 2,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-10",
            "explicit": 0,
            "stopped": 0,
            "detected": 0,
            "count": 0,
            "cohortCount": 0,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          null,
          null,
          null,
          null,
          null
        ]
      }
    },
    "unassigned": 1
  },
  "admissionConversion": {
    "definition": "trial-attendance-fiscal-ytd-v1",
    "asOf": "2026-10-28",
    "fiscalYear": "2026",
    "teams": {
      "A": {
        "trials": 139,
        "admissions": 122,
        "previousTrials": 70,
        "previousAdmissions": 58
      },
      "B": {
        "trials": 137,
        "admissions": 104,
        "previousTrials": 84,
        "previousAdmissions": 69
      },
      "C": {
        "trials": 104,
        "admissions": 68,
        "previousTrials": 115,
        "previousAdmissions": 76
      },
      "D": {
        "trials": 102,
        "admissions": 64,
        "previousTrials": 210,
        "previousAdmissions": 133
      }
    }
  },
  "retentionAvailability": {
    "definition": "historical-retained-forward-confirmed-v2",
    "asOf": "2026-10-28",
    "teams": {
      "A": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 320,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 0,
        "scoreAvailable": true
      },
      "B": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 220,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 0,
        "scoreAvailable": true
      },
      "C": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 153,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 1,
        "scoreAvailable": true
      },
      "D": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 60,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 0,
        "scoreAvailable": true
      }
    }
  },
  "memberComposition": {
    "definition": "operational-member-composition-v1",
    "memberDefinition": "operational-person-v1",
    "asOf": "2026-10-28",
    "status": "ok",
    "overall": {
      "members": 1104,
      "grade": {
        "preschool": 0,
        "k1": 6,
        "k2": 50,
        "k3": 52,
        "p1": 140,
        "p2": 183,
        "p3": 168,
        "p4": 175,
        "p5": 171,
        "p6": 99,
        "j1": 37,
        "j2": 15,
        "j3": 6,
        "h1": 1,
        "h2": 0,
        "h3": 0,
        "adult": 0,
        "unknown": 1
      },
      "gender": {
        "male": 471,
        "female": 631,
        "other": 0,
        "unknown": 2
      },
      "tenure": {
        "lt3": 90,
        "m3to6": 174,
        "m6to12": 187,
        "y1to2": 285,
        "y2to3": 232,
        "y3to5": 131,
        "y5plus": 4,
        "unknown": 1
      },
      "age": {
        "lt5": 26,
        "a5to6": 138,
        "a7to9": 509,
        "a10to12": 384,
        "a13to15": 45,
        "a16plus": 1,
        "unknown": 1
      },
      "status": {
        "active": 1053,
        "paused": 25,
        "scheduled": 25,
        "unknown": 1
      },
      "entryYear": {
        "2021": 13,
        "2022": 31,
        "2023": 119,
        "2024": 257,
        "2025": 323,
        "2026": 360,
        "unknown": 1
      },
      "summary": {
        "knownTenure": 1103,
        "tenureMonthsTotal": 19451,
        "meanTenureMonths": 17.6,
        "medianTenureMonths": 16
      }
    },
    "teams": {
      "A": {
        "members": 351,
        "grade": {
          "preschool": 0,
          "k1": 4,
          "k2": 16,
          "k3": 10,
          "p1": 52,
          "p2": 49,
          "p3": 59,
          "p4": 47,
          "p5": 60,
          "p6": 27,
          "j1": 14,
          "j2": 8,
          "j3": 4,
          "h1": 1,
          "h2": 0,
          "h3": 0,
          "adult": 0,
          "unknown": 0
        },
        "gender": {
          "male": 162,
          "female": 189,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 36,
          "m3to6": 62,
          "m6to12": 60,
          "y1to2": 58,
          "y2to3": 60,
          "y3to5": 71,
          "y5plus": 4,
          "unknown": 0
        },
        "age": {
          "lt5": 13,
          "a5to6": 35,
          "a7to9": 160,
          "a10to12": 121,
          "a13to15": 21,
          "a16plus": 1,
          "unknown": 0
        },
        "status": {
          "active": 343,
          "paused": 2,
          "scheduled": 6,
          "unknown": 0
        },
        "entryYear": {
          "2021": 13,
          "2022": 31,
          "2023": 44,
          "2024": 64,
          "2025": 73,
          "2026": 126
        },
        "summary": {
          "knownTenure": 351,
          "tenureMonthsTotal": 7067,
          "meanTenureMonths": 20.1,
          "medianTenureMonths": 16
        }
      },
      "B": {
        "members": 319,
        "grade": {
          "preschool": 0,
          "k1": 0,
          "k2": 13,
          "k3": 25,
          "p1": 33,
          "p2": 40,
          "p3": 48,
          "p4": 53,
          "p5": 56,
          "p6": 38,
          "j1": 7,
          "j2": 3,
          "j3": 2,
          "h1": 0,
          "h2": 0,
          "h3": 0,
          "adult": 0,
          "unknown": 1
        },
        "gender": {
          "male": 137,
          "female": 181,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 26,
          "m3to6": 40,
          "m6to12": 56,
          "y1to2": 59,
          "y2to3": 77,
          "y3to5": 60,
          "y5plus": 0,
          "unknown": 1
        },
        "age": {
          "lt5": 7,
          "a5to6": 48,
          "a7to9": 131,
          "a10to12": 122,
          "a13to15": 10,
          "a16plus": 0,
          "unknown": 1
        },
        "status": {
          "active": 312,
          "paused": 0,
          "scheduled": 6,
          "unknown": 1
        },
        "entryYear": {
          "2023": 75,
          "2024": 73,
          "2025": 69,
          "2026": 101,
          "unknown": 1
        },
        "summary": {
          "knownTenure": 318,
          "tenureMonthsTotal": 6137,
          "meanTenureMonths": 19.3,
          "medianTenureMonths": 17
        }
      },
      "C": {
        "members": 228,
        "grade": {
          "preschool": 0,
          "k1": 0,
          "k2": 4,
          "k3": 9,
          "p1": 34,
          "p2": 46,
          "p3": 30,
          "p4": 40,
          "p5": 28,
          "p6": 21,
          "j1": 13,
          "j2": 3,
          "j3": 0,
          "h1": 0,
          "h2": 0,
          "h3": 0,
          "adult": 0,
          "unknown": 0
        },
        "gender": {
          "male": 103,
          "female": 125,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 10,
          "m3to6": 39,
          "m6to12": 34,
          "y1to2": 73,
          "y2to3": 72,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 2,
          "a5to6": 22,
          "a7to9": 112,
          "a10to12": 82,
          "a13to15": 10,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 202,
          "paused": 18,
          "scheduled": 8,
          "unknown": 0
        },
        "entryYear": {
          "2024": 92,
          "2025": 68,
          "2026": 68
        },
        "summary": {
          "knownTenure": 228,
          "tenureMonthsTotal": 3664,
          "meanTenureMonths": 16.1,
          "medianTenureMonths": 16
        }
      },
      "D": {
        "members": 206,
        "grade": {
          "preschool": 0,
          "k1": 2,
          "k2": 17,
          "k3": 8,
          "p1": 21,
          "p2": 48,
          "p3": 31,
          "p4": 35,
          "p5": 27,
          "p6": 13,
          "j1": 3,
          "j2": 1,
          "j3": 0,
          "h1": 0,
          "h2": 0,
          "h3": 0,
          "adult": 0,
          "unknown": 0
        },
        "gender": {
          "male": 69,
          "female": 136,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 18,
          "m3to6": 33,
          "m6to12": 37,
          "y1to2": 95,
          "y2to3": 23,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 4,
          "a5to6": 33,
          "a7to9": 106,
          "a10to12": 59,
          "a13to15": 4,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 196,
          "paused": 5,
          "scheduled": 5,
          "unknown": 0
        },
        "entryYear": {
          "2024": 28,
          "2025": 113,
          "2026": 65
        },
        "summary": {
          "knownTenure": 206,
          "tenureMonthsTotal": 2583,
          "meanTenureMonths": 12.5,
          "medianTenureMonths": 13
        }
      }
    }
  },
  "admissionConversionHistory": {
    "status": "ok",
    "definition": "trial-attendance-fiscal-monthly-v1",
    "asOf": "2026-10-28",
    "fiscalYear": "2026",
    "months": [
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
      "2026-12",
      "2027-01",
      "2027-02",
      "2027-03"
    ],
    "teams": {
      "A": {
        "trials": [
          35,
          33,
          17,
          18,
          6,
          19,
          11,
          null,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          33,
          26,
          13,
          18,
          5,
          17,
          10,
          null,
          null,
          null,
          null,
          null
        ]
      },
      "B": {
        "trials": [
          61,
          21,
          15,
          10,
          0,
          17,
          13,
          null,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          49,
          18,
          8,
          10,
          0,
          14,
          5,
          null,
          null,
          null,
          null,
          null
        ]
      },
      "C": {
        "trials": [
          28,
          38,
          15,
          9,
          1,
          4,
          9,
          null,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          22,
          23,
          8,
          5,
          0,
          3,
          7,
          null,
          null,
          null,
          null,
          null
        ]
      },
      "D": {
        "trials": [
          42,
          21,
          7,
          6,
          2,
          11,
          13,
          null,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          23,
          15,
          5,
          3,
          2,
          11,
          5,
          null,
          null,
          null,
          null,
          null
        ]
      }
    },
    "total": {
      "trials": [
        166,
        113,
        54,
        43,
        9,
        51,
        46,
        null,
        null,
        null,
        null,
        null
      ],
      "admissions": [
        127,
        82,
        34,
        36,
        7,
        45,
        27,
        null,
        null,
        null,
        null,
        null
      ]
    }
  }
});
