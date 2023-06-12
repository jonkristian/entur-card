import { LitElement, html, TemplateResult, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./human-readable"
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

    const human_readable =
      this.human_readable_time === 'line_extras' ||
      this.human_readable_time === 'all'
      ? true
      : false;

    return html`
      <div class="entur-line ${this.divide_lines ? "divided" : ""}">
        <div class="entur-line__header">
          ${this.formattedDeparture[2]}
          ${human_readable ? html`
            <entur-card-human-readable
              .hass=${this.hass}
              .due=${this.formattedDeparture[1]}
            ></entur-card-human-readable>
          `:html``}
        </div>

        <div class="entur-line__due entur-column icon-${this.clock_icon_state ?? "hidden"}">
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
}
