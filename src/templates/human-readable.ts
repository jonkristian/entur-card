import { LitElement, html, TemplateResult, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import setupCustomlocalize from "../localize/localize";
import { renderHumanReadable } from "../utils";
import { cardStyle } from "../styles/card";

@customElement("entur-card-human-readable")
export class EnturCardHumanReadable extends LitElement {
  @property() hass;
  @property() due;
  @property() delay;

  static get styles(): CSSResultGroup {
    return [cardStyle];
  }

  protected render(): TemplateResult {
    if (!this.due) {
      return html``;
    }

    let output;

    const customLocalize = setupCustomlocalize(this.hass!);
    const { minutes, hours, translationKey } = renderHumanReadable(this.due, this.delay);

    let timeUntilDue = "";
    if (hours > 0) {
      timeUntilDue += `${hours} ${customLocalize(hours === 1 ? "common.hour" : "common.hours")}`;
      if (minutes > 0) {
        timeUntilDue += " " + customLocalize("common.and") + " ";
      }
    }
    if (minutes > 0) {
      if (timeUntilDue !== "") {
        timeUntilDue += " ";
      }
      timeUntilDue += `${minutes} ${customLocalize(minutes === 1 ? "common.minute" : "common.minutes")}`;
    }

    if (translationKey === "common.departs") {
      output = html`
        <p class="entur-line__hr coming-up">
          ${customLocalize(translationKey)} ${timeUntilDue}
        </p>
      `;
    } else if (translationKey === "common.departing") {
      output = html`
        <p class="entur-line__hr is-now">
          ${customLocalize(translationKey)} ${timeUntilDue}
        </p>
      `;
    } else if (translationKey === "common.departed") {
      output = html`
        <p class="entur-line__hr is-now">
          ${customLocalize(translationKey)} ${timeUntilDue}
        </p>
      `;
    } else if (translationKey === "common.arrives") {
      output = html`
        <p class="entur-line__hr is-now">
          ${customLocalize(translationKey)} ${timeUntilDue}
        </p>
      `;
    } else {
      output = html``;
    }

    return html`${output}`;
  }

}