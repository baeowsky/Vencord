/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { MessageActions } from "@webpack/common";

const settings = definePluginSettings({
    footerLine1: {
        type: OptionType.STRING,
        default: "",
        description: "Text appended at the end of messages - Line 1"
    },
    footerLine2: {
        type: OptionType.STRING,
        default: "",
        description: "Text appended at the end of messages - Line 2"
    },
    footerLine3: {
        type: OptionType.STRING,
        default: "",
        description: "Text appended at the end of messages - Line 3"
    },
    applyOnlyOnServer: {
        type: OptionType.STRING,
        default: "",
        description: "Server ID where the additional text should be appended (empty = all servers)"
    }
});

export default definePlugin({
    name: "addFooterText",
    description: "Appends user-defined text at the end of each sent message.",
    authors: [{ name: "bae", id: 1014661757773561908n }],
    settings,

    start() {
        this.patchSendMessage();
    },

    patchSendMessage() {
        const originalSendMessage = MessageActions.sendMessage;

        MessageActions.sendMessage = (channelId, message, ...args) => {
            const { footerLine1, footerLine2, footerLine3, applyOnlyOnServer } = settings.store;

            const isServerMatch = !applyOnlyOnServer || channelId.startsWith(applyOnlyOnServer);

            if (isServerMatch && message && typeof message.content === "string") {
                if (footerLine1) message.content += `\n${footerLine1}`;
                if (footerLine2) message.content += `\n${footerLine2}`;
                if (footerLine3) message.content += `\n${footerLine3}`;
            }

            return originalSendMessage.call(MessageActions, channelId, message, ...args);
        };

        this.originalSendMessage = originalSendMessage;
    },

    stop() {
        if (this.originalSendMessage) {
            MessageActions.sendMessage = this.originalSendMessage;
        }
    }
});
