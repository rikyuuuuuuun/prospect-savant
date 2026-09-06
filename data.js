window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-09-06-0730",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-09-06",
  "asOfLabel": "2026年9月6日",
  "admissions": {
    "asOf": "2026-09-06",
    "definition": "member-master-admission-date-annual-v1",
    "fiscalYear": "2026",
    "futureAdmissionCount": 0,
    "reEnrollmentPolicy": "including-reenrollment",
    "teams": {
      "A": {
        "cumulative": 106
      },
      "B": {
        "cumulative": 88
      },
      "C": {
        "cumulative": 68
      },
      "D": {
        "cumulative": 54
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1054,
    "monthlyDelta": -4,
    "admissionRate": 73,
    "admissionPreviousRate": 68.5,
    "admissionYoYDelta": 4.3,
    "latestEventParticipants": 124
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-09-05",
    "previousAsOfLabel": "2026年9月5日",
    "headline": {
      "members": 1051,
      "monthlyDelta": -7,
      "admissionRate": 73,
      "admissionPreviousRate": 68.5,
      "admissionYoYDelta": 4.3,
      "latestEventParticipants": 124
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 334,
        "overall": 73,
        "metrics": {
          "retention": 72,
          "admission": 88,
          "event": 66,
          "growth": 88,
          "family": 47
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-09-05",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 602,
                "retained": 593,
                "exited": 9,
                "rate": 98.5,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 538,
                "retained": 511,
                "exited": 27,
                "rate": 95,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 496,
                "retained": 409,
                "exited": 87,
                "rate": 82.5,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 410,
                "retained": 238,
                "exited": 172,
                "rate": 58,
                "relativeScore": 50,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 272,
                "retained": 113,
                "exited": 159,
                "rate": 41.5,
                "relativeScore": 75,
                "scored": true
              },
              {
                "key": "y4",
                "label": "4年",
                "months": 48,
                "weight": 6,
                "sample": 144,
                "retained": 42,
                "exited": 102,
                "rate": 29.2,
                "relativeScore": null,
                "scored": false
              },
              {
                "key": "y5",
                "label": "5年",
                "months": 60,
                "weight": 7,
                "sample": 2,
                "retained": null,
                "exited": null,
                "rate": 100,
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
            "weightedIndex": 71.7
          },
          "admission": {
            "trials": 108,
            "admissions": 93,
            "rate": 86.1,
            "previousRate": 82.7,
            "yoyDelta": 3.4,
            "relativeScore": 87.5
          },
          "event": {
            "averageRate": 18.8,
            "participationScore": 58.8,
            "repeatRate": 37.5,
            "repeatScore": 82.4,
            "score": 66,
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
            "components": {
              "sibling": {
                "key": "sibling",
                "label": "兄弟姉妹在籍世帯率",
                "numerator": null,
                "denominator": null,
                "rate": 26.3,
                "relativeScore": 37.5,
                "weight": 25
              },
              "retention2y": {
                "key": "retention2y",
                "label": "2年継続率",
                "numerator": null,
                "denominator": null,
                "rate": 58,
                "relativeScore": 50,
                "weight": 20
              },
              "reentry": {
                "key": "reentry",
                "label": "再入会率",
                "numerator": null,
                "denominator": null,
                "rate": 0.3,
                "relativeScore": 62.5,
                "weight": 20
              },
              "eventRepeat": {
                "key": "eventRepeat",
                "label": "イベント継続参加率",
                "numerator": null,
                "denominator": null,
                "rate": 37.5,
                "relativeScore": 37.5,
                "weight": 15
              }
            },
            "calculatedScore": 46.9,
            "score": 47,
            "status": ""
          }
        }
      },
      {
        "id": "B",
        "rank": 2,
        "members": 307,
        "overall": 64,
        "metrics": {
          "retention": 57,
          "admission": 63,
          "event": 76,
          "growth": 63,
          "family": 71
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-09-05",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 498,
                "retained": 492,
                "exited": 6,
                "rate": 98.8,
                "relativeScore": 87.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 430,
                "retained": 405,
                "exited": 25,
                "rate": 94.2,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 391,
                "retained": 310,
                "exited": 81,
                "rate": 79.3,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 301,
                "retained": 175,
                "exited": 126,
                "rate": 58.1,
                "relativeScore": 83.3,
                "scored": true
              },
              {
                "key": "y3",
                "label": "3年",
                "months": 36,
                "weight": 5,
                "sample": 147,
                "retained": 44,
                "exited": 103,
                "rate": 29.9,
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
            "weightedIndex": 57.2
          },
          "admission": {
            "trials": 107,
            "admissions": 84,
            "rate": 78.5,
            "previousRate": 80.6,
            "yoyDelta": -2.1,
            "relativeScore": 62.5
          },
          "event": {
            "averageRate": 20.8,
            "participationScore": 65,
            "repeatRate": 45.5,
            "repeatScore": 100,
            "score": 76,
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
            "components": {
              "sibling": {
                "key": "sibling",
                "label": "兄弟姉妹在籍世帯率",
                "numerator": null,
                "denominator": null,
                "rate": 30.2,
                "relativeScore": 87.5,
                "weight": 25
              },
              "retention2y": {
                "key": "retention2y",
                "label": "2年継続率",
                "numerator": null,
                "denominator": null,
                "rate": 58.1,
                "relativeScore": 83.3,
                "weight": 20
              },
              "reentry": {
                "key": "reentry",
                "label": "再入会率",
                "numerator": null,
                "denominator": null,
                "rate": 0,
                "relativeScore": 25,
                "weight": 20
              },
              "eventRepeat": {
                "key": "eventRepeat",
                "label": "イベント継続参加率",
                "numerator": null,
                "denominator": null,
                "rate": 45.5,
                "relativeScore": 87.5,
                "weight": 15
              }
            },
            "calculatedScore": 70.8,
            "score": 71,
            "status": ""
          }
        }
      },
      {
        "id": "C",
        "rank": 3,
        "members": 222,
        "overall": 34,
        "metrics": {
          "retention": 17,
          "admission": 38,
          "event": 50,
          "growth": 38,
          "family": 42
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-09-05",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 367,
                "retained": 357,
                "exited": 10,
                "rate": 97.3,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 310,
                "retained": 278,
                "exited": 32,
                "rate": 89.7,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 273,
                "retained": 189,
                "exited": 84,
                "rate": 69.2,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 149,
                "retained": 70,
                "exited": 79,
                "rate": 47,
                "relativeScore": 16.7,
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
            "weightedIndex": 16.7
          },
          "admission": {
            "trials": 81,
            "admissions": 51,
            "rate": 63,
            "previousRate": 59.5,
            "yoyDelta": 3.4,
            "relativeScore": 37.5
          },
          "event": {
            "averageRate": 11.4,
            "participationScore": 35.7,
            "repeatRate": 38.3,
            "repeatScore": 84.1,
            "score": 50,
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
            "components": {
              "sibling": {
                "key": "sibling",
                "label": "兄弟姉妹在籍世帯率",
                "numerator": null,
                "denominator": null,
                "rate": 28.2,
                "relativeScore": 62.5,
                "weight": 25
              },
              "retention2y": {
                "key": "retention2y",
                "label": "2年継続率",
                "numerator": null,
                "denominator": null,
                "rate": 47,
                "relativeScore": 16.7,
                "weight": 20
              },
              "reentry": {
                "key": "reentry",
                "label": "再入会率",
                "numerator": null,
                "denominator": null,
                "rate": 0,
                "relativeScore": 25,
                "weight": 20
              },
              "eventRepeat": {
                "key": "eventRepeat",
                "label": "イベント継続参加率",
                "numerator": null,
                "denominator": null,
                "rate": 38.3,
                "relativeScore": 62.5,
                "weight": 15
              }
            },
            "calculatedScore": 41.7,
            "score": 42,
            "status": ""
          }
        }
      },
      {
        "id": "D",
        "rank": 4,
        "members": 188,
        "overall": 27,
        "metrics": {
          "retention": 33,
          "admission": 13,
          "event": 43,
          "growth": 13,
          "family": 38
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-09-05",
          "retention": {
            "periods": [
              {
                "key": "m3",
                "label": "3か月",
                "months": 3,
                "weight": 1,
                "sample": 234,
                "retained": 227,
                "exited": 7,
                "rate": 97,
                "relativeScore": 12.5,
                "scored": true
              },
              {
                "key": "m6",
                "label": "6か月",
                "months": 6,
                "weight": 2,
                "sample": 191,
                "retained": 178,
                "exited": 13,
                "rate": 93.2,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 147,
                "retained": 114,
                "exited": 33,
                "rate": 77.6,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "y2",
                "label": "2年",
                "months": 24,
                "weight": 4,
                "sample": 5,
                "retained": null,
                "exited": null,
                "rate": 100,
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
            "weightedIndex": 33.3
          },
          "admission": {
            "trials": 78,
            "admissions": 45,
            "rate": 57.7,
            "previousRate": 63.6,
            "yoyDelta": -5.9,
            "relativeScore": 12.5
          },
          "event": {
            "averageRate": 10.3,
            "participationScore": 32.4,
            "repeatRate": 31.1,
            "repeatScore": 68.5,
            "score": 43,
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
            "components": {
              "sibling": {
                "key": "sibling",
                "label": "兄弟姉妹在籍世帯率",
                "numerator": null,
                "denominator": null,
                "rate": 24,
                "relativeScore": 12.5,
                "weight": 25
              },
              "retention2y": {
                "key": "retention2y",
                "label": "2年継続率",
                "numerator": null,
                "denominator": null,
                "rate": null,
                "relativeScore": null,
                "weight": 20
              },
              "reentry": {
                "key": "reentry",
                "label": "再入会率",
                "numerator": null,
                "denominator": null,
                "rate": 1.7,
                "relativeScore": 87.5,
                "weight": 20
              },
              "eventRepeat": {
                "key": "eventRepeat",
                "label": "イベント継続参加率",
                "numerator": null,
                "denominator": null,
                "rate": 31.1,
                "relativeScore": 12.5,
                "weight": 15
              }
            },
            "calculatedScore": 37.5,
            "score": 38,
            "status": ""
          }
        }
      }
    ],
    "memberDefinition": {
      "id": "operational-person-v1",
      "label": "人物単位運用会員"
    },
    "admissions": {
      "asOf": "2026-09-05",
      "definition": "member-master-admission-date-annual-v1",
      "fiscalYear": "2026",
      "futureAdmissionCount": 0,
      "reEnrollmentPolicy": "including-reenrollment",
      "teams": {
        "A": {
          "cumulative": 106
        },
        "B": {
          "cumulative": 85
        },
        "C": {
          "cumulative": 68
        },
        "D": {
          "cumulative": 54
        }
      }
    },
    "metricDefinitions": {}
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
      "members": 334,
      "monthlyDelta": 1,
      "overall": 76,
      "status": "算出済",
      "metrics": {
        "retention": 72,
        "admission": 88,
        "event": 66,
        "growth": 88,
        "family": 64
      },
      "benchmark": {
        "retention12mRate": 82.5,
        "retention12mSample": 496,
        "admissionRate": 86.1,
        "admissionPreviousRate": 82.7,
        "admissionYoYDelta": 3.4,
        "eventRate": 18.8,
        "repeatRate": 37.5,
        "referralPoints": 9,
        "referralRate": 2.694610778443114,
        "referralMembers": 334
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-09-06",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 602,
              "retained": 593,
              "exited": 9,
              "rate": 98.5,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 538,
              "retained": 511,
              "exited": 27,
              "rate": 95,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 496,
              "retained": 409,
              "exited": 87,
              "rate": 82.5,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 410,
              "retained": 238,
              "exited": 172,
              "rate": 58,
              "relativeScore": 50,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 273,
              "retained": 113,
              "exited": 160,
              "rate": 41.4,
              "relativeScore": 75,
              "scored": true
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 144,
              "retained": 42,
              "exited": 102,
              "rate": 29.2,
              "relativeScore": null,
              "scored": false
            },
            {
              "key": "y5",
              "label": "5年",
              "months": 60,
              "weight": 7,
              "sample": 3,
              "retained": null,
              "exited": null,
              "rate": 66.7,
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
          "weightedIndex": 71.7
        },
        "admission": {
          "trials": 108,
          "admissions": 93,
          "rate": 86.1,
          "previousRate": 82.7,
          "yoyDelta": 3.4,
          "relativeScore": 87.5
        },
        "event": {
          "averageRate": 18.8,
          "participationScore": 58.8,
          "repeatRate": 37.5,
          "repeatScore": 82.4,
          "score": 66,
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
          "asOf": "2026-09-06",
          "trialPoints": 0,
          "siblingPoints": 9,
          "points": 9,
          "calculatedScore": 63.75,
          "members": 334,
          "rate": 2.694610778443114,
          "pointScore": 75,
          "rateScore": 37.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 593/602人継続・非継続9人（98.5%・相対点62.5）、6か月 511/538人継続・非継続27人（95.0%・相対点87.5）、12か月 409/496人継続・非継続87人（82.5%・相対点87.5）、2年 238/410人継続・非継続172人（58.0%・相対点50.0）、3年 113/273人継続・非継続160人（41.4%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果72点です。 【年度入会力】108人体験のうち93人入会、年度入会率86.1%（前年同期間82.7%）。A〜Dの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率18.8%と継続参加率37.5%を、参加70%・継続30%で統合して66点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。A〜Dの相対評価で88点です。 【紹介力】2026年度の紹介9ポイント（紹介体験0人・兄弟姉妹入会9人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は9pt÷基準日の会員334人＝2.69％。人数相対点75.0×70％＋紹介率相対点37.5×30％で64点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 定義や年度が異なる過去の点数とは比較しません。"
    },
    {
      "id": "B",
      "rank": 2,
      "members": 310,
      "monthlyDelta": 1,
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
        "retention12mSample": 391,
        "admissionRate": 78.5,
        "admissionPreviousRate": 80.6,
        "admissionYoYDelta": -2.1,
        "eventRate": 20.8,
        "repeatRate": 45.5,
        "referralPoints": 9,
        "referralRate": 2.903225806451613,
        "referralMembers": 310
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-09-06",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 498,
              "retained": 492,
              "exited": 6,
              "rate": 98.8,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 430,
              "retained": 405,
              "exited": 25,
              "rate": 94.2,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 391,
              "retained": 310,
              "exited": 81,
              "rate": 79.3,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 301,
              "retained": 175,
              "exited": 126,
              "rate": 58.1,
              "relativeScore": 83.3,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 147,
              "retained": 44,
              "exited": 103,
              "rate": 29.9,
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
          "weightedIndex": 57.2
        },
        "admission": {
          "trials": 107,
          "admissions": 84,
          "rate": 78.5,
          "previousRate": 80.6,
          "yoyDelta": -2.1,
          "relativeScore": 62.5
        },
        "event": {
          "averageRate": 20.8,
          "participationScore": 65,
          "repeatRate": 45.5,
          "repeatScore": 100,
          "score": 76,
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
          "asOf": "2026-09-06",
          "trialPoints": 0,
          "siblingPoints": 9,
          "points": 9,
          "calculatedScore": 71.25,
          "members": 310,
          "rate": 2.903225806451613,
          "pointScore": 75,
          "rateScore": 62.5,
          "weights": {
            "points": 70,
            "rate": 30
          },
          "status": "算出可能",
          "denominatorBasis": "operational-members-at-asof"
        }
      },
      "note": "評価根拠｜【定着力】3か月 492/498人継続・非継続6人（98.8%・相対点87.5）、6か月 405/430人継続・非継続25人（94.2%・相対点62.5）、12か月 310/391人継続・非継続81人（79.3%・相対点62.5）、2年 175/301人継続・非継続126人（58.1%・相対点83.3）、3年 44/147人継続・非継続103人（29.9%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果57点です。 【年度入会力】107人体験のうち84人入会、年度入会率78.5%（前年同期間80.6%）。A〜Dの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率20.8%と継続参加率45.5%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。A〜Dの相対評価で63点です。 【紹介力】2026年度の紹介9ポイント（紹介体験0人・兄弟姉妹入会9人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は9pt÷基準日の会員310人＝2.90％。人数相対点75.0×70％＋紹介率相対点62.5×30％で71点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 定義や年度が異なる過去の点数とは比較しません。"
    },
    {
      "id": "C",
      "rank": 3,
      "members": 222,
      "monthlyDelta": -2,
      "overall": 29,
      "status": "算出済",
      "metrics": {
        "retention": 17,
        "admission": 38,
        "event": 50,
        "growth": 38,
        "family": 13
      },
      "benchmark": {
        "retention12mRate": 69.3,
        "retention12mSample": 274,
        "admissionRate": 63,
        "admissionPreviousRate": 59.5,
        "admissionYoYDelta": 3.4,
        "eventRate": 11.4,
        "repeatRate": 38.3,
        "referralPoints": 5,
        "referralRate": 2.2522522522522523,
        "referralMembers": 222
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-09-06",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 367,
              "retained": 357,
              "exited": 10,
              "rate": 97.3,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 310,
              "retained": 278,
              "exited": 32,
              "rate": 89.7,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 274,
              "retained": 190,
              "exited": 84,
              "rate": 69.3,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 149,
              "retained": 70,
              "exited": 79,
              "rate": 47,
              "relativeScore": 16.7,
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
          "weightedIndex": 16.7
        },
        "admission": {
          "trials": 81,
          "admissions": 51,
          "rate": 63,
          "previousRate": 59.5,
          "yoyDelta": 3.4,
          "relativeScore": 37.5
        },
        "event": {
          "averageRate": 11.4,
          "participationScore": 35.7,
          "repeatRate": 38.3,
          "repeatScore": 84.1,
          "score": 50,
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
          "asOf": "2026-09-06",
          "trialPoints": 0,
          "siblingPoints": 5,
          "points": 5,
          "calculatedScore": 12.5,
          "members": 222,
          "rate": 2.2522522522522523,
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
      "note": "評価根拠｜【定着力】3か月 357/367人継続・非継続10人（97.3%・相対点37.5）、6か月 278/310人継続・非継続32人（89.7%・相対点12.5）、12か月 190/274人継続・非継続84人（69.3%・相対点12.5）、2年 70/149人継続・非継続79人（47.0%・相対点16.7）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果17点です。 【年度入会力】81人体験のうち51人入会、年度入会率63.0%（前年同期間59.5%）。A〜Dの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.4%と継続参加率38.3%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。A〜Dの相対評価で38点です。 【紹介力】2026年度の紹介5ポイント（紹介体験0人・兄弟姉妹入会5人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は5pt÷基準日の会員222人＝2.25％。人数相対点12.5×70％＋紹介率相対点12.5×30％で13点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 定義や年度が異なる過去の点数とは比較しません。"
    },
    {
      "id": "D",
      "rank": 3,
      "members": 188,
      "monthlyDelta": -4,
      "overall": 29,
      "status": "算出済",
      "metrics": {
        "retention": 33,
        "admission": 13,
        "event": 43,
        "growth": 13,
        "family": 53
      },
      "benchmark": {
        "retention12mRate": 77.6,
        "retention12mSample": 147,
        "admissionRate": 57.7,
        "admissionPreviousRate": 63.6,
        "admissionYoYDelta": -5.9,
        "eventRate": 10.3,
        "repeatRate": 31.1,
        "referralPoints": 8,
        "referralRate": 4.25531914893617,
        "referralMembers": 188
      },
      "note": "評価根拠｜【定着力】3か月 227/234人継続・非継続7人（97.0%・相対点12.5）、6か月 178/191人継続・非継続13人（93.2%・相対点37.5）、12か月 114/147人継続・非継続33人（77.6%・相対点37.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果33点です。 【年度入会力】78人体験のうち45人入会、年度入会率57.7%（前年同期間63.6%）。A〜Dの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率10.3%と継続参加率31.1%を、参加70%・継続30%で統合して43点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。A〜Dの相対評価で13点です。 【紹介力】2026年度の紹介8ポイント（紹介体験1人・兄弟姉妹入会7人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は8pt÷基準日の会員188人＝4.26％。人数相対点37.5×70％＋紹介率相対点87.5×30％で53点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 定義や年度が異なる過去の点数とは比較しません。\n運用注記｜イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-09-06",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 234,
              "retained": 227,
              "exited": 7,
              "rate": 97,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "m6",
              "label": "6か月",
              "months": 6,
              "weight": 2,
              "sample": 191,
              "retained": 178,
              "exited": 13,
              "rate": 93.2,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 147,
              "retained": 114,
              "exited": 33,
              "rate": 77.6,
              "relativeScore": 37.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 5,
              "retained": null,
              "exited": null,
              "rate": 100,
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
          "weightedIndex": 33.3
        },
        "admission": {
          "trials": 78,
          "admissions": 45,
          "rate": 57.7,
          "previousRate": 63.6,
          "yoyDelta": -5.9,
          "relativeScore": 12.5
        },
        "event": {
          "averageRate": 10.3,
          "participationScore": 32.4,
          "repeatRate": 31.1,
          "repeatScore": 68.5,
          "score": 43,
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
          "asOf": "2026-09-06",
          "trialPoints": 1,
          "siblingPoints": 7,
          "points": 8,
          "calculatedScore": 52.5,
          "members": 188,
          "rate": 4.25531914893617,
          "pointScore": 37.5,
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
    "previousAsOf": "2026-08-31",
    "previousAsOfLabel": "2026年8月31日",
    "headline": {
      "members": 1058
    },
    "teams": [
      {
        "id": "A",
        "members": 333
      },
      {
        "id": "B",
        "members": 309
      },
      {
        "id": "C",
        "members": 224
      },
      {
        "id": "D",
        "members": 192
      }
    ],
    "memberDefinition": {
      "id": "operational-person-v1",
      "label": "人物単位運用会員"
    }
  },
  "memberDeltaDefinition": "previous-month-end-v1",
  "metricDefinitions": {
    "family": "referral-volume-rate-v2"
  },
  "admissionHistory": {
    "definition": "member-master-admission-date-monthly-v1",
    "asOf": "2026-09-06",
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
        4,
        null,
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
        3,
        null,
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
        0,
        null,
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
        0,
        null,
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
      7,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  }
});
