import Session from "../middleware/Session";
import ApiError from "../error/ApiError";
import moment from "moment/moment";
import * as Payments from "../services/iyzico/methods/payment";
import Iyzipay from "iyzipay";

export default (router) => {
  router.post("/payments/:cartId/with-new-card", async (req, res) => {
    const { data } = req.body;
    if (!data) {
      return res.status(400).send({
        error: "The card information is missing in the request body.",
      });
    }

    const { cardHolderName, cardNumber, expireMonth, expireYear, cvc } =
      data.card;
    const {
      id,
      name,
      surname,
      gsmNumber,
      email,
      identityNumber,
      lastLoginDate,
      registrationDate,
      registrationAddress,
      ip,
      city,
      country,
      zipCode,
    } = data.buyer;
    const basketItems = data.basketItems;
    const request = {
      locale: data.locale,
      conversationId: data.conversationId,
      price: data.price,
      paidPrice: data.paidPrice,
      installment: data.installment,
      paymentChannel: data.paymentChannel,
      basketId: data.basketId,
      paymentGroup: data.paymentGroup,
      paymentCard: {
        cardHolderName: cardHolderName,
        cardNumber: cardNumber,
        expireYear: expireYear,
        expireMonth: expireMonth,
        cvc: cvc,
        registerCard: "0",
      },
      buyer: {
        id: id,
        name: name,
        surname: surname,
        gsmNumber: gsmNumber,
        email: email,
        identityNumber: identityNumber,
        lastLoginDate: lastLoginDate,
        registrationDate: registrationDate,
        registrationAddress: registrationAddress,
        ip: ip,
        city: city,
        country: country,
        zipCode: zipCode,
      },
      shippingAddress: {
        contactName: data.shippingAddress.contactName,
        city: data.shippingAddress.city,
        country: data.shippingAddress.country,
        address: data.shippingAddress.address,
        zipCode: data.shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: data.billingAddress.contactName,
        city: data.billingAddress.city,
        country: data.billingAddress.country,
        address: data.billingAddress.address,
        zipCode: data.billingAddress.zipCode,
      },
      basketItems: basketItems.map((item) => ({
        id: item.id,
        name: item.name,
        category1: item.category1,
        category2: item.category2,
        itemType: "PHYSICAL",
        price: item.price,
      })),
    };

    let result = await Payments.createPayment(request);
    console.log(result);
    res.send(result);
  });
};
