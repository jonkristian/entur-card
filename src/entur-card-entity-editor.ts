import { css, LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  fireEvent,
  HomeAssistant,
  LovelaceCardEditor,
} from "custom-card-helpers";
import buildElementDefinitions from "./buildElementDefinitions";
import globalElementLoader from "./globalElementLoader";
import MwcListItem from "./mwc/list-item";
import MwcSelect from "./mwc/select";
import type { SubElementEditorConfig } from "./types";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";

import setupCustomlocalize from "./localize/localize";

declare global {
  interface HASSDomEvents {
    "go-back": undefined;
  }
}

@customElement("entur-card-entity-editor")
export class EnturCardEntityEditor
  extends ScopedRegistryHost(LitElement)
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config!: SubElementEditorConfig;

  static get elementDefinitions() {
    return buildElementDefinitions(
      [
        globalElementLoader("ha-checkbox"),
        globalElementLoader("ha-textfield"),
        globalElementLoader("ha-formfield"),
        globalElementLoader("ha-icon-button"),
        globalElementLoader("ha-icon"),
        MwcListItem,
        MwcSelect,
      ],
      EnturCardEntityEditor
    );
  }

  public setConfig(config: SubElementEditorConfig): void {
    this.config = {
      elementConfig: {
        name: "",
        destination: "",
        clock_icon_state: "left",
      },
      ...config,
    };
  }

  protected render(): TemplateResult {
    const customLocalize = setupCustomlocalize(this.hass);

    const clockIconState = ["left", "right"];
    const extraDepartures = ["next", "all"];
    const humanReadable = ["all", "line", "line_next", "line_extras"];
    const remainingTime = ["all", "line", "line_next", "line_extras"];

    return html`
      <div class="header">
        <div class="back-title">
          <ha-icon-button
            .label=${this.hass!.localize("ui.common.back")}
            @click=${this._goBack}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </ha-icon-button>
          <span slot="title">${customLocalize(`editor.title`)}</span>
        </div>
      </div>

      <div class="entity-editor">
        <ha-textfield
          class="entity-title"
          .label=${customLocalize("editor.name")}
          .value="${this.config.elementConfig?.name ?? ""}"
          .configValue="${"name"}"
          @change="${this._valueChanged}"
        ></ha-textfield>

        <ha-textfield
          class="entity-title"
          .label=${customLocalize("editor.destination")}
          .value="${this.config.elementConfig?.destination ?? ""}"
          .configValue="${"destination"}"
          @change="${this._valueChanged}"
        ></ha-textfield>

        <ha-formfield .label=${customLocalize("editor.divide_lines")}>
          <ha-checkbox
            @change="${this._valueChanged}"
            .checked=${this.config.elementConfig?.divide_lines}
            .configValue="${"divide_lines"}"
          ></ha-checkbox>
        </ha-formfield>

        <mwc-select
          .label=${customLocalize("editor.clock_icon_state.title")}
          .configValue=${"clock_icon_state"}
          .value=${this.config.elementConfig?.clock_icon_state}
          @selected="${this._valueChanged}"
          @closed="${(e) => e.stopPropagation()}"
          fixedMenuPosition
          naturalMenuWidth
        >
          <mwc-list-item></mwc-list-item>
          ${clockIconState.map(
            (value) => html`
              <mwc-list-item .value=${value}
                >${customLocalize(
                  `editor.clock_icon_state.${value}`
                )}</mwc-list-item
              >
            `
          )}
        </mwc-select>

        <mwc-select
          .label=${customLocalize("editor.extra_departures.title")}
          .configValue=${"extra_departures"}
          .value=${this.config.elementConfig?.extra_departures}
          @selected="${this._valueChanged}"
          @closed="${(e) => e.stopPropagation()}"
          fixedMenuPosition
          naturalMenuWidth
        >
          <mwc-list-item></mwc-list-item>
          ${extraDepartures.map(
            (value) => html`
              <mwc-list-item .value=${value}
                >${customLocalize(
                  `editor.extra_departures.${value}`
                )}</mwc-list-item
              >
            `
          )}
        </mwc-select>

        <mwc-select
          .label=${customLocalize("editor.human_readable_time.title")}
          .configValue=${"human_readable_time"}
          .value=${this.config.elementConfig?.human_readable_time}
          @selected="${this._valueChanged}"
          @closed="${(e) => e.stopPropagation()}"
          fixedMenuPosition
          naturalMenuWidth
        >
          <mwc-list-item></mwc-list-item>
          ${humanReadable.map(
            (value) => html`
              <mwc-list-item .value=${value}
                >${customLocalize(
                  `editor.human_readable_time.${value}`
                )}</mwc-list-item
              >
            `
          )}
        </mwc-select>
        <mwc-select
          .label=${customLocalize("editor.remaining_time.title")}
          .configValue=${"remaining_time"}
          .value=${this.config.elementConfig?.remaining_time}
          @selected="${this._valueChanged}"
          @closed="${(e) => e.stopPropagation()}"
          fixedMenuPosition
          naturalMenuWidth
        >
          <mwc-list-item></mwc-list-item>
          ${remainingTime.map(
            (value) => html`
              <mwc-list-item .value=${value}
                >${customLocalize(
                  `editor.remaining_time.${value}`
                )}</mwc-list-item
              >
            `
          )}
        </mwc-select>
      </div>
    `;
  }

  private _goBack(): void {
    fireEvent(this, "go-back");
  }

  private _valueChanged(ev): void {
    if (!this.config || !this.hass) {
      return;
    }

    const target = ev.target;
    if (target.configValue) {
      if (target.value === "") {
        const tmpConfig = { ...this.config.elementConfig };
        delete tmpConfig[target.configValue];
        this.config.elementConfig = tmpConfig;
      } else {
        const elementConfig = {
          ...this.config.elementConfig,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
        this.config.elementConfig = { ...elementConfig };
      }
    }

    fireEvent(this, "config-changed", { config: this.config.elementConfig });
  }

  static get styles() {
    return css`
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .back-title {
        display: flex;
        align-items: center;
        font-size: 18px;
      }

      .entity-editor {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      mwc-select {
        width: 100%;
      }

      ha-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "entur-card-entity-editor": EnturCardEntityEditor;
  }
}
