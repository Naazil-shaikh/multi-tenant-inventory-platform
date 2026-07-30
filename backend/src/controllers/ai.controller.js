import { ApiResponse } from "../utils/ApiResponse.js";
import { chatWithInventoryAssistant } from "../ai/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const chatController = asyncHandler(async (req, res) => {
  const response = await chatWithInventoryAssistant({
    message: req.body.message,

    membership: req.membership,

    user: req.user,

    tenant: req.tenant,
  });

  return res.status(200).json(new ApiResponse(200, response));
});
