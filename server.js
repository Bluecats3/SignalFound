const express = require("express");

const app = express();

/* ========================= */
/* SERVE WEBSITE FILES */
/* ========================= */

app.use(express.static("."));

/* ========================= */
/* START SERVER */
/* ========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `SignalFound running on port ${PORT}`
  );

});
