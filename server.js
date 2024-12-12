import express from 'express';
import bodyParser from 'body-parser';
import safecharge from 'safecharge';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Load environment variables
const {
    MERCHANT_ID,
    MERCHANT_SITE_ID,
    SECRET_KEY,
    NUVEI_ENV = 'int', // 'int' for integration, 'prod' for production
} = process.env;

// Initialize SafeCharge
const data = safecharge.initiate(MERCHANT_ID, MERCHANT_SITE_ID, SECRET_KEY, NUVEI_ENV);

/**
 * Utility function to calculate checksum for requests
 */
const calculateChecksum = (fields) => {
    const concatenatedString = fields.join('');
    return crypto.createHash('sha256').update(concatenatedString).digest('hex');
};

/**
 * Endpoint to get session token
 */
app.post('/get-session-token', (req, res) => {
    const timeStamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // YYYYMMDDHHmmss
    const clientRequestId = `${Date.now()}`; // Unique request ID

    // Fields to calculate checksum
    const fields = [
        MERCHANT_ID,
        MERCHANT_SITE_ID,
        clientRequestId,
        timeStamp,
        SECRET_KEY,
    ];

    const checksum = calculateChecksum(fields);

    const sessionTokenRequest = {
        MERCHANT_ID: MERCHANT_ID,
        merchantSiteId: MERCHANT_SITE_ID,
        clientRequestId,
        timeStamp,
        checksum,
    };

    safecharge.paymentService.getSessionToken(sessionTokenRequest, (error, result) => {
        if (error) {
            console.error('Session Token Error:', error);
            return res.status(500).json({ error: 'Failed to get session token', details: error });
        }

        if (result.status === 'SUCCESS') {
            return res.status(200).json({ sessionToken: result.sessionToken, data: result });
        } else {
            return res.status(400).json({ message: 'Failed to get session token', data: result });
        }
    });
});

/**
 * Endpoint to process payments
 */
app.post('/process-payment', (req, res) => {
    const { amount, currency, sessionToken, cardDetails } = req.body;

    // Validate input
    if (!sessionToken || !cardDetails) {
        return res.status(400).json({ error: 'Session token and card details are required' });
    }

    const paymentData = {
        amount: amount.toString(),
        currency,
        sessionToken,
        paymentOption: {
            card: {
                cardNumber: cardDetails.cardNumber,
                expirationMonth: cardDetails.expirationMonth,
                expirationYear: cardDetails.expirationYear,
                CVV: cardDetails.CVV,
                cardHolderName: cardDetails.cardHolderName,
            },
        },
        billingAddress: {
            firstName: "John",
            lastName: "Smith",
            country: "US",
            email: "john.smith@email.com"
        },
        deviceDetails: {
            ipAddress: "192.168.2.38"
        }
    };

    // Process payment
    safecharge.paymentService.createPayment(paymentData, (error, result) => {
        if (error) {
            console.error('Payment Error:', error);
            return res.status(500).json({ error: 'Payment failed', details: error });
        }

        console.log('Payment Result:', result);

        if (result.status === 'SUCCESS') {
            return res.status(200).json({ message: 'Payment successful', data: result });
        } else {
            return res.status(400).json({ message: 'Payment not approved', data: result });
        }
    });
});

// Method for simply Connect
app.post('/openOrder', async (req, res) => {
    const { amount, currency, clientUniqueId, clientRequestId } = req.body;

    const timeStamp = Date.now().toString();
    const checksum = calculateChecksum([
        MERCHANT_ID,
        MERCHANT_SITE_ID,
        clientRequestId,
        amount,
        currency,
        timeStamp,
        SECRET_KEY,
    ]);

    try {
        // Wrap the openOrder method in a Promise
        const response = await new Promise((resolve, reject) => {
            safecharge.paymentService.openOrder(
                {
                    clientUniqueId,
                    clientRequestId,
                    currency,
                    amount,
                    checksum
                },
                (error, body) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(body);
                }
            );
        });

        console.log("response", response);
        return res.status(200).json({ message: 'Open order successful', data: response });
    } catch (error) {
        console.error('Error opening order:', error);
        res.status(500).send('Failed to open order');
    }
});

// Step 2: Verify payment status
app.post('/api/PaymentStatus', async (req, res) => {
    const { sessionToken } = req.body;

    try {
        const response = await safecharge.paymentService.getPaymentStatus({
            sessionToken,
        });
        res.json(response);
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send('Failed to verify payment');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
