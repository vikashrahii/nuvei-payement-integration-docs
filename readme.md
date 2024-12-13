# Overview of Nuvei Payment Gateway

Nuvei is a comprehensive payment service provider offering a wide range of payment solutions. These include both 3D-Secure (3DS) and Non-3D-Secure payment methods, each tailored to different transaction types and security requirements. Below is an overview of these methods, their functionalities, and their use cases.

---

## **What is 3D-Secure Payment?**

3D-Secure (3DS) is an additional security layer for online credit and debit card transactions. It is commonly branded by card networks as:

- **Visa Secure** (Visa cards)
- **Mastercard Identity Check** (Mastercard)
- **American Express SafeKey** (AmEx cards)

### **Purpose**
- To reduce fraud by authenticating the cardholder during the payment process.
- To shift liability from the merchant to the card issuer in cases of fraudulent transactions.

### **How It Works**
1. During checkout, the customer enters their card details.
2. The customer is redirected to their bank's 3DS authentication page.
3. Authentication methods may include:
   - Password
   - One-time password (OTP) sent to their phone
   - Biometric authentication (e.g., fingerprint, facial recognition)
4. After successful authentication, the transaction proceeds and the payment is completed.

### **Use Cases**
- High-risk or high-value transactions.
- Transactions requiring compliance with regulations, such as PSD2 (Strong Customer Authentication - SCA) in the EU.
- Transactions involving cards issued in regions where stringent fraud prevention measures are mandatory.

---

## **What is Non-3D-Secure Payment?**

Non-3D-Secure payments omit the additional authentication step of 3DS, offering a simpler and faster payment process.

### **Purpose**
- To provide a seamless and frictionless checkout experience.
- Commonly used for low-risk or recurring payments where fraud risk is minimal.

### **How It Works**
1. The customer enters their card details directly on the merchant's checkout page.
2. The payment is processed immediately, without requiring additional authentication from the card issuer.

### **Use Cases**
- Small-value transactions where fraud risk is low.
- Recurring payments (e.g., subscriptions) where the user experience is a priority.
- Markets or regions where 3DS is not mandatory.

---

## **Key Differences Between 3D-Secure and Non-3D-Secure Payments**

| **Aspect**           | **3D-Secure Payment**                      | **Non-3D-Secure Payment**              |
|----------------------|-------------------------------------------|---------------------------------------|
| **Security Level**   | High (additional authentication layer)     | Lower (relies only on card details)    |
| **Fraud Protection** | Significantly reduces fraud risk           | Higher fraud risk                      |
| **Liability**        | Liability shifts to card issuer after authentication | Merchant bears the liability            |
| **User Experience**  | Extra authentication step (may add friction) | Seamless and faster checkout           |
| **Regulations**      | Complies with SCA (e.g., PSD2 in the EU)    | May not comply with certain regulations |
| **Transaction Speed**| Slightly slower due to authentication       | Faster                                 |
| **Common Use Cases** | High-value, high-risk transactions          | Low-value, low-risk transactions       |

---

## **When to Use 3D-Secure vs. Non-3D-Secure?**

### **3D-Secure:**
- For high-value transactions or markets requiring compliance with regulations like PSD2.
- When security and fraud prevention are top priorities.
- To benefit from liability protection in case of fraudulent transactions.

### **Non-3D-Secure:**
- For small-value or recurring transactions where a seamless user experience is key.
- In regions where 3DS is not mandatory.
- When the merchant is willing to accept liability for potential fraud.

---

## **Conclusion**

Both 3D-Secure and Non-3D-Secure payment methods cater to different needs. While 3DS enhances security and reduces fraud risk, Non-3DS offers faster and frictionless payment processing. Selecting the right method depends on the transaction type, regulatory requirements, and your risk management strategy.

---

# Nuvei Simply Connect Integration
[Nuvei Simply Connect Integration](https://docs.nuvei.com/documentation/accept-payment/simply-connect/quick-start-for-checkout/)


This guide provides detailed instructions on integrating Nuvei's **Simply Connect** payment solution into your application. Simply Connect is a frontend-focused, end-to-end solution that simplifies payment processing with minimal backend involvement.

## **Overview**
Simply Connect allows you to:
- Embed a customizable payment form directly into your website.
- Handle PCI compliance and 3D-Secure checks effortlessly.
- Use a single API call (`/openOrder`) to initiate a payment session.

## **Key Features**
- **Ease of Integration**: Minimal code for setup.
- **Customizable UI/UX**: Flexible styling for your payment form.
- **Real-Time Event Callbacks**: Get notified about payment results.
- **Secure Transactions**: Only one backend API call required for session initialization.

---

## **Integration Steps**

### 1. Backend: Open Payment Session
You need to call the `/openOrder` API from your backend to create a payment session and receive a `sessionToken`. This token is required to render the payment form.

#### Example Request:
```json
{
  "merchantId": "<your_merchant_id>",
  "merchantSiteId": "<your_merchant_site_id>",
  "clientUniqueId": "<unique_transaction_id>",
  "currency": "USD",
  "amount": "200",
  "timeStamp": "<YYYYMMDDHHmmss>",
  "checksum": "<calculated_checksum>"
}
```

#### Example Response:
```json
{
  "sessionToken": "9610a8f6-44cf-4c4f-976a-005da69a2a3b",
  "orderId": "39272",
  "status": "SUCCESS"
}
```

### 2. Frontend: Add Placeholder for Payment Form
Add a `<div>` element to your payment page where the Simply Connect payment form will be rendered. Include the `checkout.js` script from Nuvei.

#### Example HTML:
```html
<div id="checkout" style="width:400px; height:600px;"></div>
<script src="https://cdn.safecharge.com/safecharge_resources/v1/checkout/checkout.js"></script>
```

### 3. Frontend: Render the Payment Form
Use the `checkout()` method provided by Nuvei to render the payment form and handle the payment process.

#### Example JavaScript:
```javascript
checkout({
  sessionToken: "9610a8f6-44cf-4c4f-976a-005da69a2a3b",
  env: 'prod', // Use 'int' for integration and 'prod' for production
  amount: 135,
  currency: 'USD',
  renderTo: '#checkout',
  onResult: function(result) {
    console.log("Payment Result:", result);
    // Handle the payment result
  }
});
```

### 4. Backend: Verify Payment
Use Nuvei's **DMN (Direct Merchant Notification)** system or your backend to validate the payment results securely. This ensures that the payment process is tamper-proof.

---

## **Configuration Parameters**

| Parameter         | Type       | Description                                    |
|-------------------|------------|------------------------------------------------|
| `sessionToken`    | `string`   | Token returned by the `/openOrder` API call.  |
| `env`             | `string`   | Environment: `int` (integration) or `prod`.   |
| `amount`          | `number`   | The transaction amount.                       |
| `currency`        | `string`   | Currency code (e.g., `USD`, `EUR`).           |
| `renderTo`        | `string`   | CSS selector for the payment form container.  |
| `onResult`        | `function` | Callback to handle the payment result.        |

---

## **Comparison: Simply Connect vs. Server-to-Server Integration**

| **Feature**                  | **Simply Connect**                                 | **Server-to-Server**                           |
|-------------------------------|---------------------------------------------------|-----------------------------------------------|
| **Integration**              | Minimal frontend integration with one API call    | Fully backend-driven, requires multiple API calls |
| **UI/UX**                    | Customizable payment form provided by Nuvei       | You control the entire payment UI/UX          |
| **PCI Compliance**           | Handled by Nuvei                                  | Requires PCI DSS compliance for card details  |
| **3D Secure**                | Handled by Nuvei                                  | Implemented manually                          |
| **Payment Flow**             | Handled in the frontend                           | Handled entirely in the backend               |
| **Effort Level**             | Low effort, quick to implement                    | High effort, full control over flow           |

---

## **When to Use Simply Connect?**
- You want a quick and easy payment solution.
- You don’t want to handle PCI compliance or 3D-Secure checks manually.
- You are comfortable using Nuvei’s frontend payment form.

## **When to Use Server-to-Server?**
- You require full control over the payment flow and UI.
- Your application already complies with PCI DSS requirements.
- You want to process payments entirely on the backend.

# Nuvei Server-to-Server SDK Integration

## Overview
This repository explains the integration of the **Nuvei Server-to-Server SDK** for handling payment operations in large-scale applications, such as gaming platforms. The Server-to-Server SDK provides a robust and secure way to manage payment processes, ensuring better performance, scalability, and security compared to the Nuvei Simply Connect payment method.

## Why Use the Nuvei Server-to-Server SDK?
The **Server-to-Server SDK** is designed to handle high transaction volumes and complex workflows, making it ideal for large applications like gaming platforms. Here's a comparison between the **Server-to-Server SDK** and the **Simply Connect** payment method:

| Feature            | Server-to-Server SDK                       | Simply Connect                             |
|---------------------|--------------------------------------------|-------------------------------------------|
| **Performance**     | High performance, optimized for large-scale apps | Basic, suitable for smaller-scale integrations |
| **Scalability**     | Easily handles high transaction volumes    | Limited scalability for high-load environments |
| **Security**        | Secure direct communication with Nuvei servers | Relies on client-side interactions, less secure |
| **Flexibility**     | Fully customizable API for advanced use cases | Limited flexibility in customization       |
| **Error Handling**  | Robust error handling and logging mechanisms | Minimal error handling support             |

## Benefits of Server-to-Server SDK for Gaming Platforms
1. **Scalability for High Traffic**:  
   Gaming contests like Dream11 experience traffic spikes during contests. The Server-to-Server SDK ensures smooth handling of transactions even under heavy loads.

2. **Advanced Security**:  
   With direct server-to-server communication, sensitive payment data is not exposed on the client side, reducing risks of data breaches.

3. **Customization**:  
   Supports custom payment flows, order management, and error handling tailored to your platform’s needs.

4. **Improved Performance**:  
   Unlike Simply Connect, which may experience latency due to client-server interactions, the SDK ensures faster processing by handling requests directly on the server.

5. **Detailed Logs**:  
   Provides detailed logs and error handling, essential for monitoring and debugging in a production environment.

## Key Features
- **Open Order**: Create payment orders directly from your server.
- **Authorization and Capture**: Manage payment authorization and capture with precision.
- **Refunds and Voids**: Seamlessly handle refunds and void transactions.
- **Custom Checksum Calculation**: Securely verify transaction integrity using server-side checksum generation.


---

## **Testing**
To test the integration:
1. Use the `int` environment (`env: 'int'`) during development.
2. Verify the `sessionToken` and `orderId` returned by the `/openOrder` API.
3. Check the `onResult` callback to handle success and failure scenarios.

---

## **Support**
For any issues or questions, refer to the official [Nuvei Documentation](https://www.nuvei.com/) or contact their support team.

---

## **License**
This integration is governed by the terms of your Nuvei agreement.


## **Additional Resources**

- **Supported Payment Methods:** [Click Here](#)
- **Testing Cards:** [Click Here](#)

