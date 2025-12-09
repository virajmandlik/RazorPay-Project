const NotificationStrategy = require("../NotificationStrategy");
const { getIO } = require("../../../socket"); // Adjust path as needed

class InAppStrategy extends NotificationStrategy {
    async send(userId, message, data) {
        try {
            const io = getIO();
            // Emit to specific user room
            io.to(userId.toString()).emit("notification", {
                message,
                data,
                timestamp: new Date()
            });
            console.log(`[InApp] Notification sent to ${userId}: ${message}`);
        } catch (error) {
            console.error("[InApp] Failed to send notification:", error.message);
        }
    }
}

module.exports = InAppStrategy;
