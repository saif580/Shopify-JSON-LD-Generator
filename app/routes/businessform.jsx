import React, { useState } from "react";

import Shopify from "shopify-node-api";

//Configuration for obtaining access token dummy data
const shopifyConfig = {
  shop: "testapp246.myshopify.com", // Replace with your shop name
  shopify_api_key: "49b40515a695064a84c477f4c2f5c847",
  shopify_shared_secret: "9f4d54aa96a12b36e8c2307c5d6744c3",
  scope: [
    "read_products",
    "write_products",
    "read_products",
    "read_content",
    "read_themes",
    "read_script_tags",
    "read_customers",
    "read_orders",
  ],
  redirectUri: "https://testapp246.myshopify.com/api/auth/callback",
  verbose: false,
};

// Define your form component
function BusinessForm() {
  // State variables for form fields
  const [businessName, setBusinessName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [keywords, setKeywords] = useState("");
  const [founder, setFounder] = useState("");
  const [currenciesAccepted, setCurrenciesAccepted] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityState, setCityState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [weekdayTimings, setWeekdayTimings] = useState({
    monday: { openingTime: "", closingTime: "" },
    tuesday: { openingTime: "", closingTime: "" },
    wednesday: { openingTime: "", closingTime: "" },
    thursday: { openingTime: "", closingTime: "" },
    friday: { openingTime: "", closingTime: "" },
    saturday: { openingTime: "", closingTime: "" },
    sunday: { openingTime: "", closingTime: "" },
  });

  // State variable for products
  const [generatedJsonld, setGeneratedJsonld] = useState("");
  const [editedProducts, setEditedProducts] = useState([]);

  //State variables for accessing shopify data
  const [shopify, setShopify] = useState(null);

  //Connecting to shopify store
  const handleConnectShopify = async () => {
    try {
      const shopifyInstance = new Shopify(shopifyConfig);
      setShopify(shopifyInstance);
      console.log("testing--------" + shopify);
      const storeInfo = await shopify.shop.get();
      console.log("Store Info:", storeInfo);
      setBusinessName(storeInfo.name);
      setWebsite(storeInfo.website);

      const products = await shopify.product.list();
      setEditedProducts(
        products.map((product) => ({
          name: product.title,
          image: product.image.src,
          description: product.body_html,
          price: product.variants[0].price,
        }))
      );
    } catch (error) {
      console.error("Error connecting to Shopify:", error);
    }
  };

  // Function to handle editing product details
  const handleEditProduct = (index, field, value) => {
    const updatedProducts = [...editedProducts];
    updatedProducts[index][field] = value;
    setEditedProducts(updatedProducts);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Creating an object to store the data of filled fields
    const formData = {};

    // Adding common properties
    formData["@context"] = "https://schema.org";
    formData["@type"] = "Store";

    // Adding your logic for form submission here and filling it
    if (businessName) formData.name = businessName;
    if (legalName) formData.legalName = legalName;
    if (website) formData.url = website;
    if (image) formData.image = image;
    if (phoneNumber) formData.telephone = phoneNumber;
    if (email) formData.email = email;
    if (keywords)
      formData.keywords = keywords.split(",").map((keyword) => keyword.trim());
    if (founder) formData.founder = founder;
    if (currenciesAccepted)
      formData.currenciesAccepted = currenciesAccepted
        .split(",")
        .map((currency) => currency.trim());
    if (streetAddress || cityState || postalCode || country) {
      formData.address = {
        "@type": "PostalAddress",
        streetAddress: streetAddress,
        addressLocality: cityState,
        postalCode: postalCode,
        addressCountry: country,
      };
    }
    if (
      Object.values(weekdayTimings).some(
        (day) => day.openingTime || day.closingTime
      )
    ) {
      formData.openingHoursSpecification = Object.keys(weekdayTimings)
        .map((day) => {
          const isDayChecked =
            weekdayTimings[day].openingTime !== "" ||
            weekdayTimings[day].closingTime !== "";
          return isDayChecked
            ? {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: day,
                opens: weekdayTimings[day].openingTime,
                closes: weekdayTimings[day].closingTime,
              }
            : null;
        })
        .filter(Boolean);
    }

    if (editedProducts.length > 0) {
      formData.hasOfferCatalog = {
        "@type": "OfferCatalog",
        itemListElement: editedProducts.map((product, index) => ({
          "@type": "Offer",
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price,
        })),
      };
    }

    // Checking if there is any data to generate JSON-LD
    if (Object.keys(formData).length === 0) {
      alert("Please fill in at least one field to generate JSON-LD.");
      return;
    }

    // Converting the JSON-LD document to a JSON string
    const jsonString = JSON.stringify(formData, null, 2);

    // Setting the generated JSON-LD to the state
    setGeneratedJsonld(jsonString);
    console.log(jsonString);
  };

  // Function to handle opening time change
  const handleOpeningTimeChange = (day, value) => {
    setWeekdayTimings((prevTimings) => ({
      ...prevTimings,
      [day]: { ...prevTimings[day], openingTime: value },
    }));
  };

  // Function to handle closing time change
  const handleClosingTimeChange = (day, value) => {
    setWeekdayTimings((prevTimings) => ({
      ...prevTimings,
      [day]: { ...prevTimings[day], closingTime: value },
    }));
  };

  // Function to handle adding a new product
  const handleAddProduct = () => {
    // Adding new product
    const newProduct = {
      name: "",
      image: "",
      description: "",
      price: 0,
    };
    // Updating the editedProducts
    setEditedProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Function to handle deleting a product
  const handleDeleteProduct = (index) => {
    // Removing the product at the specified index
    setEditedProducts((prevProducts) => [
      ...prevProducts.slice(0, index),
      ...prevProducts.slice(index + 1),
    ]);
  };

  const handleCheckboxChange = (day) => {
    setWeekdayTimings((prevTimings) => {
      const isChecked =
        prevTimings[day].openingTime !== "" ||
        prevTimings[day].closingTime !== "";

      return {
        ...prevTimings,
        [day]: {
          openingTime: isChecked ? "" : "09:00", // deafult time
          closingTime: isChecked ? "" : "17:00", // default time
        },
      };
    });
  };

  // Function to open the Structured Data Markup Validator
  const openMarkupValidator = () => {
    const validatorUrl = "https://validator.schema.org/";
    window.open(validatorUrl, "_blank");
  };

  // Rendering the form
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height: "100%",
        }}
      >
        <label>
          Schema Type:
          <input type="text" value="Local Storage" readOnly />
        </label>
        <br />

        <label>
          Business Type:
          <input type="text" value="Store" readOnly />
        </label>
        <br />

        <button onClick={handleConnectShopify}>Connect with Shopify</button>

        <br />

        <fieldset
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <legend>
            <b>Store Information</b>
          </legend>

          <div style={{ padding: "5px" }}>
            <label htmlFor="businessName">Store Name:</label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="legalName">Legal Name:</label>
            <input
              id="legalName"
              className="input-field"
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="website">Website:</label>
            <input
              id="website"
              className="input-field"
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="image">Image:</label>
            <input
              id="image"
              className="input-field"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              id="phoneNumber"
              className="input-field"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              className="input-field"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="keywords">Keywords:</label>
            <input
              id="keywords"
              className="input-field"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="founder">Founder:</label>
            <input
              id="founder"
              className="input-field"
              type="text"
              value={founder}
              onChange={(e) => setFounder(e.target.value)}
            />
          </div>

          <div style={{ padding: "5px" }}>
            <label htmlFor="currenciesAccepted">Currencies Accepted:</label>
            <input
              id="currenciesAccepted"
              className="input-field"
              type="text"
              value={currenciesAccepted}
              onChange={(e) => setCurrenciesAccepted(e.target.value)}
            />
          </div>
        </fieldset>
        <fieldset
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <legend>
            <b>Address</b>
          </legend>
          <div style={{ padding: "5px" }}>
            <label>
              Street Address:
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </label>
          </div>

          <div style={{ padding: "5px" }}>
            <label>
              State:
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
              />
            </label>
            <br />
          </div>

          <div style={{ padding: "5px" }}>
            <label>
              Postal Code:
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </label>
            <br />
          </div>

          <div style={{ padding: "5px" }}>
            <label>
              Country:
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
            <br />
          </div>
        </fieldset>

        <fieldset
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <legend>
            <b>Weekdays and Timing</b>
          </legend>
          {Object.keys(weekdayTimings).map((day) => (
            <div key={day} style={{ marginBottom: "10px" }}>
              <label style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={
                    weekdayTimings[day].openingTime !== "" ||
                    weekdayTimings[day].closingTime !== ""
                  }
                  onChange={() => handleCheckboxChange(day)}
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}:
              </label>

              <label style={{ marginRight: "10px" }}>
                Opening Time:
                <input
                  type="time"
                  value={weekdayTimings[day].openingTime}
                  onChange={(e) => handleOpeningTimeChange(day, e.target.value)}
                />
              </label>

              <label>
                Closing Time:
                <input
                  type="time"
                  value={weekdayTimings[day].closingTime}
                  onChange={(e) => handleClosingTimeChange(day, e.target.value)}
                />
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="button"
          onClick={handleAddProduct}
          style={{ marginBottom: "10px" }}
        >
          <b>Add Product</b>
        </button>

        {editedProducts.map((product, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <fieldset
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ padding: "5px" }}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleEditProduct(index, "name", e.target.value)
                    }
                  />
                </label>
              </div>

              <div style={{ padding: "5px" }}>
                <label>
                  Image:
                  <input
                    type="text"
                    value={product.image}
                    onChange={(e) =>
                      handleEditProduct(index, "image", e.target.value)
                    }
                  />
                </label>
              </div>

              <div style={{ padding: "5px" }}>
                <label>
                  Description:
                  <textarea
                    value={product.description}
                    onChange={(e) =>
                      handleEditProduct(index, "description", e.target.value)
                    }
                  />
                </label>
              </div>

              <div style={{ padding: "5px" }}>
                <label>
                  Price:
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleEditProduct(index, "price", e.target.value)
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteProduct(index)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </fieldset>
          </div>
        ))}

        <button type="submit" style={{ marginTop: "10px" }}>
          <b>Generate JSON-LD</b>
        </button>
      </form>

      <div
        style={{
          position: "relative",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Generated JSON-LD:</h2>
        <hr />
        <pre>{generatedJsonld}</pre>

        <button
          type="button"
          onClick={openMarkupValidator}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            marginBottom: "10px",
          }}
        >
          <b>JSON-LD Validator</b>
        </button>

        <button
          type="button"
          onClick={() => {
            const textArea = document.createElement("textarea");
            textArea.value = generatedJsonld;

            document.body.appendChild(textArea);

            textArea.select();
            document.execCommand("copy");

            document.body.removeChild(textArea);
          }}
          style={{
            position: "absolute",
            top: "50px",
            right: "10px",
          }}
        >
          <b>Copy JSON-LD</b>
        </button>
      </div>
    </div>
  );
}

// Export your form component
export default BusinessForm;
