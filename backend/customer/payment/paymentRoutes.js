import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import { handleIPN, handleSuccess, handleFail, handleCancel } from "./paymentController.js";
import { initiatePayment } from "./paymentController.js";

export default (store_id, store_passwd) => {
  const router = express.Router();
  const role = "customer";

  router.post("/initiate", authorization, authorizeRoles(role), (req, res) => initiatePayment(req, res, store_id, store_passwd));
  router.post("/payment/ipn", express.urlencoded({ extended: true }), handleIPN);
  router.post("/payment/success", handleSuccess);
  router.post("/payment/fail", handleFail);
  router.post("/payment/cancel", handleCancel);

  return router;
};