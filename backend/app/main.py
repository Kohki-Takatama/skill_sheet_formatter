from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload

from .database import Base, engine, get_db
from .models import CartItem, Order, OrderItem, Product
from .schemas import (
    CartItemCreate,
    CartItemProduct,
    CartItemResponse,
    CartItemUpdate,
    ErrorResponse,
    MessageResponse,
    OrderDetailResponse,
    OrderItemResponse,
    OrderResponse,
    ProductResponse,
)
from .seed import seed_initial_data

FIXED_USER_ID = 1


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Mobile Order Mock Backend", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "エラーが発生しました。"
    return JSONResponse(status_code=exc.status_code, content={"message": message})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={"message": "入力値が不正です。"})


@app.exception_handler(Exception)
async def generic_exception_handler(_: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"message": "想定外エラーが発生しました。"})


def to_cart_item_response(cart_item: CartItem) -> CartItemResponse:
    product = cart_item.product
    return CartItemResponse(
        id=cart_item.id,
        product=CartItemProduct(id=product.id, name=product.name, price=product.price, image_url=product.image_url),
        quantity=cart_item.quantity,
        subtotal=cart_item.quantity * product.price,
    )


@app.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active.is_(True)).order_by(Product.id.asc()).all()


@app.get("/cart-items", response_model=list[CartItemResponse])
def get_cart_items(db: Session = Depends(get_db)):
    items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == FIXED_USER_ID)
        .order_by(CartItem.id.asc())
        .all()
    )
    return [to_cart_item_response(item) for item in items]


@app.post("/cart-items", response_model=CartItemResponse, responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}})
def add_cart_item(payload: CartItemCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="商品が存在しません。")
    if not product.is_active:
        raise HTTPException(status_code=409, detail="販売停止中の商品は追加できません。")

    item = db.query(CartItem).filter(CartItem.user_id == FIXED_USER_ID, CartItem.product_id == payload.product_id).first()
    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(user_id=FIXED_USER_ID, product_id=payload.product_id, quantity=payload.quantity)
        db.add(item)

    db.commit()
    db.refresh(item)
    db.refresh(item, attribute_names=["product"])
    return to_cart_item_response(item)


@app.patch("/cart-items/{cart_item_id}", response_model=CartItemResponse, responses={404: {"model": ErrorResponse}})
def update_cart_item(cart_item_id: int, payload: CartItemUpdate, db: Session = Depends(get_db)):
    item = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.id == cart_item_id, CartItem.user_id == FIXED_USER_ID)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="カート商品が存在しません。")

    item.quantity = payload.quantity
    db.commit()
    db.refresh(item)
    return to_cart_item_response(item)


@app.delete("/cart-items/{cart_item_id}", response_model=MessageResponse, responses={404: {"model": ErrorResponse}})
def delete_cart_item(cart_item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == FIXED_USER_ID).first()
    if not item:
        raise HTTPException(status_code=404, detail="カート商品が存在しません。")
    db.delete(item)
    db.commit()
    return MessageResponse(message="カート商品を削除しました。")


@app.post("/orders", response_model=OrderDetailResponse, responses={409: {"model": ErrorResponse}})
def create_order(db: Session = Depends(get_db)):
    try:
        cart_items = (
            db.query(CartItem)
            .options(joinedload(CartItem.product))
            .filter(CartItem.user_id == FIXED_USER_ID)
            .all()
        )
        if not cart_items:
            raise HTTPException(status_code=409, detail="カートが空です。")

        total_amount = sum(item.quantity * item.product.price for item in cart_items)
        order = Order(user_id=FIXED_USER_ID, status="ordered", total_amount=total_amount)
        db.add(order)
        db.flush()

        order_items = []
        for ci in cart_items:
            oi = OrderItem(
                order_id=order.id,
                product_id=ci.product_id,
                product_name_at_order=ci.product.name,
                price_at_order=ci.product.price,
                quantity=ci.quantity,
            )
            db.add(oi)
            order_items.append(oi)

        for ci in cart_items:
            db.delete(ci)

        db.commit()
        db.refresh(order)

        return OrderDetailResponse(
            id=order.id,
            status=order.status,
            total_amount=order.total_amount,
            ordered_at=order.ordered_at,
            items=[
                OrderItemResponse(
                    product_id=oi.product_id,
                    product_name=oi.product_name_at_order,
                    price=oi.price_at_order,
                    quantity=oi.quantity,
                    subtotal=oi.price_at_order * oi.quantity,
                )
                for oi in order_items
            ],
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


@app.get("/orders", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == FIXED_USER_ID).order_by(Order.ordered_at.desc()).all()
    return [OrderResponse(id=o.id, status=o.status, total_amount=o.total_amount, ordered_at=o.ordered_at) for o in orders]


@app.get("/orders/{order_id}", response_model=OrderDetailResponse, responses={404: {"model": ErrorResponse}})
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id, Order.user_id == FIXED_USER_ID)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="注文が存在しません。")

    return OrderDetailResponse(
        id=order.id,
        status=order.status,
        total_amount=order.total_amount,
        ordered_at=order.ordered_at,
        items=[
            OrderItemResponse(
                product_id=i.product_id,
                product_name=i.product_name_at_order,
                price=i.price_at_order,
                quantity=i.quantity,
                subtotal=i.price_at_order * i.quantity,
            )
            for i in order.items
        ],
    )
