const express = require("express");

const { getAllPlanets } = require("./planets.controller");

const router = express.Router();

router.get("/planets", getAllPlanets);

module.exports = router;
