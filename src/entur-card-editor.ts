import { LitElement, html, TemplateResult, CSSResultGroup } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { guard } from "lit/directives/guard.js";
import type { SortableEvent } from "sortablejs";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";

import {
  fireEvent,
  HomeAssistant,
  LovelaceCardEditor,
  HASSDomEvent,
} from "custom-card-helpers";
import buildElementDefinitions from "./buildElementDefinitions";
import globalElementLoader from "./globalElementLoader";

import MwcListItem from "./mwc/list-item";
import MwcSelect from "./mwc/select";
import type {
  EditorTarget,
  EnturCardConfig,
  SubElementEditorConfig,
  EditSubElementEvent,
} from "./types";
import { styleEditor } from "./styles/editor";
import setupCustomlocalize from "./localize/localize";
import "./entur-card-entity-editor";

let Sortable;

@customElement("entur-card-editor")
export class EnturCardEditor
  extends ScopedRegistryHost(LitElement)
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config!: EnturCardConfig;
  @state() private _attached = false;
  @state() private _renderEmptySortable = false;
  @state() private _subElementEditorConfig?: SubElementEditorConfig;

  private _entities?;
  private _sortable?;

  static get elementDefinitions() {
    return buildElementDefinitions(
      [
        globalElementLoader("ha-checkbox"),
        globalElementLoader("ha-textfield"),
        globalElementLoader("ha-formfield"),
        globalElementLoader("ha-icon-button"),
        globalElementLoader("ha-icon"),
        globalElementLoader("entur-card-entity-editor"),
        MwcListItem,
        MwcSelect,
      ],
      EnturCardEditor
    );
  }

  static get styles(): CSSResultGroup {
    return [styleEditor];
  }

  public setConfig(config: EnturCardConfig): void {
    this._config = {
      name: "",
      ...config,
    };
    this._entities = config.entities;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._entities) {
      return html``;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    if (this._subElementEditorConfig) {
      return html`
        <entur-card-entity-editor
          .hass=${this.hass}
          .config=${this._subElementEditorConfig}
          @go-back=${this._goBack}
          @config-changed=${this._handleSubElementChanged}
          @edit-detail-element=${this._editDetailElement}
        >
        </entur-card-entity-editor>
      `;
    }

    // Filter states to only include sensors, and only those with an attribute containing a "route_id".
    const sensorsWithRouteId = Object.values(this.hass!.states)
      .filter((entity) => entity.entity_id.startsWith("sensor."))
      .filter((sensor) =>
        Object.keys(sensor.attributes).some((key) =>
          key.toLowerCase().includes("route_id")
        )
      )
      .map((sensor) => sensor.entity_id);

    return html`
      <div class="card-config">
        <ha-textfield
          class="card-title"
          .label=${customLocalize("editor.name")}
          .value="${this._config.name}"
          .configValue="${"name"}"
          @change="${this._valueChanged}"
        ></ha-textfield>

        <ha-formfield .label=${customLocalize("editor.display_time")}>
          <ha-checkbox
            @change="${this._valueChanged}"
            .checked=${this._config.display_time}
            .configValue="${"display_time"}"
          ></ha-checkbox>
        </ha-formfield>

        <ha-formfield .label=${customLocalize("editor.divide_routes")}>
          <ha-checkbox
            @change="${this._valueChanged}"
            .checked=${this._config.divide_routes}
            .configValue="${"divide_routes"}"
          ></ha-checkbox>
        </ha-formfield>

        <div class="entities">
          ${guard([this._entities, this._renderEmptySortable], () =>
            this._renderEmptySortable
              ? ""
              : this._entities?.map(
                  (route, index) => html`
                    <div class="entity">
                      <div class="handle">
                        <ha-icon icon="mdi:drag"></ha-icon>
                      </div>
                      ${html`
                        <div class="special-row">
                          <div>
                            <span
                              >${route.name ? route.name : route.entity}</span
                            >
                            <span class="secondary">${route.entity}</span>
                          </div>
                        </div>
                      `}
                      <ha-icon-button
                        label="Remove"
                        class="remove-icon"
                        .index=${index}
                        @click=${this._removeRow}
                      >
                        <ha-icon icon="mdi:close"></ha-icon>
                      </ha-icon-button>

                      <ha-icon-button
                        label="Edit"
                        class="edit-icon"
                        .index=${index}
                        @click=${this._editRow}
                      >
                        <ha-icon icon="mdi:pencil"></ha-icon>
                      </ha-icon-button>
                    </div>
                  `
                )
          )}
        </div>

        <mwc-select
          label="Entity"
          @selected="${this._addEntity}"
          @closed="${(e) => e.stopPropagation()}"
          fixedMenuPosition
          naturalMenuWidth
        >
          ${sensorsWithRouteId.map(
            (entity) => html`
              <mwc-list-item .value=${entity}> ${entity} </mwc-list-item>
            `
          )}
        </mwc-select>
      </div>
    `;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }

    if (target.configValue) {
      if (target.value === "") {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }

  private _handleSubElementChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const value = ev.detail.config;
    const newConfigEntities = this._config!.entities!.concat();

    if (!value) {
      newConfigEntities.splice(this._subElementEditorConfig!.index!, 1);
      this._goBack();
    } else {
      newConfigEntities[this._subElementEditorConfig!.index!] = value;
    }
    this._config = { ...this._config!, entities: newConfigEntities };

    this._subElementEditorConfig = {
      ...this._subElementEditorConfig!,
      elementConfig: value,
    };

    fireEvent(this, "config-changed", { config: this._config });
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._attached = true;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._attached = false;
  }

  protected updated(changedProps): void {
    super.updated(changedProps);
    const attachedChanged = changedProps.has("_attached");
    const entitiesChanged = changedProps.has("entities");

    if (!entitiesChanged && !attachedChanged) {
      return;
    }

    if (attachedChanged && !this._attached) {
      // Tear down sortable, if available
      this._sortable?.destroy();
      this._sortable = undefined;
      return;
    }

    if (!this._sortable && this._entities) {
      this._createSortable();
      return;
    }

    if (entitiesChanged) {
      this._handleEntitiesChanged();
    }
  }

  private async _handleEntitiesChanged(): Promise<void> {
    this._renderEmptySortable = true;
    await this.updateComplete;
    const container = this.shadowRoot?.querySelector(
      ".entities"
    ) as HTMLElement;
    while (container.lastElementChild) {
      container.removeChild(container.lastElementChild);
    }
    this._renderEmptySortable = false;
  }

  private async _createSortable() {
    if (!Sortable) {
      const sortableImport = await import(
        "sortablejs/modular/sortable.core.esm"
      );

      Sortable = sortableImport.Sortable;
      Sortable.mount(sortableImport.OnSpill);
      Sortable.mount(sortableImport.AutoScroll());
    }

    const element = this.shadowRoot?.querySelector(".entities");
    if (!element) return;
    this._sortable = new Sortable(element, {
      animation: 150,
      fallbackClass: "sortable-fallback",
      handle: ".handle",
      onEnd: async (evt) => this._rowMoved(evt),
    });
  }

  private _rowMoved(ev: SortableEvent): void {
    if (ev.oldIndex === ev.newIndex) return;

    const newEntities = this._entities!.concat();
    newEntities.splice(ev.newIndex, 0, newEntities.splice(ev.oldIndex, 1)[0]);

    this._valueChanged({
      target: { configValue: "entities", value: newEntities },
    });
  }

  private _removeRow(ev): void {
    const index = ev.currentTarget?.index || 0;
    const newEntities = this._entities?.concat();
    newEntities?.splice(index, 1);

    this._valueChanged({
      target: { configValue: "entities", value: newEntities },
    });
  }

  private async _addEntity(ev): Promise<void> {
    const target = ev.target! as EditorTarget;
    const value = target.value as string;

    if (value === "") {
      return;
    }

    const newEntities = this._entities.concat({
      entity: value,
    });
    (ev.target as any).value = "";
    this._valueChanged({
      target: { configValue: "entities", value: newEntities },
    });
  }

  private _editRow(ev) {
    const index = ev.currentTarget.index;

    this._subElementEditorConfig = {
      index,
      elementConfig: this._entities[index],
    };
  }

  private _goBack(): void {
    this._subElementEditorConfig = undefined;
  }

  private _editDetailElement(ev: HASSDomEvent<EditSubElementEvent>): void {
    this._subElementEditorConfig = ev.detail.subElementConfig;
  }
}
