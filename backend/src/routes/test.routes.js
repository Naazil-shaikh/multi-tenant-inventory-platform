import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { branchInventory } from "../services/branch.service.js";
import {
  compareProductStockAcrossBranches,
  getProductStockInBranch,
} from "../services/inventory.service.js";
import {
  createProductService,
  updateProductByName,
} from "../services/product.service.js";

const router = Router();

router.post("/", verifyJwt, resolveTenantContext, async (req, res) => {
  try {
    // console.log("Tenant:", req.membership?.tenantId);
    // console.log("Branch:", req.query.branch);

    // const result = await compareProductStockAcrossBranches({
    //   tenantId: req.membership.tenantId,
    //   productName: "Apple",
    // });

    const { branchName } = req.body;

    const result = await branchInventory({
      tenantId: req.membership.tenantId,
      branchName,
    });
    // Appless

    console.log("result: ", result);
    return res.json(result);
  } catch (error) {
    //   next(error); // Passes errors to your Express error handler
    console.log(error);
  }
});

export default router;
