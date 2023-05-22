import config from "../config/config.json";
import Iyzipay from "iyzipay";

const iyzipay = new Iyzipay(config);

export default iyzipay;