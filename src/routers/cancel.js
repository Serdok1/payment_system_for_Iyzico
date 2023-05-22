import * as Cancel from "../services/iyzico/methods/cancel-payment";

export default (router) => {
    router.post("/cancel-payment", async (req, res) => {
      const { data } = req.body;
      if (!data) {
        return res.status(400).send({
          error: "The information is missing in the request body.",
        });
      }
      const request={
        locale: data.locale,
        paymentId: data.paymentId,
        ip: data.ip
      }

      let result = await Cancel.cancelPayment(request);
      console.log(result);
      res.send(result);
    })
}