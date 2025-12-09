const NotificationContext = require("./NotificationContext");
const InAppStrategy = require("./strategies/InAppStrategy");

// Register Strategies
NotificationContext.addStrategy(new InAppStrategy());

// Export configured context
module.exports = NotificationContext;
