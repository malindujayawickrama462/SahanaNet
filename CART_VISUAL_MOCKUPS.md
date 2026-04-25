# 🎨 Cart System - Visual UI Mockups

## 1️⃣ Header with Cart Icon

### Desktop View
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👤 Malindu Jayawickrama     Wallet: ₹1,250  ⭐ Points: 85        ┃
┃  STUDENT MODULE              │                                    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                  🛒 🔔 Logout     ┃
┃                                                  ↓   ↓              ┃
┃                                            [Badge: 3] [1 notif]    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Legend:
🛒 = Shopping cart icon (clickable)
[Badge: 3] = Item count in cart
🔔 = Notifications bell
```

---

## 2️⃣ Cart Mini Component (Icon with Badge)

### States
```
Empty Cart          With Items (1)      With Items (5)      With Items (100+)
┌─────┐            ┌─────┐            ┌─────┐            ┌─────┐
│ 🛒  │            │ 🛒  │            │ 🛒  │            │ 🛒  │
└─────┘            │1️⃣   │            │5️⃣   │            │9️⃣+️⃣ │
 No badge           └─────┘            └─────┘            └─────┘

CSS Classes:
- Base: w-10 h-10 rounded-lg bg-slate-800 border border-slate-700
- Hover: border-slate-600
- Badge: -top-2 -right-2 w-6 h-6 bg-emerald-500 text-xs font-bold
```

---

## 3️⃣ Empty Cart Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Shopping Cart                    [← Back to Canteens]           │
│  Logged in as: student@email.com                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐ │
│   │                                                          │ │
│   │  Your Cart is Empty 🛒                                  │ │
│   │                                                          │ │
│   │  No items in your cart yet.                             │ │
│   │  Add items from the menu to begin.                      │ │
│   │                                                          │ │
│   │          [Continue Shopping]                             │ │
│   │                                                          │ │
│   └──────────────────────────────────────────────────────────┘ │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ Cart with Items (Full Desktop View)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Shopping Cart                                 [← Back to Canteens]          │
│  Logged in as: student@email.com                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ┌────────────────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Items in Cart                  (3)     │ │ Order Summary                │ │
│ ├────────────────────────────────────────┤ ├──────────────────────────────┤ │
│ │                                        │ │                              │ │
│ │ ┌──────────────────────────────────┐  │ │ ┌────────────────────────┐   │ │
│ │ │ Biryani Rice               [IMG] │  │ │ │ Subtotal               │   │ │
│ │ │ Rs. 350 per item                │  │ │ │ Rs. 950                │   │ │
│ │ │ Quantity: − 2 +                 │  │ │ │ (fresh biryani)        │   │ │
│ │ │ Total: Rs. 700      [🗑️ Remove]│  │ │ └────────────────────────┘   │ │
│ │ └──────────────────────────────────┘  │ │                              │ │
│ │                                        │ │ ┌────────────────────────┐   │ │
│ │ ┌──────────────────────────────────┐  │ │ │ Redeem Points          │   │ │
│ │ │ Sandwich                    [IMG]│  │ │ │ Input: [50          ]  │   │ │
│ │ │ Rs. 250 per item                │  │ │ │ (- 50 LKR)             │   │ │
│ │ │ Quantity: − 1 +                 │  │ │ │ (Max: 950)             │   │ │
│ │ │ Total: Rs. 250      [🗑️ Remove]│  │ │ └────────────────────────┘   │ │
│ │ └──────────────────────────────────┘  │ │                              │ │
│ │                                        │ │ Final Total:                 │ │
│ │ ┌──────────────────────────────────┐  │ │ Rs. 900   ✅              │ │
│ │ │ Coke Can                    [IMG]│  │ │                              │ │
│ │ │ Rs. 80 per item                 │  │ │ ┌────────────────────────┐   │ │
│ │ │ Quantity: − 1 +                 │  │ │ │ Payment Method         │   │ │
│ │ │ Total: Rs. 80       [🗑️ Remove]│  │ │ │                        │   │ │
│ │ └──────────────────────────────────┘  │ │ ○ 💵 Cash              │   │ │
│ │                                        │ │ ○ 💳 Card              │   │ │
│ │ Canteen                                │ │ ○ 👛 Wallet            │   │ │
│ │ ┌──────────────────────────────────┐  │ │ └────────────────────────┘   │ │
│ │ │ Main Canteen                     │  │ │                              │ │
│ │ │ 📍 Building A, Main Campus      │  │ │ [Place Order]                │ │
│ │ └──────────────────────────────────┘  │ │ [Clear Cart]                 │ │
│ │                                        │ │                              │ │
│ └────────────────────────────────────────┘ └──────────────────────────────┘ │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ Cart - Mobile View (Stacked)

```
┌────────────────────────────────────────┐
│  🔙 Shopping Cart                      │
│  student@email.com                     │
├────────────────────────────────────────┤
│                                        │
│ Items in Cart              (3)         │
│ ┌──────────────────────────────────┐  │
│ │ Biryani Rice              [IMG]  │  │
│ │ Rs. 350 × 2                      │  │
│ │ − 2 +                 Rs. 700    │  │
│ │          [🗑️]                    │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Sandwich                  [IMG]  │  │
│ │ Rs. 250 × 1                      │  │
│ │ − 1 +                 Rs. 250    │  │
│ │          [🗑️]                    │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Coke Can                  [IMG]  │  │
│ │ Rs. 80 × 1                       │  │
│ │ − 1 +                  Rs. 80    │  │
│ │          [🗑️]                    │  │
│ └──────────────────────────────────┘  │
│                                        │
│ Canteen                                │
│ Main Canteen (Building A)              │
│                                        │
│ ═══════════════════════════════════    │
│                                        │
│ Subtotal:            Rs. 950          │
│                                        │
│ Redeem Points:                         │
│ ┌──────────────────────────────────┐  │
│ │  [50                          ]  │  │
│ └──────────────────────────────────┘  │
│ Final Total:         Rs. 900           │
│                                        │
│ Payment Method:                        │
│ ○ 💵 Cash                              │
│ ○ 💳 Card                              │
│ ○ 👛 Wallet                            │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ [Place Order]                    │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ [Clear Cart]                     │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ℹ️  All prices in LKR                 │
│ 1 point = 1 LKR discount              │
│ Cart specific to selected canteen     │
│                                        │
└────────────────────────────────────────┘
```

---

## 6️⃣ Order Success Screen

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│        Order Placed! ✅                           │
│   Your order has been submitted                   │
│                                                    │
│        ┌──────────────────────────────┐            │
│        │                              │            │
│        │    SQ-001-1200               │            │
│        │    (Order Token)             │            │
│        │                              │            │
│        └──────────────────────────────┘            │
│                                                    │
│        Status: Pending ⏳                        │
│                                                    │
│        ┌──────────────────────────────┐            │
│        │  Total Amount                │            │
│        │  Rs. 900                     │            │
│        └──────────────────────────────┘            │
│                                                    │
│        ┌──────────────────────────────┐            │
│        │ [Back to Home]               │            │
│        └──────────────────────────────┘            │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 7️⃣ Item Card Details

### Add from Menu (StudentOrder Page - Existing)
```
┌──────────────────────────────────────┐
│  BIRYANI                        [+]  │  <- Click + to add
│  Rs. 500/=                           │
│  Fresh biryani with spices...        │
│  ✓ In Stock                          │
│  [Preview Image - 300x200]           │
└──────────────────────────────────────┘
```

### In Cart (Cart Page)
```
┌──────────────────────────────────────┐
│ Biryani                   [IMG]       │
│ Rs. 350 per item                     │
│ Quantity: − [2] +                    │
│ Total: Rs. 700     [🗑️]              │
└──────────────────────────────────────┘
```

---

## 8️⃣ Error States

### Cannot Add From Different Canteen
```
┌──────────────────────────────────────┐
│ ❌ Error                             │
│                                      │
│ You can only add items from one      │
│ canteen. Clear your cart first.      │
│                                      │
│ Current Canteen: Main Canteen        │
└──────────────────────────────────────┘
```

### Insufficient Loyalty Points
```
┌──────────────────────────────────────┐
│ ❌ Error                             │
│                                      │
│ Insufficient loyalty points          │
│ You have: 50 points                  │
│ Trying to redeem: 150 points         │
└──────────────────────────────────────┘
```

### Insufficient Wallet Balance
```
┌──────────────────────────────────────┐
│ ❌ Error                             │
│                                      │
│ Insufficient wallet balance          │
│ You have: Rs. 200                    │
│ Order total: Rs. 900                 │
└──────────────────────────────────────┘
```

---

## 9️⃣ Payment Method Selection

### Radio Button Options
```
Payment Method:

○ 💵 Cash
  Pay at the counter

○ 💳 Card (Selected)
  Online payment via card
  Invoice will be generated

○ 👛 Wallet
  Pay using Smart Queue wallet
  Wallet balance: Rs. 1,250
```

---

## 🔟 Loyalty Points Redemption

### Input Field
```
Redeem Loyalty Points
┌─────────────────────────────────┐
│ [50                          ]  │  <- Input field
│ (- 50 LKR)                      │  <- Shows equivalent
│ Max redeemable: 950 LKR         │  <- Max limit
└─────────────────────────────────┘

Before:  Subtotal: Rs. 950
After:   Final Total: Rs. 900 (950 - 50)
```

---

## 1️⃣1️⃣ Responsive Breakpoints

### Mobile (< 640px)
```
Single Column
100% width
Items stacked vertically
Summary below items
Buttons full width
```

### Tablet (640px - 1024px)
```
Single Column with padding
Good spacing around elements
Readable text
Touch-friendly buttons
```

### Desktop (> 1024px)
```
Two Column Layout
Left: 60% (items)
Right: 40% (summary)
Optimal for viewing
Multiple items visible
```

---

## 1️⃣2️⃣ Color Reference

### Palette Used
```
Background:     #0f172a (slate-950)  - Dark background
Text Primary:   #f1f5f9 (slate-100)  - Light text
Text Secondary: #94a3b8 (slate-400)  - Muted text
Border:         #1e293b (slate-800)  - Card borders

Success:  #10b981 (emerald-500)  - Total, buttons
Info:     #3b82f6 (blue-500)     - Card payment
Warning:  #f59e0b (amber-500)    - Points redemption
Error:    #ef4444 (red-500)      - Errors, remove button
```

---

## 1️⃣3️⃣ Interaction States

### Button States
```
Normal:    bg-emerald-500 text-slate-950
Hover:     bg-emerald-600 (darker)
Active:    shadow-lg
Disabled:  opacity-50 cursor-not-allowed
Loading:   animated spinner visible
```

### Form Input States
```
Normal:    bg-slate-900/50 border-slate-700
Focus:     border-emerald-500 ring-1 ring-emerald-500/20
Error:     border-red-500 text-red-400
Disabled:  opacity-50 cursor-not-allowed
```

---

## 1️⃣4️⃣ Loading States

### Cart Loading
```
┌──────────────────────────────┐
│ Loading your cart...         │
│                              │
│ ⏳ [Spinner animation]        │
│                              │
└──────────────────────────────┘
```

### Checkout Loading
```
┌──────────────────────────────┐
│ [Place Order] (disabled)     │
│                              │
│ Processing...                │
│ ⏳ [Spinner]                  │
│                              │
└──────────────────────────────┘
```

---

## 1️⃣5️⃣ Accessibility Features

```
✅ ARIA labels on buttons
✅ Keyboard navigation support
✅ Color contrast ratio > 4.5:1
✅ Text alternatives for icons
✅ Focus indicators on all interactive elements
✅ Error messages linked to form fields
✅ Loading states announced to screen readers
```

---

**Visual Design Version:** 1.0  
**Last Updated:** April 25, 2026  
**Status:** ✅ Ready for Implementation

