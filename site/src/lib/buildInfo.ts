/**
 * When this build was made. Static pages bake it in, so it advances with
 * every deploy — a visible sign the site is maintained, without pretending
 * to know anything about stock movements it cannot see.
 */
export const builtOn = new Date();

export const builtOnLabel = builtOn.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/London",
});
