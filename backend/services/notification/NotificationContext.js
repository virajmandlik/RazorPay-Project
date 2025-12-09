class NotificationContext {
    constructor() {
        this.strategies = [];
    }

    addStrategy(strategy) {
        this.strategies.push(strategy);
    }

    async notify(userId, message, data = {}) {
        const promises = this.strategies.map(strategy =>
            strategy.send(userId, message, data).catch(err => console.error("Notification failed", err))
        );
        await Promise.all(promises);
    }
}

module.exports = new NotificationContext(); // Singleton
