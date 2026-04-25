# 🎯 Cart System - Quick Reference Guide

## 📁 Files Created/Modified

### Backend
```
backend/
├── common/
│   ├── models/
│   │   └── Cart.js (NEW) ✨
│   ├── controllers/
│   │   └── cartController.js (NEW) ✨
│   └── Routes/
│       └── cartRoutes.js (NEW) ✨
└── server.js (MODIFIED) 🔄
    └── Added: import cartRouter
    └── Added: app.use("/api/cart", cartRouter)
```

### Frontend
```
frontend/src/
├── api/
│   └── cartApi.js (NEW) ✨
├── pages/
│   └── Cart.jsx (NEW) ✨
├── components/
│   ├── CartMini.jsx (NEW) ✨
│   └── TopNavbar.jsx (MODIFIED) 🔄
│       └── Added: import CartMini
│       └── Added: {user.role === 'student' && <CartMini />}
└── App.jsx (MODIFIED) 🔄
    └── Added: import Cart from './pages/Cart'
    └── Added: <Route path="/cart" element={<Cart />} />
```

### Documentation
```
root/
├── CART_IMPLEMENTATION_SUMMARY.md (NEW) 📄
├── CART_UI_GUIDE.md (NEW) 📄
└── CART_TESTING_CHECKLIST.md (NEW) 📄
```

---

## 🚀 Quick Setup

### Step 1: Backend Already Integrated
✅ All backend files created and server.js updated
✅ Just ensure MongoDB connection is working

### Step 2: Frontend Already Integrated
✅ All frontend files created
✅ Routes configured in App.jsx
✅ CartMini added to TopNavbar

### Step 3: Ready to Test
```bash
# Terminal 1: Start Backend
cd backend && npm start

# Terminal 2: Start Frontend
cd frontend && npm run dev

# Navigate to: http://localhost:5173
```

---

## 🔗 Main Endpoints

### API Endpoints (All POST/GET/PUT/DELETE to `/api/cart`)
```
POST   /api/cart/add           - Add item
GET    /api/cart               - Get cart
PUT    /api/cart/update        - Update quantity
DELETE /api/cart/remove        - Remove item
DELETE /api/cart/clear         - Clear all
POST   /api/cart/checkout      - Place order
```

### Frontend Routes (All require authentication)
```
GET  /cart          - View cart page
GET  /canteens      - Select canteen
GET  /order/:id     - Browse menu & add items
```

---

## 💡 Key Concepts

### Authentication
```javascript
// Every API call includes:
Authorization: Bearer <JWT_TOKEN>

// Token stored in localStorage as: smartqueue_token
```

### Cart Structure
```javascript
{
  student: ObjectId,
  canteen: ObjectId,
  items: [
    {
      foodItem: ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      image: String (optional)
    }
  ],
  totalPrice: Number // Auto-calculated
}
```

### Order From Checkout
```javascript
{
  student: ObjectId,
  canteen: ObjectId,
  items: Array,
  totalPrice: Number,
  status: 'Pending',
  paymentMethod: 'Cash|Card|Wallet',
  paymentStatus: 'Pending|Paid',
  timeSlot: {
    startTime: String,
    endTime: String,
    date: String
  },
  orderToken: String,
  orderID: String
}
```

---

## 🎯 Feature Checklist

### Core Features
- ✅ Add items to cart
- ✅ Update quantity
- ✅ Remove items
- ✅ Clear cart
- ✅ View total price
- ✅ Redeem loyalty points
- ✅ Select payment method
- ✅ Checkout to order

### UI/UX Features
- ✅ Real-time calculations
- ✅ Cart badge in header
- ✅ Error messages
- ✅ Loading states
- ✅ Success screens
- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Image support

### Security Features
- ✅ Authentication required
- ✅ Authorization checks
- ✅ Input validation
- ✅ Price protection
- ✅ Token management

---

## 🧪 Quick Test Commands (Postman)

### 1. Add Item
```
POST http://localhost:5000/api/cart/add
Header: Authorization: Bearer YOUR_TOKEN

{
  "canteenID": "CANTEEN_ID",
  "foodItemID": "FOOD_ID",
  "quantity": 2
}
```

### 2. Get Cart
```
GET http://localhost:5000/api/cart
Header: Authorization: Bearer YOUR_TOKEN
```

### 3. Update Quantity
```
PUT http://localhost:5000/api/cart/update
Header: Authorization: Bearer YOUR_TOKEN

{
  "foodItemID": "FOOD_ID",
  "quantity": 5
}
```

### 4. Remove Item
```
DELETE http://localhost:5000/api/cart/remove
Header: Authorization: Bearer YOUR_TOKEN

{
  "foodItemID": "FOOD_ID"
}
```

### 5. Checkout
```
POST http://localhost:5000/api/cart/checkout
Header: Authorization: Bearer YOUR_TOKEN

{
  "paymentMethod": "Cash",
  "redeemPoints": 50,
  "timeSlot": {
    "startTime": "12:00",
    "endTime": "12:05",
    "date": "2026-04-25"
  }
}
```

---

## 🎨 UI Highlights

### Header
```
User Avatar | Wallet Info | Points | 🛒 (Cart) | 🔔 (Notifications) | Logout
```

### Cart Page
```
[Shopping Cart] ← Back Link

Left Column (60%)       Right Column (40%)
├─ Items List           ├─ Order Summary
├─ Item Cards           ├─ Subtotal
├─ Canteen Info         ├─ Point Redemption
└─ Actions              ├─ Total
                        ├─ Payment Method
                        └─ Checkout Button
```

### Cart Item Card
```
┌─────────────────────────────────────┐
│ Item Name                           │
│ Rs. 350 per item                    │
│ [Image if available]                │
│ − Qty + | Total | 🗑️              │
└─────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
User Action (Add to Cart)
    ↓
React Component (StudentOrder.jsx)
    ↓
CartApi.js (HTTP Request)
    ↓
Express Server (cartRoutes.js)
    ↓
Middleware: authenticate()
    ↓
Controller: addToCart()
    ↓
MongoDB: Cart.findOneAndUpdate()
    ↓
Response JSON
    ↓
React State Update
    ↓
UI Re-render (Cart Page Updates)
    ↓
User Sees Changes
```

---

## 🔍 File Size Reference

```
Backend Models:       ~1 KB (Cart.js)
Backend Controller:   ~8 KB (cartController.js)
Backend Routes:       ~1 KB (cartRoutes.js)
Frontend API:         ~2 KB (cartApi.js)
Frontend Page:        ~9 KB (Cart.jsx)
Frontend Component:   ~2 KB (CartMini.jsx)
─────────────────────────────
Total New Code:       ~23 KB
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cart not found" | User hasn't added any items yet. This is expected. |
| "Cannot add from different canteen" | Clear cart first, then add new items |
| "Insufficient loyalty points" | Redeem less points than available |
| "Cart API returning 401" | Token expired, login again |
| Cart badge not updating | Refresh page or wait 5 seconds (auto-refresh) |
| "Cannot checkout" | Ensure cart has items and payment method selected |
| Items not showing images | Images may fail to load; app handles gracefully |

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔄 Component Relationships

```
App.jsx (Routes)
├── StudentLayout
│   ├── TopNavbar
│   │   ├── CartMini ← NEW
│   │   └── NotificationBell
│   ├── StudentSidebar
│   └── Routes
│       ├── Cart ← NEW
│       ├── StudentCanteens
│       ├── StudentOrder
│       └── ...
```

---

## 🎓 Redux/State Management

Currently using **Local Component State (React Hooks)**:
```javascript
// In Cart.jsx
const [cart, setCart] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

// Fetch on mount
useEffect(() => {
  fetchCart();
}, []);
```

---

## 🔐 Token Management

```javascript
// Token stored in localStorage
localStorage.getItem('smartqueue_token')

// Automatically included in all requests via cartApi.js
const getHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`
});

// getToken() function in storage.js:
export const getToken = () => localStorage.getItem('smartqueue_token');
```

---

## 📞 Development Commands

```bash
# Backend
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with nodemon

# Frontend
npm install         # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## ✨ Next Steps

1. **Test the system** (See CART_TESTING_CHECKLIST.md)
2. **Verify all features work** 
3. **Check responsive design** on different devices
4. **Test payment methods** (Cash/Card/Wallet)
5. **Test error scenarios** (empty cart, insufficient points, etc.)
6. **Deploy to production** when ready

---

## 📚 Documentation

- **CART_IMPLEMENTATION_SUMMARY.md** - Detailed overview
- **CART_UI_GUIDE.md** - UI components guide
- **CART_TESTING_CHECKLIST.md** - Comprehensive testing
- **This file** - Quick reference

---

**Status:** ✅ READY FOR TESTING  
**Last Updated:** April 25, 2026  
**Version:** 1.0.0

