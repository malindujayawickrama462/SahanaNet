# 🧪 Cart System - Testing Checklist

## ✅ Backend Testing (Postman)

### Cart Endpoints

#### 1. Add to Cart
```
POST http://localhost:5000/api/cart/add
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json

Body:
{
  "canteenID": "canteen_id_here",
  "foodItemID": "food_item_id_here",
  "quantity": 2
}

Expected Response (201):
{
  "message": "Item added to cart",
  "cart": {
    "_id": "...",
    "student": "...",
    "canteen": "...",
    "items": [...],
    "totalPrice": 700
  }
}
```

#### 2. Get Cart
```
GET http://localhost:5000/api/cart
Headers:
  Authorization: Bearer <your_token>

Expected Response (200):
{
  "cart": {
    "_id": "...",
    "student": "...",
    "canteen": {
      "_id": "...",
      "name": "Main Canteen",
      "location": "Building A"
    },
    "items": [
      {
        "foodItem": "...",
        "name": "Biryani",
        "quantity": 2,
        "price": 350,
        "image": "url"
      }
    ],
    "totalPrice": 700,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### 3. Update Cart Item
```
PUT http://localhost:5000/api/cart/update
Headers:
  Authorization: Bearer <your_token>

Body:
{
  "foodItemID": "food_item_id_here",
  "quantity": 5
}

Expected Response (200):
{
  "message": "Cart updated",
  "cart": { ... }
}
```

#### 4. Remove from Cart
```
DELETE http://localhost:5000/api/cart/remove
Headers:
  Authorization: Bearer <your_token>

Body:
{
  "foodItemID": "food_item_id_here"
}

Expected Response (200):
{
  "message": "Item removed from cart",
  "cart": { ... }
}
```

#### 5. Clear Cart
```
DELETE http://localhost:5000/api/cart/clear
Headers:
  Authorization: Bearer <your_token>

Expected Response (200):
{
  "message": "Cart cleared successfully"
}
```

#### 6. Checkout
```
POST http://localhost:5000/api/cart/checkout
Headers:
  Authorization: Bearer <your_token>

Body:
{
  "paymentMethod": "Cash",
  "redeemPoints": 50,
  "timeSlot": {
    "startTime": "12:00",
    "endTime": "12:05",
    "date": "2026-04-25"
  }
}

Expected Response (201):
{
  "message": "Order placed successfully from cart",
  "order": {
    "_id": "...",
    "orderID": "EN-001",
    "orderToken": "SQ-001-1200",
    "student": "...",
    "canteen": "...",
    "items": [...],
    "totalPrice": 900,
    "status": "Pending",
    "paymentStatus": "Pending",
    "timeSlot": { ... }
  },
  "pointsEarned": 9
}
```

---

## ✅ Frontend Testing Checklist

### Page: `/cart`

#### Test 1: View Empty Cart
- [ ] Navigate to `/cart` with no items
- [ ] See "Your Cart is Empty" message
- [ ] See "Continue Shopping" button
- [ ] Button redirects to `/canteens`

#### Test 2: Add Item and View
- [ ] Add item from menu (StudentOrder page)
- [ ] Navigate to cart
- [ ] Item appears with correct name, price, quantity
- [ ] Total price is calculated correctly
- [ ] Canteen info is displayed

#### Test 3: Update Quantity
- [ ] Click "+" button on item
- [ ] Quantity increases
- [ ] Total price updates
- [ ] Click "-" button
- [ ] Quantity decreases (min: 1)
- [ ] Total price updates

#### Test 4: Remove Item
- [ ] Click 🗑️ button on item
- [ ] Item is removed from cart
- [ ] Total price updates
- [ ] Cart refreshes with remaining items

#### Test 5: Clear Cart
- [ ] Click "Clear Cart" button
- [ ] Confirmation dialog appears
- [ ] After confirmation, cart is cleared
- [ ] Page shows empty cart message

#### Test 6: Redeem Loyalty Points
- [ ] Enter points value in "Redeem Loyalty Points" field
- [ ] Final Total updates: Final = Subtotal - Points
- [ ] Cannot redeem more than subtotal
- [ ] Negative values not allowed

#### Test 7: Payment Method Selection
- [ ] Select "Cash" option
- [ ] Select "Card" option
- [ ] Select "Wallet" option
- [ ] Each option highlights correctly

#### Test 8: Checkout - Success
- [ ] Fill in valid data:
  - [ ] At least 1 item in cart
  - [ ] Payment method selected
  - [ ] Loyalty points (optional)
- [ ] Click "Place Order" button
- [ ] Loading state shows
- [ ] Order success screen displays:
  - [ ] "Order Placed! ✅" title
  - [ ] Order token visible
  - [ ] Order status shown
  - [ ] Total amount displayed
  - [ ] "Back to Home" button works

#### Test 9: Checkout - Error Cases
- [ ] Empty cart: "Your cart is empty" error
- [ ] No items selected: Error message shows
- [ ] Cannot add from different canteen: Error displays

#### Test 10: Cart Mini Icon (Header)
- [ ] Icon shows 🛒 symbol
- [ ] Badge shows item count
- [ ] Badge updates when cart changes
- [ ] Clicking navigates to cart page
- [ ] Badge disappears when count = 0

#### Test 11: Responsive Design
- [ ] **Mobile (320px)**: Single column, readable
- [ ] **Tablet (768px)**: Single column, good spacing
- [ ] **Desktop (1024px+)**: 2 columns (items + sidebar)
- [ ] All buttons are touch-friendly

#### Test 12: Error Handling
- [ ] Network error during add: Show error message
- [ ] Network error during checkout: Show error message
- [ ] Invalid canteen: Show error
- [ ] Invalid food item: Show error
- [ ] Session timeout: Redirect to login

#### Test 13: Real-time Updates
- [ ] Add item → Total updates immediately
- [ ] Update quantity → Total updates
- [ ] Remove item → Total updates
- [ ] Redeem points → Total updates

#### Test 14: Data Validation
- [ ] Quantity must be ≥ 1
- [ ] Points must be ≥ 0
- [ ] Cannot checkout without items
- [ ] Cannot mix items from different canteens

---

## 🔄 Integration Testing

### User Journey 1: Complete Order
```
1. Login as student
2. Navigate to /canteens
3. Select a canteen
4. View menu (/order/:canteenId)
5. Add multiple items to cart
6. View cart (/cart)
7. Update quantities
8. Apply loyalty points
9. Select payment method
10. Checkout
11. Verify order success screen
12. Verify order appears in student orders
```

### User Journey 2: Cart Management
```
1. Add item to cart
2. View cart
3. Remove one item
4. Add different item
5. Clear entire cart
6. Verify empty state
```

### User Journey 3: Payment Methods
```
For each payment method (Cash, Card, Wallet):
1. Add items to cart
2. Select payment method
3. Checkout
4. Verify order created
5. Verify payment status reflects method
```

---

## 🎯 Expected API Behavior

### Error Responses

#### 400 - Bad Request
```json
{
  "message": "Invalid input. Provide canteenID, foodItemID, and quantity >= 1"
}
```

#### 404 - Not Found
```json
{
  "message": "Cart is empty"
}
```

#### 404 - Canteen Not Found
```json
{
  "message": "Canteen not found"
}
```

#### 400 - Different Canteen
```json
{
  "message": "You can only add items from one canteen. Clear your cart first."
}
```

#### 400 - Insufficient Points
```json
{
  "message": "Insufficient loyalty points"
}
```

#### 400 - Insufficient Wallet
```json
{
  "message": "Insufficient wallet balance"
}
```

#### 500 - Server Error
```json
{
  "message": "Error message here"
}
```

---

## 📊 Database Verification

### Check Cart Collection
```javascript
// MongoDB query
db.carts.find({})

// Should return documents like:
{
  "_id": ObjectId("..."),
  "student": ObjectId("..."),
  "canteen": ObjectId("..."),
  "items": [
    {
      "foodItem": ObjectId("..."),
      "name": "Biryani",
      "quantity": 2,
      "price": 350,
      "image": "url"
    }
  ],
  "totalPrice": 700,
  "createdAt": ISODate("2026-04-25T10:00:00Z"),
  "updatedAt": ISODate("2026-04-25T10:05:00Z")
}
```

### Verify Cart Deletion on Checkout
```javascript
// After checkout, cart should be deleted
db.carts.findOne({ student: ObjectId("student_id") })
// Should return: null
```

---

## 🚀 Performance Testing

- [ ] Load cart with 50+ items: Should load in <2s
- [ ] Update quantity 10 times: Should respond in <1s each
- [ ] Checkout with complex data: Should complete in <3s
- [ ] No memory leaks when navigating away and back

---

## 📱 Mobile-Specific Tests

- [ ] Touch targets are at least 44px
- [ ] Text is readable without zooming
- [ ] Images load correctly
- [ ] Forms are easy to fill on mobile keyboard
- [ ] No horizontal scrolling
- [ ] Buttons don't overlap

---

## 🔒 Security Testing

- [ ] Cannot access cart without authentication token
- [ ] Cannot access other student's cart
- [ ] Cannot manipulate prices in frontend (server validates)
- [ ] Cannot redeem more points than have
- [ ] Cannot exploit quantity field (negative, zero, etc.)

---

## ✨ UX/UI Testing

- [ ] Colors have good contrast
- [ ] Error messages are clear
- [ ] Loading states are visible
- [ ] Buttons have hover effects
- [ ] Form labels are clear
- [ ] Success/error messages are visible

