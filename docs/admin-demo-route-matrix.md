# Admin demo route coverage

Every route below uses the connected demo store. All sidebar routes and representative details were checked in a real Chromium browser. Domain coverage is in `scripts/test-admin-demo.ts`.

| Route | Page | View | Data source |
| --- | --- | --- | --- |
| `/admin/dashboard` | Your store at a glance | dashboard | summary |
| `/admin/dashboard/wallet` | Wallet overview | wallet | summary |
| `/admin/dashboard/wallet/accounts` | Wallet accounts | list | accounts |
| `/admin/dashboard/wallet/transactions` | Wallet transactions | list | entries |
| `/admin/dashboard/wallet/topups` | Customer top-ups | list | topups |
| `/admin/dashboard/wallet/withdrawals` | Vendor withdrawals | list | withdrawals |
| `/admin/dashboard/wallet/refunds` | Wallet refunds | list | refunds |
| `/admin/dashboard/wallet/adjustments` | Balance adjustments | list | adjustments |
| `/admin/dashboard/wallet/cashback` | Promotional cashback | list | cashback |
| `/admin/dashboard/wallet/reports` | Wallet reports | walletReport | summary |
| `/admin/dashboard/wallet/settings` | Wallet settings | settings | settings |
| `/admin/dashboard/finance` | Finance overview | finance | summary |
| `/admin/dashboard/finance/transactions` | Payments | list | payments |
| `/admin/dashboard/finance/refunds` | All refunds | list | refunds |
| `/admin/dashboard/finance/settlements` | Vendor settlements | list | settlements |
| `/admin/dashboard/finance/expenses` | Operating expenses | list | expenses |
| `/admin/dashboard/finance/reports` | Financial reports | financeReport | summary |
| `/admin/dashboard/finance/reconciliation` | Payment reconciliation | list | payments |
| `/admin/dashboard/orders` | Orders | list | orders |
| `/admin/dashboard/orders/searchOrders` | Search orders | list | orders |
| `/admin/dashboard/orders/returns` | Returns | list | returns |
| `/admin/dashboard/product/allProduct` | Products | list | products |
| `/admin/dashboard/product/addProduct` | Add product | form | products |
| `/admin/dashboard/inventory` | Inventory | list | products |
| `/admin/dashboard/category/allCategory` | Categories | list | categories |
| `/admin/dashboard/category/addCategory` | Add category | form | categories |
| `/admin/dashboard/category/addSubCategory` | Add subcategory | form | categories |
| `/admin/dashboard/category/addSubSubCatgeory` | Add sub-subcategory | form | categories |
| `/admin/dashboard/users` | Customers | list | customers |
| `/admin/dashboard/user/search` | Search customers | list | customers |
| `/admin/dashboard/vendors` | Vendors | list | vendors |
| `/admin/dashboard/rationCards` | Ration card applications | list | rationCards |
| `/admin/dashboard/services` | Recharge & bill services | services | summary |
| `/admin/dashboard/services/recharges` | Recharges | list | services |
| `/admin/dashboard/services/bills` | Bill payments | list | services |
| `/admin/dashboard/blog/allBlog` | Blog posts | list | blogs |
| `/admin/dashboard/blog/addBlog` | Write a blog post | form | blogs |
| `/admin/dashboard/review/addReview` | Add review | form | reviews |
| `/admin/dashboard/reviews` | Review moderation | list | reviews |
| `/admin/dashboard/promotions/coupons` | Coupons | list | coupons |
| `/admin/dashboard/promotions/banners` | Promotional banners | list | banners |
| `/admin/dashboard/support/tickets` | Support tickets | list | tickets |
| `/admin/dashboard/support/messages` | Contact messages | list | messages |
| `/admin/dashboard/notifications` | Notifications | list | notifications |
| `/admin/dashboard/settings` | Store settings | settings | settings |
| `/admin/dashboard/profile` | Admin profile | settings | profile |
| `/admin/dashboard/settings/roles` | Roles & permissions | roles | summary |
| `/admin/dashboard/settings/audit-log` | Audit log | list | audit |
| `/admin/dashboard/policy/privacyPolicy` | Privacy policy | form | policies |
| `/admin/dashboard/policy/returnPolicy` | Return policy | form | policies |
| `/admin/dashboard/policy/shippingPolicy` | Shipping policy | form | policies |
| `/admin/dashboard/policy/termsAndCondition` | Terms and conditions | form | policies |
| `/admin/dashboard/wallet/accounts/WAL-C1` | accounts | detail | accounts |
| `/admin/dashboard/wallet/transactions/LED-OPEN-1` | entries | detail | entries |
| `/admin/dashboard/wallet/withdrawals/WD-1` | withdrawals | detail | withdrawals |
| `/admin/dashboard/finance/settlements/SET-1` | settlements | detail | settlements |
| `/admin/dashboard/orders/ORD-1` | orders | detail | orders |
| `/admin/dashboard/orders/returns/RET-1` | returns | detail | returns |
| `/admin/dashboard/product/PRD-1` | products | detail | products |
| `/admin/dashboard/category/CAT-1` | categories | detail | categories |
| `/admin/dashboard/users/CUS-1` | customers | detail | customers |
| `/admin/dashboard/vendors/VEN-1` | vendors | detail | vendors |
| `/admin/dashboard/rationCards/RAT-1` | rationCards | detail | rationCards |
| `/admin/dashboard/services/transactions/SVC-1` | services | detail | services |
| `/admin/dashboard/blog/BLOG-1` | blogs | detail | blogs |
| `/admin/dashboard/support/tickets/TKT-1` | tickets | detail | tickets |

Dynamic details accept existing fixture IDs and browser-created record IDs. Product, category and blog detail routes also support `/edit`. Invalid record IDs render a record-not-found state.
