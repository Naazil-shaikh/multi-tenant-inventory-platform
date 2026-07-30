import { tool } from "langchain";
import { PERMISSIONS } from "../../constants/permissions.js";
import {
  productById,
  getProductByName,
  getLowStockProducts,
  getOutOfStockProducts,
  createProductService,
  updateProductService,
} from "../../services/product.service.js";
import { hasPermission } from "../../services/permission.service.js";
import * as z from "zod";
import { inventorySummary } from "../../services/inventory.service.js";
import { branchInventory } from "../../services/branch.service.js";
import {
  compareProductStockAcrossBranches,
  getProductStockInBranch,
} from "../../services/inventory.service.js";
import { ApiError } from "../../utils/ApiError.js";

async function executeWithPermission(permission, requestContext, action) {
  if (!hasPermission(requestContext.membership, permission)) {
    throw new ApiError(401, "permission denied");
  }
  return action();
}

export function createInventoryTools(requestContext) {
  return [
    tool(
      async ({ productName }) =>
        executeWithPermission(PERMISSIONS.PRODUCT_VIEW, requestContext, () => {
          return getProductByName({
            tenantId: requestContext.membership.tenantId,
            productName,
          });
        }),
      {
        name: "search_product",
        description: `
          Use this tool whenever the user asks about a specific product or wants
          information related to a product by mentioning its name.

          Examples:
          - Show me iPhone 17 Pro.
          - Find Samsung Galaxy S25.
          - What is the stock of MacBook Air?
          - Do we have OnePlus Nord in inventory?
          - Tell me about Dell XPS 15.
          - What is the price of iPhone 16?
          - Give me the SKU of AirPods Pro.

          Input:
          - Product name (full or partial).

          Output:
          - Matching product(s) with details such as product name, stock quantity,
            selling price, purchase price, SKU, category, brand, and other available
            inventory information.

          Do NOT use this tool for:
          - Branch analytics.
          - Sales reports.
          - Supplier information.
          - Customer information.
          - Inventory summaries.
          - Stock transfers.
        `,
        schema: z.object({
          productName: z
            .string()
            .describe(
              "The name or partial name of the product the user wants to search for, for example 'iPhone 17 Pro', 'Samsung', or 'MacBook'."
            ),
        }),
      }
    ),
    tool(
      async ({ threshold }) =>
        executeWithPermission(PERMISSIONS.PRODUCT_VIEW, requestContext, () => {
          return getLowStockProducts({
            tenantId: requestContext.membership.tenantId,
            threshold,
          });
        }),
      {
        name: "get_low_stock_products",
        description: `
          Use this tool whenever the user asks about products that are running low on stock.

          Examples:
          - Which products are running low?
          - Show low stock products.
          - What items need to be restocked?
          - Which products have low inventory?
          - Show products below the stock threshold.
          - What should I reorder?
          - Display products with low quantity.

          Input:
          An optional stock threshold. If no threshold is provided, use the default value.

          Output:
          A list of products that are at or below the specified stock threshold, including their remaining quantity and branch information if available.

          Do NOT use this tool for:
          - Searching for a specific product
          - Out-of-stock products only
          - Inventory summaries
          - Sales reports
          - Supplier information
        `,
        schema: z.object({
          threshold: z
            .number()
            .optional()
            .describe(
              "Optional stock threshold. Return products whose quantity is less than or equal to this value. If omitted, use the default threshold of 5."
            ),
        }),
      }
    ),
    tool(
      async () =>
        executeWithPermission(
          PERMISSIONS.PRODUCT_VIEW,
          requestContext,
          async () => {
            return getOutOfStockProducts({
              tenantId: requestContext.membership.tenantId,
            });
          }
        ),
      {
        name: "get_out_of_stock_products",
        description: `
          Use this tool whenever the user asks about products that are completely out of stock.

          Examples:
          - Show out of stock products.
          - Which items are unavailable?
          - Display products with zero quantity.
          - What products need immediate restocking?
          - Which products are not available?

          Input:
          No input required.

          Output:
          A list of products with zero inventory, including product name, branch name, and quantity.

          Do NOT use this tool for:
          - Low stock products
          - Product search
          - Inventory summaries
          - Sales reports
        `,
        schema: z.object({}),
      }
    ),
    tool(
      async () =>
        executeWithPermission(
          PERMISSIONS.INVENTORY_VIEW,
          requestContext,
          async () => {
            const summary = await inventorySummary({
              tenantId: requestContext.membership.tenantId,
            });

            console.log(summary);

            return summary;
          }
        ),
      {
        name: "get_inventory_summary",
        description: `
          Use this tool whenever the user requests an overview or summary of the inventory.

          Examples:
          - Give me an inventory summary.
          - Show inventory statistics.
          - What is my inventory worth?
          - How much capital is tied up in inventory?
          - Show inventory value.

          Input:
          No input required.

          Output:
          Returns:
          - Total number of products
          - Number of low stock products
          - Number of out of stock products
          - Total inventory value

          Do NOT use this tool for:
          - Searching products
          - Branch inventory
          - Supplier information
          - Sales reports
        `,
        schema: z.object({}),
      }
    ),
    tool(
      async ({ branchName }) =>
        executeWithPermission(
          PERMISSIONS.BRANCH_VIEW,
          requestContext,
          async () =>
            branchInventory({
              tenantId: requestContext.membership.tenantId,
              branchName,
            })
        ),
      {
        name: "get_branch_inventory",
        description: `
         Use this tool when the user wants to view the complete inventory of a specific branch.

        Examples:
        - Show inventory of Mumbai branch.
        - List all products in the Palghar branch.
        - What products are available in Pune?
        - Display the inventory of the Andheri branch.
        - Show everything stocked in the Red Chillie branch.
        - What items are currently available in Branch A?

        Returns:
        - Product name
        - Quantity
        - Unit (if available)

        Do NOT use this tool for:
        - Finding a specific product in a branch
        - Comparing inventory across multiple branches
        - Low stock or out-of-stock analysis
        - Overall inventory summary
        - Product search across all branches
        - Sales, revenue, or analytics
        `,
        schema: z.object({
          branchName: z
            .string()
            .describe("The name of the branch to retrieve inventory for."),
        }),
      }
    ),
    tool(
      async ({ branchName, productName }) =>
        executeWithPermission(
          PERMISSIONS.BRANCH_VIEW,
          requestContext,
          async () => {
            return getProductStockInBranch({
              tenantId: requestContext.membership.tenantId,
              branchName,
              productName,
            });
          }
        ),
      {
        name: "get_product_stock_in_branch",
        description: `
        Use this tool when the user wants to check whether a specific product is available in a particular branch or asks for the stock quantity of a product in one branch.

        Examples:
        - Does Palghar have iPhone 16?
        - How many Samsung A55 are available in Mumbai?
        - Is Redmi Note 14 in Pune branch?
        - Check stock of Vivo V50 in Andheri.

        Returns:
        - Product name
        - Quantity
        - Unit

        Do NOT use this tool for:
        - Listing every product in a branch
        - Comparing stock across branches
        - Inventory summaries
        - Low-stock reports
        `,
        schema: z.object({
          branchName: z.string().describe("The branch name."),
          productName: z.string().describe("The product name."),
        }),
      }
    ),
    tool(
      async ({ productName }) =>
        executeWithPermission(
          PERMISSIONS.BRANCH_VIEW,
          requestContext,
          async () => {
            return compareProductStockAcrossBranches({
              tenantId: requestContext.membership.tenantId,
              productName,
            });
          }
        ),
      {
        name: "compare_product_stock_across_branches",
        description: `
      Use this tool when the user wants to compare the stock of a product across multiple branches or asks which branch has the product.

      Examples:
      - Which branch has the most iPhone 16?
      - Compare Samsung A55 stock across branches.
      - Where is Redmi Note 14 available?
      - Which branches currently stock Vivo V50?

      Returns:
      - Branch name
      - Quantity available

      Do NOT use this tool for:
      - Listing all products in a branch
      - Checking stock for an entire branch
      - Inventory summaries
      - Sales analytics
      `,
        schema: z.object({
          productName: z.string().describe("The product to compare."),
        }),
      }
    ),

    tool(
      async ({
        productName,
        tenantId,
        sellingPrice,
        costPrice,
        unit,
        category,
        status,
      }) =>
        executeWithPermission(
          PERMISSIONS.PRODUCT_CREATE,
          requestContext,
          () => {
            return createProductService({
              productName,
              tenantId,
              sellingPrice,
              costPrice,
              unit,
              category,
              status,
            });
          }
        ),
      {
        name: "create_product",
        description: `
              Use this tool whenever the user wants to create a new product in the inventory.

              Examples:
              - Create a product named iPhone 17 Pro.
              - Add a new Samsung Galaxy S25 to inventory.
              - Create a product called Apple with a selling price of 120.
              - Add a new product named Dell XPS 15.
              - Create a product called Rice with unit kg.
              - Add Coca Cola to the inventory.

              Input:
              - Product name
              - Selling price
              - Cost price (optional)
              - Unit
              - Category
              - Status (optional)

              Output:
              Returns the details of the newly created product.

              Do NOT use this tool for:
              - Updating existing products
              - Searching for products
              - Inventory queries
              - Branch inventory
              - Stock comparison
              - Sales reports
              `,
        schema: z.object({
          productName: z
            .string()
            .describe("The name of the product to create."),

          sellingPrice: z
            .number()
            .describe("The selling price of the product."),

          costPrice: z
            .number()
            .optional()
            .describe("The purchase or cost price of the product."),

          unit: z
            .string()
            .describe(
              "The unit of measurement, for example piece, kg, litre, box, etc."
            ),

          category: z.string().describe("The category the product belongs to."),

          status: z
            .string()
            .optional()
            .describe("The product status, such as active or inactive."),
        }),
      }
    ),
    tool(
      async () =>
        executeWithPermission(
          PERMISSIONS.PRODUCT_UPDATE,
          requestContext,
          () => {
            return updateProductByName({ productName, updates });
          }
        ),
      {
        name: "update_product",
        description: `
        Use this tool whenever the user wants to modify the details of an existing product.
        If someone says update price of the product and didn't mention either costprice or 
        sellingPrice, ask to clarify it first

        Examples:
        - Change the price of iPhone 16 to ₹82,000.
        - Update Samsung A55 selling price.
        - Rename Apple to Fresh Apple.
        - Change the category of Coca Cola to Beverages.
        - Mark iPhone 15 as inactive.
        - Update the unit of Rice to kg.
        - Modify the purchase price of Dell XPS.

        Input:
        - Product name (used to identify the product)
        - One or more fields to update:
          - Product name
          - Selling price
          - Cost price
          - Unit
          - Category
          - Status

        Output:
        Returns the updated product details.

        Do NOT use this tool for:
        - Creating new products
        - Searching products
        - Inventory queries
        - Branch inventory
        - Stock comparison
        `,
        schema: z.object({
          productName: z
            .string()
            .describe(
              "The existing product name used to identify the product."
            ),

          updates: z
            .object({
              productName: z.string().optional().describe("New product name."),

              sellingPrice: z
                .number()
                .optional()
                .describe("New selling price."),

              costPrice: z
                .number()
                .optional()
                .describe("New purchase/cost price."),

              unit: z.string().optional().describe("New unit of measurement."),

              category: z.string().optional().describe("New product category."),

              status: z
                .string()
                .optional()
                .describe("New product status such as active or inactive."),
            })
            .describe("Fields that should be updated."),
        }),
      }
    ),
  ];
}
