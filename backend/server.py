"""Album House Prop Store backend — FastAPI + MongoDB + JWT admin + AI quiz."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Any
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt as pyjwt
from emergentintegrations.llm.chat import LlmChat, UserMessage

from seed import SEED_PRODUCTS, SEED_THEMES, SEED_BANNERS, SEED_REVIEWS, SEED_STORES, SEED_SITE_CONFIG, SEED_MENTORS, SEED_STUDIO_BOOKINGS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ.get("JWT_SECRET", "change-me")
ADMIN_USER = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "admin")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Album House Prop Store API")
api = APIRouter(prefix="/api")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login", auto_error=False)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# ===================== Models =====================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    username: str
    password: str

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tag: Optional[str] = None
    sale: bool = False
    price: float
    regularPrice: Optional[float] = None
    save: Optional[str] = None
    image: str
    hover: Optional[str] = None
    category: str = "new-arrivals"  # new-arrivals | ready-themes | maternity | baby
    description: Optional[str] = ""
    order: int = 0

class ProductIn(BaseModel):
    name: str
    tag: Optional[str] = None
    sale: bool = False
    price: float
    regularPrice: Optional[float] = None
    save: Optional[str] = None
    image: str
    hover: Optional[str] = None
    category: str = "new-arrivals"
    description: Optional[str] = ""
    order: int = 0

class Theme(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    image: str
    order: int = 0

class ThemeIn(BaseModel):
    title: str
    image: str
    order: int = 0

class Banner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # hero | promo
    desktop: Optional[str] = None
    mobile: Optional[str] = None
    image: Optional[str] = None
    alt: Optional[str] = ""
    tag: Optional[str] = ""
    title: Optional[str] = ""
    cta: Optional[str] = ""
    order: int = 0

class BannerIn(BaseModel):
    type: str
    desktop: Optional[str] = None
    mobile: Optional[str] = None
    image: Optional[str] = None
    alt: Optional[str] = ""
    tag: Optional[str] = ""
    title: Optional[str] = ""
    cta: Optional[str] = ""
    order: int = 0

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    stars: int = 5
    title: str
    body: str
    author: str
    date: str
    product: str

class ReviewIn(BaseModel):
    stars: int = 5
    title: str
    body: str
    author: str
    date: str
    product: str

class Store(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image: str
    address: str
    phone: str
    extra: str = ""
    hours: str

class StoreIn(BaseModel):
    name: str
    image: str
    address: str
    phone: str
    extra: str = ""
    hours: str

class SiteConfig(BaseModel):
    brand: str = "Album House Prop Store"
    tagline: str = "Handcrafted with love. Designed to make tiny moments unforgettable."
    announcements: List[str] = []
    primaryColor: str = "#E85A4F"
    secondaryColor: str = "#0F4C5C"
    accentColor: str = "#F2C94C"
    creamColor: str = "#FFF8F0"
    textColor: str = "#2D1B0F"
    instagram: str = "https://www.instagram.com/"
    email: str = "hello@albumhousepropstore.com"
    aboutText: str = ""
    heroSubText: str = ""

class QuizRequest(BaseModel):
    subject: str  # newborn | baby | maternity | kids
    style: str  # boho | fairytale | vintage | modern | traditional
    color: str  # warm | cool | neutral | bold
    setting: str  # studio | outdoor | both
    budget: str  # under-5k | 5k-15k | 15k-50k | premium
    occasion: Optional[str] = ""

class QuizResponse(BaseModel):
    title: str
    message: str
    categories: List[str]
    products: List[Product]

class MentorPick(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image: str
    order: int = 0

class StudioBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    line1: str
    heading: str
    sub: str
    cta: str
    image: str
    whatsapp: str
    order: int = 0


# ===================== Auth =====================

def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

def verify_password(p: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), hashed.encode())
    except Exception:
        return False

def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "iat": datetime.now(timezone.utc),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def require_admin(token: Optional[str] = Depends(oauth2_scheme)) -> str:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ===================== Helpers =====================

def strip_id(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc.pop("_id")
    return doc


# ===================== Public endpoints =====================

@api.get("/")
async def root():
    return {"message": "Album House Prop Store API", "version": "1.0"}

@api.get("/site-config", response_model=SiteConfig)
async def get_site_config():
    cfg = await db.site_config.find_one({"_key": "main"})
    if not cfg:
        return SiteConfig()
    cfg.pop("_id", None)
    cfg.pop("_key", None)
    return SiteConfig(**cfg)

@api.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, q: Optional[str] = None, limit: int = 200):
    query: dict = {}
    if category:
        query["category"] = category
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    docs = await db.products.find(query).sort("order", 1).to_list(limit)
    return [Product(**strip_id(d)) for d in docs]

@api.get("/products/{pid}", response_model=Product)
async def get_product(pid: str):
    doc = await db.products.find_one({"id": pid})
    if not doc:
        raise HTTPException(404, "Product not found")
    return Product(**strip_id(doc))

@api.get("/themes", response_model=List[Theme])
async def list_themes():
    docs = await db.themes.find().sort("order", 1).to_list(100)
    return [Theme(**strip_id(d)) for d in docs]

@api.get("/banners", response_model=List[Banner])
async def list_banners(type: Optional[str] = None):
    q: dict = {}
    if type:
        q["type"] = type
    docs = await db.banners.find(q).sort("order", 1).to_list(100)
    return [Banner(**strip_id(d)) for d in docs]

@api.get("/reviews", response_model=List[Review])
async def list_reviews():
    docs = await db.reviews.find().to_list(100)
    return [Review(**strip_id(d)) for d in docs]

@api.get("/stores", response_model=List[Store])
async def list_stores():
    docs = await db.stores.find().to_list(50)
    return [Store(**strip_id(d)) for d in docs]

@api.get("/mentor-picks", response_model=List[MentorPick])
async def list_mentor_picks():
    docs = await db.mentor_picks.find().sort("order", 1).to_list(50)
    return [MentorPick(**strip_id(d)) for d in docs]

@api.get("/studio-bookings", response_model=List[StudioBooking])
async def list_studio_bookings():
    docs = await db.studio_bookings.find().sort("order", 1).to_list(50)
    return [StudioBooking(**strip_id(d)) for d in docs]


# ===================== Admin auth =====================

@api.post("/admin/login", response_model=TokenResponse)
async def admin_login(body: LoginRequest):
    if body.username != ADMIN_USER or body.password != ADMIN_PASS:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(body.username)
    return TokenResponse(access_token=token)

@api.get("/admin/me")
async def admin_me(username: str = Depends(require_admin)):
    return {"username": username}


# ===================== Admin CRUD =====================

@api.put("/admin/site-config", response_model=SiteConfig)
async def update_site_config(cfg: SiteConfig, _: str = Depends(require_admin)):
    payload = cfg.dict()
    payload["_key"] = "main"
    await db.site_config.update_one({"_key": "main"}, {"$set": payload}, upsert=True)
    return cfg

@api.post("/admin/products", response_model=Product)
async def create_product(p: ProductIn, _: str = Depends(require_admin)):
    obj = Product(**p.dict())
    await db.products.insert_one(obj.dict())
    return obj

@api.put("/admin/products/{pid}", response_model=Product)
async def update_product(pid: str, p: ProductIn, _: str = Depends(require_admin)):
    upd = p.dict()
    res = await db.products.update_one({"id": pid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Product not found")
    doc = await db.products.find_one({"id": pid})
    return Product(**strip_id(doc))

@api.delete("/admin/products/{pid}")
async def delete_product(pid: str, _: str = Depends(require_admin)):
    res = await db.products.delete_one({"id": pid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return {"ok": True}

@api.post("/admin/themes", response_model=Theme)
async def create_theme(t: ThemeIn, _: str = Depends(require_admin)):
    obj = Theme(**t.dict())
    await db.themes.insert_one(obj.dict())
    return obj

@api.put("/admin/themes/{tid}", response_model=Theme)
async def update_theme(tid: str, t: ThemeIn, _: str = Depends(require_admin)):
    res = await db.themes.update_one({"id": tid}, {"$set": t.dict()})
    if res.matched_count == 0:
        raise HTTPException(404, "Theme not found")
    doc = await db.themes.find_one({"id": tid})
    return Theme(**strip_id(doc))

@api.delete("/admin/themes/{tid}")
async def delete_theme(tid: str, _: str = Depends(require_admin)):
    res = await db.themes.delete_one({"id": tid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Theme not found")
    return {"ok": True}

@api.post("/admin/banners", response_model=Banner)
async def create_banner(b: BannerIn, _: str = Depends(require_admin)):
    obj = Banner(**b.dict())
    await db.banners.insert_one(obj.dict())
    return obj

@api.put("/admin/banners/{bid}", response_model=Banner)
async def update_banner(bid: str, b: BannerIn, _: str = Depends(require_admin)):
    res = await db.banners.update_one({"id": bid}, {"$set": b.dict()})
    if res.matched_count == 0:
        raise HTTPException(404, "Banner not found")
    doc = await db.banners.find_one({"id": bid})
    return Banner(**strip_id(doc))

@api.delete("/admin/banners/{bid}")
async def delete_banner(bid: str, _: str = Depends(require_admin)):
    res = await db.banners.delete_one({"id": bid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Banner not found")
    return {"ok": True}

@api.post("/admin/reviews", response_model=Review)
async def create_review(r: ReviewIn, _: str = Depends(require_admin)):
    obj = Review(**r.dict())
    await db.reviews.insert_one(obj.dict())
    return obj

@api.delete("/admin/reviews/{rid}")
async def delete_review(rid: str, _: str = Depends(require_admin)):
    res = await db.reviews.delete_one({"id": rid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Review not found")
    return {"ok": True}


# ===================== AI Quiz =====================

QUIZ_SYSTEM = """You are a friendly photography prop curator for Album House Prop Store —
a premium handcrafted prop store for newborn, baby, maternity, and kids photography.

Given a customer's quiz answers, recommend the 3 most relevant product CATEGORIES from this
fixed list (use these exact strings):
- Newborn Wraps & Pillows
- Maternity Backdrops
- Vintage Beds & Sofa Props
- Floral Backdrops
- Boho Posing Props
- Themed Setups (Jungle / Beach / Royal / Boss Babe)
- Cake Smash & Birthday Props
- Traditional Backdrops
- Bath Time Props
- Posing Aids & Stands
- Filler Props (Under 999)
- Mini Sets (Under 4999)

Respond ONLY as compact valid JSON, no markdown:
{
  "title": "<a short catchy bundle title, max 6 words>",
  "message": "<a warm 2-3 sentence message addressing the customer's needs>",
  "categories": ["<cat1>", "<cat2>", "<cat3>"]
}"""


@api.post("/quiz/recommend", response_model=QuizResponse)
async def quiz_recommend(req: QuizRequest):
    user_text = (
        f"Subject of shoot: {req.subject}\n"
        f"Style preference: {req.style}\n"
        f"Color mood: {req.color}\n"
        f"Setting: {req.setting}\n"
        f"Budget range: {req.budget}\n"
        f"Occasion: {req.occasion or 'general portfolio'}\n"
    )

    title = "Your Curated Prop Bundle"
    message = "We've handpicked a beautiful collection that matches your style and budget."
    categories: List[str] = []

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"quiz-{uuid.uuid4()}",
            system_message=QUIZ_SYSTEM,
        ).with_model("openai", "gpt-4o-mini")
        resp = await chat.send_message(UserMessage(text=user_text))
        text = resp if isinstance(resp, str) else str(resp)
        # Try to extract JSON
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            data = json.loads(text[start:end + 1])
            title = data.get("title", title)
            message = data.get("message", message)
            categories = data.get("categories", []) or []
    except Exception as e:
        logger.warning(f"Quiz LLM failed, using fallback: {e}")
        # Deterministic fallback so the UX always works
        fallback_map = {
            "newborn": ["Newborn Wraps & Pillows", "Posing Aids & Stands", "Filler Props (Under 999)"],
            "maternity": ["Maternity Backdrops", "Floral Backdrops", "Boho Posing Props"],
            "baby": ["Cake Smash & Birthday Props", "Themed Setups (Jungle / Beach / Royal / Boss Babe)", "Vintage Beds & Sofa Props"],
            "kids": ["Themed Setups (Jungle / Beach / Royal / Boss Babe)", "Cake Smash & Birthday Props", "Traditional Backdrops"],
        }
        categories = fallback_map.get(req.subject, ["Newborn Wraps & Pillows", "Floral Backdrops", "Filler Props (Under 999)"])

    # Pick up to 6 matching products from DB based on category keywords
    products: List[Product] = []
    seen_ids: set = set()
    keywords_per_cat = {
        "Newborn Wraps & Pillows": ["wrap", "pillow", "newborn"],
        "Maternity Backdrops": ["maternity"],
        "Vintage Beds & Sofa Props": ["sofa", "bed", "vintage"],
        "Floral Backdrops": ["floral", "rose", "blossom", "garden"],
        "Boho Posing Props": ["boho", "podium", "bean"],
        "Themed Setups (Jungle / Beach / Royal / Boss Babe)": ["setup", "jungle", "beach", "royal", "boss"],
        "Cake Smash & Birthday Props": ["birthday", "cake", "carnival"],
        "Traditional Backdrops": ["traditional", "darbar", "vintage", "lotus"],
        "Bath Time Props": ["bath"],
        "Posing Aids & Stands": ["podium", "stand", "posing"],
        "Filler Props (Under 999)": ["filler", "headset", "radio"],
        "Mini Sets (Under 4999)": ["mini", "set"],
    }

    for cat in categories:
        kws = keywords_per_cat.get(cat, [])
        docs = await db.products.find().to_list(200)
        for d in docs:
            if any(k.lower() in d.get("name", "").lower() for k in kws):
                if d["id"] in seen_ids:
                    continue
                seen_ids.add(d["id"])
                products.append(Product(**strip_id(d)))
                if len(products) >= 6:
                    break
        if len(products) >= 6:
            break

    # Fallback: if we couldn't find any product, return any 4
    if not products:
        docs = await db.products.find().limit(4).to_list(4)
        products = [Product(**strip_id(d)) for d in docs]

    return QuizResponse(
        title=title,
        message=message,
        categories=categories,
        products=products[:6],
    )


# ===================== Seed on startup =====================

async def seed_database():
    # Site config
    existing = await db.site_config.find_one({"_key": "main"})
    if not existing:
        await db.site_config.update_one(
            {"_key": "main"},
            {"$set": {**SEED_SITE_CONFIG, "_key": "main"}},
            upsert=True,
        )

    seeds = [
        ("products", SEED_PRODUCTS),
        ("themes", SEED_THEMES),
        ("banners", SEED_BANNERS),
        ("reviews", SEED_REVIEWS),
        ("stores", SEED_STORES),
        ("mentor_picks", SEED_MENTORS),
        ("studio_bookings", SEED_STUDIO_BOOKINGS),
    ]
    for coll, data in seeds:
        count = await db[coll].count_documents({})
        if count == 0 and data:
            await db[coll].insert_many([dict(d) for d in data])
            logger.info(f"Seeded {len(data)} into {coll}")


@app.on_event("startup")
async def on_startup():
    try:
        await seed_database()
    except Exception as e:
        logger.error(f"Seed failed: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
