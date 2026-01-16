import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Inventory } from "../models/inventory.model.js";
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { Branch } from "../models/branches.model.js";
import { Product } from "../models/poduct.model.js";

export const addStockService = async ({
  tenantId,
  branchId,
  productId,
  type = "ADD",
  quantity,
  userId,
  note,
}) => {
  if (!tenantId || !branchId || !productId || !quantity || !userId) {
    throw new ApiError(400, "All fields are required");
  }

  if (!["ADD", "SALE", "REMOVE", "RETURN", "ADJUST"].includes(type)) {
    throw new ApiError(400, "Invalid inventory transaction type");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const branch = await Branch.findOne({
      _id: branchId,
      tenantId,
      branchStatus: "active",
    }).session(session);

    if (!branch) {
      throw new ApiError(400, "Invalid or closed branch");
    }

    const product = await Product.findOne({
      _id: productId,
      tenantId,
      status: "active",
    }).session(session);

    if (!product) {
      throw new ApiError(400, "Invalid or inactive product");
    }

    const inventory = await Inventory.findOne(
      { tenantId, branchId, productId },
      null,
      { session }
    );

    if (!inventory && type !== "ADD") {
      throw new ApiError(400, "Inventory does not exist");
    }

    if (inventory && inventory.quantity + quantity < 0) {
      throw new ApiError(400, "Insufficient stock");
    }

    const updatedInventory = await Inventory.findOneAndUpdate(
      { tenantId, branchId, productId },
      { $inc: { quantity } },
      { new: true, upsert: type === "ADD", session }
    );

    await InventoryTransaction.create(
      [
        {
          tenantId,
          branchId,
          productId,
          type,
          quantity,
          userId,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedInventory;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const saleStockService = async ({
  tenantId,
  branchId,
  productId,
  quantity,
  userId,
  note,
}) => {
  if (!tenantId || !branchId || !productId || !quantity || !userId) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const branch = await Branch.findOne({
      _id: branchId,
      tenantId,
      branchStatus: "active",
    }).session(session);

    if (!branch) {
      throw new ApiError(400, "Invalid or closed branch");
    }

    const product = await Product.findOne({
      _id: productId,
      tenantId,
      status: "active",
    }).session(session);
    if (!product) {
      throw new ApiError(400, "Invalid or Inactive product");
    }
    const inventory = await Inventory.findOne(
      { tenantId, branchId, productId },
      null,
      { session }
    );

    if (!inventory) {
      throw new ApiError(400, "Inventory does not exist");
    }

    if (inventory.quantity < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    const updatedInventory = await Inventory.findOneAndUpdate(
      { tenantId, productId, branchId },
      { $inc: { quantity: -quantity } },
      { new: true, session }
    );

    const inventoryTransaction = await InventoryTransaction.create(
      [
        {
          tenantId,
          branchId,
          productId,
          type: "SALE",
          quantity,
          userId,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedInventory;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const removeStockService = async ({
  tenantId,
  branchId,
  productId,
  quantity,
  userId,
  note,
}) => {
  if (!tenantId || !branchId || !productId || !quantity || !userId) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const branch = await Branch.findOne({
      _id: branchId,
      tenantId,
      branchStatus: "active",
    }).session(session);

    if (!branch) {
      throw new ApiError(400, "Invalid or closed branch");
    }

    const product = await Product.findOne({
      _id: productId,
      tenantId,
      status: "active",
    }).session(session);

    if (!product) {
      throw new ApiError(400, "Invalid or inactive product");
    }

    const inventory = await Inventory.findOne(
      { tenantId, branchId, productId },
      null,
      { session }
    );

    if (!inventory) {
      throw new ApiError(400, "Inventory does not exist");
    }

    if (inventory.quantity < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    const updatedInventory = await Inventory.findOneAndUpdate(
      { tenantId, branchId, productId },
      { $inc: { quantity: -quantity } },
      { new: true, session }
    );

    await InventoryTransaction.create(
      [
        {
          tenantId,
          branchId,
          productId,
          type: "REMOVE",
          quantity,
          userId,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedInventory;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const adjustStockService = async ({
  tenantId,
  branchId,
  productId,
  quantity,
  userId,
  note,
}) => {
  if (
    !tenantId ||
    !branchId ||
    !productId ||
    quantity === undefined ||
    !userId
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!note || note.trim() === "") {
    throw new ApiError(400, "Adjustment note is required");
  }

  if (quantity < 0) {
    throw new ApiError(400, "Quantity cannot be negative");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const branch = await Branch.findOne({
      _id: branchId,
      tenantId,
      branchStatus: "active",
    }).session(session);

    if (!branch) {
      throw new ApiError(400, "Invalid or closed branch");
    }

    const product = await Product.findOne({
      _id: productId,
      tenantId,
      status: "active",
    }).session(session);

    if (!product) {
      throw new ApiError(400, "Invalid or inactive product");
    }

    const inventory = await Inventory.findOne(
      { tenantId, branchId, productId },
      null,
      { session }
    );

    if (!inventory) {
      throw new ApiError(400, "Inventory does not exist");
    }

    const delta = quantity - inventory.quantity;

    const updatedInventory = await Inventory.findOneAndUpdate(
      { tenantId, branchId, productId },
      { $set: { quantity } },
      { new: true, session }
    );

    await InventoryTransaction.create(
      [
        {
          tenantId,
          branchId,
          productId,
          type: "ADJUST",
          quantity: delta,
          userId,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedInventory;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
