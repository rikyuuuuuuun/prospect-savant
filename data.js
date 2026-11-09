window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-11-10-0730-trial-ytd-v1",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-11-10",
  "asOfLabel": "2026年11月10日",
  "admissions": {
    "asOf": "2026-11-10",
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
        "cumulative": 83
      },
      "D": {
        "cumulative": 76
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1091,
    "monthlyDelta": -16,
    "admissionRate": 74.5,
    "admissionPreviousRate": 70.4,
    "admissionYoYDelta": 4.1,
    "latestEventParticipants": 224
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-11-09",
    "previousAsOfLabel": "2026年11月9日",
    "headline": {
      "members": 1090,
      "monthlyDelta": -17,
      "admissionRate": 74.6,
      "admissionPreviousRate": 70.1,
      "admissionYoYDelta": 4.5,
      "latestEventParticipants": 224
    },
    "teams": [
      {
        "id": "A",
        "rank": 1,
        "members": 347,
        "overall": 74,
        "metrics": {
          "retention": 75,
          "admission": 88,
          "event": 76,
          "growth": 88,
          "family": 38
        },
        "metricEvidence": {
          "version": "metric-evidence-v1",
          "asOf": "2026-11-09",
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
                "sample": 574,
                "retained": 547,
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
                "sample": 508,
                "retained": 421,
                "exited": 87,
                "rate": 82.9,
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
            "previousRate": 82.9,
            "yoyDelta": 5.1,
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
            "asOf": "2026-11-09",
            "trialPoints": 7,
            "siblingPoints": 9,
            "points": 16,
            "calculatedScore": 37.5,
            "members": 347,
            "rate": 4.610951008645533,
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
          "asOf": "2026-11-09",
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
                "sample": 481,
                "retained": 454,
                "exited": 27,
                "rate": 94.4,
                "relativeScore": 62.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 410,
                "retained": 326,
                "exited": 84,
                "rate": 79.5,
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
            "trials": 145,
            "admissions": 110,
            "rate": 75.9,
            "previousRate": 83.1,
            "yoyDelta": -7.3,
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
            "asOf": "2026-11-09",
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
        "members": 223,
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
          "asOf": "2026-11-09",
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
                "sample": 340,
                "retained": 306,
                "exited": 34,
                "rate": 90,
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
                "sample": 178,
                "retained": 82,
                "exited": 96,
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
            "trials": 109,
            "admissions": 72,
            "rate": 66.1,
            "previousRate": 65.5,
            "yoyDelta": 0.5,
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
            "asOf": "2026-11-09",
            "trialPoints": 5,
            "siblingPoints": 5,
            "points": 10,
            "calculatedScore": 12.5,
            "members": 223,
            "rate": 4.484304932735426,
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
        "members": 202,
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
          "asOf": "2026-11-09",
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
                "sample": 219,
                "retained": 203,
                "exited": 16,
                "rate": 92.7,
                "relativeScore": 37.5,
                "scored": true
              },
              {
                "key": "m12",
                "label": "12か月",
                "months": 12,
                "weight": 3,
                "sample": 178,
                "retained": 141,
                "exited": 37,
                "rate": 79.2,
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
            "admissions": 65,
            "rate": 63.7,
            "previousRate": 63,
            "yoyDelta": 0.7,
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
            "asOf": "2026-11-09",
            "trialPoints": 8,
            "siblingPoints": 11,
            "points": 19,
            "calculatedScore": 70,
            "members": 202,
            "rate": 9.405940594059405,
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
      "asOf": "2026-11-09",
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
          "cumulative": 82
        },
        "D": {
          "cumulative": 73
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
        "retention12mRate": 82.9,
        "retention12mSample": 508,
        "admissionRate": 87.9,
        "admissionPreviousRate": 83.6,
        "admissionYoYDelta": 4.4,
        "eventRate": 21.4,
        "repeatRate": 45.6,
        "referralPoints": 16,
        "referralRate": 4.610951008645533,
        "referralMembers": 347
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-10",
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
              "sample": 574,
              "retained": 547,
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
              "sample": 508,
              "retained": 421,
              "exited": 87,
              "rate": 82.9,
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
          "asOf": "2026-11-10",
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
      },
      "note": "評価根拠｜【定着力】3か月 631/640人継続・非継続9人（98.6%・相対点62.5）、6か月 547/574人継続・非継続27人（95.3%・相対点87.5）、12か月 421/508人継続・非継続87人（82.9%・相対点87.5）、2年 245/423人継続・非継続178人（57.9%・相対点62.5）、3年 116/284人継続・非継続168人（40.8%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果75点です。 【年度入会力】141人体験のうち124人入会、年度の体験→入会率87.9%（前年同期間83.6%）。A〜Dの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.4%と継続参加率45.6%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。A〜Dの相対評価で88点です。 【紹介力】2026年度の紹介16ポイント（紹介体験7人・兄弟姉妹入会9人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は16pt÷基準日の会員347人＝4.61％。人数相対点37.5×70％＋紹介率相対点12.5×30％で30点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月9日の16→16ポイント。"
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
        "retention12mRate": 79.5,
        "retention12mSample": 410,
        "admissionRate": 75.9,
        "admissionPreviousRate": 83.1,
        "admissionYoYDelta": -7.3,
        "eventRate": 21.8,
        "repeatRate": 46.9,
        "referralPoints": 20,
        "referralRate": 6.289308176100629,
        "referralMembers": 318
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-10",
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
              "sample": 483,
              "retained": 454,
              "exited": 29,
              "rate": 94,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "m12",
              "label": "12か月",
              "months": 12,
              "weight": 3,
              "sample": 410,
              "retained": 326,
              "exited": 84,
              "rate": 79.5,
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
          "trials": 145,
          "admissions": 110,
          "rate": 75.9,
          "previousRate": 83.1,
          "yoyDelta": -7.3,
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
          "asOf": "2026-11-10",
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
      "note": "評価根拠｜【定着力】3か月 508/515人継続・非継続7人（98.6%・相対点87.5）、6か月 454/483人継続・非継続29人（94.0%・相対点62.5）、12か月 326/410人継続・非継続84人（79.5%・相対点62.5）、2年 188/325人継続・非継続137人（57.8%・相対点37.5）、3年 63/193人継続・非継続130人（32.6%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果45点です。 【年度入会力】145人体験のうち110人入会、年度の体験→入会率75.9%（前年同期間83.1%）。A〜Dの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率21.8%と継続参加率46.9%を、参加70%・継続30%で統合して78点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。A〜Dの相対評価で63点です。 【紹介力】2026年度の紹介20ポイント（紹介体験8人・兄弟姉妹入会12人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は20pt÷基準日の会員318人＝6.29％。人数相対点87.5×70％＋紹介率相対点62.5×30％で80点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月9日の20→20ポイント。"
    },
    {
      "id": "C",
      "rank": 4,
      "members": 224,
      "monthlyDelta": -4,
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
        "admissionRate": 65.5,
        "admissionPreviousRate": 65.8,
        "admissionYoYDelta": -0.4,
        "eventRate": 12.4,
        "repeatRate": 38.4,
        "referralPoints": 11,
        "referralRate": 4.910714285714286,
        "referralMembers": 224
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-10",
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
              "sample": 340,
              "retained": 306,
              "exited": 34,
              "rate": 90,
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
              "sample": 178,
              "retained": 82,
              "exited": 96,
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
          "trials": 110,
          "admissions": 72,
          "rate": 65.5,
          "previousRate": 65.8,
          "yoyDelta": -0.4,
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
          "asOf": "2026-11-10",
          "trialPoints": 5,
          "siblingPoints": 6,
          "points": 11,
          "calculatedScore": 20,
          "members": 224,
          "rate": 4.910714285714286,
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
      "note": "評価根拠｜【定着力】3か月 368/379人継続・非継続11人（97.1%・相対点37.5）、6か月 306/340人継続・非継続34人（90.0%・相対点12.5）、12か月 218/302人継続・非継続84人（72.2%・相対点12.5）、2年 82/178人継続・非継続96人（46.1%・相対点12.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果15点です。 【年度入会力】110人体験のうち72人入会、年度の体験→入会率65.5%（前年同期間65.8%）。A〜Dの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率12.4%と継続参加率38.4%を、参加70%・継続30%で統合して52点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。A〜Dの相対評価で38点です。 【紹介力】2026年度の紹介11ポイント（紹介体験5人・兄弟姉妹入会6人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は11pt÷基準日の会員224人＝4.91％。人数相対点12.5×70％＋紹介率相対点37.5×30％で20点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月9日の10→11ポイント。"
    },
    {
      "id": "D",
      "rank": 3,
      "members": 202,
      "monthlyDelta": -4,
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
        "admissionRate": 63.7,
        "admissionPreviousRate": 63,
        "admissionYoYDelta": 0.7,
        "eventRate": 11.9,
        "repeatRate": 37.9,
        "referralPoints": 19,
        "referralRate": 9.405940594059405,
        "referralMembers": 202
      },
      "note": "評価根拠｜【定着力】3か月 241/249人継続・非継続8人（96.8%・相対点12.5）、6か月 206/222人継続・非継続16人（92.8%・相対点37.5）、12か月 142/179人継続・非継続37人（79.3%・相対点37.5）、2年 24/38人継続・非継続14人（63.2%・相対点87.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果55点です。 【年度入会力】102人体験のうち65人入会、年度の体験→入会率63.7%（前年同期間63.0%）。A〜Dの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.9%と継続参加率37.9%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。A〜Dの相対評価で13点です。 【紹介力】2026年度の紹介19ポイント（紹介体験8人・兄弟姉妹入会11人）。子ども1人につき1ポイントで、同じ家庭の複数紹介も人数分を加算します。紹介者未入力は0点、判別できた既存会員の兄弟姉妹入会は加点。同じ子の再体験・入会は重複加算しません。紹介率は19pt÷基準日の会員202人＝9.41％。人数相対点62.5×70％＋紹介率相対点87.5×30％で70点です。年度累計と現在会員数の比なので、会員数の変化でも率は変わります。 2026年11月9日の19→19ポイント。\n運用注記｜イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-11-10",
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
              "sample": 222,
              "retained": 206,
              "exited": 16,
              "rate": 92.8,
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
          "trials": 102,
          "admissions": 65,
          "rate": 63.7,
          "previousRate": 63,
          "yoyDelta": 0.7,
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
          "asOf": "2026-11-10",
          "trialPoints": 8,
          "siblingPoints": 11,
          "points": 19,
          "calculatedScore": 70,
          "members": 202,
          "rate": 9.405940594059405,
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
    "asOf": "2026-11-10",
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
        0,
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
        4,
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
      11,
      null,
      null,
      null,
      null
    ]
  },
  "withdrawalHistory": {
    "definition": "member-retirement-explicit-stop-detected-v1",
    "asOf": "2026-11-10",
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
    "asOf": "2026-11-10",
    "fiscalYear": "2026",
    "teams": {
      "A": {
        "trials": 141,
        "admissions": 124,
        "previousTrials": 73,
        "previousAdmissions": 61
      },
      "B": {
        "trials": 145,
        "admissions": 110,
        "previousTrials": 89,
        "previousAdmissions": 74
      },
      "C": {
        "trials": 110,
        "admissions": 72,
        "previousTrials": 120,
        "previousAdmissions": 79
      },
      "D": {
        "trials": 102,
        "admissions": 65,
        "previousTrials": 211,
        "previousAdmissions": 133
      }
    }
  },
  "retentionAvailability": {
    "definition": "historical-retained-forward-confirmed-v2",
    "asOf": "2026-11-10",
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
    "asOf": "2026-11-10",
    "status": "ok",
    "overall": {
      "members": 1091,
      "grade": {
        "preschool": 0,
        "k1": 5,
        "k2": 48,
        "k3": 52,
        "p1": 145,
        "p2": 181,
        "p3": 168,
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
        "male": 474,
        "female": 615,
        "other": 0,
        "unknown": 2
      },
      "tenure": {
        "lt3": 94,
        "m3to6": 144,
        "m6to12": 198,
        "y1to2": 291,
        "y2to3": 229,
        "y3to5": 130,
        "y5plus": 4,
        "unknown": 1
      },
      "age": {
        "lt5": 21,
        "a5to6": 136,
        "a7to9": 513,
        "a10to12": 376,
        "a13to15": 43,
        "a16plus": 1,
        "unknown": 1
      },
      "status": {
        "active": 1055,
        "paused": 21,
        "scheduled": 14,
        "unknown": 1
      },
      "entryYear": {
        "2021": 13,
        "2022": 31,
        "2023": 117,
        "2024": 251,
        "2025": 313,
        "2026": 365,
        "unknown": 1
      },
      "summary": {
        "knownTenure": 1090,
        "tenureMonthsTotal": 19411,
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
          "m3to6": 60,
          "m6to12": 60,
          "y1to2": 60,
          "y2to3": 59,
          "y3to5": 72,
          "y5plus": 4,
          "unknown": 0
        },
        "age": {
          "lt5": 10,
          "a5to6": 36,
          "a7to9": 159,
          "a10to12": 120,
          "a13to15": 21,
          "a16plus": 1,
          "unknown": 0
        },
        "status": {
          "active": 345,
          "paused": 2,
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
          "tenureMonthsTotal": 7147,
          "meanTenureMonths": 20.6,
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
          "m3to6": 29,
          "m6to12": 66,
          "y1to2": 61,
          "y2to3": 75,
          "y3to5": 58,
          "y5plus": 0,
          "unknown": 1
        },
        "age": {
          "lt5": 7,
          "a5to6": 50,
          "a7to9": 132,
          "a10to12": 118,
          "a13to15": 10,
          "a16plus": 0,
          "unknown": 1
        },
        "status": {
          "active": 311,
          "paused": 0,
          "scheduled": 6,
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
          "tenureMonthsTotal": 6089,
          "meanTenureMonths": 19.2,
          "medianTenureMonths": 17
        }
      },
      "C": {
        "members": 224,
        "grade": {
          "preschool": 0,
          "k1": 0,
          "k2": 4,
          "k3": 9,
          "p1": 34,
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
          "male": 108,
          "female": 116,
          "other": 0,
          "unknown": 0
        },
        "tenure": {
          "lt3": 15,
          "m3to6": 32,
          "m6to12": 33,
          "y1to2": 72,
          "y2to3": 72,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 1,
          "a5to6": 19,
          "a7to9": 117,
          "a10to12": 79,
          "a13to15": 8,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 206,
          "paused": 12,
          "scheduled": 6,
          "unknown": 0
        },
        "entryYear": {
          "2024": 88,
          "2025": 65,
          "2026": 71
        },
        "summary": {
          "knownTenure": 224,
          "tenureMonthsTotal": 3575,
          "meanTenureMonths": 16,
          "medianTenureMonths": 16
        }
      },
      "D": {
        "members": 202,
        "grade": {
          "preschool": 0,
          "k1": 2,
          "k2": 15,
          "k3": 8,
          "p1": 21,
          "p2": 47,
          "p3": 31,
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
          "male": 69,
          "female": 132,
          "other": 0,
          "unknown": 1
        },
        "tenure": {
          "lt3": 19,
          "m3to6": 23,
          "m6to12": 39,
          "y1to2": 98,
          "y2to3": 23,
          "y3to5": 0,
          "y5plus": 0,
          "unknown": 0
        },
        "age": {
          "lt5": 3,
          "a5to6": 31,
          "a7to9": 105,
          "a10to12": 59,
          "a13to15": 4,
          "a16plus": 0,
          "unknown": 0
        },
        "status": {
          "active": 193,
          "paused": 7,
          "scheduled": 2,
          "unknown": 0
        },
        "entryYear": {
          "2024": 28,
          "2025": 109,
          "2026": 65
        },
        "summary": {
          "knownTenure": 202,
          "tenureMonthsTotal": 2600,
          "meanTenureMonths": 12.9,
          "medianTenureMonths": 14
        }
      }
    }
  },
  "admissionConversionHistory": {
    "status": "ok",
    "definition": "trial-attendance-fiscal-monthly-v1",
    "asOf": "2026-11-10",
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
          0,
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
          1,
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
          4,
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
          3,
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
          0,
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
          0,
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
        5,
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
        4,
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
    "asOf": "2026-11-10",
    "since": "2026-11-02",
    "timezone": "Asia/Tokyo",
    "teams": {
      "A": {
        "flyer": 0,
        "referral": 0,
        "other": 2,
        "unknown": 0,
        "total": 2
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
        "flyer": 5,
        "referral": 0,
        "other": 0,
        "unknown": 0,
        "total": 5
      }
    },
    "months": [
      {
        "month": "2026-11",
        "teams": {
          "A": {
            "flyer": 0,
            "referral": 0,
            "other": 2,
            "unknown": 0,
            "total": 2
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
            "flyer": 5,
            "referral": 0,
            "other": 0,
            "unknown": 0,
            "total": 5
          }
        }
      }
    ]
  }
});
