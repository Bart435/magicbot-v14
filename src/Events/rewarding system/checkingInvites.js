const { comparing_invites, remove_expired, remove_invites } = require("../../lib/systems/invitesSystem");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // Checking if someone joined by invite during down time
        comparing_invites(client)
        // Timer to remove expired or removed invites
        let timer = setInterval(function () {
            remove_expired()
            remove_invites(client)
        }, 300000);
    },
};
