// backend/paymentService.js

// Pricing rules
const pricingRules = {
    creator: { first: 5, modification: 4 },
    guest: { first: 14, modification: 5 },
    admin: { first: 0, modification: 0 }
};

// Charge user function
function chargeUser(userType, isModification) {
    const pricing = pricingRules[userType];
    if (!pricing) {
        throw new Error('Invalid user type');
    }
    return isModification ? pricing.modification : pricing.first;
}

// Validate payment function
function validatePayment(amount, userType) {
    const fee = chargeUser(userType, false); // Assume first charge for validation
    return amount >= fee;
}

// Refund function
function refundUser(userType, amount) {
    const fee = chargeUser(userType, true); // Assume modification refund
    if (amount > fee) {
        throw new Error('Refund amount exceeds charge for modifications');
    }
    return true; // Successful refund
}

module.exports = { chargeUser, validatePayment, refundUser };