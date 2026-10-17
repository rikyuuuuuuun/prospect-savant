window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-10-18-0730-trial-ytd-v1",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-10-18",
  "asOfLabel": "2026年10月18日",
  "admissions": {
    "asOf": "2026-10-18",
    "definition": "member-master-admission-date-annual-v1",
    "fiscalYear": "2026",
    "futureAdmissionCount": 0,
    "reEnrollmentPolicy": "including-reenrollment",
    "teams": {
      "A": {
        "cumulative": 125
      },
      "B": {
        "cumulative": 106
      },
      "C": {
        "cumulative": 77
      },
      "D": {
        "cumulative": 68
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1092,
    "monthlyDelta": 13,
    "admissionRate": 73.1,
    "admissionPreviousRate": 70.2,
    "admissionYoYDelta": 2.9,
    "latestEventParticipants": 224
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-10-17",
    "previousAsOfLabel": "2026年10月17日",
    "headline": {
      "members": 1092,
      "monthlyDelta": 13,
      "admissionRate": 73.6,
      "admissionPreviousRate": 70.2,
      "admissionYoYDelta": 3.3,
      "latestEventParticipants": 224
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 345,
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
          "asOf": "2026-10-17",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 628,
                "retained": 619,
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
                "sample": 554,
                "retained": 527,
                "exited": 27,
                "rate": 95.1,
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
                "sample": 422,
                "retained": 245,
                "exited": 177,
                "rate": 58.1,
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
                "sample": 164,
                "retained": 52,
                "exited": 112,
                "rate": 31.7,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 12,
                "retained": null,
                "exited": null,
                "rate": 33.3,
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
            "trials": 135,
            "admissions": 116,
            "rate": 85.9,
            "previousRate": 84.6,
            "yoyDelta": 1.3,
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
            "asOf": "2026-10-17",
            "trialPoints": 3,
            "siblingPoints": 9,
            "points": 12,
            "calculatedScore": 37.5,
            "members": 345,
            "rate": 3.4782608695652173,
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
          "asOf": "2026-10-17",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 508,
                "retained": 501,
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
                "sample": 441,
                "retained": 415,
                "exited": 26,
                "rate": 94.1,
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
                "sample": 320,
                "retained": 187,
                "exited": 133,
                "rate": 58.4,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 168,
                "retained": 56,
                "exited": 112,
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
            "trials": 133,
            "admissions": 104,
            "rate": 78.2,
            "previousRate": 83.1,
            "yoyDelta": -4.9,
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
            "asOf": "2026-10-17",
            "trialPoints": 3,
            "siblingPoints": 12,
            "points": 15,
            "calculatedScore": 62.5,
            "members": 319,
            "rate": 4.702194357366771,
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
        "members": 227,
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
          "asOf": "2026-10-17",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 376,
                "retained": 365,
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
                "sample": 319,
                "retained": 288,
                "exited": 31,
                "rate": 90.3,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 295,
                "retained": 210,
                "exited": 85,
                "rate": 71.2,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 166,
                "retained": 79,
                "exited": 87,
                "rate": 47.6,
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
            "trials": 103,
            "admissions": 65,
            "rate": 63.1,
            "previousRate": 65.2,
            "yoyDelta": -2.1,
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
            "asOf": "2026-10-17",
            "trialPoints": 0,
            "siblingPoints": 5,
            "points": 5,
            "calculatedScore": 12.5,
            "members": 227,
            "rate": 2.2026431718061676,
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
        "members": 201,
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
          "asOf": "2026-10-17",
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
                "sample": 201,
                "retained": 188,
                "exited": 13,
                "rate": 93.5,
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
                "sample": 35,
                "retained": 21,
                "exited": 14,
                "rate": 60,
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
            "trials": 98,
            "admissions": 60,
            "rate": 61.2,
            "previousRate": 63.3,
            "yoyDelta": -2.1,
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
            "asOf": "2026-10-17",
            "trialPoints": 8,
            "siblingPoints": 11,
            "points": 19,
            "calculatedScore": 87.5,
            "members": 201,
            "rate": 9.45273631840796,
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
      "asOf": "2026-10-17",
      "definition": "member-master-admission-date-annual-v1",
      "fiscalYear": "2026",
      "futureAdmissionCount": 0,
      "reEnrollmentPolicy": "including-reenrollment",
      "teams": {
        "A": {
          "cumulative": 125
        },
        "B": {
          "cumulative": 106
        },
        "C": {
          "cumulative": 77
        },
        "D": {
          "cumulative": 68
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
      "members": 345,
      "monthlyDelta": 9,
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
        "retention12mRate": 82.7,
        "retention12mSample": 503,
        "admissionRate": 85.9,
        "admissionPreviousRate": 84.6,
        "admissionYoYDelta": 1.3,
        "eventRate": 21.4,
        "repeatRate": 45.6,
        "referralPoints": 12,
        "referralRate": 3.4782608695652173,
        "referralMembers": 345
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-18",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 630,
              "retained": 621,
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
              "sample": 556,
              "retained": 529,
              "exited": 27,
              "rate": 95.1,
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
              "sample": 422,
              "retained": 245,
              "exited": 177,
              "rate": 58.1,
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
              "sample": 164,
              "retained": 52,
              "exited": 112,
              "rate": 31.7,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 13,
              "retained": null,
              "exited": null,
              "rate": 30.8,
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
          "trials": 135,
          "admissions": 116,
          "rate": 85.9,
          "previousRate": 84.6,
          "yoyDelta": 1.3,
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
          "asOf": "2026-10-18",
          "trialPoints": 3,
          "siblingPoints": 9,
          "points": 12,
          "calculatedScore": 37.5,
          "members": 345,
          "rate": 3.4782608695652173,
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
      "note": "評価根拠｜【定着力】3か月 621/630人継続・非継続9人（98.6%・相対点62.5）、6か月 529/556人継続・非継続27人（95.1%・相対点87.5）、12か月 416/503人継続・非継続87人（82.7%・相対点87.5）、2年 245/422人継続・非継続177人（58.1%・相対点37.5）、3年 115/281人継続・非継続166人（40.9%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果68点です。 【年度入会力】135人体験のうち116人入会、年度の体験→入会率85.9%（前年同期間84.6%）。A〜Dの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.4%と継続参加率45.6%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。A〜Dの相対評価で88点です。 【紹介力】2026年度の紹介12ポイント（紹介体験3人・兄弟姉妹入会9人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は12pt÷基準日の会員345人＝3.48％。人数相対点37.5×70％＋紹介率相対点37.5×30％で38点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月17日の12→12ポイント。"
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
        "admissionRate": 76.5,
        "admissionPreviousRate": 83.1,
        "admissionYoYDelta": -6.7,
        "eventRate": 21.8,
        "repeatRate": 46.9,
        "referralPoints": 18,
        "referralRate": 5.6426332288401255,
        "referralMembers": 319
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-18",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 509,
              "retained": 502,
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
              "sample": 444,
              "retained": 418,
              "exited": 26,
              "rate": 94.1,
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
              "sample": 320,
              "retained": 187,
              "exited": 133,
              "rate": 58.4,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 169,
              "retained": 56,
              "exited": 113,
              "rate": 33.1,
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
          "trials": 136,
          "admissions": 104,
          "rate": 76.5,
          "previousRate": 83.1,
          "yoyDelta": -6.7,
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
          "asOf": "2026-10-18",
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
      "note": "評価根拠｜【定着力】3か月 502/509人継続・非継続7人（98.6%・相対点87.5）、6か月 418/444人継続・非継続26人（94.1%・相対点62.5）、12か月 323/407人継続・非継続84人（79.4%・相対点62.5）、2年 187/320人継続・非継続133人（58.4%・相対点62.5）、3年 56/169人継続・非継続113人（33.1%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果52点です。 【年度入会力】136人体験のうち104人入会、年度の体験→入会率76.5%（前年同期間83.1%）。A〜Dの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.8%と継続参加率46.9%を、参加70%・継続30%で統合して78点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。A〜Dの相対評価で63点です。 【紹介力】2026年度の紹介18ポイント（紹介体験6人・兄弟姉妹入会12人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は18pt÷基準日の会員319人＝5.64％。人数相対点62.5×70％＋紹介率相対点62.5×30％で63点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月17日の15→18ポイント。"
    },
    {
      "id": "C",
      "rank": 4,
      "members": 227,
      "monthlyDelta": 3,
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
        "retention12mRate": 71.2,
        "retention12mSample": 295,
        "admissionRate": 63.1,
        "admissionPreviousRate": 65.2,
        "admissionYoYDelta": -2.1,
        "eventRate": 12.4,
        "repeatRate": 38.4,
        "referralPoints": 5,
        "referralRate": 2.2026431718061676,
        "referralMembers": 227
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-18",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 378,
              "retained": 367,
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
              "sample": 326,
              "retained": 294,
              "exited": 32,
              "rate": 90.2,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 295,
              "retained": 210,
              "exited": 85,
              "rate": 71.2,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 166,
              "retained": 79,
              "exited": 87,
              "rate": 47.6,
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
          "trials": 103,
          "admissions": 65,
          "rate": 63.1,
          "previousRate": 65.2,
          "yoyDelta": -2.1,
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
          "asOf": "2026-10-18",
          "trialPoints": 0,
          "siblingPoints": 5,
          "points": 5,
          "calculatedScore": 12.5,
          "members": 227,
          "rate": 2.2026431718061676,
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
      "note": "評価根拠｜【定着力】3か月 367/378人継続・非継続11人（97.1%・相対点37.5）、6か月 294/326人継続・非継続32人（90.2%・相対点12.5）、12か月 210/295人継続・非継続85人（71.2%・相対点12.5）、2年 79/166人継続・非継続87人（47.6%・相対点12.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果15点です。 【年度入会力】103人体験のうち65人入会、年度の体験→入会率63.1%（前年同期間65.2%）。A〜Dの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率12.4%と継続参加率38.4%を、参加70%・継続30%で統合して52点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。A〜Dの相対評価で38点です。 【紹介力】2026年度の紹介5ポイント（紹介体験0人・兄弟姉妹入会5人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は5pt÷基準日の会員227人＝2.20％。人数相対点12.5×70％＋紹介率相対点12.5×30％で13点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月17日の5→5ポイント。"
    },
    {
      "id": "D",
      "rank": 3,
      "members": 201,
      "monthlyDelta": 1,
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
        "retention12mRate": 78.2,
        "retention12mSample": 170,
        "admissionRate": 61.2,
        "admissionPreviousRate": 63.3,
        "admissionYoYDelta": -2.1,
        "eventRate": 11.9,
        "repeatRate": 37.9,
        "referralPoints": 19,
        "referralRate": 9.45273631840796,
        "referralMembers": 201
      },
      "note": "評価根拠｜【定着力】3か月 240/248人継続・非継続8人（96.8%・相対点12.5）、6か月 188/202人継続・非継続14人（93.1%・相対点37.5）、12か月 133/170人継続・非継続37人（78.2%・相対点37.5）、2年 22/36人継続・非継続14人（61.1%・相対点87.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果55点です。 【年度入会力】98人体験のうち60人入会、年度の体験→入会率61.2%（前年同期間63.3%）。A〜Dの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.9%と継続参加率37.9%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。A〜Dの相対評価で13点です。 【紹介力】2026年度の紹介19ポイント（紹介体験8人・兄弟姉妹入会11人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は19pt÷基準日の会員201人＝9.45％。人数相対点87.5×70％＋紹介率相対点87.5×30％で88点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年10月17日の19→19ポイント。\n運用注記｜イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-10-18",
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
              "sample": 202,
              "retained": 188,
              "exited": 14,
              "rate": 93.1,
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
              "sample": 36,
              "retained": 22,
              "exited": 14,
              "rate": 61.1,
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
          "trials": 98,
          "admissions": 60,
          "rate": 61.2,
          "previousRate": 63.3,
          "yoyDelta": -2.1,
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
          "asOf": "2026-10-18",
          "trialPoints": 8,
          "siblingPoints": 11,
          "points": 19,
          "calculatedScore": 87.5,
          "members": 201,
          "rate": 9.45273631840796,
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
    "asOf": "2026-10-18",
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
        6,
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
        6,
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
        4,
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
      24,
      null,
      null,
      null,
      null,
      null
    ]
  },
  "withdrawalHistory": {
    "definition": "member-retirement-explicit-stop-detected-v1",
    "asOf": "2026-10-18",
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
        "unknownMonth": 302,
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
        "unknownMonth": 147,
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
    "asOf": "2026-10-18",
    "fiscalYear": "2026",
    "teams": {
      "A": {
        "trials": 135,
        "admissions": 116,
        "previousTrials": 65,
        "previousAdmissions": 55
      },
      "B": {
        "trials": 136,
        "admissions": 104,
        "previousTrials": 83,
        "previousAdmissions": 69
      },
      "C": {
        "trials": 103,
        "admissions": 65,
        "previousTrials": 112,
        "previousAdmissions": 73
      },
      "D": {
        "trials": 98,
        "admissions": 60,
        "previousTrials": 207,
        "previousAdmissions": 131
      }
    }
  },
  "retentionAvailability": {
    "definition": "historical-retained-forward-confirmed-v2",
    "asOf": "2026-10-18",
    "teams": {
      "A": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 320,
        "billingWithdrawals": 0,
        "scoreAvailable": true
      },
      "B": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 220,
        "billingWithdrawals": 0,
        "scoreAvailable": true
      },
      "C": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 154,
        "billingWithdrawals": 0,
        "scoreAvailable": true
      },
      "D": {
        "confirmedWithdrawals": 0,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 60,
        "billingWithdrawals": 0,
        "scoreAvailable": true
      }
    }
  }
});
