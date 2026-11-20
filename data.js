window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-11-21-0730-trial-ytd-v1",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-11-21",
  "asOfLabel": "2026年11月21日",
  "admissions": {
    "asOf": "2026-11-21",
    "definition": "member-master-admission-date-annual-v1",
    "fiscalYear": "2026",
    "futureAdmissionCount": 0,
    "reEnrollmentPolicy": "including-reenrollment",
    "teams": {
      "A": {
        "cumulative": 137
      },
      "B": {
        "cumulative": 114
      },
      "C": {
        "cumulative": 87
      },
      "D": {
        "cumulative": 83
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1111,
    "monthlyDelta": 4,
    "admissionRate": 74.7,
    "admissionPreviousRate": 70.3,
    "admissionYoYDelta": 4.3,
    "latestEventParticipants": 224
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-11-20",
    "previousAsOfLabel": "2026年11月20日",
    "headline": {
      "members": 1110,
      "monthlyDelta": 3,
      "admissionRate": 74.7,
      "admissionPreviousRate": 70.4,
      "admissionYoYDelta": 4.3,
      "latestEventParticipants": 224
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 350,
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
          "asOf": "2026-11-20",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 642,
                "retained": 633,
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
                "sample": 595,
                "retained": 564,
                "exited": 31,
                "rate": 94.8,
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
                "sample": 425,
                "retained": 246,
                "exited": 179,
                "rate": 57.9,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 286,
                "retained": 118,
                "exited": 168,
                "rate": 41.3,
                "relativeScore": 75,
                "scored": true
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 170,
                "retained": 52,
                "exited": 118,
                "rate": 30.6,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 41,
                "retained": 5,
                "exited": 36,
                "rate": 12.2,
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
            "trials": 145,
            "admissions": 128,
            "rate": 88.3,
            "previousRate": 83.6,
            "yoyDelta": 4.7,
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
            "asOf": "2026-11-20",
            "trialPoints": 8,
            "siblingPoints": 10,
            "points": 18,
            "calculatedScore": 30,
            "members": 350,
            "rate": 5.142857142857142,
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
        "members": 321,
        "overall": 59,
        "metrics": {
          "retention": 45,
          "admission": 63,
          "event": 78,
          "growth": 63,
          "family": 63
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-20",
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
                "sample": 495,
                "retained": 465,
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
                "sample": 413,
                "retained": 329,
                "exited": 84,
                "rate": 79.7,
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
            "trials": 149,
            "admissions": 112,
            "rate": 75.2,
            "previousRate": 83.5,
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
            "asOf": "2026-11-20",
            "trialPoints": 8,
            "siblingPoints": 13,
            "points": 21,
            "calculatedScore": 62.5,
            "members": 321,
            "rate": 6.5420560747663545,
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
        "members": 228,
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
          "asOf": "2026-11-20",
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
                "sample": 352,
                "retained": 316,
                "exited": 36,
                "rate": 89.8,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 303,
                "retained": 219,
                "exited": 84,
                "rate": 72.3,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 183,
                "retained": 83,
                "exited": 100,
                "rate": 45.4,
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
            "trials": 113,
            "admissions": 75,
            "rate": 66.4,
            "previousRate": 65.6,
            "yoyDelta": 0.8,
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
            "asOf": "2026-11-20",
            "trialPoints": 7,
            "siblingPoints": 7,
            "points": 14,
            "calculatedScore": 20,
            "members": 228,
            "rate": 6.140350877192982,
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
        "members": 211,
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
          "asOf": "2026-11-20",
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
                "sample": 227,
                "retained": 209,
                "exited": 18,
                "rate": 92.1,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 180,
                "retained": 143,
                "exited": 37,
                "rate": 79.4,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 39,
                "retained": 25,
                "exited": 14,
                "rate": 64.1,
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
            "trials": 114,
            "admissions": 74,
            "rate": 64.9,
            "previousRate": 63.1,
            "yoyDelta": 1.8,
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
            "asOf": "2026-11-20",
            "trialPoints": 16,
            "siblingPoints": 11,
            "points": 27,
            "calculatedScore": 87.5,
            "members": 211,
            "rate": 12.796208530805686,
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
      "asOf": "2026-11-20",
      "definition": "member-master-admission-date-annual-v1",
      "fiscalYear": "2026",
      "futureAdmissionCount": 0,
      "reEnrollmentPolicy": "including-reenrollment",
      "teams": {
        "A": {
          "cumulative": 137
        },
        "B": {
          "cumulative": 114
        },
        "C": {
          "cumulative": 87
        },
        "D": {
          "cumulative": 82
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
      "members": 350,
      "monthlyDelta": -1,
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
        "admissionRate": 88.3,
        "admissionPreviousRate": 83.8,
        "admissionYoYDelta": 4.5,
        "eventRate": 21.4,
        "repeatRate": 45.6,
        "referralPoints": 18,
        "referralRate": 5.142857142857142,
        "referralMembers": 350
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-21",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 642,
              "retained": 633,
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
              "sample": 597,
              "retained": 566,
              "exited": 31,
              "rate": 94.8,
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
              "sample": 425,
              "retained": 246,
              "exited": 179,
              "rate": 57.9,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 286,
              "retained": 118,
              "exited": 168,
              "rate": 41.3,
              "relativeScore": 75,
              "scored": true
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 170,
              "retained": 52,
              "exited": 118,
              "rate": 30.6,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 41,
              "retained": 5,
              "exited": 36,
              "rate": 12.2,
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
          "trials": 145,
          "admissions": 128,
          "rate": 88.3,
          "previousRate": 83.8,
          "yoyDelta": 4.5,
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
          "asOf": "2026-11-21",
          "trialPoints": 8,
          "siblingPoints": 10,
          "points": 18,
          "calculatedScore": 30,
          "members": 350,
          "rate": 5.142857142857142,
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
      "note": "評価根拠｜【定着力】3か月 633/642人継続・非継続9人（98.6%・相対点62.5）、6か月 566/597人継続・非継続31人（94.8%・相対点87.5）、12か月 422/511人継続・非継続89人（82.6%・相対点87.5）、2年 246/425人継続・非継続179人（57.9%・相対点62.5）、3年 118/286人継続・非継続168人（41.3%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果75点です。 【年度入会力】145人体験のうち128人入会、年度の体験→入会率88.3%（前年同期間83.8%）。全チームの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.4%と継続参加率45.6%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。全チームの相対評価で88点です。 【紹介力】2026年度の紹介18ポイント（紹介体験8人・兄弟姉妹入会10人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は18pt÷基準日の会員350人＝5.14％。人数相対点37.5×70％＋紹介率相対点12.5×30％で30点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月20日の18→18ポイント。"
    },
    {
      "id": "B",
      "rank": 2,
      "members": 321,
      "monthlyDelta": -1,
      "overall": 59,
      "status": "算出済",
      "metrics": {
        "retention": 45,
        "admission": 63,
        "event": 78,
        "growth": 63,
        "family": 63
      },
      "benchmark": {
        "retention12mRate": 79.7,
        "retention12mSample": 413,
        "admissionRate": 75.2,
        "admissionPreviousRate": 83.5,
        "admissionYoYDelta": -8.3,
        "eventRate": 21.8,
        "repeatRate": 46.9,
        "referralPoints": 21,
        "referralRate": 6.5420560747663545,
        "referralMembers": 321
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-21",
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
              "sample": 496,
              "retained": 466,
              "exited": 30,
              "rate": 94,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 413,
              "retained": 329,
              "exited": 84,
              "rate": 79.7,
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
              "sample": 195,
              "retained": 65,
              "exited": 130,
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
          "weightedIndex": 45
        },
        "admission": {
          "trials": 149,
          "admissions": 112,
          "rate": 75.2,
          "previousRate": 83.5,
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
          "asOf": "2026-11-21",
          "trialPoints": 8,
          "siblingPoints": 13,
          "points": 21,
          "calculatedScore": 62.5,
          "members": 321,
          "rate": 6.5420560747663545,
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
      "note": "評価根拠｜【定着力】3か月 508/515人継続・非継続7人（98.6%・相対点87.5）、6か月 466/496人継続・非継続30人（94.0%・相対点62.5）、12か月 329/413人継続・非継続84人（79.7%・相対点62.5）、2年 188/325人継続・非継続137人（57.8%・相対点37.5）、3年 65/195人継続・非継続130人（33.3%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果45点です。 【年度入会力】149人体験のうち112人入会、年度の体験→入会率75.2%（前年同期間83.5%）。全チームの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.8%と継続参加率46.9%を、参加70%・継続30%で統合して78点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。全チームの相対評価で63点です。 【紹介力】2026年度の紹介21ポイント（紹介体験8人・兄弟姉妹入会13人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は21pt÷基準日の会員321人＝6.54％。人数相対点62.5×70％＋紹介率相対点62.5×30％で63点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月20日の21→21ポイント。"
    },
    {
      "id": "C",
      "rank": 4,
      "members": 228,
      "monthlyDelta": 0,
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
        "retention12mRate": 72.3,
        "retention12mSample": 303,
        "admissionRate": 66.4,
        "admissionPreviousRate": 65.6,
        "admissionYoYDelta": 0.8,
        "eventRate": 12.4,
        "repeatRate": 38.4,
        "referralPoints": 14,
        "referralRate": 6.140350877192982,
        "referralMembers": 228
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-21",
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
              "sample": 352,
              "retained": 316,
              "exited": 36,
              "rate": 89.8,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 303,
              "retained": 219,
              "exited": 84,
              "rate": 72.3,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 187,
              "retained": 84,
              "exited": 103,
              "rate": 44.9,
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
          "trials": 113,
          "admissions": 75,
          "rate": 66.4,
          "previousRate": 65.6,
          "yoyDelta": 0.8,
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
          "asOf": "2026-11-21",
          "trialPoints": 7,
          "siblingPoints": 7,
          "points": 14,
          "calculatedScore": 20,
          "members": 228,
          "rate": 6.140350877192982,
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
      "note": "評価根拠｜【定着力】3か月 369/380人継続・非継続11人（97.1%・相対点37.5）、6か月 316/352人継続・非継続36人（89.8%・相対点12.5）、12か月 219/303人継続・非継続84人（72.3%・相対点12.5）、2年 84/187人継続・非継続103人（44.9%・相対点12.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果15点です。 【年度入会力】113人体験のうち75人入会、年度の体験→入会率66.4%（前年同期間65.6%）。全チームの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率12.4%と継続参加率38.4%を、参加70%・継続30%で統合して52点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。全チームの相対評価で38点です。 【紹介力】2026年度の紹介14ポイント（紹介体験7人・兄弟姉妹入会7人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は14pt÷基準日の会員228人＝6.14％。人数相対点12.5×70％＋紹介率相対点37.5×30％で20点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月20日の14→14ポイント。"
    },
    {
      "id": "D",
      "rank": 3,
      "members": 212,
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
        "retention12mRate": 79.4,
        "retention12mSample": 180,
        "admissionRate": 64.9,
        "admissionPreviousRate": 62.8,
        "admissionYoYDelta": 2.1,
        "eventRate": 11.9,
        "repeatRate": 37.9,
        "referralPoints": 27,
        "referralRate": 12.735849056603774,
        "referralMembers": 212
      },
      "note": "評価根拠｜【定着力】3か月 241/249人継続・非継続8人（96.8%・相対点12.5）、6か月 210/228人継続・非継続18人（92.1%・相対点37.5）、12か月 143/180人継続・非継続37人（79.4%・相対点37.5）、2年 25/39人継続・非継続14人（64.1%・相対点87.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重く全チームの相対順位を加重した結果55点です。 【年度入会力】114人体験のうち74人入会、年度の体験→入会率64.9%（前年同期間62.8%）。全チームの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.9%と継続参加率37.9%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。全チームの相対評価で13点です。 【紹介力】2026年度の紹介27ポイント（紹介体験16人・兄弟姉妹入会11人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は27pt÷基準日の会員212人＝12.74％。人数相対点87.5×70％＋紹介率相対点87.5×30％で88点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月20日の27→27ポイント。\n運用注記｜イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-21",
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
              "sample": 228,
              "retained": 210,
              "exited": 18,
              "rate": 92.1,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 180,
              "retained": 143,
              "exited": 37,
              "rate": 79.4,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 39,
              "retained": 25,
              "exited": 14,
              "rate": 64.1,
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
          "trials": 114,
          "admissions": 74,
          "rate": 64.9,
          "previousRate": 62.8,
          "yoyDelta": 2.1,
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
          "asOf": "2026-11-21",
          "trialPoints": 16,
          "siblingPoints": 11,
          "points": 27,
          "calculatedScore": 87.5,
          "members": 212,
          "rate": 12.735849056603774,
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
    "asOf": "2026-11-21",
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
        4,
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
        5,
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
        8,
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
        11,
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
      28,
      null,
      null,
      null,
      null
    ]
  },
  "withdrawalHistory": {
    "definition": "member-retirement-explicit-stop-detected-v1",
    "asOf": "2026-11-21",
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
    "asOf": "2026-11-21",
    "fiscalYear": "2026",
    "teams": {
      "A": {
        "trials": 145,
        "admissions": 128,
        "previousTrials": 74,
        "previousAdmissions": 62
      },
      "B": {
        "trials": 149,
        "admissions": 112,
        "previousTrials": 91,
        "previousAdmissions": 76
      },
      "C": {
        "trials": 113,
        "admissions": 75,
        "previousTrials": 122,
        "previousAdmissions": 80
      },
      "D": {
        "trials": 114,
        "admissions": 74,
        "previousTrials": 215,
        "previousAdmissions": 135
      }
    }
  },
  "retentionAvailability": {
    "definition": "historical-retained-forward-confirmed-v2",
    "asOf": "2026-11-21",
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
    "asOf": "2026-11-21",
    "status": "ok",
    "overall": {
      "members": 1111,
      "grade": {
        "preschool": 0,
        "k1": 7,
        "k2": 49,
        "k3": 54,
        "p1": 151,
        "p2": 184,
        "p3": 173,
        "p4": 173,
        "p5": 167,
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
        "male": 485,
        "female": 624,
        "other": 0,
        "unknown": 2
      },
      "tenure": {
        "lt3": 112,
        "m3to6": 103,
        "m6to12": 236,
        "y1to2": 290,
        "y2to3": 231,
        "y3to5": 130,
        "y5plus": 8,
        "unknown": 1
      },
      "age": {
        "lt5": 20,
        "a5to6": 142,
        "a7to9": 521,
        "a10to12": 382,
        "a13to15": 44,
        "a16plus": 1,
        "unknown": 1
      },
      "status": {
        "active": 1062,
        "paused": 28,
        "scheduled": 20,
        "unknown": 1
      },
      "entryYear": {
        "2021": 13,
        "2022": 31,
        "2023": 117,
        "2024": 251,
        "2025": 313,
        "2026": 385,
        "unknown": 1
      },
      "summary": {
        "knownTenure": 1110,
        "tenureMonthsTotal": 19827,
        "meanTenureMonths": 17.9,
        "medianTenureMonths": 16
      }
    },
    "teams": {
      "A": {
        "members": 350,
        "grade": {
          "preschool": 0,
          "k1": 4,
          "k2": 17,
          "k3": 10,
          "p1": 53,
          "p2": 49,
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
          "male": 163,
          "female": 187,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 33,
          "m3to6": 43,
          "m6to12": 79,
          "y1to2": 57,
          "y2to3": 60,
          "y3to5": 70,
          "y5plus": 8,
          "unknown": 0
        },
        "age": {
          "lt5": 10,
          "a5to6": 38,
          "a7to9": 159,
          "a10to12": 121,
          "a13to15": 21,
          "a16plus": 1,
          "unknown": 0
        },
        "status": {
          "active": 336,
          "paused": 12,
          "scheduled": 2,
          "unknown": 0
        },
        "entryYear": {
          "2021": 13,
          "2022": 31,
          "2023": 44,
          "2024": 64,
          "2025": 71,
          "2026": 127
        },
        "summary": {
          "knownTenure": 350,
          "tenureMonthsTotal": 7289,
          "meanTenureMonths": 20.8,
          "medianTenureMonths": 16.5
        }
      },
      "B": {
        "members": 321,
        "grade": {
          "preschool": 0,
          "k1": 1,
          "k2": 13,
          "k3": 25,
          "p1": 38,
          "p2": 39,
          "p3": 50,
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
          "male": 139,
          "female": 181,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 31,
          "m3to6": 18,
          "m6to12": 74,
          "y1to2": 64,
          "y2to3": 73,
          "y3to5": 60,
          "y5plus": 0,
          "unknown": 1
        },
        "age": {
          "lt5": 7,
          "a5to6": 50,
          "a7to9": 132,
          "a10to12": 121,
          "a13to15": 10,
          "a16plus": 0,
          "unknown": 1
        },
        "status": {
          "active": 313,
          "paused": 0,
          "scheduled": 7,
          "unknown": 1
        },
        "entryYear": {
          "2023": 73,
          "2024": 71,
          "2025": 68,
          "2026": 108,
          "unknown": 1
        },
        "summary": {
          "knownTenure": 320,
          "tenureMonthsTotal": 6200,
          "meanTenureMonths": 19.4,
          "medianTenureMonths": 17.5
        }
      },
      "C": {
        "members": 228,
        "grade": {
          "preschool": 0,
          "k1": 0,
          "k2": 4,
          "k3": 10,
          "p1": 36,
          "p2": 47,
          "p3": 31,
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
          "male": 110,
          "female": 118,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 19,
          "m3to6": 22,
          "m6to12": 42,
          "y1to2": 71,
          "y2to3": 74,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 1,
          "a5to6": 20,
          "a7to9": 119,
          "a10to12": 79,
          "a13to15": 9,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 210,
          "paused": 12,
          "scheduled": 6,
          "unknown": 0
        },
        "entryYear": {
          "2024": 88,
          "2025": 65,
          "2026": 75
        },
        "summary": {
          "knownTenure": 228,
          "tenureMonthsTotal": 3665,
          "meanTenureMonths": 16.1,
          "medianTenureMonths": 16
        }
      },
      "D": {
        "members": 212,
        "grade": {
          "preschool": 0,
          "k1": 2,
          "k2": 15,
          "k3": 9,
          "p1": 24,
          "p2": 49,
          "p3": 34,
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
          "male": 73,
          "female": 138,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 29,
          "m3to6": 20,
          "m6to12": 41,
          "y1to2": 98,
          "y2to3": 24,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 2,
          "a5to6": 34,
          "a7to9": 111,
          "a10to12": 61,
          "a13to15": 4,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 203,
          "paused": 4,
          "scheduled": 5,
          "unknown": 0
        },
        "entryYear": {
          "2024": 28,
          "2025": 109,
          "2026": 75
        },
        "summary": {
          "knownTenure": 212,
          "tenureMonthsTotal": 2673,
          "meanTenureMonths": 12.6,
          "medianTenureMonths": 14
        }
      }
    }
  },
  "admissionConversionHistory": {
    "status": "ok",
    "definition": "trial-attendance-fiscal-monthly-v1",
    "asOf": "2026-11-21",
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
          14,
          3,
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
          13,
          3,
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
          5,
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
          3,
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
          7,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          22,
          23,
          8,
          6,
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
          7,
          2,
          11,
          13,
          11,
          null,
          null,
          null,
          null
        ],
        "admissions": [
          23,
          15,
          5,
          5,
          2,
          11,
          5,
          8,
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
        44,
        9,
        51,
        58,
        26,
        null,
        null,
        null,
        null
      ],
      "admissions": [
        127,
        82,
        34,
        39,
        7,
        45,
        36,
        19,
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
    "asOf": "2026-11-21",
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
        "referral": 6,
        "other": 0,
        "unknown": 0,
        "total": 6
      },
      "E": {
        "flyer": 9,
        "referral": 2,
        "other": 0,
        "unknown": 0,
        "total": 11
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
            "referral": 6,
            "other": 0,
            "unknown": 0,
            "total": 6
          },
          "E": {
            "flyer": 9,
            "referral": 2,
            "other": 0,
            "unknown": 0,
            "total": 11
          }
        }
      }
    ]
  },
  "eTeam": {
    "asOf": "2026-11-21",
    "members": 5,
    "allMembers": 1116,
    "definition": "trial-attendance-fiscal-ytd-v1",
    "annual": {
      "trials": 12,
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
      "asOf": "2026-11-21",
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
        "trialPoints": 2,
        "siblingPoints": 0,
        "points": 2,
        "members": 5,
        "rate": 40,
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
        "asOf": "2026-11-21",
        "status": "ok",
        "count": 0
      },
      "admissionHistory": {
        "definition": "member-master-admission-date-monthly-v1",
        "asOf": "2026-11-21",
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
            4,
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
            5,
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
            8,
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
            11,
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
          33,
          null,
          null,
          null,
          null
        ]
      },
      "withdrawalHistory": {
        "definition": "member-retirement-explicit-stop-detected-v1",
        "asOf": "2026-11-21",
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
        "asOf": "2026-11-21",
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
              14,
              3,
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
              13,
              3,
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
              5,
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
              3,
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
              7,
              null,
              null,
              null,
              null
            ],
            "admissions": [
              22,
              23,
              8,
              6,
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
              7,
              2,
              11,
              13,
              11,
              null,
              null,
              null,
              null
            ],
            "admissions": [
              23,
              15,
              5,
              5,
              2,
              11,
              5,
              8,
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
              12,
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
            44,
            9,
            51,
            58,
            38,
            null,
            null,
            null,
            null
          ],
          "admissions": [
            127,
            82,
            34,
            39,
            7,
            45,
            36,
            24,
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
        "asOf": "2026-11-21",
        "status": "ok",
        "overall": {
          "members": 1116,
          "grade": {
            "preschool": 0,
            "k1": 8,
            "k2": 49,
            "k3": 54,
            "p1": 152,
            "p2": 184,
            "p3": 175,
            "p4": 174,
            "p5": 167,
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
            "male": 487,
            "female": 627,
            "other": 0,
            "unknown": 2
          },
          "tenure": {
            "lt3": 117,
            "m3to6": 103,
            "m6to12": 236,
            "y1to2": 290,
            "y2to3": 231,
            "y3to5": 130,
            "y5plus": 8,
            "unknown": 1
          },
          "age": {
            "lt5": 21,
            "a5to6": 142,
            "a7to9": 525,
            "a10to12": 382,
            "a13to15": 44,
            "a16plus": 1,
            "unknown": 1
          },
          "status": {
            "active": 1067,
            "paused": 28,
            "scheduled": 20,
            "unknown": 1
          },
          "entryYear": {
            "2021": 13,
            "2022": 31,
            "2023": 117,
            "2024": 251,
            "2025": 313,
            "2026": 390,
            "unknown": 1
          },
          "summary": {
            "knownTenure": 1115,
            "tenureMonthsTotal": 19827,
            "meanTenureMonths": 17.8,
            "medianTenureMonths": 16
          }
        },
        "teams": {
          "A": {
            "members": 350,
            "grade": {
              "preschool": 0,
              "k1": 4,
              "k2": 17,
              "k3": 10,
              "p1": 53,
              "p2": 49,
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
              "male": 163,
              "female": 187,
              "other": 0,
              "unknown": 0
            },
            "tenure": {
              "lt3": 33,
              "m3to6": 43,
              "m6to12": 79,
              "y1to2": 57,
              "y2to3": 60,
              "y3to5": 70,
              "y5plus": 8,
              "unknown": 0
            },
            "age": {
              "lt5": 10,
              "a5to6": 38,
              "a7to9": 159,
              "a10to12": 121,
              "a13to15": 21,
              "a16plus": 1,
              "unknown": 0
            },
            "status": {
              "active": 336,
              "paused": 12,
              "scheduled": 2,
              "unknown": 0
            },
            "entryYear": {
              "2021": 13,
              "2022": 31,
              "2023": 44,
              "2024": 64,
              "2025": 71,
              "2026": 127
            },
            "summary": {
              "knownTenure": 350,
              "tenureMonthsTotal": 7289,
              "meanTenureMonths": 20.8,
              "medianTenureMonths": 16.5
            }
          },
          "B": {
            "members": 321,
            "grade": {
              "preschool": 0,
              "k1": 1,
              "k2": 13,
              "k3": 25,
              "p1": 38,
              "p2": 39,
              "p3": 50,
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
              "male": 139,
              "female": 181,
              "other": 0,
              "unknown": 1
            },
            "tenure": {
              "lt3": 31,
              "m3to6": 18,
              "m6to12": 74,
              "y1to2": 64,
              "y2to3": 73,
              "y3to5": 60,
              "y5plus": 0,
              "unknown": 1
            },
            "age": {
              "lt5": 7,
              "a5to6": 50,
              "a7to9": 132,
              "a10to12": 121,
              "a13to15": 10,
              "a16plus": 0,
              "unknown": 1
            },
            "status": {
              "active": 313,
              "paused": 0,
              "scheduled": 7,
              "unknown": 1
            },
            "entryYear": {
              "2023": 73,
              "2024": 71,
              "2025": 68,
              "2026": 108,
              "unknown": 1
            },
            "summary": {
              "knownTenure": 320,
              "tenureMonthsTotal": 6200,
              "meanTenureMonths": 19.4,
              "medianTenureMonths": 17.5
            }
          },
          "C": {
            "members": 228,
            "grade": {
              "preschool": 0,
              "k1": 0,
              "k2": 4,
              "k3": 10,
              "p1": 36,
              "p2": 47,
              "p3": 31,
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
              "male": 110,
              "female": 118,
              "other": 0,
              "unknown": 0
            },
            "tenure": {
              "lt3": 19,
              "m3to6": 22,
              "m6to12": 42,
              "y1to2": 71,
              "y2to3": 74,
              "y3to5": 0,
              "y5plus": 0,
              "unknown": 0
            },
            "age": {
              "lt5": 1,
              "a5to6": 20,
              "a7to9": 119,
              "a10to12": 79,
              "a13to15": 9,
              "a16plus": 0,
              "unknown": 0
            },
            "status": {
              "active": 210,
              "paused": 12,
              "scheduled": 6,
              "unknown": 0
            },
            "entryYear": {
              "2024": 88,
              "2025": 65,
              "2026": 75
            },
            "summary": {
              "knownTenure": 228,
              "tenureMonthsTotal": 3665,
              "meanTenureMonths": 16.1,
              "medianTenureMonths": 16
            }
          },
          "D": {
            "members": 212,
            "grade": {
              "preschool": 0,
              "k1": 2,
              "k2": 15,
              "k3": 9,
              "p1": 24,
              "p2": 49,
              "p3": 34,
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
              "male": 73,
              "female": 138,
              "other": 0,
              "unknown": 1
            },
            "tenure": {
              "lt3": 29,
              "m3to6": 20,
              "m6to12": 41,
              "y1to2": 98,
              "y2to3": 24,
              "y3to5": 0,
              "y5plus": 0,
              "unknown": 0
            },
            "age": {
              "lt5": 2,
              "a5to6": 34,
              "a7to9": 111,
              "a10to12": 61,
              "a13to15": 4,
              "a16plus": 0,
              "unknown": 0
            },
            "status": {
              "active": 203,
              "paused": 4,
              "scheduled": 5,
              "unknown": 0
            },
            "entryYear": {
              "2024": 28,
              "2025": 109,
              "2026": 75
            },
            "summary": {
              "knownTenure": 212,
              "tenureMonthsTotal": 2673,
              "meanTenureMonths": 12.6,
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
      "asOf": "2026-11-20",
      "team": {
        "id": "E",
        "members": 5,
        "monthlyDelta": 5,
        "rank": null,
        "overall": 0,
        "status": "算出済",
        "metrics": {
          "retention": null,
          "admission": 41.66666666666667,
          "growth": 0,
          "event": null,
          "family": 40
        },
        "benchmark": {
          "retention12mRate": null,
          "retention12mSample": 0,
          "admissionRate": 41.66666666666667,
          "admissionPreviousRate": null,
          "admissionYoYDelta": null,
          "eventRate": null,
          "repeatRate": null,
          "referralPoints": 2,
          "referralRate": 40,
          "referralMembers": 5
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-20",
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
            "trials": 12,
            "admissions": 5,
            "previousTrials": 0,
            "previousAdmissions": 0,
            "rate": 41.66666666666667,
            "previousRate": null,
            "relativeScore": 41.66666666666667
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
            "trialPoints": 2,
            "siblingPoints": 0,
            "points": 2,
            "members": 5,
            "rate": 40,
            "weights": {
              "points": 70,
              "rate": 30
            },
            "denominatorBasis": "operational-members-at-asof",
            "fiscalYear": "2026",
            "asOf": "2026-11-20"
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
