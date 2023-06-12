import { LitElement, html, TemplateResult, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./line-extra";
import "./human-readable"

import { cardStyle } from "../styles/card";

import dayjs from "dayjs";
import "dayjs/locale/nb";

import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

@customElement("entur-card-line")
export class EnturCardLine extends LitElement {
  @property() departures;
  @property() hass;
  @property() entity;
  @property() route;

  static get styles(): CSSResultGroup {
    return [cardStyle];
  }

  protected render(): TemplateResult {
    if (!this.entity || !this.route) {
      return html``;
    }

    const show_next_line =
      this.entity.extra_departures === "all" ||
      this.entity.extra_departures === "next"
      ? true
      : false;

    const line_human_readable =
      this.entity.human_readable_time === 'line' ||
      this.entity.human_readable_time === 'all'
      ? true
      : false;

    const line_next_human_readable =
    this.entity.human_readable_time === 'line_next' ||
    this.entity.human_readable_time === 'all'
    ? true
    : false;

    let departures = {};
    if (this.entity.extra_departures == "all") {
      departures = Object.keys(this.route.attributes)
        .filter((v) => v.startsWith("departure"))
        .map((e) => this.route.attributes[e]);
    }

    this.departures = departures;

    return html`
      <div class="entur-line">
        <div class="entur-line__header">
          ${this.route.attributes.route}
          ${line_human_readable ? html`
          <entur-card-human-readable
            .hass=${this.hass}
            .due=${this.route.attributes.due_at}
            .delay=${this.route.attributes.delay}
          ></entur-card-human-readable>
          `:html``}
        </div>
        ${this.route.attributes.delay > 0
        ? html`
            <div class="entur-line__delay entur-column">
              <ha-icon
                class="entur-icon"
                icon="mdi:clock-alert-outline"
              ></ha-icon>
              ${this.route.attributes.delay} min.
            </div>
          `
        : html``}

        <div class="entur-line__due entur-column icon-${this.entity.clock_icon_state ?? "hidden"}">
          <ha-icon class="entur-line__icon" icon="mdi:clock"></ha-icon>
          ${this._renderTimeLeft("line", this.route.attributes.due_at)}
        </div>
      </div>

      ${show_next_line ? html`
        <div class="entur-line next ${this.entity.divide_lines? "divided": ""}">
          <div class="entur-line__header">
            ${this.route.attributes.next_route}
            ${line_next_human_readable ? html`
              <entur-card-human-readable
                .hass=${this.hass}
                .due=${this.route.attributes.next_due_at}
                .delay=${this.route.attributes.next_delay}
              ></entur-card-human-readable>
            `:html``}
          </div>
          <div class="entur-line__due entur-column icon-${this.entity.clock_icon_state ?? "hidden"}">
            <ha-icon class="entur-line__icon" icon="mdi:clock"></ha-icon>
            ${this._renderTimeLeft("line_next", this.route.attributes.next_due_at)}
          </div>
        </div>
      `
      : html``}

      ${this.entity.extra_departures === "all" ? html`
        ${this.departures?.map((departure) => html`
          <entur-card-line-extra
            .hass=${this.hass}
            .departure="${departure}"
            .human_readable_time="${this.entity.human_readable_time}"
            .remaining_time="${this.entity.remaining_time}"
            .clock_icon_state="${this.entity.clock_icon_state}"
            .divide_lines="${this.entity.divide_lines}"
          ></entur-card-line-extra>
        `
      )}` : html``}
    `;
  }

  private _renderTimeLeft(type: string, due_at: number) {
    if (!due_at && !isNaN(due_at)) {
      return html``;
    }

    if (
      this.entity.remaining_time == type ||
      this.entity.remaining_time == "all"
    ) {
      return html`${dayjs(due_at, "H:mm").fromNow(true)}`;
    }

    return html`${due_at}`;
  }
}
