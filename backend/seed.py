"""Seed data for Album House Prop Store database."""
import uuid


def _id():
    return str(uuid.uuid4())


SEED_SITE_CONFIG = {
    "brand": "Album House Prop Store",
    "tagline": "Handcrafted with love. Designed to make tiny moments unforgettable.",
    "announcements": [
        "FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE INR 999",
        "NEW ARRIVALS EVERY WEEK — HANDMADE WITH LOVE",
        "TRY OUR AI PROP STYLIST — FIND YOUR PERFECT BUNDLE IN 60 SECONDS",
    ],
    "primaryColor": "#E85A4F",
    "secondaryColor": "#0F4C5C",
    "accentColor": "#F2C94C",
    "creamColor": "#FFF8F0",
    "textColor": "#2D1B0F",
    "instagram": "https://www.instagram.com/",
    "email": "hello@albumhousepropstore.com",
    "aboutText": "Album House Prop Store crafts every prop, every wrap, every backdrop with a single belief — that the first photographs of a baby deserve to feel like fine art. Designed for photographers, loved by families.",
    "heroSubText": "Handcrafted, handpicked photography props with a bold soul.",
}


SEED_PRODUCTS = [
    # New Arrivals - using high quality real product imagery
    {"id": _id(), "name": "Vintage Blossom Doorway - Baby Printed Backdrop", "tag": "Made to Order", "sale": True, "price": 1299, "regularPrice": 1499, "save": "13%", "image": "https://madraspropstore.com/cdn/shop/files/VintageBlossomDoorway.jpg?v=1779347408&width=1080", "hover": None, "category": "new-arrivals", "description": "Handcrafted blossom doorway backdrop — perfect for whimsical baby portraits.", "order": 1},
    {"id": _id(), "name": "Rose Corridor - Maternity Backdrop", "tag": "Made to Order", "sale": True, "price": 4199, "regularPrice": 5999, "save": "30%", "image": "https://madraspropstore.com/cdn/shop/files/RoseCorridor-Maternity.jpg?v=1779703215&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/RoseCorridor-8x10.jpg?v=1779703215&width=1000", "category": "new-arrivals", "description": "A romantic rose corridor for breathtaking maternity portraits.", "order": 2},
    {"id": _id(), "name": "Royal Lotus Haven - Printed Backdrop 8x12", "tag": "Sold Out", "sale": True, "price": 4899, "regularPrice": 6499, "save": "25%", "image": "https://madraspropstore.com/cdn/shop/files/Royal-Lotus-Haven_8x12_01e2adde-644a-4dfb-8c9b-b2f6b7e93d61.jpg?v=1779709617&width=1080", "hover": None, "category": "new-arrivals", "description": "A traditional palace-inspired lotus backdrop for regal portraits.", "order": 3},
    {"id": _id(), "name": "Adventure Begins at One - Baby Printed Backdrop", "tag": "Made to Order", "sale": True, "price": 1299, "regularPrice": 1499, "save": "13%", "image": "https://madraspropstore.com/cdn/shop/files/AdventureBeginsatOne.jpg?v=1779341329&width=1080", "hover": None, "category": "new-arrivals", "description": "Hot-air balloon themed first-birthday backdrop.", "order": 4},
    {"id": _id(), "name": "Blue Floral Window - Baby Printed Backdrop", "tag": "Made to Order", "sale": True, "price": 1299, "regularPrice": 1499, "save": "13%", "image": "https://madraspropstore.com/cdn/shop/files/BlueFloralWindow.jpg?v=1779341941&width=1080", "hover": None, "category": "new-arrivals", "description": "Dreamy floral window backdrop in soft blue tones.", "order": 5},
    {"id": _id(), "name": "Floral Garden Door - Baby Printed Backdrop", "tag": "Made to Order", "sale": True, "price": 1299, "regularPrice": 1499, "save": "13%", "image": "https://madraspropstore.com/cdn/shop/files/FloralGardenDoor.jpg?v=1779345484&width=1080", "hover": None, "category": "new-arrivals", "description": "Charming garden door with hanging florals.", "order": 6},
    {"id": _id(), "name": "Sandy Shores - Baby Printed Backdrop", "tag": "Made to Order", "sale": True, "price": 1299, "regularPrice": 1499, "save": "13%", "image": "https://madraspropstore.com/cdn/shop/files/SandyShores.jpg?v=1779346697&width=1080", "hover": None, "category": "new-arrivals", "description": "Beachy, sun-kissed shore backdrop for baby beach themes.", "order": 7},
    {"id": _id(), "name": "Sunlit Roses - Baby Printed Backdrop", "tag": "Made to Order", "sale": True, "price": 1299, "regularPrice": 1499, "save": "13%", "image": "https://madraspropstore.com/cdn/shop/files/SunlitRoses.jpg?v=1779347101&width=1080", "hover": None, "category": "new-arrivals", "description": "Sun-drenched rose garden — perfect for golden hour portraits.", "order": 8},
    {"id": _id(), "name": "Newborn Headset and Mini Radio Combo", "tag": "Ready to Ship", "sale": False, "price": 1599, "regularPrice": None, "save": None, "image": "https://madraspropstore.com/cdn/shop/files/NewbornHeadsetandMiniRadioCombo_Felted.jpg?v=1780491361&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/NewbornHeadsetandMiniRadioCombo_Felted_1.jpg?v=1780491361&width=1000", "category": "new-arrivals", "description": "Adorable felted headset & radio combo for filler photography props.", "order": 9},
    {"id": _id(), "name": "Neutral Arch - Maternity Backdrop", "tag": "Made to Order", "sale": True, "price": 4199, "regularPrice": 5999, "save": "30%", "image": "https://madraspropstore.com/cdn/shop/files/NeutralArch-Maternity.jpg?v=1779702245&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/NeutralArch-8x10.jpg?v=1779702245&width=1000", "category": "new-arrivals", "description": "Minimalist neutral arch — timeless and elegant.", "order": 10},
    {"id": _id(), "name": "Tropical Serenity - Maternity Backdrop", "tag": "Made to Order", "sale": True, "price": 4199, "regularPrice": 5999, "save": "30%", "image": "https://madraspropstore.com/cdn/shop/files/TropicalSerenity-Maternity.jpg?v=1779707060&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/TropicalSerenity-8x10.jpg?v=1779707060&width=1000", "category": "new-arrivals", "description": "Lush tropical backdrop — bold yet calming.", "order": 11},
    {"id": _id(), "name": "Wrap-Around Sofa Posing Prop", "tag": "Ready to Ship", "sale": False, "price": 7999, "regularPrice": None, "save": None, "image": "https://madraspropstore.com/cdn/shop/files/Wrap-AroundSofa.jpg?v=1777551389&width=1080", "hover": None, "category": "new-arrivals", "description": "A statement sofa for cake smash & milestone shoots.", "order": 12},

    # Ready-made themes
    {"id": _id(), "name": "Setup 702 — 6 Sets Bundle", "tag": "Ready to Ship", "sale": True, "price": 49999, "regularPrice": 54763, "save": "9%", "image": "https://madraspropstore.com/cdn/shop/files/702-wed.jpg?v=1778485016&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/Setup_-_701_10_sets_8.jpg?v=1778482995&width=1000", "category": "ready-themes", "description": "Six-piece curated setup bundle.", "order": 1},
    {"id": _id(), "name": "Setup 701 — 10 Sets Bundle", "tag": "Ready to Ship", "sale": True, "price": 74999, "regularPrice": 85122, "save": "12%", "image": "https://madraspropstore.com/cdn/shop/files/Setup_-_701_10_sets_9.jpg?v=1778482995&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/Setup_-_701_10_sets_4.jpg?v=1778482994&width=1000", "category": "ready-themes", "description": "Ten-piece curated setup bundle for premium studios.", "order": 2},
    {"id": _id(), "name": "Setup 0699 — 15 Sets Bundle", "tag": "Ready to Ship", "sale": True, "price": 99999, "regularPrice": 111360, "save": "10%", "image": "https://madraspropstore.com/cdn/shop/files/Setup_-_0699_15_sets_14.jpg?v=1777527631&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/Setup_-_0699_15_sets_3.jpg?v=1777527348&width=1000", "category": "ready-themes", "description": "Mega 15-piece studio starter setup.", "order": 3},
    {"id": _id(), "name": "Setup 0697 — 6 Sets Bundle", "tag": "Ready to Ship", "sale": True, "price": 49999, "regularPrice": 52531, "save": "5%", "image": "https://madraspropstore.com/cdn/shop/files/Setup_-_0697_6_sets_6.jpg?v=1776248914&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/Setup_-_0697_6_sets_5.jpg?v=1776248914&width=1000", "category": "ready-themes", "description": "Six-piece elegant curated setup.", "order": 4},
    {"id": _id(), "name": "Setup 0698 — 15 Sets Bundle", "tag": "Ready to Ship", "sale": True, "price": 99999, "regularPrice": 111615, "save": "10%", "image": "https://madraspropstore.com/cdn/shop/files/Setup_-_0698_15_sets_15.jpg?v=1777264922&width=1080", "hover": "https://madraspropstore.com/cdn/shop/files/Setup_-_0698_15_sets_11.jpg?v=1777264922&width=1000", "category": "ready-themes", "description": "Big-impact 15-piece bundle.", "order": 5},
    {"id": _id(), "name": "Setup 0695", "tag": "Ready to Ship", "sale": True, "price": 14999, "regularPrice": 17392, "save": "14%", "image": "https://madraspropstore.com/cdn/shop/files/0695.jpg?v=1773490452&width=1080", "hover": None, "category": "ready-themes", "description": "Curated themed setup.", "order": 6},
    {"id": _id(), "name": "Setup 0694", "tag": "Ready to Ship", "sale": True, "price": 9999, "regularPrice": 12122, "save": "18%", "image": "https://madraspropstore.com/cdn/shop/files/0694.jpg?v=1773377765&width=1080", "hover": None, "category": "ready-themes", "description": "Budget-friendly curated theme setup.", "order": 7},
    {"id": _id(), "name": "Setup 0692", "tag": "Ready to Ship", "sale": False, "price": 19414, "regularPrice": None, "save": None, "image": "https://madraspropstore.com/cdn/shop/files/Setup-0692.jpg?v=1771407884&width=1080", "hover": None, "category": "ready-themes", "description": "Curated theme setup with vintage tones.", "order": 8},

    # Few more product types for AI quiz matching
    {"id": _id(), "name": "Boho Newborn Pillow Set", "tag": "Ready to Ship", "sale": False, "price": 1899, "regularPrice": None, "save": None, "image": "https://madraspropstore.com/cdn/shop/files/NewbornHeadsetandMiniRadioCombo_Felted_1.jpg?v=1780491361&width=1000", "hover": None, "category": "baby", "description": "Soft handwoven boho pillow set for newborn poses.", "order": 1},
    {"id": _id(), "name": "Podium for Posing — 19 inches", "tag": "Ready to Ship", "sale": False, "price": 2699, "regularPrice": None, "save": None, "image": "https://madraspropstore.com/cdn/shop/files/PodiumForBabies.jpg?v=1750654447&width=1080", "hover": None, "category": "baby", "description": "Sturdy podium for sitting baby poses.", "order": 2},
    {"id": _id(), "name": "Filler Props Mini Pack", "tag": "Ready to Ship", "sale": False, "price": 899, "regularPrice": None, "save": None, "image": "https://madraspropstore.com/cdn/shop/files/IMG_9797_3233ed96-bee3-493e-90c8-e4db0fa1da91.jpg?v=1731938548&width=5040", "hover": None, "category": "baby", "description": "Adorable filler props bundle — under 999.", "order": 3},
]


SEED_THEMES = [
    {"id": _id(), "title": "Jungle Theme", "image": "https://madraspropstore.com/cdn/shop/collections/MPS_JUNGLE.jpg?v=1746189776&width=1080", "order": 1},
    {"id": _id(), "title": "Space & Aviation", "image": "https://madraspropstore.com/cdn/shop/collections/107987.jpg?v=1726637231&width=1080", "order": 2},
    {"id": _id(), "title": "Beach Vibes", "image": "https://madraspropstore.com/cdn/shop/collections/107986.jpg?v=1726637284&width=1080", "order": 3},
    {"id": _id(), "title": "Birthday Party", "image": "https://madraspropstore.com/cdn/shop/collections/WhatsApp_Image_2024-09-04_at_18.26.48.jpg?v=1726637322&width=1080", "order": 4},
    {"id": _id(), "title": "Little Chef", "image": "https://madraspropstore.com/cdn/shop/collections/107996.jpg?v=1726637370&width=1080", "order": 5},
    {"id": _id(), "title": "Royal Traditional", "image": "https://madraspropstore.com/cdn/shop/collections/107993.jpg?v=1726637411&width=1080", "order": 6},
    {"id": _id(), "title": "Boss Babe", "image": "https://madraspropstore.com/cdn/shop/collections/MPS-BOSS.jpg?v=1777291770&width=1080", "order": 7},
    {"id": _id(), "title": "Bath & Spa Time", "image": "https://madraspropstore.com/cdn/shop/collections/107991.jpg?v=1726637492&width=1080", "order": 8},
]


SEED_BANNERS = [
    # Hero banners
    {"id": _id(), "type": "hero", "desktop": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=2400&q=85", "mobile": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=900&q=85", "alt": "Album House — Where Tiny Moments Become Heirlooms", "tag": "", "title": "", "cta": "", "order": 1},
    {"id": _id(), "type": "hero", "desktop": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=2400&q=85", "mobile": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=900&q=85", "alt": "Newborn Collection", "tag": "", "title": "", "cta": "", "order": 2},
    {"id": _id(), "type": "hero", "desktop": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=2400&q=85", "mobile": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=900&q=85", "alt": "Maternity Backdrops", "tag": "", "title": "", "cta": "", "order": 3},
    # Promo banners (image stays, content editable)
    {"id": _id(), "type": "promo", "image": "https://madraspropstore.com/cdn/shop/files/IMG_9797_3233ed96-bee3-493e-90c8-e4db0fa1da91.jpg?v=1731938548&width=5040", "tag": "Under 999 INR", "title": "Filler Props", "cta": "Shop Now", "order": 1},
    {"id": _id(), "type": "promo", "image": "https://madraspropstore.com/cdn/shop/files/IMG_2387.jpg?v=1731938548&width=5040", "tag": "Budget-friendly newborn sets", "title": "Mini Sets Under 4999 INR", "cta": "Grab Now", "order": 2},
    {"id": _id(), "type": "promo", "image": "https://madraspropstore.com/cdn/shop/files/IMG_9485.jpg?v=1731938548&width=5760", "tag": "International Collaboration", "title": "The Premium Knit Collection", "cta": "Shop This", "order": 3},
]


SEED_REVIEWS = [
    {"id": _id(), "stars": 5, "title": "Absolutely loved the quality!", "body": "The texture and finish of the backdrop is premium. My clients couldn't stop praising the final shoot.", "author": "Priya Sharma", "date": "07/15/2026", "product": "Rose Corridor - Maternity Backdrop"},
    {"id": _id(), "stars": 5, "title": "Best prop store in India", "body": "I have been buying from Album House for 2 years now. The attention to detail and packaging is unmatched.", "author": "Aakansha Verma", "date": "07/09/2026", "product": "Setup 701 — 10 Sets Bundle"},
    {"id": _id(), "stars": 5, "title": "AI quiz nailed my style!", "body": "Tried their AI prop stylist and ended up buying everything it recommended. Genius idea!", "author": "Divya Iyer", "date": "07/02/2026", "product": "Boho Newborn Pillow Set"},
    {"id": _id(), "stars": 5, "title": "Worth every rupee", "body": "Sturdy podium, lovely finish, and easy to clean. Will buy again.", "author": "Karthik Nair", "date": "06/22/2026", "product": "Podium for Posing — 19 inches"},
    {"id": _id(), "stars": 4, "title": "Beautifully crafted", "body": "The blossom doorway is gorgeous. Slight delay in shipping but the result was worth it.", "author": "Meera Patel", "date": "06/15/2026", "product": "Vintage Blossom Doorway"},
    {"id": _id(), "stars": 5, "title": "Tropical serenity is stunning", "body": "Used this for a maternity shoot and the colours pop beautifully in natural light.", "author": "Anjali Mehta", "date": "06/08/2026", "product": "Tropical Serenity - Maternity Backdrop"},
    {"id": _id(), "stars": 5, "title": "Premium feel", "body": "Felted props are super cute and incredibly well-made. Highly recommend.", "author": "Riya Kapoor", "date": "05/29/2026", "product": "Newborn Headset and Mini Radio Combo"},
    {"id": _id(), "stars": 5, "title": "Five stars for sure", "body": "The wrap-around sofa is a showstopper. My cake smash sessions look 10x better.", "author": "Sneha Reddy", "date": "05/20/2026", "product": "Wrap-Around Sofa Posing Prop"},
]


SEED_STORES = [
    {"id": _id(), "name": "Album House Prop Store, Chennai", "image": "https://madraspropstore.com/cdn/shop/files/Chn-store.jpg?v=1726653106", "address": "75 Anjugam Nagar, 3rd Street, Jafferkhanpet, Chennai, Tamil Nadu 600 083", "phone": "+91-877 800 5580", "extra": "(For prop rentals in Chennai, contact +91-73057 55580)", "hours": "Monday to Saturday  •  10:00 am – 6:00 pm"},
    {"id": _id(), "name": "Album House Prop Store, Hyderabad", "image": "https://madraspropstore.com/cdn/shop/files/Hyd-store.jpg?v=1726653106", "address": "2nd floor, Plot 256, Shree Radha Krishna Trade Center, Venkata Ramana Colony, KPHB, Kukatpally, Hyderabad, Telangana 500 085", "phone": "+91-89787 05580", "extra": "(No rentals in Hyderabad)", "hours": "Monday to Saturday  •  10:30 am – 6:30 pm"},
]


SEED_MENTORS = [
    {"id": _id(), "name": "Aakansha's Picks", "image": "https://madraspropstore.com/cdn/shop/files/107990.png?v=1726564359&width=1080", "order": 1},
    {"id": _id(), "name": "Shamiya's Picks", "image": "https://madraspropstore.com/cdn/shop/files/107992.png?v=1726564576&width=1080", "order": 2},
    {"id": _id(), "name": "Tarveen's Picks", "image": "https://madraspropstore.com/cdn/shop/files/107989.png?v=1726564508&width=1080", "order": 3},
]


SEED_STUDIO_BOOKINGS = [
    {"id": _id(), "line1": "Book our Studio in Chennai", "heading": "Call 87780 05580", "sub": "at the most affordable pricing", "cta": "Book Now", "image": "https://madraspropstore.com/cdn/shop/files/Studio_6ad0a928-d660-4a9f-90eb-b6a673d35b6f.jpg?v=1732364656&width=2880", "whatsapp": "918778005580", "order": 1},
    {"id": _id(), "line1": "Rent our premium props at Chennai", "heading": "Call 73057 55580", "sub": "at the most affordable pricing", "cta": "Book Now", "image": "https://madraspropstore.com/cdn/shop/files/rental-props_9d121337-331e-4e03-8184-91d5509ab56a.jpg?v=1732365817&width=3226", "whatsapp": "917305755580", "order": 2},
    {"id": _id(), "line1": "Studio in Hyderabad", "heading": "Call 89787 05580", "sub": "premium studios, affordable pricing", "cta": "Book Now", "image": "https://madraspropstore.com/cdn/shop/files/Midway.jpg?v=1732366781&width=1782", "whatsapp": "918978705580", "order": 3},
]
