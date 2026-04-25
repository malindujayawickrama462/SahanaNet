# 🛒 Smart Queue - Cart System UI Guide

## Overview
The cart system has been fully implemented with a modern, user-friendly interface. Students can now browse menus, add items to their cart, and checkout with multiple payment options.

---

## 📁 Files Created

### Backend
- **`backend/common/models/Cart.js`** - Cart data model
- **`backend/common/controllers/cartController.js`** - Cart logic and API handlers
- **`backend/common/Routes/cartRoutes.js`** - Cart API endpoints

### Frontend
- **`frontend/src/api/cartApi.js`** - Cart API client
- **`frontend/src/pages/Cart.jsx`** - Full cart page component
- **`frontend/src/components/CartMini.jsx`** - Cart icon badge component

---

## 🎨 UI Components

### 1. **Cart Mini (Header Badge)** 
Location: `CartMini.jsx`

Shows a shopping cart icon with item count in the header:
```
🛒 
  5  ← Item count badge
```

**Features:**
- Auto-refreshes every 5 seconds
- Shows total quantity of items
- Clickable to navigate to full cart page

### 2. **Full Cart Page**
Location: `Cart.jsx`

#### Layout:
```
┌─────────────────────────────────────────────────────────────┐
│  Shopping Cart                            [← Back to Canteens]
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Items in Cart (2 items)        │    Order Summary           │
│  ┌─────────────────────────┐    │    ┌──────────────────┐   │
│  │ Biryani               │    │    │ Subtotal: Rs. 700│   │
│  │ Rs. 350 per item      │    │    │                  │   │
│  │ − 2 +                 │    │    │ Redeem Points    │   │
│  │        Rs. 700    🗑️   │    │    │ ┌──────────────┐ │   │
│  └─────────────────────────┘    │    │ │ 50           │ │   │
│                                  │    │ └──────────────┘ │   │
│  ┌─────────────────────────┐    │    │                  │   │
│  │ Sandwich              │    │    │ Final Total      │   │
│  │ Rs. 250 per item      │    │    │ Rs. 650          │   │
│  │ − 1 +                 │    │    │                  │   │
│  │        Rs. 250    🗑️   │    │    ├──────────────────┤   │
│  └─────────────────────────┘    │    │ Payment Method   │   │
│                                  │    │ ○ Cash  ○ Card   │   │
│  Canteen                         │    │ ○ Wallet         │   │
│  ┌─────────────────────────┐    │    │                  │   │
│  │ Main Canteen           │    │    │ [Place Order]    │   │
│  │ 📍 Building A          │    │    │ [Clear Cart]     │   │
│  └─────────────────────────┘    │    └──────────────────┘   │
│                                  │                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow

### Step 1: Browse Canteens
```
StudentCanteens Page
    ↓
Select Canteen → Proceed to Order
```

### Step 2: Browse Menu & Add Items
```
StudentOrder Page
    ↓
View Menu Items
    ↓
Click "+" Button → Item Added to Cart
    ↓
View Cart in Sidebar
```

### Step 3: View & Manage Cart
```
Click Cart Icon (Header)
    ↓
Cart.jsx Page Opens
    ↓
Options:
  • Update Quantities (−/+)
  • Remove Items (🗑️)
  • Clear Cart
  • Apply Loyalty Points
  • Select Payment Method
```

### Step 4: Checkout
```
Select Payment Method
    ↓
(Optional) Redeem Loyalty Points
    ↓
Click "Place Order"
    ↓
Order Success Screen
    ↓
Show Order Token & Status
```

---

## 🎯 Key Features

### ✅ Add to Cart
- Add items from multiple canteens (within same canteen only)
- Automatic quantity tracking
- Real-time total calculation

### ✅ Cart Management
- **Update Quantity**: Use − / + buttons
- **Remove Item**: Click 🗑️ button
- **Clear Cart**: Remove all items at once
- **View Canteen**: See which canteen items are from

### ✅ Loyalty Points
- Redeem points for discount
- 1 point = 1 LKR discount
- Max redeemable = cart total

### ✅ Payment Methods
- 💵 **Cash** - Pay at counter
- 💳 **Card** - Online payment (generates invoice)
- 👛 **Wallet** - Smart Queue wallet

### ✅ Order Tracking
- Real-time order status
- Order token display
- Status updates: Pending → Verified → Ready → Completed

---

## 📱 Responsive Design

The cart UI is fully responsive:

```
Desktop (lg):          Tablet (md):           Mobile (sm):
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Items  │Summary │   │                 │   │                 │
│        │        │   │   Full Width    │   │   Full Width    │
│        │        │   │                 │   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
(2 columns)        (1 column stacked)    (1 column stacked)
```

---

## 🔗 API Endpoints Used

```javascript
// Get cart
GET /api/cart

// Add item
POST /api/cart/add
Body: { canteenID, foodItemID, quantity }

// Update item quantity
PUT /api/cart/update
Body: { foodItemID, quantity }

// Remove item
DELETE /api/cart/remove
Body: { foodItemID }

// Clear cart
DELETE /api/cart/clear

// Checkout
POST /api/cart/checkout
Body: { paymentMethod, redeemPoints, timeSlot }
```

---

## 🧭 Navigation

### From StudentLayout Sidebar:

Add this link to your navigation:
```jsx
<Link to="/cart">
  🛒 Shopping Cart
</Link>
```

### Quick Access:
- Cart Icon in Header (CartMini component)
- Direct URL: `/cart`

---

## 🎨 Color Scheme

```
Background:     slate-950 (dark)
Text Primary:   slate-100 (light)
Text Secondary: slate-400 (muted)
Accent Success: emerald-500 (green)
Accent Info:    blue-500 (blue)
Accent Warning: amber-500 (orange)
Accent Error:   red-500 (red)
```

---

## 📊 Component States

### Empty Cart
```
Your Cart is Empty 🛒
No items in your cart yet.
[Continue Shopping]
```

### Loading
```
Loading your cart...
```

### Error
```
❌ Error Message
Failed to fetch cart items
```

### Order Success
```
Order Placed! ✅
Order Token: SQ-001-1200
Status: Pending
Total: Rs. 700
[Back to Home]
```

---

## 🔐 Authentication

All cart endpoints require:
```
Authorization: Bearer <token>
```

Token is automatically included in `cartApi.js` from localStorage.

---

## 📝 Example Checkout Flow

```javascript
// 1. User adds item to cart
await addToCart(canteenID, foodItemID, 2);

// 2. User views cart
const { cart } = await getCart();
// Output: 
// {
//   canteen: { name: "Main Canteen", ... },
//   items: [
//     { name: "Biryani", quantity: 2, price: 350 },
//     { name: "Sandwich", quantity: 1, price: 250 }
//   ],
//   totalPrice: 950
// }

// 3. User applies points and checks out
await checkoutCart('Cash', 50); // Redeem 50 points
// Output:
// {
//   order: { 
//     orderToken: "SQ-001-1200",
//     status: "Pending",
//     totalPrice: 900  // 950 - 50
//   },
//   pointsEarned: 9  // 900 / 100
// }
```

---

## 🚀 Getting Started

### 1. **Start Backend Server**
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

### 2. **Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. **Test Cart**
1. Login as a student
2. Go to Canteens
3. Select a canteen
4. Browse menu and add items
5. Click 🛒 icon to view cart
6. Proceed to checkout

---

## 💡 Tips

- **Loyalty Points**: Every 100 LKR spent = 1 point earned
- **Cart Persistence**: Cart is stored in backend database (per student)
- **One Canteen Rule**: Cannot mix items from different canteens
- **Auto-refresh**: CartMini badge auto-refreshes every 5 seconds
- **Mobile Friendly**: All UI is optimized for mobile devices

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cart doesn't load | Check backend is running on port 5000 |
| "Cart is empty" error | Items expire after 24 hours. Re-add them |
| Can't add from different canteen | Clear cart first, then add new items |
| Points won't redeem | Max redeemable = cart total |
| Invoice not generating | Only generated for Card payments |

---

## 📞 Support

For issues or feature requests, contact the development team.

