require("dotenv").config();

const fetch = require("node-fetch");

exports.khaltiApi = async (req, res) => {
  const payload = req.body;

  try {
    const response = await fetch(
      `https://a.khalti.com/api/v2/epayment/initiate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    return res.status(201).json(responseData);
  } catch (error) {
    console.error(error);
  }
};

exports.khaltiSuccess = async (req, res) => {
  const pidx = req.body || { pidx: "PkdvYFZXKybbGLVHBhxgTW" };
  console.log(pidx, "P");
  const respo = await fetch(`https://a.khalti.com/api/v2/epayment/lookup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
    },
    body: JSON.stringify(pidx),

    credentials: "include",
  });
  const responseData = await respo.json();
  console.log(responseData, "rs");
  return res.status(201).json(responseData);
};
