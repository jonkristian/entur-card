import { ActionConfig, LovelaceCardConfig } from 'custom-card-helpers';

export interface EnturCardConfig extends LovelaceCardConfig {
  entities: any[];
  state: object;
  show_clock: boolean;
  show_next: boolean;
  show_human: boolean;
  show_extra_departures: boolean;
  type: string;
  name?: string | false;
  show_warning?: boolean;
  show_error?: boolean;
  entity?: string;
  tap_aciton?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
