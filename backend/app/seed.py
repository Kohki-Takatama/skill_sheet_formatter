from sqlalchemy.orm import Session

from .models import Product, User


INITIAL_PRODUCTS = [
    {"name": "アイスコーヒー", "description": "すっきり飲みやすいアイスコーヒーです。", "price": 350},
    {"name": "ホットコーヒー", "description": "香り高いホットコーヒーです。", "price": 300},
    {"name": "カフェラテ", "description": "ミルクたっぷりのカフェラテです。", "price": 450},
    {"name": "紅茶", "description": "やさしい香りの紅茶です。", "price": 320},
    {"name": "サンドイッチ", "description": "具だくさんのサンドイッチです。", "price": 600},
    {"name": "チーズケーキ", "description": "濃厚なチーズケーキです。", "price": 500},
]


def seed_initial_data(db: Session):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        db.add(User(id=1, name="Mock User", email="mock-user@example.com"))

    product_count = db.query(Product).count()
    if product_count == 0:
        for p in INITIAL_PRODUCTS:
            db.add(Product(**p, image_url="https://placehold.co/300x200", is_active=True))

    db.commit()
