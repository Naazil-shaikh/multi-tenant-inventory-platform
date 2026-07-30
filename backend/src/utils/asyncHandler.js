export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// export const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     console.log("=== asyncHandler ===");
//     console.log("Handler:", requestHandler.name || "anonymous");
//     console.log("req exists:", !!req);
//     console.log("res exists:", !!res);
//     console.log("next:", next);

//     Promise.resolve(requestHandler(req, res, next)).catch((err) => {
//       console.error(err);
//       console.log("next inside catch:", next);
//       next(err);
//     });
//   };
// };
