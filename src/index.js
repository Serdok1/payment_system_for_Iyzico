import "express-async-errors";
import config from "./config";
import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import fs from "fs";
import path from "path";
import https from "https";
import GenericErrorHandler from "./middleware/GenericErrorhandler";
import ApiError from "./error/ApiError";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import routes from "./routers/index";
import Session from "./middleware/Session";
const envPath = config?.production ? "./env/.prod" : "./env/.dev";

dotenv.config({
  path: envPath,
});

const app = express();
const router = express.Router();
app.use(express.json());


routes.forEach((routeFunc, index) => {
  routeFunc(router);
});


app.use(logger(process.env.LOGGER));

app.use(helmet());

app.use(
  cors({
    origin: "*",
  })
  );
  
  app.use(
    express.json({
      limit: "1mb",
    })
    );
    
app.use("/api", router);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

app.use(passport.initialize());

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_TOKEN,
};

passport.use(
  new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
    try {
      const user = await Users.findOne({ _id: jwtPayload._id });
      if (user) {
        done(null, user.toJSON());
      } else {
        done(
          new ApiError("Authorization is not valid", 401, "authInvalid"),
          false
        );
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

app.use(express.urlencoded({ extended: true }));

app.all("/test-auth", Session, (req, res) => {
  res.json({
    test: true,
  });
});

app.use(GenericErrorHandler);

if (process.env.HTTPS_ENABLED == "true") {
  const key = fs
    .readFileSync(path.join(__dirname, "./certs/key.pem"))
    .toString();
  const cert = fs
    .readFileSync(path.join(__dirname, "./certs/cert.pem"))
    .toString();

  const server = https.createServer({ key, cert }, app);

  app.listen(process.env.PORT, () => {
    console.log(
      "Working on port: " + process.env.PORT + " http://localhost:443"
    );
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(
      "Working on port:" + process.env.PORT + " https://localhost:8080"
    );
  });
}
