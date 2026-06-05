import os
import psycopg2
from psycopg2.extras import execute_values

DB_URL = "postgresql://postgres:wallsplat_secret@localhost:5432/wallsplat"

# Characters data
CHARACTERS = [
    {"name": "Alisa Bosconovich", "portrait_url": "/characters/portraits/alisa.png", "icon_url": "/characters/icons/alisa.png"},
    {"name": "Asuka Kazama", "portrait_url": "/characters/portraits/asuka.png", "icon_url": "/characters/icons/asuka.png"},
    {"name": "Azucena", "portrait_url": "/characters/portraits/azucena.png", "icon_url": "/characters/icons/azucena.png"},
    {"name": "Bryan Fury", "portrait_url": "/characters/portraits/bryan.png", "icon_url": "/characters/icons/bryan.png"},
    {"name": "Claudio Serafino", "portrait_url": "/characters/portraits/claudio.png", "icon_url": "/characters/icons/claudio.png"},
    {"name": "Devil Jin", "portrait_url": "/characters/portraits/devil_jin.png", "icon_url": "/characters/icons/devil_jin.png"},
    {"name": "Dragunov", "portrait_url": "/characters/portraits/dragunov.png", "icon_url": "/characters/icons/dragunov.png"},
    {"name": "Eddy Gordo", "portrait_url": "/characters/portraits/eddy.png", "icon_url": "/characters/icons/eddy.png"},
    {"name": "Feng Wei", "portrait_url": "/characters/portraits/feng.png", "icon_url": "/characters/icons/feng.png"},
    {"name": "Hwoarang", "portrait_url": "/characters/portraits/hwoarang.png", "icon_url": "/characters/icons/hwoarang.png"},
    {"name": "Jack-8", "portrait_url": "/characters/portraits/jack-8.png", "icon_url": "/characters/icons/jack-8.png"},
    {"name": "Jin Kazama", "portrait_url": "/characters/portraits/jin.png", "icon_url": "/characters/icons/jin.png"},
    {"name": "Jun Kazama", "portrait_url": "/characters/portraits/jun.png", "icon_url": "/characters/icons/jun.png"},
    {"name": "Kazuya Mishima", "portrait_url": "/characters/portraits/kazuya.png", "icon_url": "/characters/icons/kazuya.png"},
    {"name": "King", "portrait_url": "/characters/portraits/king.png", "icon_url": "/characters/icons/king.png"},
    {"name": "Kuma", "portrait_url": "/characters/portraits/kuma.png", "icon_url": "/characters/icons/kuma.png"},
    {"name": "Lars Alexandersson", "portrait_url": "/characters/portraits/lars.png", "icon_url": "/characters/icons/lars.png"},
    {"name": "Lee Chaolan", "portrait_url": "/characters/portraits/lee.png", "icon_url": "/characters/icons/lee.png"},
    {"name": "Leo", "portrait_url": "/characters/portraits/leo.png", "icon_url": "/characters/icons/leo.png"},
    {"name": "Leroy Smith", "portrait_url": "/characters/portraits/leroy.png", "icon_url": "/characters/icons/leroy.png"},
    {"name": "Lidia Sobieska", "portrait_url": "/characters/portraits/lidia.png", "icon_url": "/characters/icons/lidia.png"},
    {"name": "Lili", "portrait_url": "/characters/portraits/lili.png", "icon_url": "/characters/icons/lili.png"},
    {"name": "Ling Xiaoyu", "portrait_url": "/characters/portraits/xiaoyu.png", "icon_url": "/characters/icons/xiaoyu.png"},
    {"name": "Marshall Law", "portrait_url": "/characters/portraits/law.png", "icon_url": "/characters/icons/law.png"},
    {"name": "Nina Williams", "portrait_url": "/characters/portraits/nina.png", "icon_url": "/characters/icons/nina.png"},
    {"name": "Panda", "portrait_url": "/characters/portraits/panda.png", "icon_url": "/characters/icons/panda.png"},
    {"name": "Paul Phoenix", "portrait_url": "/characters/portraits/paul.png", "icon_url": "/characters/icons/paul.png"},
    {"name": "Raven", "portrait_url": "/characters/portraits/raven.png", "icon_url": "/characters/icons/raven.png"},
    {"name": "Reina", "portrait_url": "/characters/portraits/reina.png", "icon_url": "/characters/icons/reina.png"},
    {"name": "Shaheen", "portrait_url": "/characters/portraits/shaheen.png", "icon_url": "/characters/icons/shaheen.png"},
    {"name": "Steve Fox", "portrait_url": "/characters/portraits/steve.png", "icon_url": "/characters/icons/steve.png"},
    {"name": "Victor Chevalier", "portrait_url": "/characters/portraits/victor.png", "icon_url": "/characters/icons/victor.png"},
    {"name": "Yoshimitsu", "portrait_url": "/characters/portraits/yoshimitsu.png", "icon_url": "/characters/icons/yoshimitsu.png"},
    {"name": "Zafina", "portrait_url": "/characters/portraits/zafina.png", "icon_url": "/characters/icons/zafina.png"},
    {"name": "Heihachi Mishima", "portrait_url": "/characters/portraits/heihachi.png", "icon_url": "/characters/icons/heihachi.png"},
]

# Known Players data (combined seed list and extracted list)
PLAYERS = [
    {"name": "Arslan Ash", "real_name": "Arslan Siddique", "nationality": "Pakistan", "country_code": "PK", "flag_emoji": "🇵🇰", "liquipedia_url": "Arslan_Ash"},
    {"name": "ULSAN", "real_name": "Lim Soo-hoon", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Ulsan"},
    {"name": "Mulgold", "real_name": "Han Jae-woo", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Mulgold"},
    {"name": "ATIF", "real_name": "Atif Butt", "nationality": "Pakistan", "country_code": "PK", "flag_emoji": "🇵🇰", "liquipedia_url": "Atif_Butt"},
    {"name": "kkokkoma", "real_name": "Kim Mu-jong", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Kkokkoma"},
    {"name": "AK", "real_name": "Alexandre Laverez", "nationality": "Philippines", "country_code": "PH", "flag_emoji": "🇵🇭", "liquipedia_url": "AK"},
    {"name": "THE JON", "real_name": "Bilal Ilyas", "nationality": "Pakistan", "country_code": "PK", "flag_emoji": "🇵🇰", "liquipedia_url": "The_Jon"},
    {"name": "Shadow 20z", "real_name": "Marquis Jordan", "nationality": "United States", "country_code": "US", "flag_emoji": "🇺🇸", "liquipedia_url": "Shadow_20z"},
    {"name": "Chikurin", "real_name": "Yuta Take", "nationality": "Japan", "country_code": "JP", "flag_emoji": "🇯🇵", "liquipedia_url": "Chikurin"},
    {"name": "JoKa", "real_name": "Jowin Howtian", "nationality": "United Kingdom", "country_code": "GB", "flag_emoji": "🇬🇧", "liquipedia_url": "JoKa"},
    {"name": "Rangchu", "real_name": "Jung Hyeon-ho", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Rangchu"},
    {"name": "Raef", "real_name": "Raef Al-Jamil", "nationality": "Saudi Arabia", "country_code": "SA", "flag_emoji": "🇸🇦", "liquipedia_url": "Raef"},
    {"name": "Chanel", "real_name": "Kang Seong-ho", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Chanel"},
    {"name": "CBM", "real_name": "Kim Jae-hyun", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "CherryBerryMango"},
    {"name": "double", "real_name": "Shoji Takakubo", "nationality": "Japan", "country_code": "JP", "flag_emoji": "🇯🇵", "liquipedia_url": "Double"},
    {"name": "Nobi", "real_name": "Daichi Nakayama", "nationality": "Japan", "country_code": "JP", "flag_emoji": "🇯🇵", "liquipedia_url": "Nobi"},
    {"name": "Farzeen", "real_name": "Farzeen Butt", "nationality": "Pakistan", "country_code": "PK", "flag_emoji": "🇵🇰", "liquipedia_url": "Farzeen"},
    {"name": "LowHigh", "real_name": "Yoon Sun-woong", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "LowHigh"},
    {"name": "Jodd", "real_name": "Jodd", "nationality": "France", "country_code": "FR", "flag_emoji": "🇫🇷", "liquipedia_url": "Jodd"},
    {"name": "leemishima", "real_name": "Lee Mishima", "nationality": "Argentina", "country_code": "AR", "flag_emoji": "🇦🇷", "liquipedia_url": "Leemishima"},
    {"name": "JeonDDing", "real_name": "Sang-hyun Lim", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Jeondding"},
    {"name": "KingReyJr", "real_name": "Rey Jr", "nationality": "United States", "country_code": "US", "flag_emoji": "🇺🇸", "liquipedia_url": "KingReyJr"},
    {"name": "KEISUKE", "real_name": "Keisuke", "nationality": "Japan", "country_code": "JP", "flag_emoji": "🇯🇵", "liquipedia_url": "Keisuke"},
    {"name": "Book", "real_name": "Nopparut Hempamorn", "nationality": "Thailand", "country_code": "TH", "flag_emoji": "🇹🇭", "liquipedia_url": "Book"},
    {"name": "Fear Of Silence", "real_name": "Fear Of Silence", "nationality": "United States", "country_code": "US", "flag_emoji": "🇺🇸", "liquipedia_url": "Fear_Of_Silence"},
    {"name": "Knee", "real_name": "Jae-min Bae", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "Knee"},
    {"name": "JDCR", "real_name": "Hyun-jin Kim", "nationality": "South Korea", "country_code": "KR", "flag_emoji": "🇰🇷", "liquipedia_url": "JDCR"},
    {"name": "Anakin", "real_name": "Stephen Arnold", "nationality": "USA", "country_code": "US", "flag_emoji": "🇺🇸", "liquipedia_url": "Anakin"},
    {"name": "Awais Honey", "real_name": "Awais Honey", "nationality": "Pakistan", "country_code": "PK", "flag_emoji": "🇵🇰", "liquipedia_url": "Awais_Honey"},
    {"name": "Tissuemon", "real_name": "Tissuemon", "nationality": "Taiwan", "country_code": "TW", "flag_emoji": "🇹🇼", "liquipedia_url": "Tissuemon"},
]

# Tournaments data
TOURNAMENTS = [
    # 2024
    {"name": "EVO Japan 2024", "short_name": "EVOJP24", "start_date": "2024-04-27", "end_date": "2024-04-29", "location": "Tokyo, Japan", "country_code": "JP", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "EVO_Japan/2024"},
    {"name": "Combo Breaker 2024", "short_name": "CB24", "start_date": "2024-05-24", "end_date": "2024-05-26", "location": "Schaumburg, IL, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "Combo_Breaker/2024"},
    {"name": "CEO 2024", "short_name": "CEO24", "start_date": "2024-06-28", "end_date": "2024-06-30", "location": "Daytona Beach, FL, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "CEO/2024"},
    {"name": "VSFighting 2024", "short_name": "VSF24", "start_date": "2024-08-16", "end_date": "2024-08-18", "location": "Birmingham, UK", "country_code": "GB", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "VSFighting/2024"},
    {"name": "EVO 2024", "short_name": "EVO24", "start_date": "2024-07-19", "end_date": "2024-07-21", "location": "Las Vegas, NV, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "EVO/2024"},
    {"name": "CEOtaku 2024", "short_name": "CEOtaku24", "start_date": "2024-10-18", "end_date": "2024-10-20", "location": "Orlando, FL, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "CEOtaku/2024"},
    {"name": "Tekken World Tour 2024 Finals", "short_name": "TWT24F", "start_date": "2024-12-07", "end_date": "2024-12-08", "location": "San Francisco, CA, USA", "country_code": "US", "tier": "PREMIER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "Tekken_World_Tour/2024/Finals"},
    
    # 2024 Community Majors
    {"name": "Red Bull Kumite 2024", "short_name": "RBK24", "start_date": "2024-03-16", "end_date": "2024-03-17", "location": "New York City, NY, USA", "country_code": "US", "tier": "MAJOR", "region": "GLOBAL", "is_twt_official": False, "liquipedia_url": "Red_Bull_Kumite/2024"},
    {"name": "Battle of BC 6", "short_name": "BOBC6", "start_date": "2024-03-29", "end_date": "2024-03-31", "location": "Vancouver, Canada", "country_code": "CA", "tier": "MAJOR", "region": "GLOBAL", "is_twt_official": False, "liquipedia_url": "Battle_of_BC/6"},
    {"name": "The Mixup 2024", "short_name": "MIXUP24", "start_date": "2024-04-13", "end_date": "2024-04-14", "location": "Lyon, France", "country_code": "FR", "tier": "MAJOR", "region": "GLOBAL", "is_twt_official": False, "liquipedia_url": "The_Mixup/2024"},
    {"name": "DreamHack Dallas 2024", "short_name": "DHD24", "start_date": "2024-05-31", "end_date": "2024-06-02", "location": "Dallas, TX, USA", "country_code": "US", "tier": "MAJOR", "region": "GLOBAL", "is_twt_official": False, "liquipedia_url": "DreamHack_Dallas/2024"},
    {"name": "Frosty Faustings XVI", "short_name": "FFXVI", "start_date": "2024-01-25", "end_date": "2024-01-28", "location": "Lombard, IL, USA", "country_code": "US", "tier": "MAJOR", "region": "GLOBAL", "is_twt_official": False, "liquipedia_url": "Frosty_Faustings/XVI"},

    # 2025
    {"name": "EVO Japan 2025", "short_name": "EVOJP25", "start_date": "2025-04-25", "end_date": "2025-04-27", "location": "Tokyo, Japan", "country_code": "JP", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "EVO_Japan/2025"},
    {"name": "Combo Breaker 2025", "short_name": "CB25", "start_date": "2025-05-23", "end_date": "2025-05-25", "location": "Schaumburg, IL, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "Combo_Breaker/2025"},
    {"name": "CEO 2025", "short_name": "CEO25", "start_date": "2025-06-27", "end_date": "2025-06-29", "location": "Daytona Beach, FL, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "CEO/2025"},
    {"name": "EVO 2025", "short_name": "EVO25", "start_date": "2025-07-18", "end_date": "2025-07-20", "location": "Las Vegas, NV, USA", "country_code": "US", "tier": "TWT_MASTER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "EVO/2025"},
    {"name": "Tekken World Tour 2025 Finals", "short_name": "TWT25F", "start_date": "2025-12-06", "end_date": "2025-12-07", "location": "Tokyo, Japan", "country_code": "JP", "tier": "PREMIER", "region": "GLOBAL", "is_twt_official": True, "liquipedia_url": "Tekken_World_Tour/2025/Finals"},
]

def seed_db():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("Seeding characters...")
    char_tuples = [(c["name"], c["portrait_url"], c["icon_url"]) for c in CHARACTERS]
    execute_values(
        cur,
        """
        INSERT INTO characters (name, portrait_url, icon_url)
        VALUES %s
        ON CONFLICT (name) DO UPDATE
        SET portrait_url = EXCLUDED.portrait_url, icon_url = EXCLUDED.icon_url
        """,
        char_tuples
    )
    
    print("Seeding players...")
    player_tuples = [(p["name"], p["real_name"], p["nationality"], p["country_code"], p["flag_emoji"], p["liquipedia_url"]) for p in PLAYERS]
    execute_values(
        cur,
        """
        INSERT INTO players (name, real_name, nationality, country_code, flag_emoji, liquipedia_url)
        VALUES %s
        ON CONFLICT (liquipedia_url) DO UPDATE
        SET name = EXCLUDED.name, real_name = EXCLUDED.real_name, nationality = EXCLUDED.nationality,
            country_code = EXCLUDED.country_code, flag_emoji = EXCLUDED.flag_emoji
        """,
        player_tuples
    )

    print("Seeding tournaments...")
    tourney_tuples = [(t["name"], t["short_name"], t["start_date"], t["end_date"], t["location"], t["country_code"], t["tier"], t["region"], t["is_twt_official"], t["liquipedia_url"]) for t in TOURNAMENTS]
    execute_values(
        cur,
        """
        INSERT INTO tournaments (name, short_name, start_date, end_date, location, country_code, tier, region, is_twt_official, liquipedia_url)
        VALUES %s
        ON CONFLICT (liquipedia_url) DO UPDATE
        SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date, location = EXCLUDED.location, country_code = EXCLUDED.country_code,
            tier = EXCLUDED.tier, region = EXCLUDED.region, is_twt_official = EXCLUDED.is_twt_official
        """,
        tourney_tuples
    )
    
    conn.commit()
    cur.close()
    conn.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
