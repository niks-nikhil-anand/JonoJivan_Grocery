// One homepage source of truth: change the order, badge, visibility or route
// here without changing the services UI.
export const HOME_SERVICES = [
  { id: "mobile", label: "Mobile Recharge", subtitle: "Prepaid plans and top-ups", group: "recharge", route: "/recharge", icon: "mobile" },
  { id: "dth", label: "DTH Recharge", subtitle: "Recharge your DTH connection", group: "recharge", route: "/recharge/dth", icon: "tv" },
  { id: "fastag", label: "FASTag", subtitle: "Recharge your FASTag", group: "recharge", route: "/recharge/bills/fastag", icon: "car" },
  { id: "postpaid", label: "Postpaid", subtitle: "Pay mobile postpaid bill", group: "recharge", route: "/recharge/bills/postpaid", icon: "phone" },
  { id: "electricity", label: "Electricity", subtitle: "Pay electricity bill", group: "bills", route: "/recharge/bills/electricity", icon: "bolt", badge: "Popular" },
  { id: "lpg-gas", label: "LPG Gas", subtitle: "Book and pay for LPG", group: "bills", route: "/recharge/bills/lpg-gas", icon: "flame" },
  { id: "broadband", label: "Broadband", subtitle: "Pay broadband bill", group: "bills", route: "/recharge/bills/broadband", icon: "wifi" },
  { id: "water-bill", label: "Water Bill", subtitle: "Pay water bill", group: "bills", route: "/recharge/bills/water-bill", icon: "droplets" },
  { id: "cable-tv", label: "Cable TV", subtitle: "Pay cable TV bill", group: "bills", route: "/recharge/bills/cable-tv", icon: "cable" },
  { id: "emi", label: "EMI Payment", subtitle: "Pay loan EMI", group: "bills", route: "/recharge/bills/emi-payment", icon: "calendar" },
  { id: "insurance", label: "Insurance", subtitle: "Pay insurance premium", group: "bills", route: "/recharge/bills/insurance", icon: "shield" },
];
