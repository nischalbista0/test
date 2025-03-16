const nodemailer = require("nodemailer");

const sendCheckoutMail = (cart, mail) => {
  console.log(cart, "cartData");
  console.log(mail, "cartData");

  const email_client = mail;
  const products = cart; // Array of products in the cart
  const email_host = "rajbhandarisanjina3@gmail.com"; // Your email host

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: email_host,
      pass: process.env.GMAIL_PASS, // Ensure you have your Gmail password stored in an environment variable
    },
    secure: true,
  });

  let productItems = ""; // String to hold the HTML for each product in the email

  // Loop through each product and append its details to the productItems string
  products.forEach((product) => {
    productItems += `
      <li>Name: ${product.name}</li>
      <li>Brand: ${product.brand}</li>
      <li>Description: ${product.description}</li>
      <li>Price: Rs ${product.price}</li>
      <li>Quantity: ${product.quantity}</li>
      <br>
    `;
  });

  const mailData = {
    from: email_host,
    to: email_client,
    subject: "Order Confirmation",
    text: "Your order has been confirmed",
    html: `
    <p>Your order has been confirmed successfully.</p>
    <p>Product Details:</p>
    <ul>
      ${productItems} <!-- Insert the product details here -->
    </ul>
    `,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log("Error occurred while sending email:", error.message);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

const sendBookingMail = (body) => {
  const email_client = "hoxogo9247@otemdi.com";
  const model = body.model;
  const days = body.days;
  const price = body.price;
  const email_host = "rajbhandarisanjina3@gmail.com";
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: email_host,
      pass: process.env.GMAIL_PASS,
    },
    secure: true,
  });

  const mailData = {
    from: email_host,
    to: email_client,
    subject: "Booking Confirmation",
    text: "Your Vehicle booking has been confirmed",
    html: `
    <p>The vehicle you have choose to book is booked successfull.
    Booking Details:
    Model: ${model}
    For : ${days} days
    at Price : Rs ${price}/day
    </p>
`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    console.log(info, "Mail has been sent Successfully");
  });
};
const sendPasswordResetMail = (token, email) => {
  const email_client = email;
  const email_host = "rajbhandarisanjina3@gmail.com";
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: email_host,
      pass: process.env.GMAIL_PASS,
    },
    secure: true,
  });

  const mailData = {
    from: email_host,
    to: email_client,
    subject: "Reset Password",
    text: "Change your password",
    html: `
    <p>Click on the button below to change your password:</p>
    <a href="http://localhost:3000/resetForm?token=${token}&email=${email_client}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    console.log(info, "Mail has been sent Successfully");
  });
};

module.exports = sendPasswordResetMail;
module.exports = sendBookingMail;
module.exports = sendCheckoutMail;
