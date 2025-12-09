class NotificationStrategy {
    send(userId, message, data) {
        throw new Error("Method 'send' must be implemented.");
    }
}

module.exports = NotificationStrategy;
