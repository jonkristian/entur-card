import { LitElement, html, TemplateResult, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import setupCustomlocalize from "../localize/localize";
import { cardStyle } from "../styles/card";
import dayjs from "dayjs";
import "dayjs/locale/nb";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

@customElement("entur-card-line-extra")
export class EnturCardLineExtra extends LitElement {
  @property() hass;
  @property() departure;
  @property() human_readable_time;
  @property() remaining_time;
  @property() clock_icon_state;
  @property() divide_lines;
  @property() formattedDeparture;

  static get styles(): CSSResultGroup {
    return [cardStyle];
  }

  protected render(): TemplateResult {
    if (!this.departure) {
      return html``;
    }

    let departure = this.departure;
    this.formattedDeparture = String(departure).match("^(.*:..)(.*)");

    return html`
      <div class="entur-line ${this.divide_lines ? "divided" : ""}">
        <div class="entur-line__header">
          ${this.formattedDeparture[2]} ${this._renderHumanReadable()}
        </div>

        <div
          class="entur-line__due entur-column icon-${this.clock_icon_state ??
          "hidden"}"
        >
          <ha-icon class="entur-line__icon" icon="mdi:clock"></ha-icon>
          ${this._renderTimeLeft()}
        </div>
      </div>
    `;
  }

  private _renderTimeLeft() {
    if (!this.formattedDeparture[1]) {
      return html``;
    }
    const due = dayjs(this.formattedDeparture[1], "H:mm");

    if (this.remaining_time == "extras" || this.remaining_time == "all") {
      return html`${due.fromNow(true)}`;
    }

    return html`${this.formattedDeparture[1]}`;
  }

  private _renderHumanReadable(): any {
    if (!this.human_readable_time) {
      return html``;
    }
    const due = dayjs(this.formattedDeparture[1], "H:mm");
    const customLocalize = setupCustomlocalize(this.hass!);

    if (
      this.human_readable_time == "extras" ||
      this.human_readable_time == "all"
    ) {
      return html`
        <p class="entur-line__hr">
          ${customLocalize("common.arrives")} ${due.fromNow()}
        </p>
      `;
    }
  }
}
