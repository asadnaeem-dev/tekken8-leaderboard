# Fallback Mock Data for WallSplat Scraper

STANDINGS_2024 = [
    {"rank": 1, "player": "Arslan Ash", "points": 2315, "country": "Pakistan"},
    {"rank": 2, "player": "ULSAN", "points": 2200, "country": "South Korea"},
    {"rank": 3, "player": "Mulgold", "points": 2140, "country": "South Korea"},
    {"rank": 4, "player": "ATIF", "points": 1725, "country": "Pakistan"},
    {"rank": 5, "player": "kkokkoma", "points": 1630, "country": "South Korea"},
    {"rank": 6, "player": "AK", "points": 1620, "country": "Philippines"},
    {"rank": 7, "player": "THE JON", "points": 1580, "country": "Pakistan"},
    {"rank": 8, "player": "Shadow 20z", "points": 1546, "country": "United States"},
    {"rank": 9, "player": "Chikurin", "points": 1520, "country": "Japan"},
    {"rank": 10, "player": "JoKa", "points": 1505, "country": "United Kingdom"},
    {"rank": 11, "player": "Rangchu", "points": 1505, "country": "South Korea"},
    {"rank": 12, "player": "Raef", "points": 1450, "country": "Saudi Arabia"},
    {"rank": 13, "player": "Chanel", "points": 1425, "country": "South Korea"},
    {"rank": 14, "player": "CBM", "points": 1400, "country": "South Korea"},
    {"rank": 15, "player": "double", "points": 1385, "country": "Japan"},
    {"rank": 16, "player": "Nobi", "points": 1380, "country": "Japan"},
    {"rank": 17, "player": "Farzeen", "points": 1365, "country": "Pakistan"},
    {"rank": 18, "player": "LowHigh", "points": 1340, "country": "South Korea"},
    {"rank": 19, "player": "Jodd", "points": 1320, "country": "France"},
    {"rank": 20, "player": "leemishima", "points": 1310, "country": "Argentina"},
    {"rank": 21, "player": "JeonDDing", "points": 1285, "country": "South Korea"},
    {"rank": 22, "player": "KingReyJr", "points": 1250, "country": "United States"},
    {"rank": 23, "player": "KEISUKE", "points": 1230, "country": "Japan"},
    {"rank": 24, "player": "Book", "points": 1130, "country": "Thailand"},
    {"rank": 25, "player": "Fear Of Silence", "points": 1050, "country": "United States"}
]

TOURNAMENT_RESULTS = {
    # 2024 TWT Tournaments
    "EVO_Japan/2024": {
        "placements": [
            {"place": 1, "player": "Chikurin", "points": 800, "prize": 8000, "characters": ["Lili"]},
            {"place": 2, "player": "LowHigh", "points": 500, "prize": 4000, "characters": ["Dragunov", "Steve Fox"]},
            {"place": 3, "player": "Chanel", "points": 400, "prize": 2000, "characters": ["Alisa Bosconovich"]},
            {"place": 4, "player": "double", "points": 300, "prize": 1000, "characters": ["Marshall Law"]},
            {"place": 5, "player": "Rangchu", "points": 200, "prize": 500, "characters": ["Panda"]},
            {"place": 6, "player": "ULSAN", "points": 200, "prize": 500, "characters": ["Dragunov"]},
            {"place": 7, "player": "Knee", "points": 150, "prize": 250, "characters": ["Feng Wei"]},
            {"place": 8, "player": "KEISUKE", "points": 150, "prize": 250, "characters": ["Devil Jin"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Chikurin", "p2": "LowHigh", "p1_score": 3, "p2_score": 1, "winner": "Chikurin"},
            {"round": "Losers Semis", "p1": "Chanel", "p2": "double", "p1_score": 3, "p2_score": 2, "winner": "Chanel"},
            {"round": "Losers Finals", "p1": "LowHigh", "p2": "Chanel", "p1_score": 3, "p2_score": 2, "winner": "LowHigh"},
            {"round": "Grand Finals", "p1": "Chikurin", "p2": "LowHigh", "p1_score": 3, "p2_score": 0, "winner": "Chikurin"}
        ]
    },
    "Combo_Breaker/2024": {
        "placements": [
            {"place": 1, "player": "Arslan Ash", "points": 800, "prize": 9382, "characters": ["Zafina", "Ling Xiaoyu"]},
            {"place": 2, "player": "ULSAN", "points": 500, "prize": 4691, "characters": ["Dragunov", "Reina"]},
            {"place": 3, "player": "CBM", "points": 400, "prize": 2345, "characters": ["Jin Kazama"]},
            {"place": 4, "player": "ATIF", "points": 300, "prize": 1172, "characters": ["Dragunov"]},
            {"place": 5, "player": "Knee", "points": 200, "prize": 586, "characters": ["Bryan Fury"]},
            {"place": 6, "player": "Rangchu", "points": 200, "prize": 586, "characters": ["Panda"]},
            {"place": 7, "player": "Shadow 20z", "points": 150, "prize": 293, "characters": ["Zafina"]},
            {"place": 8, "player": "JeonDDing", "points": 150, "prize": 293, "characters": ["Eddy Gordo"]}
        ],
        "matches": [
            {"round": "Winners Semis", "p1": "Arslan Ash", "p2": "CBM", "p1_score": 3, "p2_score": 1, "winner": "Arslan Ash"},
            {"round": "Winners Semis", "p1": "ULSAN", "p2": "ATIF", "p1_score": 3, "p2_score": 2, "winner": "ULSAN"},
            {"round": "Winners Finals", "p1": "Arslan Ash", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"},
            {"round": "Losers Semis", "p1": "CBM", "p2": "ATIF", "p1_score": 3, "p2_score": 0, "winner": "CBM"},
            {"round": "Losers Finals", "p1": "ULSAN", "p2": "CBM", "p1_score": 3, "p2_score": 1, "winner": "ULSAN"},
            {"round": "Grand Finals", "p1": "Arslan Ash", "p2": "ULSAN", "p1_score": 3, "p2_score": 1, "winner": "Arslan Ash"}
        ]
    },
    "CEO/2024": {
        "placements": [
            {"place": 1, "player": "ATIF", "points": 800, "prize": 7500, "characters": ["Dragunov", "Feng Wei"]},
            {"place": 2, "player": "KEISUKE", "points": 500, "prize": 3750, "characters": ["Devil Jin"]},
            {"place": 3, "player": "double", "points": 400, "prize": 1875, "characters": ["Marshall Law"]},
            {"place": 4, "player": "kkokkoma", "points": 300, "prize": 937, "characters": ["Feng Wei"]},
            {"place": 5, "player": "Arslan Ash", "points": 200, "prize": 468, "characters": ["Zafina"]},
            {"place": 6, "player": "Shadow 20z", "points": 200, "prize": 468, "characters": ["Zafina"]},
            {"place": 7, "player": "Rangchu", "points": 150, "prize": 234, "characters": ["Panda"]},
            {"place": 8, "player": "Anakin", "points": 150, "prize": 234, "characters": ["Jack-8"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "ATIF", "p2": "KEISUKE", "p1_score": 3, "p2_score": 2, "winner": "ATIF"},
            {"round": "Losers Semis", "p1": "double", "p2": "kkokkoma", "p1_score": 3, "p2_score": 1, "winner": "double"},
            {"round": "Losers Finals", "p1": "KEISUKE", "p2": "double", "p1_score": 3, "p2_score": 2, "winner": "KEISUKE"},
            {"round": "Grand Finals", "p1": "ATIF", "p2": "KEISUKE", "p1_score": 3, "p2_score": 1, "winner": "ATIF"}
        ]
    },
    "VSFighting/2024": {
        "placements": [
            {"place": 1, "player": "JoKa", "points": 800, "prize": 6500, "characters": ["Feng Wei"]},
            {"place": 2, "player": "Farzeen", "points": 500, "prize": 3250, "characters": ["Dragunov"]},
            {"place": 3, "player": "Jodd", "points": 400, "prize": 1625, "characters": ["Yoshimitsu"]},
            {"place": 4, "player": "ATIF", "points": 300, "prize": 812, "characters": ["Dragunov"]},
            {"place": 5, "player": "Knee", "points": 200, "prize": 406, "characters": ["Bryan Fury"]},
            {"place": 6, "player": "double", "points": 200, "prize": 406, "characters": ["Marshall Law"]},
            {"place": 7, "player": "kkokkoma", "points": 150, "prize": 203, "characters": ["Feng Wei"]},
            {"place": 8, "player": "Tissuemon", "points": 150, "prize": 203, "characters": ["Raven"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "JoKa", "p2": "Farzeen", "p1_score": 3, "p2_score": 1, "winner": "JoKa"},
            {"round": "Losers Semis", "p1": "Farzeen", "p2": "ATIF", "p1_score": 3, "p2_score": 2, "winner": "Farzeen"},
            {"round": "Losers Finals", "p1": "Farzeen", "p2": "Jodd", "p1_score": 3, "p2_score": 0, "winner": "Farzeen"},
            {"round": "Grand Finals", "p1": "JoKa", "p2": "Farzeen", "p1_score": 3, "p2_score": 2, "winner": "JoKa"}
        ]
    },
    "EVO/2024": {
        "placements": [
            {"place": 1, "player": "Arslan Ash", "points": 1000, "prize": 12000, "characters": ["Zafina", "Ling Xiaoyu"]},
            {"place": 2, "player": "ATIF", "points": 700, "prize": 6000, "characters": ["Dragunov"]},
            {"place": 3, "player": "Nobi", "points": 550, "prize": 3600, "characters": ["Dragunov"]},
            {"place": 4, "player": "ULSAN", "points": 450, "prize": 2400, "characters": ["Dragunov"]},
            {"place": 5, "player": "Farzeen", "points": 350, "prize": 1200, "characters": ["Dragunov"]},
            {"place": 6, "player": "double", "points": 350, "prize": 1200, "characters": ["Marshall Law"]},
            {"place": 7, "player": "Knee", "points": 250, "prize": 600, "characters": ["Lili"]},
            {"place": 8, "player": "CBM", "points": 250, "prize": 600, "characters": ["Jin Kazama"]}
        ],
        "matches": [
            {"round": "Winners Semis", "p1": "Arslan Ash", "p2": "Nobi", "p1_score": 3, "p2_score": 1, "winner": "Arslan Ash"},
            {"round": "Winners Semis", "p1": "ATIF", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "ATIF"},
            {"round": "Winners Finals", "p1": "Arslan Ash", "p2": "ATIF", "p1_score": 3, "p2_score": 1, "winner": "Arslan Ash"},
            {"round": "Losers Semis", "p1": "Nobi", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "Nobi"},
            {"round": "Losers Finals", "p1": "ATIF", "p2": "Nobi", "p1_score": 3, "p2_score": 0, "winner": "ATIF"},
            {"round": "Grand Finals", "p1": "Arslan Ash", "p2": "ATIF", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"}
        ]
    },
    "CEOtaku/2024": {
        "placements": [
            {"place": 1, "player": "Mulgold", "points": 800, "prize": 4000, "characters": ["Claudio Serafino"]},
            {"place": 2, "player": "Shadow 20z", "points": 500, "prize": 2000, "characters": ["Zafina"]},
            {"place": 3, "player": "Anakin", "points": 400, "prize": 1000, "characters": ["Jack-8"]},
            {"place": 4, "player": "Book", "points": 300, "prize": 500, "characters": ["Alisa Bosconovich"]},
            {"place": 5, "player": "Speedkicks", "points": 200, "prize": 250, "characters": ["Hwoarang"]},
            {"place": 6, "player": "Rip", "points": 200, "prize": 250, "characters": ["Marshall Law"]},
            {"place": 7, "player": "Anakin", "points": 150, "prize": 125, "characters": ["Dragunov"]},
            {"place": 8, "player": "Knee", "points": 150, "prize": 125, "characters": ["Feng Wei"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Mulgold", "p2": "Shadow 20z", "p1_score": 3, "p2_score": 0, "winner": "Mulgold"},
            {"round": "Losers Semis", "p1": "Anakin", "p2": "Book", "p1_score": 3, "p2_score": 1, "winner": "Anakin"},
            {"round": "Losers Finals", "p1": "Shadow 20z", "p2": "Anakin", "p1_score": 3, "p2_score": 2, "winner": "Shadow 20z"},
            {"round": "Grand Finals", "p1": "Mulgold", "p2": "Shadow 20z", "p1_score": 3, "p2_score": 1, "winner": "Mulgold"}
        ]
    },
    "Tekken_World_Tour/2024/Finals": {
        "placements": [
            {"place": 1, "player": "ULSAN", "points": 2000, "prize": 50000, "characters": ["Dragunov"]},
            {"place": 2, "player": "ATIF", "points": 1500, "prize": 25000, "characters": ["Dragunov", "Feng Wei"]},
            {"place": 3, "player": "Arslan Ash", "points": 1000, "prize": 15000, "characters": ["Zafina"]},
            {"place": 4, "player": "Mulgold", "points": 800, "prize": 10000, "characters": ["Claudio Serafino"]},
            {"place": 5, "player": "kkokkoma", "points": 600, "prize": 5000, "characters": ["Feng Wei"]},
            {"place": 6, "player": "double", "points": 600, "prize": 5000, "characters": ["Marshall Law"]},
            {"place": 7, "player": "Chikurin", "points": 400, "prize": 3000, "characters": ["Lili"]},
            {"place": 8, "player": "Rangchu", "points": 400, "prize": 3000, "characters": ["Panda"]}
        ],
        "matches": [
            {"round": "Winners Semis", "p1": "ULSAN", "p2": "Mulgold", "p1_score": 3, "p2_score": 2, "winner": "ULSAN"},
            {"round": "Winners Semis", "p1": "ATIF", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 1, "winner": "ATIF"},
            {"round": "Winners Finals", "p1": "ULSAN", "p2": "ATIF", "p1_score": 3, "p2_score": 1, "winner": "ULSAN"},
            {"round": "Losers Semis", "p1": "Arslan Ash", "p2": "Mulgold", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"},
            {"round": "Losers Finals", "p1": "ATIF", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 2, "winner": "ATIF"},
            {"round": "Grand Finals", "p1": "ULSAN", "p2": "ATIF", "p1_score": 3, "p2_score": 0, "winner": "ULSAN"}
        ]
    },

    # 2024 Community Majors (New added!)
    "Red_Bull_Kumite/2024": {
        "placements": [
            {"place": 1, "player": "Nobi", "points": 600, "prize": 10000, "characters": ["Dragunov"]},
            {"place": 2, "player": "Arslan Ash", "points": 400, "prize": 5000, "characters": ["Zafina"]},
            {"place": 3, "player": "ULSAN", "points": 300, "prize": 2500, "characters": ["Dragunov"]},
            {"place": 4, "player": "Knee", "points": 200, "prize": 1250, "characters": ["Bryan Fury"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Nobi", "p2": "Arslan Ash", "p1_score": 5, "p2_score": 3, "winner": "Nobi"},
            {"round": "Losers Finals", "p1": "Arslan Ash", "p2": "ULSAN", "p1_score": 5, "p2_score": 4, "winner": "Arslan Ash"},
            {"round": "Grand Finals", "p1": "Nobi", "p2": "Arslan Ash", "p1_score": 5, "p2_score": 2, "winner": "Nobi"}
        ]
    },
    "Battle_of_BC/6": {
        "placements": [
            {"place": 1, "player": "Chikurin", "points": 600, "prize": 8000, "characters": ["Lili"]},
            {"place": 2, "player": "Rangchu", "points": 400, "prize": 4000, "characters": ["Panda"]},
            {"place": 3, "player": "LowHigh", "points": 300, "prize": 2000, "characters": ["Dragunov"]},
            {"place": 4, "player": "Knee", "points": 200, "prize": 1000, "characters": ["Bryan Fury"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Chikurin", "p2": "Rangchu", "p1_score": 3, "p2_score": 2, "winner": "Chikurin"},
            {"round": "Losers Finals", "p1": "Rangchu", "p2": "LowHigh", "p1_score": 3, "p2_score": 1, "winner": "Rangchu"},
            {"round": "Grand Finals", "p1": "Chikurin", "p2": "Rangchu", "p1_score": 3, "p2_score": 1, "winner": "Chikurin"}
        ]
    },
    "The_Mixup/2024": {
        "placements": [
            {"place": 1, "player": "Knee", "points": 600, "prize": 7000, "characters": ["Bryan Fury", "Feng Wei"]},
            {"place": 2, "player": "JoKa", "points": 400, "prize": 3500, "characters": ["Feng Wei"]},
            {"place": 3, "player": "Jodd", "points": 300, "prize": 1750, "characters": ["Yoshimitsu"]},
            {"place": 4, "player": "kkokkoma", "points": 200, "prize": 875, "characters": ["Feng Wei"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Knee", "p2": "JoKa", "p1_score": 3, "p2_score": 0, "winner": "Knee"},
            {"round": "Losers Finals", "p1": "JoKa", "p2": "Jodd", "p1_score": 3, "p2_score": 2, "winner": "JoKa"},
            {"round": "Grand Finals", "p1": "Knee", "p2": "JoKa", "p1_score": 3, "p2_score": 1, "winner": "Knee"}
        ]
    },
    "DreamHack_Dallas/2024": {
        "placements": [
            {"place": 1, "player": "ATIF", "points": 600, "prize": 9000, "characters": ["Dragunov"]},
            {"place": 2, "player": "Shadow 20z", "points": 400, "prize": 4500, "characters": ["Zafina"]},
            {"place": 3, "player": "Anakin", "points": 300, "prize": 2250, "characters": ["Jack-8"]},
            {"place": 4, "player": "LowHigh", "points": 200, "prize": 1125, "characters": ["Steve Fox"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "ATIF", "p2": "Shadow 20z", "p1_score": 3, "p2_score": 1, "winner": "ATIF"},
            {"round": "Losers Finals", "p1": "Shadow 20z", "p2": "Anakin", "p1_score": 3, "p2_score": 1, "winner": "Shadow 20z"},
            {"round": "Grand Finals", "p1": "ATIF", "p2": "Shadow 20z", "p1_score": 3, "p2_score": 0, "winner": "ATIF"}
        ]
    },
    "Frosty_Faustings/XVI": {
        "placements": [
            {"place": 1, "player": "Anakin", "points": 600, "prize": 5000, "characters": ["Jack-8"]},
            {"place": 2, "player": "Shadow 20z", "points": 400, "prize": 2500, "characters": ["Zafina"]},
            {"place": 3, "player": "Rip", "points": 300, "prize": 1250, "characters": ["Marshall Law"]},
            {"place": 4, "player": "Fear Of Silence", "points": 200, "prize": 625, "characters": ["Alisa Bosconovich"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Anakin", "p2": "Shadow 20z", "p1_score": 3, "p2_score": 1, "winner": "Anakin"},
            {"round": "Losers Finals", "p1": "Shadow 20z", "p2": "Rip", "p1_score": 3, "p2_score": 0, "winner": "Shadow 20z"},
            {"round": "Grand Finals", "p1": "Anakin", "p2": "Shadow 20z", "p1_score": 3, "p2_score": 2, "winner": "Anakin"}
        ]
    },

    # 2025 TWT Tournaments (New added!)
    "EVO_Japan/2025": {
        "placements": [
            {"place": 1, "player": "ULSAN", "points": 800, "prize": 10000, "characters": ["Dragunov"]},
            {"place": 2, "player": "Arslan Ash", "points": 500, "prize": 5000, "characters": ["Zafina"]},
            {"place": 3, "player": "Chikurin", "points": 400, "prize": 2500, "characters": ["Lili"]},
            {"place": 4, "player": "double", "points": 300, "prize": 1250, "characters": ["Marshall Law"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "ULSAN", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 2, "winner": "ULSAN"},
            {"round": "Losers Finals", "p1": "Arslan Ash", "p2": "Chikurin", "p1_score": 3, "p2_score": 1, "winner": "Arslan Ash"},
            {"round": "Grand Finals", "p1": "ULSAN", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 1, "winner": "ULSAN"}
        ]
    },
    "Combo_Breaker/2025": {
        "placements": [
            {"place": 1, "player": "ATIF", "points": 800, "prize": 11000, "characters": ["Dragunov"]},
            {"place": 2, "player": "Arslan Ash", "points": 500, "prize": 5500, "characters": ["Zafina", "Ling Xiaoyu"]},
            {"place": 3, "player": "ULSAN", "points": 400, "prize": 2750, "characters": ["Dragunov"]},
            {"place": 4, "player": "CBM", "points": 300, "prize": 1375, "characters": ["Jin Kazama"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "ATIF", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 0, "winner": "ATIF"},
            {"round": "Losers Finals", "p1": "Arslan Ash", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"},
            {"round": "Grand Finals", "p1": "ATIF", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 1, "winner": "ATIF"}
        ]
    },
    "CEO/2025": {
        "placements": [
            {"place": 1, "player": "Arslan Ash", "points": 800, "prize": 8000, "characters": ["Zafina"]},
            {"place": 2, "player": "ULSAN", "points": 500, "prize": 4000, "characters": ["Dragunov"]},
            {"place": 3, "player": "double", "points": 400, "prize": 2000, "characters": ["Marshall Law"]},
            {"place": 4, "player": "ATIF", "points": 300, "prize": 1000, "characters": ["Dragunov"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Arslan Ash", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"},
            {"round": "Losers Finals", "p1": "ULSAN", "p2": "double", "p1_score": 3, "p2_score": 1, "winner": "ULSAN"},
            {"round": "Grand Finals", "p1": "Arslan Ash", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"}
        ]
    },
    "EVO/2025": {
        "placements": [
            {"place": 1, "player": "Mulgold", "points": 1000, "prize": 15000, "characters": ["Claudio Serafino"]},
            {"place": 2, "player": "ULSAN", "points": 700, "prize": 7500, "characters": ["Dragunov"]},
            {"place": 3, "player": "Arslan Ash", "points": 550, "prize": 3750, "characters": ["Zafina"]},
            {"place": 4, "player": "ATIF", "points": 450, "prize": 1875, "characters": ["Dragunov"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Mulgold", "p2": "ULSAN", "p1_score": 3, "p2_score": 1, "winner": "Mulgold"},
            {"round": "Losers Finals", "p1": "ULSAN", "p2": "Arslan Ash", "p1_score": 3, "p2_score": 2, "winner": "ULSAN"},
            {"round": "Grand Finals", "p1": "Mulgold", "p2": "ULSAN", "p1_score": 3, "p2_score": 2, "winner": "Mulgold"}
        ]
    },
    "Tekken_World_Tour/2025/Finals": {
        "placements": [
            {"place": 1, "player": "Arslan Ash", "points": 2000, "prize": 60000, "characters": ["Zafina", "Ling Xiaoyu"]},
            {"place": 2, "player": "Mulgold", "points": 1500, "prize": 30000, "characters": ["Claudio Serafino"]},
            {"place": 3, "player": "ULSAN", "points": 1000, "prize": 15000, "characters": ["Dragunov"]},
            {"place": 4, "player": "ATIF", "points": 800, "prize": 8000, "characters": ["Dragunov"]}
        ],
        "matches": [
            {"round": "Winners Finals", "p1": "Arslan Ash", "p2": "Mulgold", "p1_score": 3, "p2_score": 2, "winner": "Arslan Ash"},
            {"round": "Losers Finals", "p1": "Mulgold", "p2": "ULSAN", "p1_score": 3, "p2_score": 1, "winner": "Mulgold"},
            {"round": "Grand Finals", "p1": "Arslan Ash", "p2": "Mulgold", "p1_score": 3, "p2_score": 1, "winner": "Arslan Ash"}
        ]
    }
}
