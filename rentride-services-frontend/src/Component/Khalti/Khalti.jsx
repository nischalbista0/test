import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Khalti = ({ amounto, purpose }) => {
  console.log(
    amounto,
    purpose,
    "-------------------------------------------------------------------------------"
  );
  useEffect(() => {
    const paisa = parseInt(amounto) * 100;
    console.log(
      paisa,
      "**************************************************************"
    );
    const submitAlbum = async () => {
      console.log("heheheheh");
      try {
        const purchase_order_id = uuidv4();
        const payload = {
          return_url: "http://localhost:3000/khaltiSuccess/",
          website_url: "http://localhost:3000/",
          amount: paisa,
          purchase_order_id: purchase_order_id,
          purchase_order_name: purpose,
          customer_info: {
            name: "c1",
          },
        };

        const response = await fetch("http://localhost:8081/khaltiApi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log(response, "ressssssss");
        if (response) {
          const responseData = await response.json();
          console.log(responseData, "daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          window.location.href = `${responseData?.payment_url}`;
        }
      } catch (error) {
        console.error(error);
      }
    };

    submitAlbum(); // Call the function once
  }, []); // Empty dependency array ensures the effect runs only once
};

export default Khalti;
