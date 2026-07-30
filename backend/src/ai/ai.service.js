import { invokeInventoryAgent } from "./agent/inventoryAgent.js";
import { createInventoryTools } from "./factories/inventoryTools.factory.js";

export async function chatWithInventoryAssistant({
  message,

  membership,

  user,
}) {
  const requestContext = {
    membership,

    user,
  };

  const tools = createInventoryTools(requestContext);

  return invokeInventoryAgent({
    message,

    tools,
  });
}
