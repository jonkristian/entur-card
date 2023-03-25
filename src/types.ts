import { ActionConfig, LovelaceCardConfig } from "custom-card-helpers";

export interface EnturCardEntityConfig {
  entity?: string;
  name?: string;
  icon?: string;
  destination?: string;
  divide_lines?: boolean;
  clock_icon_state?: string;
  extra_departures?: string;
  human_readable_time?: string;
  remaining_time?: string;
}

export interface EnturCardConfig extends LovelaceCardConfig {
  entity?: string;
  entities: any[];
  state: object;
  divide_routes: boolean;
  display_time: boolean;
  name?: string;
  show_warning?: boolean;
  show_error?: boolean;
}

export interface SubElementEditorConfig {
  index?: number;
  elementConfig?: EnturCardEntityConfig;
  entity?: string;
}

export interface EditSubElementEvent {
  subElementConfig: SubElementEditorConfig;
}

export interface EditorTarget extends EventTarget {
  value?: string;
  index?: number;
  checked?: boolean;
  configValue?: string;
  type?: HTMLInputElement["type"];
  config: ActionConfig;
}
