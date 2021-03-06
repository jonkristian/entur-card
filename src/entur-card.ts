/* eslint indent: "off" */
/* eslint no-undef: "off" */
import { LitElement, html, customElement, property, CSSResult, TemplateResult } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, getLovelace, LovelaceCard } from 'custom-card-helpers';

import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

import style from './style';

import { EnturCardConfig } from './types';
import { localize } from './localize/localize';
import { CARD_VERSION } from './const';

/* eslint no-console: 0 */
console.info(
  `%c  ENTUR-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'entur-card',
  name: 'Entur Card',
  description: 'This card is made to work with the Entur public transport component.',
});


@customElement('entur-card')
class EnTurCard extends LitElement {
  @property() public hass?: HomeAssistant;
  @property() private _config?: EnturCardConfig;

  public setConfig(config: EnturCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this._config = {
      name: 'EnturCard',
      ...config,
    };
  }

  protected render(): TemplateResult | void {
    if (['en', 'nb'].includes(this.hass.selectedLanguage)) {
      dayjs.locale(this.hass.selectedLanguage);
    } else {
      dayjs.locale('en');
    }

    if (this._config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }

    const header = (this._config.name || this._config.show_clock)
      ? html`
        <div class="card-header entur-header">
          ${false !== this._config.name
            ? html`
              <div class="entur-name">${this._config.name}</div>
            ` : html``
          }
          ${true === this._config.show_clock
            ? html`
              <div class="entur-clock">${this.getTime()}</div>
            ` : html``
          }
        </div>
        `
        : undefined

    return html`
      <ha-card>
        ${header}
        ${this._config.entities.map((entity) => {
          const stateObj = this.hass.states[entity.entity];

          if (undefined === stateObj) {
            return html`
            <ha-card>
              <div class="warning">
                <ha-icon class="warning-icon" icon="mdi:comment-alert-outline"></ha-icon>
                ${localize('common.entity_error')}
              </div>
            </ha-card>
            `;
          }

          const station_name = entity.name ? entity.name : stateObj.attributes.friendly_name.match(/entur (.+?)(?= platform|$)/i)[1];
          const icon = entity.icon ? entity.icon : stateObj.attributes.icon;
          const destination = entity.destination ? entity.destination : 'unavailable';

          const line = this.getLineInfo(stateObj);
          const next_line = this.getNextLineInfo(stateObj);

          return stateObj
            ? html`
                <div class="entur-item">
                  <ha-icon class="entur-type-icon" icon="${icon}"></ha-icon>

                  <h2 class="entur-station">
                    ${station_name}
                    ${destination !== 'unavailable'
                      ? html`
                          <ha-icon class="entur-icon" icon="mdi:chevron-right"></ha-icon> ${destination}
                        `
                      : html``}
                  </h2>

                  <div class="entur-row">
                    <div class="entur-line">
                      ${line.route}
                      ${true === this._config.show_human && line.delay == 0
                        ? html`
                            ${this.isNowOrHasBeen(line.due_at)}
                          `
                        : html``}
                      ${true === this._config.show_next && next_line.due_at !== line.due_at
                        ? html`
                            <div class="entur-next">
                              <em>${next_line.route}</em> ${localize('common.at')}
                              ${next_line.due_at}
                            </div>
                          `
                        : html``}
                    </div>

                    ${line.delay > 0
                      ? html`
                          <div class="entur-delay">
                            <ha-icon class="entur-icon" icon="mdi:clock-alert-outline"></ha-icon>
                            ${line.delay} min.
                          </div>
                        `
                      : html``}

                    <div class="entur-status">
                      <ha-icon class="entur-icon" icon="mdi:clock"></ha-icon>
                      ${line.due_at}
                    </div>
                  </div>

                  ${true === this._config.show_extra_departures
                    ? html`
                        ${this.getExtraDepartures(stateObj.attributes)}
                      `
                    : html``}
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
    return dayjs().format('HH:mm');
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
    // eslint-disable-next-line no-restricted-syntax
    const extraDepartures = [];

    // Pull time from string 'departure_*' (HH:mm)
    const getTime = /\b([01]\d|2[0-3]):[0-5]\d/g;

    // If show_next is false make sure the next departure is part of extra departures.
    if ( true !==  this._config.show_next ) {
      extraDepartures.push(
        html`
          <div class="entur-row">
            <div class="entur-line">
              ${obj.next_route}
              ${true === this._config.show_human
                ? html`${this.isNowOrHasBeen(obj.next_due_at)}`
                : html``
              }
            </div>
            <div class="entur-status">
              <ha-icon class="entur-icon" icon="mdi:clock"></ha-icon>
              ${obj.next_due_at}
            </div>
          </div>
        `
      );
    }

    for (const key of Object.keys(obj)) {
      if (key.startsWith('departure_')) {
        const time = obj[key].match(getTime);
        extraDepartures.push(
          html`
            <div class="entur-row">
              <div class="entur-line">
                ${obj[key].replace(time, '').replace('ca. ', '')}
                ${true === this._config.show_human
                  ? html`
                  ${this.isNowOrHasBeen(time[0])}
                  `
                  : html``
                }
              </div>
              <div class="entur-status">
                <ha-icon class="entur-icon" icon="mdi:clock"></ha-icon>
                ${time}
              </div>
            </div>
          `,
        );
      }
    }

    return extraDepartures;
  }

  private isNowOrHasBeen(due_at) {
    const now = dayjs();
    const when = dayjs(due_at, 'H:mm');
    const target = dayjs(due_at, 'H:mm');

    if (when > now) {
      return html`
        <span class="entur-human is-now">
          ${localize('common.arrives')}
          ${dayjs(target).fromNow()}
        </span>
      `;
    } else if (when.add(15, 'second') > now) {
      return html`
        <span class="entur-human has-been">
          ${localize('common.arrived')}
          ${dayjs(target).fromNow()}
        </span>
      `;
    } else {
      return html`
        <span class="entur-human coming-up">
          ${localize('common.coming')}
          ${dayjs(target).add(1, 'day').fromNow()}
        </span>
      `;
    }
  }

  private showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  static get styles(): CSSResult {
    return style;
  }
}
