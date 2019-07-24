/* eslint indent: "off" */
/* eslint no-undef: "off" */
import {
  LitElement,
  html,
  customElement,
  property,
  CSSResult,
  TemplateResult
} from 'lit-element';
import {
  HomeAssistant,
  handleClick
} from "custom-card-helpers";
import style from './style';
import moment from 'moment/src/moment';
import 'moment/src/locale/nb';

import { EnturConfig } from "./types";

@customElement("entur-card")
class EnTurCard extends LitElement {
  // Add any properities that should cause your element to re-render here.
  @property() public hass?: HomeAssistant;

  @property() private _config?: EnturConfig;

  public setConfig(config: EnturConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error("Invalid configuration");
    }

    this._config = config;
  }

  readonly _lang = {
    en: {
      at: 'at',
      to: 'To',
      arrives: 'Arrives',
      arrived: 'Left about',
      delayed: 'Delayed',
      next_route: 'Next:',
    },
    nb: {
      at: 'klokken',
      to: 'Til',
      arrives: 'Avgang',
      arrived: 'Gikk for',
      delayed: 'Forsinket',
      next_route: 'Neste avgang:',
    }
  };

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this._config.show_warning) {
      return html`
        <ha-card>
          <div class="warning">Show Warning</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card @ha-click="${this._handleTap}">
        <div class="card-header entur-header">
          ${this._config.name !== undefined ? html`<div class="entur-name">${this._config.name}</div>` : html``}
          ${this._config.show_clock === true ? html`<div class="entur-clock">${this.getTime()}</div>` : html``}
        </div>

        ${this._config.entities.map((entity) => {
          const stateObj = this.hass.states[entity.entity];
          const station_name = entity.name ? entity.name : stateObj.attributes.friendly_name.match(/entur (.+?)(?= platform|$)/i)[1];
          const icon = entity.icon ? entity.icon : stateObj.attributes.icon;
          const destination = entity.destination ? entity.destination : 'unavailable';

          const line = this.getLineInfo(stateObj);
          const next_line = this.getNextLineInfo(stateObj);

          return stateObj ? html`
            <div class="entur-item">

              <ha-icon class="entur-type-icon" icon="mdi:${icon}"></ha-icon>
              
              <h2 class="entur-station">
                ${station_name}
                
                ${destination !== 'unavailable'
                  ? html` <ha-icon class="entur-icon" icon="mdi:chevron-right"></ha-icon> ${destination}`
                  : html``
                }
              </h2>

              <div class="entur-line">
                ${line.route}

                ${this._config.show_human
                  ? this.isNowOrHasBeen(line.due_with_delay) === false
                    ? html`<span class="entur-human is-now">${this._translate('arrives')} ${moment(line.due_with_delay, "HH:mm:ss").fromNow()}</span>`
                    : html`<span class="entur-human has-been">${this._translate('arrived')} ${moment(line.due_with_delay, "HH:mm:ss").fromNow()}</span>`
                  : html``
                }
              </div>

              ${line.delay > 0
                ? html`
                  <div class="entur-delay">
                    <ha-icon class="entur-icon" icon="mdi:clock-alert-outline"></ha-icon>
                    ${line.delay} min.
                  </div>`
                : html``
              }

              <div class="entur-status">
                <ha-icon class="entur-icon" icon="mdi:clock"></ha-icon>
                ${line.due_at}
              </div>

              ${this._config.show_next && next_line.due_at !== line.due_at
                ? html`
                  <div class="entur-next">
                  ${this._translate('next_route')} <em>${next_line.route}</em> ${this._translate('at')} ${next_line.due_at}
                  </div>`
                : html``
              }
            </div>
          `
          : html`
            <div class="not-found">Entity ${entity} not found.</div>
          `;
        })}
      </ha-card>
    `;
  }

  private getTime() {
    return moment().format('HH:mm');
  }

  private getLineInfo(stateObj) {
    return {
      route: stateObj.attributes.route,
      delay: stateObj.attributes.delay,
      due_at: stateObj.attributes.due_at,
      due_with_delay: moment(stateObj.attributes.due_at, "HH:mm:ss").add(stateObj.attributes.delay, "m").format("HH:mm:ss"),
    };
  }

  private getNextLineInfo(stateObj) {
    return {
      route: stateObj.attributes.next_route,
      delay: stateObj.attributes.next_delay,
      due_at: stateObj.attributes.next_due_at,
    };
  }

  private isNowOrHasBeen(due_at) {
    let now = moment();
    let when = moment(due_at, "HH:mm:ss");

    return (now > when ? true : false);
  }

  private _handleTap(): void {
    handleClick(this, this.hass!, this._config!, false, false);
  }

  private _translate(key) {
    return this._lang[this.hass.language][key];
  }

  static get styles(): CSSResult {
    return style;
  }
}
