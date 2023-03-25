import { css } from "lit";

export const cardStyle = css`
  .entur-header {
    display: flex;
    padding: 1rem 1rem 0 1rem;
  }

  .entur-header__name {
    flex: 1;
  }

  .entur-header__time {
    align-self: flex-end;
  }

  .entur-column {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.3rem;
  }

  .entur-route {
    padding: 1rem;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 24px 1fr;
    align-items: flex-start;
    margin-block: 1rem;
  }

  .entur-route.divided {
    border-bottom: 1px solid var(--divider-color);
  }

  .entur-route:last-of-type {
    margin-bottom: 0;
    border-bottom: none;
  }

  .entur-route__name {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--primary-text-color);
    font-size: 18px;
    font-weight: 300;
    margin: 0;
  }

  .entur-route__icon {
    align-self: center;
    width: 100%;
    height: auto;
  }

  .entur-route__lines {
    grid-column: 2/2;
  }

  .entur-line__icon {
    --mdc-icon-size: 20px;
    line-height: 0;
  }

  .entur-line.divided {
    border-top: 1px solid var(--divider-color);
  }

  .entur-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.5rem;
    margin-block: 0.25rem;
    padding-block: 0.25rem;
  }

  .entur-line__header {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    row-gap: 0.15rem;
    margin-top: 0.3rem;
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 400;
  }

  .entur-line__hr {
    margin: 0;
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .entur-line__delay {
    --mdc-icon-size: 19px;
    font-size: 0.9rem;
    color: var(--error-color);
  }

  .entur-line__due {
    color: var(--dark-primary-color);
  }

  .entur-line__due.icon-right {
    flex-direction: row-reverse;
  }

  .entur-line__due.icon-hidden ha-icon {
    display: none;
  }

  .entur-line__next {
    color: var(--secondary-text-color);
    font-size: 1rem;
    margin-top: 8px;
  }
`;
