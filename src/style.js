import { css } from 'lit-element';

const style = css`
    :host {
        --entur-primary-color: #44739e;
        --entur-secondary-color: #9e9e9e;
        --entur-station-color: #666;
        --entur-mute-color: #efefef;
        --entur-warning-color: rgba(231, 76, 60, .8);
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
        padding: 0 16px 16px;
        border-bottom: 1px solid var(--entur-mute-color);
        display: grid;
        grid-gap: 0px 10px;
        grid-template-columns: 24px 1fr;
        align-items: start;
        grid-template-areas:
            "entur-icon entur-station entur-station entur-station"
            ". entur-line entur-delay entur-status"
            ". entur-next entur-next entur-next";
    }

    .entur-type-icon {
        grid-area: entur-icon;
        color: var(--entur-primary-color);
        align-self: center;
        width: 100%;
        height: auto;
    }

    .entur-station {
        grid-area: entur-station;
        color: var(--entur-station-color);
        font-size: 1.3em;
        font-weight: 300;
    }

    .entur-line {
        grid-area: entur-line;
        color: var(--entur-primary-color);
        font-size: 1.1em;
        margin-bottom: .5em;
    }

    .entur-human {
        color: var(--entur-text-color);
        font-size: 0.8em;
        display: block;
        margin-top: 4px;
    }

    .entur-human.has-been {
        color: var(--entur-warning-color);
    }

    .entur-delay {
        grid-area: entur-delay;
        align-self: center;
        color: var(--entur-warning-color);
    }

    .entur-status {
        grid-area: entur-status;
        color: var(--primary-color);
        align-self: center;
    }

    .entur-icon {
        margin-top: -2px;
    }

    .entur-next {
        grid-area: entur-next;
        color: var(--entur-secondary-color);
        font-size: 0.9em;
        font-style: italic;
    }

    .entur-next em {
        text-decoration: underline;
    }`;

    export default style;