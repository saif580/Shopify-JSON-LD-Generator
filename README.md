![1st product JSON-LD](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/c996c3d4-3602-491e-ab84-648f63b465f6)# Shopify JSON-LD Generator

The Shopify JSON-LD Generator is a Public app (not available on the Shopify store) that empowers users to create JSON-LD (JavaScript Object Notation for Linked Data) for a store's structured data. This data enhances the store's visibility in search engine results.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Configuration](#configuration)
- [Testing](#testing)

## Installation

To run the Shopify JSON-LD Generator locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/saif580/Shopify-JSON-LD-Generator.git
    ```

2. Install dependencies:

    ```bash
    cd Shopify-JSON-LD-Generator
    npm install
    ```

3. Start the application:

    ```bash
    npm run dev
    ```

## Ngrok Connection

To expose your local application to the internet using ngrok, follow these steps:

1. Install ngrok globally:

    ```bash
    npm install -g ngrok
    ```

2. Start ngrok to tunnel your local application:

    ```bash
    ngrok http port_number
    ```

3. Copy the URL provided by ngrok and paste it into the shopify.app.toml file:

    ```bash
    # shopify.app.toml
    application_url = "ngrok-generated-URL"
    redirect_urls = [
      "ngrok-generated-URL/auth/callback",
      "ngrok-generated-URL/auth/shopify/callback",
      "ngrok-generated-URL/api/auth/callback",
      "ngrok-generated-URL/graphiql/auth/callback"
    ]
    ```

4. Push the updated configuration to Shopify:

    ```bash
    npm run shopify app config push
    ```
4. Start the application with the ngrok tunnel URL:

    ```bash
    npm run dev -- --tunnel-url ngrok-generated-URL:port_number
    ```

The application will be accessible at the generator URL in your web browser.

## Usage

The Shopify JSON-LD Generator provides a form for users to input information about their store. This includes details such as store name, legal name, website, address, and products. Additionally, the application can connect to a Shopify store to fetch some information automatically.

1. **Connect with Shopify:**
   - Click the "Connect with Shopify" button to connect the application with your Shopify store.

2. **Fill in Store Information:**
   - Fill in the required information about your store, such as store name, legal name, and website.

3. **Address and Timing:**
   - Provide the store's address, including street address, state, postal code, and country.
   - Set opening and closing times for each weekday.

4. **Products:**
   - Add products with details like name, image, description, and price.

5. **Generate JSON-LD:**
   - Click the "Generate JSON-LD" button to create the JSON-LD document based on the provided information.

## Folder Structure

The project's folder structure is organized as follows:

- **public:** Contains the HTML template.
- **src:**
  - **components:** Contains React components, including `BusinessForm.jsx`.
  - **styles:** Contains styling files.
  - **tests:** Contains test files for unit and integration testing.
  - **index.js:** Entry point for the application.

## Configuration

The application can be configured using the `shopify.app.my-test-app.toml` file. This file includes settings such as the app name, client ID, and access scopes.

```toml
# Example Configuration
name = "my-test-app"
client_id = "your-client-id"
application_url = "https://your-application-url"
embedded = true
```

## Testing

The application includes both unit tests for individual components and integration tests for testing component interactions. Testing is done using Jest and React Testing Library.

To run tests:

```bash
npm test
```

## Screenshots
1. JSON-LD Home Page(admin)![JSON-LD Home Page(admin)](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/86608756-1b53-4946-b6ec-c2fdbb7c48f2)
2. Store and JSON-LD App(installed)![store and json-ld(installed)](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/93b652a6-da03-4b66-b8bc-5fcda1cdf126)
3. Pre-filled data of the store by clicking the "connect to Shopify store" button![Pre-filled data of the store](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/f35f18f6-1b17-4cd3-b389-9ccbdf9c04b7)
4. Generated JSON-LD data![Generated json-ld data](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/f4f76fdc-da66-4786-aa8d-f881e53e3bfc)
5. JSON-LD validator![JSON-LD validator](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/6182d3ed-032e-4be8-ace4-d59ea12814af)
5. Editing JSON-LD![Editing JSON-LD](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/c1df0fe7-fa38-4ffa-9d69-25b86362c36a)
6. Add products-![Add product button](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/482a843d-6c5d-4c44-b2c2-a2716b8578ff)
7. Adding 1st product-![1st product JSON-LD](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/a89886f0-3c9e-48a5-9c39-098bd3f302d4)
8. Adding 2nd product-![2nd product JSON-LD](https://github.com/saif580/Shopify-JSON-LD-Generator/assets/29210607/b4f971bf-e112-4322-a9c1-c4d4f33477b3)


