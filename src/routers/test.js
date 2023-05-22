export default (router) => {
  router.get("/check", async (req, res) => {
    const ip = req.headers["X-Forwarded-For"];
    const userAgent = req.headers["user-agent"];
    res.json({
      ip: ip,
      userAgent: userAgent,
    });
  });
};
