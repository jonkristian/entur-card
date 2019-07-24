import { ActionConfig } from "custom-card-helpers";

// TODO Add your configuration elements here for type-checking
export interface EnturConfig {
  entities: any[];
  state: object;
  show_clock: boolean;
  show_next: boolean;
  show_human: boolean;
  show_extra_departures: boolean;
  type: string;
  name?: string;
  show_warning?: boolean;
  show_error?: boolean;
  entity?: string;
  tap_aciton?: ActionConfig;
  hold_action?: ActionConfig;
}
