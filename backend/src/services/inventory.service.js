import { Branch } from "../models/branches.model.js";
import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/poduct.model.js";

export const totalInventoryValue = async ({ tenantId }) => {
  const inventory = await Inventory.find({ tenantId }).populate(
    "productId",
    "costPrice"
  );

  return inventory.reduce(
    (sum, item) => sum + item.productId.costPrice * item.quantity,
    0
  );
};

export const inventorySummary = async ({ tenantId }) => {
  const [totalProducts, lowStocks, outOfStocks, totalInventoryValueAmount] =
    await Promise.all([
      Product.countDocuments({ tenantId }),
      getLowStockProducts({ tenantId }),
      getOutOfStockProducts({ tenantId }),
      totalInventoryValue({ tenantId }),
    ]);

  return {
    totalProducts,
    lowStockCount: lowStocks.length,
    outOfStockCount: outOfStocks.length,
    totalInventoryValue: totalInventoryValueAmount,
  };
};

export const getProductStockInBranch = async ({
  tenantId,
  branchName,
  productName,
}) => {
  try {
    const branch = await Branch.findOne({
      tenantId,
      branchName: {
        $regex: branchName,
        $options: "i",
      },
    });

    if (!branch) {
      return [];
    }

    const product = await Product.findOne({
      tenantId,
      productName: {
        $regex: productName,
        $options: "i",
      },
    });

    if (!product) return [];

    const inventory = await Inventory.findOne({
      tenantId,
      branchId: branch._id,
      productId: product._id,
    });

    if (!inventory) {
      return [];
    }

    return {
      productName: product.productName,
      quantity: inventory.quantity,
      unit: product.unit,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const compareProductStockAcrossBranches = async ({
  tenantId,
  productName,
}) => {
  try {
    const product = await Product.findOne({
      tenantId,
      productName: {
        $regex: productName,
        $options: "i",
      },
    });

    if (!product) {
      return [];
    }

    const inventory = await Inventory.find({
      tenantId,
      productId: product._id,
    }).populate("branchId", "branchName");

    if (inventory.length === 0) {
      return [];
    }

    return inventory.map((item) => ({
      branchName: item.branchId.branchName,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
