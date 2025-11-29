import Document from "../models/Document.js";

class DocumentStatsDAO {
    static async getAggregatedStats() {
        try {
        const result = await Document.aggregate([
            {
            $group: {
                _id: null,
                totalDocs: { $sum: 1 },

                age: { $avg: "$age" },
                contactDurationSeconds: { $avg: "$contactDurationSeconds" },
                numberOfContacts: { $avg: "$numberOfContacts" },
                daysSinceLastContact: { $avg: "$daysSinceLastContact" },
                previousContactsCount: { $avg: "$previousContactsCount" },
                employmentVariationRate: { $avg: "$employmentVariationRate" },
                consumerPriceIndex: { $avg: "$consumerPriceIndex" },
                consumerConfidenceIndex: { $avg: "$consumerConfidenceIndex" },
                euriborThreeMonthRate: { $avg: "$euriborThreeMonthRate" },
                numberOfEmployees: { $avg: "$numberOfEmployees" },

                job: { $push: "$job" },
                marital: { $push: "$marital" },
                education: { $push: "$education" },
                hasCreditDefault: { $push: "$hasCreditDefault" },
                hasHousingLoan: { $push: "$hasHousingLoan" },
                hasPersonalLoan: { $push: "$hasPersonalLoan" },
                contactType: { $push: "$contactType" },
                contactMonth: { $push: "$contactMonth" },
                contactDayOfWeek: { $push: "$contactDayOfWeek" },
                previousCampaignOutcome: { $push: "$previousCampaignOutcome" },
                subscribedTermDeposit: { $push: "$subscribedTermDeposit" }
            }
            },

            {
            $project: {
                _id: 0,

                age: 1,
                contactDurationSeconds: 1,
                numberOfContacts: 1,
                daysSinceLastContact: 1,
                previousContactsCount: 1,
                employmentVariationRate: 1,
                consumerPriceIndex: 1,
                consumerConfidenceIndex: 1,
                euriborThreeMonthRate: 1,
                numberOfEmployees: 1,

                job: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$job", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$job",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                marital: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$marital", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$marital",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                education: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$education", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$education",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                hasCreditDefault: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$hasCreditDefault", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$hasCreditDefault",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                hasHousingLoan: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$hasHousingLoan", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$hasHousingLoan",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                hasPersonalLoan: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$hasPersonalLoan", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$hasPersonalLoan",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                contactType: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$contactType", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$contactType",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                contactMonth: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$contactMonth", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$contactMonth",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                contactDayOfWeek: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$contactDayOfWeek", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$contactDayOfWeek",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                previousCampaignOutcome: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$previousCampaignOutcome", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$previousCampaignOutcome",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                },

                subscribedTermDeposit: {
                $arrayToObject: {
                    $map: {
                    input: { $setUnion: ["$subscribedTermDeposit", []] },
                    as: "val",
                    in: {
                        k: "$$val",
                        v: {
                        $multiply: [
                            {
                            $divide: [
                                {
                                $size: {
                                    $filter: {
                                    input: "$subscribedTermDeposit",
                                    as: "x",
                                    cond: { $eq: ["$$x", "$$val"] }
                                    }
                                }
                                },
                                "$totalDocs"
                            ]
                            },
                            100
                        ]
                        }
                    }
                    }
                }
                }
            }
            }
        ]);

        return result[0];

        } catch (err) {
        console.error("Aggregation error:", err);
        throw err;
        }
    }
}

export default DocumentStatsDAO;
