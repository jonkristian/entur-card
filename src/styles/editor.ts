import { css } from "lit";

export const styleEditor = css`
  .entity {
    display: flex;
    align-items: center;
  }

  ha-icon {
    display: flex;
  }

  .card-title,
  mwc-select {
    width: 100%;
  }

  .entity .handle {
    padding-right: 8px;
    cursor: move;
  }

  .entity .handle > * {
    pointer-events: none;
  }

  .special-row {
    height: 60px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    overflow-x: hidden;
  }

  .special-row div {
    display: flex;
    flex-direction: column;
  }

  .remove-icon,
  .edit-icon {
    --mdc-icon-button-size: 36px;
    color: var(--secondary-text-color);
  }

  .secondary {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
`;
