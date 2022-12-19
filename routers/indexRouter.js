const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/IndexController");

router.get("/", IndexController.Index);
router.get("/secure", IndexController.Secure);

module.exports = router;
