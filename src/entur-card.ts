import { LitElement, html, TemplateResult, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import type { EnturCardConfig } from "./types";
import pjson from "../package.json";
import "./templates/line";
import dayjs from "dayjs";
import "dayjs/locale/nb";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

import { cardStyle } from "./styles/card";

/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "entur-card",
  name: "Entur Card",
  description:
    "This card is made to work with the Entur public transport component.",
});
/* eslint-enable @typescript-eslint/no-explicit-any */

@customElement("entur-card")
export class EnturCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: EnturCardConfig;

  static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./entur-card-editor");
    return document.createElement("entur-card-editor") as LovelaceCardEditor;
  }

  getCardSize(): number | Promise<number> {
    return 1;
  }

  public static getStubConfig(): object {
    return {
      entities: [],
    };
  }

  setConfig(config: EnturCardConfig): void {
    this.config = config;
  }

  static get styles(): CSSResultGroup {
    return [cardStyle];
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html``;
    }

    const lang = this.hass?.locale.language ?? "en";
    dayjs.locale(lang);

    return html`
      <ha-card>
        ${this._renderHeader()}
        <div class="entur-routes">
          ${this.config.entities?.map((entity) => {
            const route = this.hass?.states[entity!.entity];

            if (!route) {
              return html``;
            }

            return html`
              <div
                class="entur-route ${this.config.divide_routes
                  ? "divided"
                  : ""}"
              >
                <ha-icon
                  class="entur-route__icon"
                  icon="${entity.icon ? entity.icon : route.attributes.icon}"
                ></ha-icon>
                <h2 class="entur-route__name">
                  ${entity.name ? entity.name : route.attributes.friendly_name}
                  ${entity.destination
                    ? html`
                        <ha-icon
                          class="entur-icon"
                          icon="mdi:chevron-right"
                        ></ha-icon>
                        ${entity.destination}
                      `
                    : html``}
                </h2>
                <div class="entur-route__lines">
                  <entur-card-line
                    .hass="${this.hass}"
                    .entity="${entity}"
                    .route=${route}
                    .locale=${lang}
                  ></entur-card-line>
                </div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  _renderHeader() {
    const header =
      this.config.name || this.config.display_time
        ? html`
            <div class="card-header entur-header">
              ${this.config.name
                ? html`
                    <div class="entur-header__name">${this.config.name}</div>
                  `
                : html``}
              ${this.config.display_time
                ? html`<div class="entur-header__time">
                    ${dayjs().format("HH:mm")}
                  </div>`
                : html``}
            </div>
          `
        : html``;
    return header;
  }
}

if (!customElements.get("entur-card")) {
  customElements.define("entur-card", EnturCard);
  console.info(
    `%c  ENTUR-CARD \n%c ${pjson.version}    `,
    "color: orange; font-weight: bold; background: black",
    "color: white; font-weight: bold; background: dimgray"
  );
}
