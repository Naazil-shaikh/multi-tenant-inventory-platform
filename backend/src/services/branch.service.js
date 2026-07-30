import { Branch } from "../models/branches.model.js";
import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/poduct.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const branchInventory = async ({ tenantId, branchName }) => {
  console.log(tenantId);

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

    const inventory = await Inventory.find({
      tenantId,
      branchId: branch._id,
    }).populate("productId", "productName unit");

    // console.log("Inventory found: ", inventory);

    return inventory.map((item) => ({
      productName: item.productId.productName,
      quantity: item.quantity,
      unit: item.productId.unit,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
