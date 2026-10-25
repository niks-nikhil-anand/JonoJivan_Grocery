// Prisma repositories that preserve the public field names used by existing routes.
// Queries execute in PostgreSQL; this module does not use a document database.
import { randomUUID } from "node:crypto";
import prisma from "./prisma";

const aliases = {
  User: { password: "passwordHash", profilePic: "profileImage", isVerifiedExpires: "verificationExpiresAt", resetPasswordExpires: "resetPasswordExpiresAt" },
  Vendor: { vendorId: "vendorCode", adhaarCard: "aadhaarCardUrl", panCard: "panCardUrl", bankPassbook: "bankPassbookUrl", msmsCertificate: "msmeCertificateUrl", gstCertificate: "gstCertificateUrl", tradeLicence: "tradeLicenceUrl", shopPhoto: "shopPhotoUrl", dob: "dateOfBirth", numberOfEmployees: "employeeCount" },
  Address: { address: "addressLine1", pinCode: "postalCode", typeOfAddress: "type", User: "userId", user: "userId" },
  Category: { image: "imageUrl" }, SubCategory: { image: "imageUrl", category: "categoryId" }, SubSubCategory: { image: "imageUrl", subCategory: "subCategoryId" },
  Product: { category: "categoryId", subCategory: "subCategoryId", subSubCategory: "subSubCategoryId", featuredImage: "featuredImageUrl" },
  Order: { user: "userId", cart: "cartId", address: "addressId", orderStatus: "status", orderDate: "orderedAt", razorpay_order_id: "razorpayOrderId", razorpay_payment_id: "razorpayPaymentId" },
  PendingOrder: { user: "userId", cart: "cartId", address: "addressId", orderStatus: "status" },
  Payment: { razorpay_order_id: "razorpayOrderId", razorpay_payment_id: "razorpayPaymentId", razorpay_signature: "razorpaySignature" },
  Review: { product: "productId", reviewTitle: "title", review: "body" },
  BlogPost: { featuredImage: "featuredImageUrl" }, ContactMessage: { user: "userId" },
  RechargeTransaction: { txnId: "transactionId", number: "subscriberNumber", providerRef: "providerReference", operatorRef: "operatorReference" },
};
const enums = {
  UserRole: { User: "USER", SuperAdmin: "SUPER_ADMIN", Vendor: "VENDOR" },
  AccountStatus: { Active: "ACTIVE", Blocked: "BLOCKED", Pending: "PENDING", inReview: "IN_REVIEW" },
  ProductStatus: { Active: "ACTIVE", Inactive: "INACTIVE", "Out of stock": "OUT_OF_STOCK", inReview: "IN_REVIEW" },
  AddressType: { Home: "HOME", Work: "WORK" },
  PaymentMethod: { "Cash on Delivery": "CASH_ON_DELIVERY", Online: "ONLINE" },
  PaymentStatus: { Paid: "PAID", UnPaid: "UNPAID" },
  OrderStatus: { Pending: "PENDING", OrderPlaced: "ORDER_PLACED", Processing: "PROCESSING", PickedUp: "PICKED_UP", OutForDelivery: "OUT_FOR_DELIVERY", Delivered: "DELIVERED", Cancelled: "CANCELLED" },
  PendingOrderStatus: { Pending: "PENDING", Failed: "FAILED", Completed: "COMPLETED" },
  RechargeType: { mobile: "MOBILE", dth: "DTH" },
};
const relations = {
  User: { address: ["addresses", "Address", true], orderHistory: ["orders", "Order", true], vendor: ["vendorProfile", "Vendor", false], wishlist: ["wishlist", "Wishlist", false] },
  Category: { subcategory: ["subcategories", "SubCategory", true] },
  SubCategory: { subSubcategory: ["subcategories", "SubSubCategory", true] },
  Product: { category: ["category", "Category", false], subCategory: ["subCategory", "SubCategory", false], subSubCategory: ["subSubCategory", "SubSubCategory", false], users: ["users", "User", true] },
  Order: { user: ["user", "User", false], cart: ["cart", "Cart", false], address: ["address", "Address", false] },
  PendingOrder: { user: ["user", "User", false], cart: ["cart", "Cart", false], address: ["address", "Address", false] },
};
const defaults = { User: { address: [], orderHistory: [], wishlist: [] }, Category: { subcategory: [] }, SubCategory: { subSubcategory: [] }, Cart: { items: [] } };
const cache = new Map();
const delegate = (model, client = prisma) => client[model[0].toLowerCase() + model.slice(1)];
const field = (model, name) => name === "_id" ? "id" : aliases[model]?.[name] || name;
const scalar = (model, name, value) => {
  const meta = delegate(model).fields[name];
  if (value == null || !meta) return value;
  if (enums[meta.typeName]) return enums[meta.typeName][value] || value;
  if (meta.typeName === "DateTime") return value instanceof Date ? value : new Date(value);
  if (meta.typeName === "Int" || meta.typeName === "Float" || meta.typeName === "Decimal") return Number(value);
  if (meta.typeName === "String" && !meta.isList) return String(value?._id || value?.id || value);
  return value;
};

export function toWhere(model, query = {}) {
  const out = {};
  for (const [key, value] of Object.entries(query)) {
    if (key === "$or" || key === "$and") { out[key === "$or" ? "OR" : "AND"] = value.map(q => toWhere(model, q)); continue; }
    const name = field(model, key);
    const meta = delegate(model).fields[name];
    if (!meta) throw new Error(`Unsupported ${model} filter: ${key}`);
    if (value && typeof value === "object" && !(value instanceof Date) && !Array.isArray(value)) {
      const filter = {};
      for (const [op, operand] of Object.entries(value)) {
        if (op === "$options") continue;
        if (op === "$regex") {
          if (enums[meta.typeName]) {
            const text = String(operand).toLowerCase();
            filter.in = Object.entries(enums[meta.typeName]).filter(([label]) => label.toLowerCase().includes(text)).map(([, code]) => code);
          } else {
            if (operand instanceof RegExp) throw new Error("Regular expressions must be converted to a PostgreSQL search filter");
            filter.contains = String(operand);
            filter.mode = value.$options?.includes("i") ? "insensitive" : "default";
          }
        } else {
          const operators = { $ne: "not", $in: "in", $nin: "notIn", $lt: "lt", $lte: "lte", $gt: "gt", $gte: "gte" };
          if (!operators[op]) throw new Error(`Unsupported query operator: ${op}`);
          filter[operators[op]] = Array.isArray(operand) ? operand.map(v => scalar(model, name, v)) : scalar(model, name, operand);
        }
      }
      out[name] = filter;
    } else out[name] = scalar(model, name, value);
  }
  return out;
}

function includeFor(model, populates = []) {
  const include = {};
  if (model === "Cart") include.items = true;
  if (model === "Category") include.subcategories = { select: { id: true } };
  if (model === "SubCategory") include.subcategories = { select: { id: true } };
  for (const p of populates) {
    const rel = relations[model]?.[p.path];
    if (!rel) throw new Error(`Unsupported ${model} relation: ${p.path}`);
    const [name, target, many] = rel;
    const nested = includeFor(target);
    include[name] = { ...(Object.keys(nested).length ? { include: nested } : {}), ...(p.match && many ? { where: toWhere(target, p.match) } : {}) };
    // For singular relations, apply the match after fetching (matching the route's response shape).
  }
  return include;
}

export function present(model, row, populates = []) {
  if (!row) return null;
  const out = { ...(defaults[model] || {}) };
  for (const [name, value] of Object.entries(row)) {
    if (!delegate(model).fields[name]) continue;
    const legacy = Object.entries(aliases[model] || {}).find(([, f]) => f === name)?.[0] || name;
    const type = delegate(model).fields[name].typeName;
    out[legacy] = enums[type] ? Object.entries(enums[type]).find(([, code]) => code === value)?.[0] || value : type === "Decimal" && value != null ? Number(value) : value;
  }
  out._id = row.id;
  out.id = row.id;
  if (model === "Product") {
    out.weight = { value: Number(row.weightValue), unit: row.weightUnit };
    out.ratings = { average: Number(row.averageRating), numberOfRatings: row.ratingCount };
  }
  if (model === "Cart") out.items = (row.items || []).map(item => ({ productId: item.productId, quantity: item.quantity, price: Number(item.unitPrice) }));
  for (const [legacy, [name, target, many]] of Object.entries(relations[model] || {})) {
    if (!(name in row)) continue;
    const population = populates.find(p => p.path === legacy);
    let value = row[name];
    if (population?.match && value && !many) {
      const matches = Object.entries(population.match).every(([key, filter]) => filter?.$in ? filter.$in.includes(value[field(target, key)]) : value[field(target, key)] === filter);
      if (!matches) value = null;
    }
    const convert = r => population ? project(present(target, r), population.select) : r.id;
    out[legacy] = many ? value.map(convert) : value ? convert(value) : null;
  }
  return out;
}

function project(row, selection) {
  if (!row || !selection) return row;
  const entries = typeof selection === "string" ? selection.split(/\s+/).filter(Boolean).map(k => [k.replace(/^-/, ""), !k.startsWith("-")]) : Object.entries(selection);
  const positive = entries.filter(([, enabled]) => enabled);
  if (positive.length) return Object.fromEntries(Object.entries(row).filter(([k]) => k === "_id" || k === "id" || positive.some(([name]) => name === k)));
  const copy = { ...row };
  for (const [name] of entries) { delete copy[name]; if (name === "password") delete copy.passwordHash; }
  return copy;
}

async function toData(model, input, creating, client = prisma) {
  const data = {};
  for (const [key, value] of Object.entries(input)) {
    const name = field(model, key);
    if (value === undefined || name === "id" || name === "createdAt" || name === "updatedAt" || !delegate(model).fields[name]) continue;
    data[name] = scalar(model, name, value);
  }
  if (model === "Product") {
    if (input.weight) { data.weightValue = Number(input.weight.value); data.weightUnit = input.weight.unit; }
    if (input.ratings) { data.averageRating = input.ratings.average; data.ratingCount = input.ratings.numberOfRatings; }
    if (creating && !data.slug) data.slug = `${String(data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${randomUUID().slice(0, 8)}`;
    if (input.users) data.users = { connect: (Array.isArray(input.users) ? input.users : [input.users]).map(id => ({ id: String(id?._id || id) })) };
  }
  if (model === "Cart" && input.items) {
    const items = await Promise.all(input.items.map(async item => {
      const price = item.price ?? Number((await client.product.findUniqueOrThrow({ where: { id: String(item.productId) }, select: { salePrice: true } })).salePrice);
      if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) throw new Error("Cart quantities must be positive integers");
      return { productId: String(item.productId), quantity: Number(item.quantity), unitPrice: Number(price) };
    }));
    data.items = { ...(creating ? {} : { deleteMany: {} }), create: items };
  }
  return data;
}

export function createModel(model) {
  if (cache.has(model)) return cache.get(model);
  class Record {
    constructor(data = {}) { Object.assign(this, structuredClone(defaults[model] || {}), data); }
    toJSON() {
      const data = { ...this };
      if (model === "User" || model === "Vendor") {
        delete data.password;
        delete data.passwordHash;
      }
      return data;
    }
    async save() {
      const creating = !this._id;
      const input = this._original ? Object.fromEntries(Object.entries(this).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(this._original[key]))) : this;
      const data = await toData(model, input, creating);
      const include = includeFor(model);
      const options = { data, ...(Object.keys(include).length ? { include } : {}) };
      const row = creating ? await delegate(model).create(options) : await delegate(model).update({ where: { id: this._id }, ...options });
      Object.assign(this, present(model, row));
      Object.defineProperty(this, "_original", { value: JSON.parse(JSON.stringify(this)), writable: true, configurable: true });
      return this;
    }
  }
  const wrap = row => {
    if (!row) return null;
    const record = new Record(row);
    Object.defineProperty(record, "_original", { value: JSON.parse(JSON.stringify(row)), writable: true, configurable: true });
    return record;
  };
  class Query {
    constructor(where, single = false, selection) { this.where = where; this.single = single; this.selection = selection; this.populates = []; }
    sort(value) { this.orderBy = Object.entries(value).map(([name, dir]) => ({ [field(model, name)]: dir === -1 ? "desc" : "asc" })); return this; }
    skip(value) { this.offset = Math.max(0, Number(value)); return this; }
    limit(value) { this.take = Math.max(1, Number(value)); return this; }
    select(value) { this.selection = value; return this; }
    populate(path, select) { this.populates.push(typeof path === "string" ? { path, select } : path); return this; }
    lean() { this.plain = true; return this; }
    then(resolve, reject) { return this.exec().then(resolve, reject); }
    async exec() {
      const include = includeFor(model, this.populates);
      const options = { where: toWhere(model, this.where), ...(this.orderBy ? { orderBy: this.orderBy } : {}), ...(this.offset ? { skip: this.offset } : {}), ...(Object.keys(include).length ? { include } : {}), ...(!this.single && this.take ? { take: this.take } : {}) };
      const transform = row => { const value = project(present(model, row, this.populates), this.selection); return this.plain ? value : wrap(value); };
      if (this.single) return transform(await delegate(model).findFirst(options));
      return (await delegate(model).findMany(options)).map(transform);
    }
  }
  Record.find = (query = {}, selection) => new Query(query, false, selection);
  Record.findOne = (query = {}) => new Query(query, true);
  Record.findById = id => new Query({ _id: id }, true);
  Record.create = async data => new Record(data).save();
  Record.insertMany = data => Promise.all(data.map(Record.create));
  Record.countDocuments = (query = {}) => delegate(model).count({ where: toWhere(model, query) });
  Record.findOneAndUpdate = async (query, update) => {
    const data = await toData(model, update.$set || update, false);
    for (const [name, value] of Object.entries(update.$inc || {})) data[field(model, name)] = { increment: value };
    // One PostgreSQL statement preserves conditional state transitions under concurrent requests.
    const rows = await delegate(model).updateManyAndReturn({ where: toWhere(model, query), data });
    return wrap(present(model, rows[0]));
  };
  Record.updateOne = async (query, update) => {
    const data = await toData(model, update.$set || update, false);
    for (const [name, value] of Object.entries(update.$inc || {})) data[field(model, name)] = { increment: value };
    const result = await delegate(model).updateMany({ where: toWhere(model, query), data });
    return { modifiedCount: result.count };
  };
  Record.findByIdAndUpdate = (id, update) => Record.findOneAndUpdate({ _id: id }, update);
  Record.findOneAndDelete = async query => prisma.$transaction(async tx => {
    const row = await delegate(model, tx).findFirst({ where: toWhere(model, query) });
    if (!row) return null;
    return wrap(present(model, await delegate(model, tx).delete({ where: { id: row.id } })));
  });
  Record.findByIdAndDelete = id => Record.findOneAndDelete({ _id: id });
  cache.set(model, Record);
  return Record;
}
