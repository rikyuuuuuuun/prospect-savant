window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-11-14-0730-trial-ytd-v1",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-11-14",
  "asOfLabel": "2026年11月14日",
  "admissions": {
    "asOf": "2026-11-14",
    "definition": "member-master-admission-date-annual-v1",
    "fiscalYear": "2026",
    "futureAdmissionCount": 0,
    "reEnrollmentPolicy": "including-reenrollment",
    "teams": {
      "A": {
        "cumulative": 134
      },
      "B": {
        "cumulative": 112
      },
      "C": {
        "cumulative": 85
      },
      "D": {
        "cumulative": 76
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1096,
    "monthlyDelta": -11,
    "admissionRate": 74.3,
    "admissionPreviousRate": 70.4,
    "admissionYoYDelta": 3.8,
    "latestEventParticipants": 224
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-11-13",
    "previousAsOfLabel": "2026年11月13日",
    "headline": {
      "members": 1095,
      "monthlyDelta": -12,
      "admissionRate": 74.4,
      "admissionPreviousRate": 70.4,
      "admissionYoYDelta": 4,
      "latestEventParticipants": 224
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 347,
        "overall": 73,
        "metrics": {
          "retention": 75,
          "admission": 88,
          "event": 76,
          "growth": 88,
          "family": 30
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-13",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 640,
                "retained": 631,
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
                "sample": 580,
                "retained": 551,
                "exited": 29,
                "rate": 95,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 511,
                "retained": 422,
                "exited": 89,
                "rate": 82.6,
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
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 284,
                "retained": 116,
                "exited": 168,
                "rate": 40.8,
                "relativeScore": 75,
                "scored": true
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 169,
                "retained": 52,
                "exited": 117,
                "rate": 30.8,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 36,
                "retained": 4,
                "exited": 32,
                "rate": 11.1,
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
            "weightedIndex": 75
          },
          "admission": {
            "trials": 141,
            "admissions": 124,
            "rate": 87.9,
            "previousRate": 83.6,
            "yoyDelta": 4.4,
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
            "asOf": "2026-11-13",
            "trialPoints": 7,
            "siblingPoints": 9,
            "points": 16,
            "calculatedScore": 30,
            "members": 347,
            "rate": 4.610951008645533,
            "pointScore": 37.5,
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
        "id": "B",
        "rank": 2,
        "members": 318,
        "overall": 62,
        "metrics": {
          "retention": 45,
          "admission": 63,
          "event": 78,
          "growth": 63,
          "family": 80
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-13",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 515,
                "retained": 508,
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
                "sample": 487,
                "retained": 457,
                "exited": 30,
                "rate": 93.8,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 412,
                "retained": 328,
                "exited": 84,
                "rate": 79.6,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 325,
                "retained": 188,
                "exited": 137,
                "rate": 57.8,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 193,
                "retained": 63,
                "exited": 130,
                "rate": 32.6,
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
            "weightedIndex": 45
          },
          "admission": {
            "trials": 147,
            "admissions": 110,
            "rate": 74.8,
            "previousRate": 83.1,
            "yoyDelta": -8.3,
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
            "asOf": "2026-11-13",
            "trialPoints": 8,
            "siblingPoints": 12,
            "points": 20,
            "calculatedScore": 80,
            "members": 318,
            "rate": 6.289308176100629,
            "pointScore": 87.5,
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
        "members": 226,
        "overall": 30,
        "metrics": {
          "retention": 15,
          "admission": 38,
          "event": 52,
          "growth": 38,
          "family": 20
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-13",
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
                "sample": 344,
                "retained": 308,
                "exited": 36,
                "rate": 89.5,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 302,
                "retained": 218,
                "exited": 84,
                "rate": 72.2,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 179,
                "retained": 83,
                "exited": 96,
                "rate": 46.4,
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
            "trials": 112,
            "admissions": 74,
            "rate": 66.1,
            "previousRate": 65.8,
            "yoyDelta": 0.2,
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
            "asOf": "2026-11-13",
            "trialPoints": 6,
            "siblingPoints": 6,
            "points": 12,
            "calculatedScore": 20,
            "members": 226,
            "rate": 5.3097345132743365,
            "pointScore": 12.5,
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
        "id": "D",
        "rank": 3,
        "members": 204,
        "overall": 39,
        "metrics": {
          "retention": 55,
          "admission": 13,
          "event": 50,
          "growth": 13,
          "family": 70
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-13",
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
                "sample": 225,
                "retained": 208,
                "exited": 17,
                "rate": 92.4,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 179,
                "retained": 142,
                "exited": 37,
                "rate": 79.3,
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
            "trials": 104,
            "admissions": 67,
            "rate": 64.4,
            "previousRate": 63,
            "yoyDelta": 1.4,
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
            "asOf": "2026-11-13",
            "trialPoints": 8,
            "siblingPoints": 11,
            "points": 19,
            "calculatedScore": 70,
            "members": 204,
            "rate": 9.313725490196079,
            "pointScore": 62.5,
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
      "asOf": "2026-11-13",
      "definition": "member-master-admission-date-annual-v1",
      "fiscalYear": "2026",
      "futureAdmissionCount": 0,
      "reEnrollmentPolicy": "including-reenrollment",
      "teams": {
        "A": {
          "cumulative": 133
        },
        "B": {
          "cumulative": 112
        },
        "C": {
          "cumulative": 85
        },
        "D": {
          "cumulative": 75
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
      "members": 347,
      "monthlyDelta": -4,
      "overall": 73,
      "status": "算出済",
      "metrics": {
        "retention": 75,
        "admission": 88,
        "event": 76,
        "growth": 88,
        "family": 30
      },
      "benchmark": {
        "retention12mRate": 82.6,
        "retention12mSample": 511,
        "admissionRate": 87.3,
        "admissionPreviousRate": 83.6,
        "admissionYoYDelta": 3.8,
        "eventRate": 21.4,
        "repeatRate": 45.6,
        "referralPoints": 18,
        "referralRate": 5.187319884726225,
        "referralMembers": 347
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-14",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 640,
              "retained": 631,
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
              "sample": 581,
              "retained": 552,
              "exited": 29,
              "rate": 95,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 511,
              "retained": 422,
              "exited": 89,
              "rate": 82.6,
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
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 284,
              "retained": 116,
              "exited": 168,
              "rate": 40.8,
              "relativeScore": 75,
              "scored": true
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 169,
              "retained": 52,
              "exited": 117,
              "rate": 30.8,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 37,
              "retained": 4,
              "exited": 33,
              "rate": 10.8,
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
          "weightedIndex": 75
        },
        "admission": {
          "trials": 142,
          "admissions": 124,
          "rate": 87.3,
          "previousRate": 83.6,
          "yoyDelta": 3.8,
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
          "asOf": "2026-11-14",
          "trialPoints": 8,
          "siblingPoints": 10,
          "points": 18,
          "calculatedScore": 30,
          "members": 347,
          "rate": 5.187319884726225,
          "pointScore": 37.5,
          "rateScore": 12.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 631/640人継続・非継続9人（98.6%・相対点62.5）、6か月 552/581人継続・非継続29人（95.0%・相対点87.5）、12か月 422/511人継続・非継続89人（82.6%・相対点87.5）、2年 245/423人継続・非継続178人（57.9%・相対点62.5）、3年 116/284人継続・非継続168人（40.8%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果75点です。 【年度入会力】142人体験のうち124人入会、年度の体験→入会率87.3%（前年同期間83.6%）。全チームの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.4%と継続参加率45.6%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。全チームの相対評価で88点です。 【紹介力】2026年度の紹介18ポイント（紹介体験8人・兄弟姉妹入会10人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は18pt÷基準日の会員347人＝5.19％。人数相対点37.5×70％＋紹介率相対点12.5×30％で30点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月13日の16→18ポイント。"
    },
    {
      "id": "B",
      "rank": 2,
      "members": 318,
      "monthlyDelta": -4,
      "overall": 62,
      "status": "算出済",
      "metrics": {
        "retention": 45,
        "admission": 63,
        "event": 78,
        "growth": 63,
        "family": 80
      },
      "benchmark": {
        "retention12mRate": 79.6,
        "retention12mSample": 412,
        "admissionRate": 74.8,
        "admissionPreviousRate": 83.1,
        "admissionYoYDelta": -8.3,
        "eventRate": 21.8,
        "repeatRate": 46.9,
        "referralPoints": 20,
        "referralRate": 6.289308176100629,
        "referralMembers": 318
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-14",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 515,
              "retained": 508,
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
              "sample": 490,
              "retained": 460,
              "exited": 30,
              "rate": 93.9,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 412,
              "retained": 328,
              "exited": 84,
              "rate": 79.6,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 325,
              "retained": 188,
              "exited": 137,
              "rate": 57.8,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 193,
              "retained": 63,
              "exited": 130,
              "rate": 32.6,
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
          "weightedIndex": 45
        },
        "admission": {
          "trials": 147,
          "admissions": 110,
          "rate": 74.8,
          "previousRate": 83.1,
          "yoyDelta": -8.3,
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
          "asOf": "2026-11-14",
          "trialPoints": 8,
          "siblingPoints": 12,
          "points": 20,
          "calculatedScore": 80,
          "members": 318,
          "rate": 6.289308176100629,
          "pointScore": 87.5,
          "rateScore": 62.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 508/515人継続・非継続7人（98.6%・相対点87.5）、6か月 460/490人継続・非継続30人（93.9%・相対点62.5）、12か月 328/412人継続・非継続84人（79.6%・相対点62.5）、2年 188/325人継続・非継続137人（57.8%・相対点37.5）、3年 63/193人継続・非継続130人（32.6%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果45点です。 【年度入会力】147人体験のうち110人入会、年度の体験→入会率74.8%（前年同期間83.1%）。全チームの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.8%と継続参加率46.9%を、参加70%・継続30%で統合して78点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。全チームの相対評価で63点です。 【紹介力】2026年度の紹介20ポイント（紹介体験8人・兄弟姉妹入会12人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は20pt÷基準日の会員318人＝6.29％。人数相対点87.5×70％＋紹介率相対点62.5×30％で80点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月13日の20→20ポイント。"
    },
    {
      "id": "C",
      "rank": 4,
      "members": 226,
      "monthlyDelta": -2,
      "overall": 30,
      "status": "算出済",
      "metrics": {
        "retention": 15,
        "admission": 38,
        "event": 52,
        "growth": 38,
        "family": 20
      },
      "benchmark": {
        "retention12mRate": 72.2,
        "retention12mSample": 302,
        "admissionRate": 66.1,
        "admissionPreviousRate": 65.8,
        "admissionYoYDelta": 0.2,
        "eventRate": 12.4,
        "repeatRate": 38.4,
        "referralPoints": 12,
        "referralRate": 5.3097345132743365,
        "referralMembers": 226
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-14",
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
              "sample": 345,
              "retained": 309,
              "exited": 36,
              "rate": 89.6,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 302,
              "retained": 218,
              "exited": 84,
              "rate": 72.2,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 180,
              "retained": 83,
              "exited": 97,
              "rate": 46.1,
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
          "trials": 112,
          "admissions": 74,
          "rate": 66.1,
          "previousRate": 65.8,
          "yoyDelta": 0.2,
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
          "asOf": "2026-11-14",
          "trialPoints": 6,
          "siblingPoints": 6,
          "points": 12,
          "calculatedScore": 20,
          "members": 226,
          "rate": 5.3097345132743365,
          "pointScore": 12.5,
          "rateScore": 37.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 368/379人継続・非継続11人（97.1%・相対点37.5）、6か月 309/345人継続・非継続36人（89.6%・相対点12.5）、12か月 218/302人継続・非継続84人（72.2%・相対点12.5）、2年 83/180人継続・非継続97人（46.1%・相対点12.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果15点です。 【年度入会力】112人体験のうち74人入会、年度の体験→入会率66.1%（前年同期間65.8%）。全チームの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率12.4%と継続参加率38.4%を、参加70%・継続30%で統合して52点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。全チームの相対評価で38点です。 【紹介力】2026年度の紹介12ポイント（紹介体験6人・兄弟姉妹入会6人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は12pt÷基準日の会員226人＝5.31％。人数相対点12.5×70％＋紹介率相対点37.5×30％で20点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月13日の12→12ポイント。"
    },
    {
      "id": "D",
      "rank": 3,
      "members": 205,
      "monthlyDelta": -1,
      "overall": 39,
      "status": "算出済",
      "metrics": {
        "retention": 55,
        "admission": 13,
        "event": 50,
        "growth": 13,
        "family": 70
      },
      "benchmark": {
        "retention12mRate": 79.3,
        "retention12mSample": 179,
        "admissionRate": 64.4,
        "admissionPreviousRate": 63.2,
        "admissionYoYDelta": 1.2,
        "eventRate": 11.9,
        "repeatRate": 37.9,
        "referralPoints": 19,
        "referralRate": 9.268292682926829,
        "referralMembers": 205
      },
      "note": "評価根拠｜【定着力】3か月 241/249人継続・非継続8人（96.8%・相対点12.5）、6か月 208/225人継続・非継続17人（92.4%・相対点37.5）、12か月 142/179人継続・非継続37人（79.3%・相対点37.5）、2年 24/38人継続・非継続14人（63.2%・相対点87.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果55点です。 【年度入会力】104人体験のうち67人入会、年度の体験→入会率64.4%（前年同期間63.2%）。全チームの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.9%と継続参加率37.9%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。全チームの相対評価で13点です。 【紹介力】2026年度の紹介19ポイント（紹介体験8人・兄弟姉妹入会11人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は19pt÷基準日の会員205人＝9.27％。人数相対点62.5×70％＋紹介率相対点87.5×30％で70点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月13日の19→19ポイント。\n運用注記｜イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-14",
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
              "sample": 225,
              "retained": 208,
              "exited": 17,
              "rate": 92.4,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 179,
              "retained": 142,
              "exited": 37,
              "rate": 79.3,
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
          "trials": 104,
          "admissions": 67,
          "rate": 64.4,
          "previousRate": 63.2,
          "yoyDelta": 1.2,
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
          "asOf": "2026-11-14",
          "trialPoints": 8,
          "siblingPoints": 11,
          "points": 19,
          "calculatedScore": 70,
          "members": 205,
          "rate": 9.268292682926829,
          "pointScore": 62.5,
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
    "previousAsOf": "2026-10-31",
    "previousAsOfLabel": "2026年10月31日",
    "headline": {
      "members": 1107
    },
    "teams": [
      {
        "id": "A",
        "members": 351
      },
      {
        "id": "B",
        "members": 322
      },
      {
        "id": "C",
        "members": 228
      },
      {
        "id": "D",
        "members": 206
      }
    ],
    "memberDefinition": {
      "id": "operational-person-v1",
      "label": "人物単位運用会員"
    },
    "estimate": {
      "method": "unconfirmed-month-end-daily-snapshot",
      "sourceAsOf": "2026-10-31"
    }
  },
  "memberDeltaDefinition": "previous-month-end-v1",
  "metricDefinitions": {
    "family": "referral-volume-rate-v2",
    "retention": "historical-retained-forward-confirmed-v2"
  },
  "admissionHistory": {
    "definition": "member-master-admission-date-monthly-v1",
    "asOf": "2026-11-14",
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
        14,
        1,
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
        11,
        3,
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
        6,
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
        4,
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
      41,
      14,
      null,
      null,
      null,
      null
    ]
  },
  "withdrawalHistory": {
    "definition": "member-retirement-explicit-stop-detected-v1",
    "asOf": "2026-11-14",
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
        "unknownMonth": 305,
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
            "explicit": 6,
            "stopped": 0,
            "detected": 0,
            "count": 6,
            "cohortCount": 6,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-11",
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
            "explicit": 6,
            "stopped": 0,
            "detected": 0,
            "count": 6,
            "cohortCount": 6,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
          {
            "month": "2026-11",
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
            "month": "2026-11",
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
            "month": "2026-11",
            "explicit": 1,
            "stopped": 0,
            "detected": 0,
            "count": 1,
            "cohortCount": 1,
            "missingEntry": 0,
            "denominator": null,
            "rate": null
          },
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
    "asOf": "2026-11-14",
    "fiscalYear": "2026",
    "teams": {
      "A": {
        "trials": 142,
        "admissions": 124,
        "previousTrials": 73,
        "previousAdmissions": 61
      },
      "B": {
        "trials": 147,
        "admissions": 110,
        "previousTrials": 89,
        "previousAdmissions": 74
      },
      "C": {
        "trials": 112,
        "admissions": 74,
        "previousTrials": 120,
        "previousAdmissions": 79
      },
      "D": {
        "trials": 104,
        "admissions": 67,
        "previousTrials": 212,
        "previousAdmissions": 134
      }
    }
  },
  "retentionAvailability": {
    "definition": "historical-retained-forward-confirmed-v2",
    "asOf": "2026-11-14",
    "teams": {
      "A": {
        "confirmedWithdrawals": 6,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 320,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 0,
        "scoreAvailable": true
      },
      "B": {
        "confirmedWithdrawals": 6,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 220,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 0,
        "scoreAvailable": true
      },
      "C": {
        "confirmedWithdrawals": 8,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 153,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 2,
        "scoreAvailable": true
      },
      "D": {
        "confirmedWithdrawals": 3,
        "unknownWithdrawals": 0,
        "historicalWithdrawals": 60,
        "billingWithdrawals": 0,
        "rosterDateWithdrawals": 2,
        "scoreAvailable": true
      }
    }
  },
  "memberComposition": {
    "definition": "operational-member-composition-v1",
    "memberDefinition": "operational-person-v1",
    "asOf": "2026-11-14",
    "status": "ok",
    "overall": {
      "members": 1096,
      "grade": {
        "preschool": 0,
        "k1": 5,
        "k2": 48,
        "k3": 53,
        "p1": 148,
        "p2": 181,
        "p3": 169,
        "p4": 173,
        "p5": 166,
        "p6": 95,
        "j1": 35,
        "j2": 15,
        "j3": 6,
        "h1": 1,
        "h2": 0,
        "h3": 0,
        "adult": 0,
        "unknown": 1
      },
      "gender": {
        "male": 476,
        "female": 618,
        "other": 0,
        "unknown": 2
      },
      "tenure": {
        "lt3": 99,
        "m3to6": 126,
        "m6to12": 214,
        "y1to2": 293,
        "y2to3": 227,
        "y3to5": 132,
        "y5plus": 4,
        "unknown": 1
      },
      "age": {
        "lt5": 19,
        "a5to6": 140,
        "a7to9": 513,
        "a10to12": 379,
        "a13to15": 43,
        "a16plus": 1,
        "unknown": 1
      },
      "status": {
        "active": 1047,
        "paused": 33,
        "scheduled": 15,
        "unknown": 1
      },
      "entryYear": {
        "2021": 13,
        "2022": 31,
        "2023": 117,
        "2024": 251,
        "2025": 313,
        "2026": 370,
        "unknown": 1
      },
      "summary": {
        "knownTenure": 1095,
        "tenureMonthsTotal": 19569,
        "meanTenureMonths": 17.9,
        "medianTenureMonths": 16
      }
    },
    "teams": {
      "A": {
        "members": 347,
        "grade": {
          "preschool": 0,
          "k1": 3,
          "k2": 16,
          "k3": 10,
          "p1": 53,
          "p2": 48,
          "p3": 58,
          "p4": 47,
          "p5": 59,
          "p6": 26,
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
          "male": 160,
          "female": 187,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 32,
          "m3to6": 53,
          "m6to12": 67,
          "y1to2": 60,
          "y2to3": 57,
          "y3to5": 74,
          "y5plus": 4,
          "unknown": 0
        },
        "age": {
          "lt5": 9,
          "a5to6": 37,
          "a7to9": 159,
          "a10to12": 120,
          "a13to15": 21,
          "a16plus": 1,
          "unknown": 0
        },
        "status": {
          "active": 333,
          "paused": 14,
          "scheduled": 0,
          "unknown": 0
        },
        "entryYear": {
          "2021": 13,
          "2022": 31,
          "2023": 44,
          "2024": 64,
          "2025": 71,
          "2026": 124
        },
        "summary": {
          "knownTenure": 347,
          "tenureMonthsTotal": 7200,
          "meanTenureMonths": 20.7,
          "medianTenureMonths": 17
        }
      },
      "B": {
        "members": 318,
        "grade": {
          "preschool": 0,
          "k1": 0,
          "k2": 13,
          "k3": 25,
          "p1": 37,
          "p2": 39,
          "p3": 49,
          "p4": 52,
          "p5": 54,
          "p6": 36,
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
          "female": 180,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 28,
          "m3to6": 23,
          "m6to12": 70,
          "y1to2": 63,
          "y2to3": 75,
          "y3to5": 58,
          "y5plus": 0,
          "unknown": 1
        },
        "age": {
          "lt5": 7,
          "a5to6": 50,
          "a7to9": 130,
          "a10to12": 120,
          "a13to15": 10,
          "a16plus": 0,
          "unknown": 1
        },
        "status": {
          "active": 310,
          "paused": 0,
          "scheduled": 7,
          "unknown": 1
        },
        "entryYear": {
          "2023": 73,
          "2024": 71,
          "2025": 68,
          "2026": 105,
          "unknown": 1
        },
        "summary": {
          "knownTenure": 317,
          "tenureMonthsTotal": 6138,
          "meanTenureMonths": 19.4,
          "medianTenureMonths": 17
        }
      },
      "C": {
        "members": 226,
        "grade": {
          "preschool": 0,
          "k1": 0,
          "k2": 4,
          "k3": 9,
          "p1": 36,
          "p2": 47,
          "p3": 30,
          "p4": 39,
          "p5": 27,
          "p6": 20,
          "j1": 11,
          "j2": 3,
          "j3": 0,
          "h1": 0,
          "h2": 0,
          "h3": 0,
          "adult": 0,
          "unknown": 0
        },
        "gender": {
          "male": 109,
          "female": 117,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 17,
          "m3to6": 29,
          "m6to12": 36,
          "y1to2": 72,
          "y2to3": 72,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 1,
          "a5to6": 19,
          "a7to9": 118,
          "a10to12": 80,
          "a13to15": 8,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 208,
          "paused": 12,
          "scheduled": 6,
          "unknown": 0
        },
        "entryYear": {
          "2024": 88,
          "2025": 65,
          "2026": 73
        },
        "summary": {
          "knownTenure": 226,
          "tenureMonthsTotal": 3609,
          "meanTenureMonths": 16,
          "medianTenureMonths": 16
        }
      },
      "D": {
        "members": 205,
        "grade": {
          "preschool": 0,
          "k1": 2,
          "k2": 15,
          "k3": 9,
          "p1": 22,
          "p2": 47,
          "p3": 32,
          "p4": 35,
          "p5": 26,
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
          "male": 70,
          "female": 134,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 22,
          "m3to6": 21,
          "m6to12": 41,
          "y1to2": 98,
          "y2to3": 23,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 2,
          "a5to6": 34,
          "a7to9": 106,
          "a10to12": 59,
          "a13to15": 4,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 196,
          "paused": 7,
          "scheduled": 2,
          "unknown": 0
        },
        "entryYear": {
          "2024": 28,
          "2025": 109,
          "2026": 68
        },
        "summary": {
          "knownTenure": 205,
          "tenureMonthsTotal": 2622,
          "meanTenureMonths": 12.8,
          "medianTenureMonths": 14
        }
      }
    }
  },
  "admissionConversionHistory": {
    "status": "ok",
    "definition": "trial-attendance-fiscal-monthly-v1",
    "asOf": "2026-11-14",
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
          13,
          1,
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
          12,
          0,
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
          20,
          3,
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
          10,
          1,
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
          11,
          6,
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
          8,
          5,
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
          2,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          23,
          15,
          5,
          4,
          2,
          11,
          5,
          2,
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
        57,
        12,
        null,
        null,
        null,
        null
      ],
      "admissions": [
        127,
        82,
        34,
        37,
        7,
        45,
        35,
        8,
        null,
        null,
        null,
        null
      ]
    }
  },
  "acquisitionHistory": {
    "definition": "club-discovery-source-v1",
    "status": "ok",
    "asOf": "2026-11-14",
    "since": "2026-11-02",
    "timezone": "Asia/Tokyo",
    "teams": {
      "A": {
        "flyer": 1,
        "referral": 0,
        "other": 2,
        "unknown": 0,
        "total": 3
      },
      "B": {
        "flyer": 2,
        "referral": 0,
        "other": 0,
        "unknown": 0,
        "total": 2
      },
      "C": {
        "flyer": 2,
        "referral": 1,
        "other": 2,
        "unknown": 0,
        "total": 5
      },
      "D": {
        "flyer": 0,
        "referral": 2,
        "other": 0,
        "unknown": 0,
        "total": 2
      },
      "E": {
        "flyer": 8,
        "referral": 2,
        "other": 0,
        "unknown": 0,
        "total": 10
      }
    },
    "months": [
      {
        "month": "2026-11",
        "teams": {
          "A": {
            "flyer": 1,
            "referral": 0,
            "other": 2,
            "unknown": 0,
            "total": 3
          },
          "B": {
            "flyer": 2,
            "referral": 0,
            "other": 0,
            "unknown": 0,
            "total": 2
          },
          "C": {
            "flyer": 2,
            "referral": 1,
            "other": 2,
            "unknown": 0,
            "total": 5
          },
          "D": {
            "flyer": 0,
            "referral": 2,
            "other": 0,
            "unknown": 0,
            "total": 2
          },
          "E": {
            "flyer": 8,
            "referral": 2,
            "other": 0,
            "unknown": 0,
            "total": 10
          }
        }
      }
    ]
  },
  "eTeam": {
    "asOf": "2026-11-14",
    "members": 5,
    "allMembers": 1101,
    "definition": "trial-attendance-fiscal-ytd-v1",
    "annual": {
      "trials": 5,
      "admissions": 5,
      "previousTrials": 0,
      "previousAdmissions": 0
    },
    "memberMonthlyComparison": {
      "asOf": "2026-10-31",
      "members": 0
    },
    "metrics": {
      "definition": "common-team-metrics-v1",
      "asOf": "2026-11-14",
      "admissions": 5,
      "retention": {
        "periods": [
          {
            "key": "m3",
            "label": "3か月",
            "months": 3,
            "weight": 1,
            "sample": 0,
            "retained": null,
            "exited": null,
            "rate": null,
            "relativeScore": null,
            "scored": false
          },
          {
            "key": "m6",
            "label": "6か月",
            "months": 6,
            "weight": 2,
            "sample": 0,
            "retained": null,
            "exited": null,
            "rate": null,
            "relativeScore": null,
            "scored": false
          },
          {
            "key": "m12",
            "label": "12か月",
            "months": 12,
            "weight": 3,
            "sample": 0,
            "retained": null,
            "exited": null,
            "rate": null,
            "relativeScore": null,
            "scored": false
          },
          {
            "key": "y2",
            "label": "2年",
            "months": 24,
            "weight": 4,
            "sample": 0,
            "retained": null,
            "exited": null,
            "rate": null,
            "relativeScore": null,
            "scored": false
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
        "weightedIndex": null
      },
      "unknownWithdrawals": 0,
      "growth": {
        "top10": 0,
        "top10to20": 0,
        "top20to30": 0,
        "top30Children": 0,
        "weightedPoints": 0,
        "status": "履歴待ち"
      },
      "family": {
        "definition": "referral-volume-rate-v2",
        "trialPoints": 0,
        "siblingPoints": 0,
        "points": 0,
        "members": 5,
        "rate": 0,
        "weights": {
          "points": 70,
          "rate": 30
        },
        "denominatorBasis": "operational-members-at-asof"
      },
      "event": {
        "eventCount": 0,
        "averageRate": null,
        "participants": 0,
        "repeated": 0,
        "repeatRate": null,
        "participationWeight": 70,
        "repeatWeight": 30
      },
      "events": [
        {
          "startDate": "2026-08-09",
          "endDate": "2026-08-23",
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false
        },
        {
          "startDate": "2026-06-28",
          "endDate": "2026-07-26",
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false
        },
        {
          "startDate": "2026-02-22",
          "endDate": "2026-02-22",
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false
        },
        {
          "startDate": "2025-11-24",
          "endDate": "2025-12-14",
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false
        },
        {
          "startDate": "2025-08-03",
          "endDate": "2025-08-03",
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false
        },
        {
          "startDate": "2024-08-03",
          "endDate": "2024-08-25",
          "participants": null,
          "members": null,
          "rate": null,
          "eligible": false
        }
      ],
      "curve": [
        {
          "months": 1,
          "rate": null,
          "sample": 0
        },
        {
          "months": 3,
          "rate": null,
          "sample": 0
        },
        {
          "months": 6,
          "rate": null,
          "sample": 0
        },
        {
          "months": 9,
          "rate": null,
          "sample": 0
        },
        {
          "months": 12,
          "rate": null,
          "sample": 0
        },
        {
          "months": 18,
          "rate": null,
          "sample": 0
        },
        {
          "months": 24,
          "rate": null,
          "sample": 0
        },
        {
          "months": 36,
          "rate": null,
          "sample": 0
        },
        {
          "months": 48,
          "rate": null,
          "sample": 0
        },
        {
          "months": 60,
          "rate": null,
          "sample": 0
        },
        {
          "months": 72,
          "rate": null,
          "sample": 0
        }
      ],
      "schoolAge": {
        "samples": [
          0,
          0,
          0,
          0
        ],
        "rates": [
          null,
          null,
          null,
          null
        ]
      }
    },
    "analysis": {
      "today": {
        "asOf": "2026-11-14",
        "status": "ok",
        "count": 0
      },
      "admissionHistory": {
        "definition": "member-master-admission-date-monthly-v1",
        "asOf": "2026-11-14",
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
            14,
            1,
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
            11,
            3,
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
            6,
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
            4,
            null,
            null,
            null,
            null
          ],
          "E": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            5,
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
          41,
          19,
          null,
          null,
          null,
          null
        ]
      },
      "withdrawalHistory": {
        "definition": "member-retirement-explicit-stop-detected-v1",
        "asOf": "2026-11-14",
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
            "unknownMonth": 305,
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
                "explicit": 6,
                "stopped": 0,
                "detected": 0,
                "count": 6,
                "cohortCount": 6,
                "missingEntry": 0,
                "denominator": null,
                "rate": null
              },
              {
                "month": "2026-11",
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
                "explicit": 6,
                "stopped": 0,
                "detected": 0,
                "count": 6,
                "cohortCount": 6,
                "missingEntry": 0,
                "denominator": null,
                "rate": null
              },
              {
                "month": "2026-11",
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
                "month": "2026-11",
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
                "month": "2026-11",
                "explicit": 1,
                "stopped": 0,
                "detected": 0,
                "count": 1,
                "cohortCount": 1,
                "missingEntry": 0,
                "denominator": null,
                "rate": null
              },
              null,
              null,
              null,
              null
            ]
          },
          "E": {
            "unknownMonth": 0,
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
                "month": "2026-08",
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
                "month": "2026-09",
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
              {
                "month": "2026-11",
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
              null
            ]
          }
        },
        "unassigned": 1
      },
      "admissionConversionHistory": {
        "status": "ok",
        "definition": "trial-attendance-fiscal-monthly-v1",
        "asOf": "2026-11-14",
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
              13,
              1,
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
              12,
              0,
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
              20,
              3,
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
              10,
              1,
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
              11,
              6,
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
              8,
              5,
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
              2,
              null,
              null,
              null,
              null
            ],
            "admissions": [
              23,
              15,
              5,
              4,
              2,
              11,
              5,
              2,
              null,
              null,
              null,
              null
            ]
          },
          "E": {
            "trials": [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              5,
              null,
              null,
              null,
              null
            ],
            "admissions": [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              5,
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
            57,
            17,
            null,
            null,
            null,
            null
          ],
          "admissions": [
            127,
            82,
            34,
            37,
            7,
            45,
            35,
            13,
            null,
            null,
            null,
            null
          ]
        }
      },
      "memberComposition": {
        "definition": "operational-member-composition-v1",
        "memberDefinition": "operational-person-v1",
        "asOf": "2026-11-14",
        "status": "ok",
        "overall": {
          "members": 1101,
          "grade": {
            "preschool": 0,
            "k1": 6,
            "k2": 48,
            "k3": 53,
            "p1": 149,
            "p2": 181,
            "p3": 171,
            "p4": 174,
            "p5": 166,
            "p6": 95,
            "j1": 35,
            "j2": 15,
            "j3": 6,
            "h1": 1,
            "h2": 0,
            "h3": 0,
            "adult": 0,
            "unknown": 1
          },
          "gender": {
            "male": 478,
            "female": 621,
            "other": 0,
            "unknown": 2
          },
          "tenure": {
            "lt3": 104,
            "m3to6": 126,
            "m6to12": 214,
            "y1to2": 293,
            "y2to3": 227,
            "y3to5": 132,
            "y5plus": 4,
            "unknown": 1
          },
          "age": {
            "lt5": 20,
            "a5to6": 140,
            "a7to9": 517,
            "a10to12": 379,
            "a13to15": 43,
            "a16plus": 1,
            "unknown": 1
          },
          "status": {
            "active": 1052,
            "paused": 33,
            "scheduled": 15,
            "unknown": 1
          },
          "entryYear": {
            "2021": 13,
            "2022": 31,
            "2023": 117,
            "2024": 251,
            "2025": 313,
            "2026": 375,
            "unknown": 1
          },
          "summary": {
            "knownTenure": 1100,
            "tenureMonthsTotal": 19569,
            "meanTenureMonths": 17.8,
            "medianTenureMonths": 16
          }
        },
        "teams": {
          "A": {
            "members": 347,
            "grade": {
              "preschool": 0,
              "k1": 3,
              "k2": 16,
              "k3": 10,
              "p1": 53,
              "p2": 48,
              "p3": 58,
              "p4": 47,
              "p5": 59,
              "p6": 26,
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
              "male": 160,
              "female": 187,
              "other": 0,
              "unknown": 0
            },
            "tenure": {
              "lt3": 32,
              "m3to6": 53,
              "m6to12": 67,
              "y1to2": 60,
              "y2to3": 57,
              "y3to5": 74,
              "y5plus": 4,
              "unknown": 0
            },
            "age": {
              "lt5": 9,
              "a5to6": 37,
              "a7to9": 159,
              "a10to12": 120,
              "a13to15": 21,
              "a16plus": 1,
              "unknown": 0
            },
            "status": {
              "active": 333,
              "paused": 14,
              "scheduled": 0,
              "unknown": 0
            },
            "entryYear": {
              "2021": 13,
              "2022": 31,
              "2023": 44,
              "2024": 64,
              "2025": 71,
              "2026": 124
            },
            "summary": {
              "knownTenure": 347,
              "tenureMonthsTotal": 7200,
              "meanTenureMonths": 20.7,
              "medianTenureMonths": 17
            }
          },
          "B": {
            "members": 318,
            "grade": {
              "preschool": 0,
              "k1": 0,
              "k2": 13,
              "k3": 25,
              "p1": 37,
              "p2": 39,
              "p3": 49,
              "p4": 52,
              "p5": 54,
              "p6": 36,
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
              "female": 180,
              "other": 0,
              "unknown": 1
            },
            "tenure": {
              "lt3": 28,
              "m3to6": 23,
              "m6to12": 70,
              "y1to2": 63,
              "y2to3": 75,
              "y3to5": 58,
              "y5plus": 0,
              "unknown": 1
            },
            "age": {
              "lt5": 7,
              "a5to6": 50,
              "a7to9": 130,
              "a10to12": 120,
              "a13to15": 10,
              "a16plus": 0,
              "unknown": 1
            },
            "status": {
              "active": 310,
              "paused": 0,
              "scheduled": 7,
              "unknown": 1
            },
            "entryYear": {
              "2023": 73,
              "2024": 71,
              "2025": 68,
              "2026": 105,
              "unknown": 1
            },
            "summary": {
              "knownTenure": 317,
              "tenureMonthsTotal": 6138,
              "meanTenureMonths": 19.4,
              "medianTenureMonths": 17
            }
          },
          "C": {
            "members": 226,
            "grade": {
              "preschool": 0,
              "k1": 0,
              "k2": 4,
              "k3": 9,
              "p1": 36,
              "p2": 47,
              "p3": 30,
              "p4": 39,
              "p5": 27,
              "p6": 20,
              "j1": 11,
              "j2": 3,
              "j3": 0,
              "h1": 0,
              "h2": 0,
              "h3": 0,
              "adult": 0,
              "unknown": 0
            },
            "gender": {
              "male": 109,
              "female": 117,
              "other": 0,
              "unknown": 0
            },
            "tenure": {
              "lt3": 17,
              "m3to6": 29,
              "m6to12": 36,
              "y1to2": 72,
              "y2to3": 72,
              "y3to5": 0,
              "y5plus": 0,
              "unknown": 0
            },
            "age": {
              "lt5": 1,
              "a5to6": 19,
              "a7to9": 118,
              "a10to12": 80,
              "a13to15": 8,
              "a16plus": 0,
              "unknown": 0
            },
            "status": {
              "active": 208,
              "paused": 12,
              "scheduled": 6,
              "unknown": 0
            },
            "entryYear": {
              "2024": 88,
              "2025": 65,
              "2026": 73
            },
            "summary": {
              "knownTenure": 226,
              "tenureMonthsTotal": 3609,
              "meanTenureMonths": 16,
              "medianTenureMonths": 16
            }
          },
          "D": {
            "members": 205,
            "grade": {
              "preschool": 0,
              "k1": 2,
              "k2": 15,
              "k3": 9,
              "p1": 22,
              "p2": 47,
              "p3": 32,
              "p4": 35,
              "p5": 26,
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
              "male": 70,
              "female": 134,
              "other": 0,
              "unknown": 1
            },
            "tenure": {
              "lt3": 22,
              "m3to6": 21,
              "m6to12": 41,
              "y1to2": 98,
              "y2to3": 23,
              "y3to5": 0,
              "y5plus": 0,
              "unknown": 0
            },
            "age": {
              "lt5": 2,
              "a5to6": 34,
              "a7to9": 106,
              "a10to12": 59,
              "a13to15": 4,
              "a16plus": 0,
              "unknown": 0
            },
            "status": {
              "active": 196,
              "paused": 7,
              "scheduled": 2,
              "unknown": 0
            },
            "entryYear": {
              "2024": 28,
              "2025": 109,
              "2026": 68
            },
            "summary": {
              "knownTenure": 205,
              "tenureMonthsTotal": 2622,
              "meanTenureMonths": 12.8,
              "medianTenureMonths": 14
            }
          },
          "E": {
            "members": 5,
            "grade": {
              "preschool": 0,
              "k1": 1,
              "k2": 0,
              "k3": 0,
              "p1": 1,
              "p2": 0,
              "p3": 2,
              "p4": 1,
              "p5": 0,
              "p6": 0,
              "j1": 0,
              "j2": 0,
              "j3": 0,
              "h1": 0,
              "h2": 0,
              "h3": 0,
              "adult": 0,
              "unknown": 0
            },
            "gender": {
              "male": 2,
              "female": 3,
              "other": 0,
              "unknown": 0
            },
            "tenure": {
              "lt3": 5,
              "m3to6": 0,
              "m6to12": 0,
              "y1to2": 0,
              "y2to3": 0,
              "y3to5": 0,
              "y5plus": 0,
              "unknown": 0
            },
            "age": {
              "lt5": 1,
              "a5to6": 0,
              "a7to9": 4,
              "a10to12": 0,
              "a13to15": 0,
              "a16plus": 0,
              "unknown": 0
            },
            "status": {
              "active": 5,
              "paused": 0,
              "scheduled": 0,
              "unknown": 0
            },
            "entryYear": {
              "2026": 5
            },
            "summary": {
              "knownTenure": 5,
              "tenureMonthsTotal": 0,
              "meanTenureMonths": 0,
              "medianTenureMonths": 0
            }
          }
        }
      }
    },
    "previous": {
      "asOf": "2026-11-13",
      "team": {
        "id": "E",
        "members": 5,
        "monthlyDelta": 5,
        "rank": null,
        "overall": 0,
        "status": "算出済",
        "metrics": {
          "retention": null,
          "admission": 100,
          "growth": 0,
          "event": null,
          "family": 0
        },
        "benchmark": {
          "retention12mRate": null,
          "retention12mSample": 0,
          "admissionRate": 100,
          "admissionPreviousRate": null,
          "admissionYoYDelta": null,
          "eventRate": null,
          "repeatRate": null,
          "referralPoints": 0,
          "referralRate": 0,
          "referralMembers": 5
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-13",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 0,
                "retained": null,
                "exited": null,
                "rate": null,
                "relativeScore": null,
                "scored": false
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
            "weightedIndex": null
          },
          "admission": {
            "trials": 5,
            "admissions": 5,
            "previousTrials": 0,
            "previousAdmissions": 0,
            "rate": 100,
            "previousRate": null,
            "relativeScore": 100
          },
          "growth": {
            "top10": 0,
            "top10to20": 0,
            "top20to30": 0,
            "top30Children": 0,
            "weightedPoints": 0,
            "status": "履歴待ち",
            "competitionCount": 2,
            "competitionRows": 1068
          },
          "family": {
            "definition": "referral-volume-rate-v2",
            "trialPoints": 0,
            "siblingPoints": 0,
            "points": 0,
            "members": 5,
            "rate": 0,
            "weights": {
              "points": 70,
              "rate": 30
            },
            "denominatorBasis": "operational-members-at-asof",
            "fiscalYear": "2026",
            "asOf": "2026-11-13"
          },
          "event": {
            "eventCount": 0,
            "averageRate": null,
            "participants": 0,
            "repeated": 0,
            "repeatRate": null,
            "participationWeight": 70,
            "repeatWeight": 30,
            "participationScore": null,
            "repeatScore": null,
            "score": null
          }
        },
        "note": "共通の対象人数・期間を満たした指標から算出します。定着率は対象20名以上。対象イベントの開催前はイベント力を保留します。"
      },
      "admissions": 5
    }
  }
});
