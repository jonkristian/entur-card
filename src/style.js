import { css } from 'lit-element';

const style = css`
    .warning {
        display: block;
        color: black;
        background-color: var(--label-badge-yellow);
        padding: 8px;
    }

    .entur-header {
        display: flex;
    }

    .entur-name {
        flex: 1;
    }

    .entur-clock {
        align-self: flex-end;
    }

    .entur-item {
        padding: 1em;
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 24px 1fr;
        align-items: start;
    }

    .entur-row {
        grid-column: 2/2;
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px;
    }

    .entur-type-icon {
        align-self: center;
        width: 100%;
        height: auto;
    }

    .entur-station {
        color: var(--primary-text-color);
        font-size: 18px;
        font-weight: 300;
        margin: .3em 0;
    }

    .entur-line {
        color: var(--primary-text-color);
        font-size: 1.1em;
    }

    .entur-human {
        color: var(--primary-text-color);
        font-size: 0.8em;
        display: block;
        margin-top: 4px;
    }

    .entur-human.is-now {
        color: var(--primary-text-color);
    }

    .entur-human.has-been {
        color: var(--error-color);
    }

    .entur-human.coming-up {
        color: var(--secondary-text-color);
    }

    .entur-delay {
        color: var(--error-color);
        margin-left: auto;
        align-self: center;
    }

    .entur-status {
        color: var(--dark-primary-color);
        margin-left: 10px;
        align-self: center;
    }

    .entur-icon {
        margin-top: -2px;
    }

    .entur-next {
        color: var(--secondary-text-color);
        font-size: 13px;
        font-style: italic;
        margin-top: 8px;
    }

    .entur-next em {
        text-decoration: underline;
    }

    .entur-extra-departures {
        margin: .5em 0;
        padding: .5em 0;
        border-top: 1px dashed var(--divider-color);
    }

    .entur-extra-departure-line {
        color: var(--secondary-text-color);
        line-height: 150%;
        font-size: 0.9em;
    }

    .entur--departure-status {
        color: var(--secondary-text-color);
        line-height: 150%;
        font-size: 0.9em;
    }
    `;

    export default style;