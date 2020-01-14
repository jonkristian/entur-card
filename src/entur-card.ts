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
} from 'custom-card-helpers';

import moment from 'moment/src/moment';
import style from './style';
import 'moment/src/locale/nb';

import { EnturConfig } from "./types";
import { localize } from './localize/localize';

@customElement("entur-card")
class EnTurCard extends LitElement {
  // Add any properities that should cause your element to re-render here.
  @property() public hass?: HomeAssistant;

  @property() private _config?: EnturConfig;

  public setConfig(config: EnturConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error(localize('invalid_configuration'));
    }

    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (['en', 'nb'].includes(this.hass.selectedLanguage)) {
      moment.locale(this.hass.selectedLanguage);
    } else {
      moment.locale('en');
    }

    if (!this._config || !this.hass) {
      return html``;
    }

    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this._config.show_warning) {
      return html`
        <ha-card>
          <div class="warning">${localize('show_warning')}</div>
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

          if (undefined === stateObj) {
            return html`
            <ha-card>
              <div class="warning">
                <ha-icon class="warning-icon" icon="mdi:comment-alert-outline"></ha-icon>
                ${localize('entity_error')}
              </div>
            </ha-card>
            `;
          }

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

              <div class="entur-row">
                <div class="entur-line">
                  ${line.route}

                  ${this._config.show_human
                    ? this.isNowOrHasBeen(line.due_at) === false
                      ? html`<span class="entur-human is-now">${localize('arrives')} ${moment(line.due_at, "HH:mm:ss").fromNow()}</span>`
                      : html`<span class="entur-human has-been">${localize('arrived')} ${moment(line.due_at, "HH:mm:ss").fromNow()}</span>`
                    : html``
                  }

                  ${this._config.show_next === true && next_line.due_at !== line.due_at
                    ? html`
                      <div class="entur-next">
                      ${localize('next_route')} <em>${next_line.route}</em> ${localize('at')} ${next_line.due_at}
                      </div>`
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
              </div>

              ${this._config.show_extra_departures === true
                ? html`${this.getExtraDepartures(stateObj.attributes)}`
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
    };
  }

  private getNextLineInfo(stateObj) {
    return {
      route: stateObj.attributes.next_route,
      delay: stateObj.attributes.next_delay,
      due_at: stateObj.attributes.next_due_at,
    };
  }

  private getExtraDepartures(obj) {
    const extraDepartures = [];
    const getTime = /\b([01]\d|2[0-3]):[0-5]\d/g;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(obj)) {
      if (key.startsWith('departure_')) {
        const time = obj[key].match(getTime);
        extraDepartures.push(
          html`
            <div class="entur-row">
              <div class="entur-line">
                ${obj[key].replace(time, '').replace('ca. ', '')}
                <span class="entur-human is-now">${localize('arrives')} ${moment(time, "HH:mm").fromNow()}</span>
              </div>
              <div class="entur-status">
                <ha-icon class="entur-icon" icon="mdi:clock"></ha-icon>
                ${time}
              </div>
            </div>
          `
        );
      }
    }

    return extraDepartures;
  }

  private isNowOrHasBeen(due_at) {
    const now = moment();
    const when = moment(due_at, "HH:mm:ss");

    return (now > when);
  }

  private _handleTap(): void {
    handleClick(this, this.hass!, this._config!, false, false);
  }

  static get styles(): CSSResult {
    return style;
  }
}
