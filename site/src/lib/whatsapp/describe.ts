import type { WebhookTextMessage } from "./types";

/**
 * Turn any inbound message into the line that goes in the thread.
 *
 * Text comes through as itself. Anything else — a photo of a rail, a voice
 * note, a location — is described in square brackets rather than dropped, so
 * the owner can see that something arrived and the drafter knows it is there
 * without pretending to have read it.
 *
 * Media is deliberately NOT downloaded or transcribed. A draft written around
 * a guess at what is in a photograph is exactly the kind of invention this
 * connector is built to avoid.
 */
export function describeMessage(message: WebhookTextMessage): string {
  switch (message.type) {
    case "text":
      return message.text?.body ?? "";

    case "image":
      return withCaption("[photo]", message.image?.caption);

    case "video":
      return withCaption("[video]", message.video?.caption);

    case "audio":
      return message.audio?.voice ? "[voice note]" : "[audio]";

    case "document":
      return withCaption(
        `[document${message.document?.filename ? `: ${message.document.filename}` : ""}]`,
        message.document?.caption,
      );

    case "sticker":
      return "[sticker]";

    case "location": {
      const place = message.location?.name ?? message.location?.address;
      return place ? `[location: ${place}]` : "[location]";
    }

    case "contacts":
      return "[contact card]";

    case "button":
      return message.button?.text ?? "[button press]";

    case "interactive":
      return (
        message.interactive?.button_reply?.title ??
        message.interactive?.list_reply?.title ??
        "[menu selection]"
      );

    case "unsupported":
      return "[a message WhatsApp could not deliver in a readable form]";

    default:
      return `[${message.type}]`;
  }
}

function withCaption(label: string, caption?: string): string {
  return caption ? `${label} ${caption}` : label;
}
