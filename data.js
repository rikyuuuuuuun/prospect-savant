window.PROSPECT_SAVANT_DATA = Object.freeze({
  "snapshotId": "savant-2026-08-27-0730",
  "scoreVersion": "v7-operational-member-denominator",
  "asOf": "2026-08-27",
  "asOfLabel": "2026年8月27日",
  "admissions": {
    "asOf": "2026-08-27",
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
        "cumulative": 68
      },
      "D": {
        "cumulative": 54
      }
    }
  },
  "periodLabel": "2026年度累計",
  "headline": {
    "members": 1058,
    "monthlyDelta": 31,
    "admissionRate": 72.7,
    "admissionPreviousRate": 68.5,
    "admissionYoYDelta": 4.3,
    "latestEventParticipants": 124
  },
  "comparison": {
    "scoreVersion": "v7-operational-member-denominator",
    "previousAsOf": "2026-08-25",
    "previousAsOfLabel": "2026年8月25日",
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
        "overall": 73,
        "metrics": {
          "retention": 72,
          "admission": 88,
          "event": 66,
          "growth": 88,
          "family": 47
        }
      },
      {
        "id": "B",
        "rank": 2,
        "members": 309,
        "overall": 64,
        "metrics": {
          "retention": 57,
          "admission": 63,
          "event": 76,
          "growth": 63,
          "family": 71
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
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-08-27",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 598,
              "retained": 589,
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
              "sample": 537,
              "retained": 510,
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
              "sample": 494,
              "retained": 407,
              "exited": 87,
              "rate": 82.4,
              "relativeScore": 87.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 409,
              "retained": 237,
              "exited": 172,
              "rate": 57.9,
              "relativeScore": 50,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 270,
              "retained": 112,
              "exited": 158,
              "rate": 41.5,
              "relativeScore": 75,
              "scored": true
            },
            {
              "key": "y4",
              "label": "4年",
              "months": 48,
              "weight": 6,
              "sample": 142,
              "retained": 42,
              "exited": 100,
              "rate": 29.6,
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
          "weightedIndex": 71.7
        },
        "admission": {
          "trials": 107,
          "admissions": 93,
          "rate": 86.9,
          "previousRate": 82.7,
          "yoyDelta": 4.2,
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
              "rate": 26,
              "relativeScore": 37.5,
              "weight": 25
            },
            "retention2y": {
              "key": "retention2y",
              "label": "2年継続率",
              "numerator": null,
              "denominator": null,
              "rate": 57.9,
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
      },
      "note": "評価根拠｜【定着力】3か月 589/598人継続・非継続9人（98.5%・相対点62.5）、6か月 510/537人継続・非継続27人（95.0%・相対点87.5）、12か月 407/494人継続・非継続87人（82.4%・相対点87.5）、2年 237/409人継続・非継続172人（57.9%・相対点50.0）、3年 112/270人継続・非継続158人（41.5%・相対点75.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果72点です。 【年度入会力】107人体験のうち93人入会、年度入会率86.9%（前年同期間82.7%）。A〜Dの年度入会率を相対評価して88点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率18.8%と継続参加率37.5%を、参加70%・継続30%で統合して66点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 69件、10〜20% 48件、20〜30% 46件、上位30%の子ども86人、加重点349点。A〜Dの相対評価で88点です。 【家庭継続力】兄弟姉妹在籍世帯率 26.0%（相対点37.5、人数内訳は現行率と整合しないため非表示）、2年継続率 57.9%（相対点50.0、人数内訳は現行率と整合しないため非表示）、再入会率 0.3%（相対点62.5、人数内訳は現行率と整合しないため非表示）、イベント継続参加率 37.5%（相対点37.5、人数内訳は現行率と整合しないため非表示）。兄弟姉妹25・2年継続20・再入会20・イベント継続15の設定重みを、利用可能項目の合計で正規化して相対評価し47点です。"
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
        "retention12mRate": 79.4,
        "retention12mSample": 388,
        "admissionRate": 76.6,
        "admissionPreviousRate": 80.6,
        "admissionYoYDelta": -4,
        "eventRate": 20.8,
        "repeatRate": 45.5
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-08-27",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 497,
              "retained": 491,
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
              "sample": 388,
              "retained": 308,
              "exited": 80,
              "rate": 79.4,
              "relativeScore": 62.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 298,
              "retained": 173,
              "exited": 125,
              "rate": 58.1,
              "relativeScore": 83.3,
              "scored": true
            },
            {
              "key": "y3",
              "label": "3年",
              "months": 36,
              "weight": 5,
              "sample": 146,
              "retained": 44,
              "exited": 102,
              "rate": 30.1,
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
          "admissions": 82,
          "rate": 76.6,
          "previousRate": 80.6,
          "yoyDelta": -4,
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
              "rate": 29.9,
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
      },
      "note": "評価根拠｜【定着力】3か月 491/497人継続・非継続6人（98.8%・相対点87.5）、6か月 405/430人継続・非継続25人（94.2%・相対点62.5）、12か月 308/388人継続・非継続80人（79.4%・相対点62.5）、2年 173/298人継続・非継続125人（58.1%・相対点83.3）、3年 44/146人継続・非継続102人（30.1%・相対点25.0）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果57点です。 【年度入会力】107人体験のうち82人入会、年度入会率76.6%（前年同期間80.6%）。A〜Dの年度入会率を相対評価して63点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率20.8%と継続参加率45.5%を、参加70%・継続30%で統合して76点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 31件、10〜20% 37件、20〜30% 39件、上位30%の子ども65人、加重点206点。A〜Dの相対評価で63点です。 【家庭継続力】兄弟姉妹在籍世帯率 29.9%（相対点87.5、人数内訳は現行率と整合しないため非表示）、2年継続率 58.1%（相対点83.3、人数内訳は現行率と整合しないため非表示）、再入会率 0.0%（相対点25.0、人数内訳は現行率と整合しないため非表示）、イベント継続参加率 45.5%（相対点87.5、人数内訳は現行率と整合しないため非表示）。兄弟姉妹25・2年継続20・再入会20・イベント継続15の設定重みを、利用可能項目の合計で正規化して相対評価し71点です。"
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
      },
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-08-27",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 359,
              "retained": 349,
              "exited": 10,
              "rate": 97.2,
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
              "sample": 271,
              "retained": 188,
              "exited": 83,
              "rate": 69.4,
              "relativeScore": 12.5,
              "scored": true
            },
            {
              "key": "y2",
              "label": "2年",
              "months": 24,
              "weight": 4,
              "sample": 149,
              "retained": 71,
              "exited": 78,
              "rate": 47.7,
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
              "rate": 26.5,
              "relativeScore": 62.5,
              "weight": 25
            },
            "retention2y": {
              "key": "retention2y",
              "label": "2年継続率",
              "numerator": null,
              "denominator": null,
              "rate": 47.7,
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
      },
      "note": "評価根拠｜【定着力】3か月 349/359人継続・非継続10人（97.2%・相対点37.5）、6か月 278/310人継続・非継続32人（89.7%・相対点12.5）、12か月 188/271人継続・非継続83人（69.4%・相対点12.5）、2年 71/149人継続・非継続78人（47.7%・相対点16.7）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果17点です。 【年度入会力】81人体験のうち51人入会、年度入会率63.0%（前年同期間59.5%）。A〜Dの年度入会率を相対評価して38点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率11.4%と継続参加率38.3%を、参加70%・継続30%で統合して50点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 12件、10〜20% 14件、20〜30% 20件、上位30%の子ども32人、加重点84点。A〜Dの相対評価で38点です。 【家庭継続力】兄弟姉妹在籍世帯率 26.5%（相対点62.5、人数内訳は現行率と整合しないため非表示）、2年継続率 47.7%（相対点16.7、人数内訳は現行率と整合しないため非表示）、再入会率 0.0%（相対点25.0、人数内訳は現行率と整合しないため非表示）、イベント継続参加率 38.3%（相対点62.5、人数内訳は現行率と整合しないため非表示）。兄弟姉妹25・2年継続20・再入会20・イベント継続15の設定重みを、利用可能項目の合計で正規化して相対評価し42点です。"
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
        "admissionRate": 57.7,
        "admissionPreviousRate": 63.6,
        "admissionYoYDelta": -5.9,
        "eventRate": 10.3,
        "repeatRate": 31.1
      },
      "note": "評価根拠｜【定着力】3か月 221/228人継続・非継続7人（96.9%・相対点12.5）、6か月 178/191人継続・非継続13人（93.2%・相対点37.5）、12か月 112/144人継続・非継続32人（77.8%・相対点37.5）。対象20人未満、または比較可能チームが1つだけの期間は採点から除外し、期間が長いほど1〜8倍で重くA〜Dの相対順位を加重した結果33点です。 【年度入会力】78人体験のうち45人入会、年度入会率57.7%（前年同期間63.6%）。A〜Dの年度入会率を相対評価して13点です。前年同期間率は説明用で、現在点は今年度入会率の相対位置で決まります。 【イベント力】一般会員対象イベントの平均参加率10.3%と継続参加率31.1%を、参加70%・継続30%で統合して43点です。大会参加者限定練習は除外しています。 【成長力】2大会・順位1,068件を対象に、上位10% 5件、10〜20% 10件、20〜30% 9件、上位30%の子ども19人、加重点44点。A〜Dの相対評価で13点です。 【家庭継続力】兄弟姉妹在籍世帯率 23.3%（相対点12.5、人数内訳は現行率と整合しないため非表示）、2年継続率は対象不足、再入会率 1.9%（相対点87.5、人数内訳は現行率と整合しないため非表示）、イベント継続参加率 31.1%（相対点12.5、人数内訳は現行率と整合しないため非表示）。兄弟姉妹25・2年継続20・再入会20・イベント継続15の設定重みを、利用可能項目の合計で正規化して相対評価し38点です。\n運用注記｜家庭継続力は評価対象が十分に蓄積するまで暫定です。イベント力は2025年4月のチーム発足後だけを評価しています。",
      "metricEvidence": {
        "version": "metric-evidence-v1",
        "asOf": "2026-08-27",
        "retention": {
          "periods": [
            {
              "key": "m3",
              "label": "3か月",
              "months": 3,
              "weight": 1,
              "sample": 228,
              "retained": 221,
              "exited": 7,
              "rate": 96.9,
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
              "sample": 144,
              "retained": 112,
              "exited": 32,
              "rate": 77.8,
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
              "rate": 23.3,
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
              "rate": 1.9,
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
