class  EnTurCard extends HTMLElement {
  set hass (hass) {

    const entities = this.config.entities;
    const title    = this.config.title;
    const icon     = this.config.icon;
    const showhuman = this.config.human;

    if (!this.content) {
      const card = document.createElement('ha-card')
      card.header = title

      this.content = document.createElement('div')

      const style = document.createElement('style')
      style.textContent = `
        .entur {
          padding: 0 16px 16px;
        }

        .entur-glance {
          color: hsla(214, 90%, 52%, 0.8);
        }

        .entur .ha-icon {
          height: 20px;
          width: 20px;
        }

        .entur-item {
          padding-bottom: 0.5em;
          padding-left: 10px;
        }

        .entur-header {
        }

        .entur-header .ha-icon {
          height: 23px;
          width: 23px;
          margin-right: 8px;
          margin-bottom: 5px
        }

        .entur-title {
          flex: 1;
        }
        .station {
        }
        .entur-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.2em;
          padding-left: 48px;
        }
        .entur-content .entur-line {
          font-family: var(--paper-font-body1_-_font-family);
          -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
          font-size: var(--paper-font-body1_-_font-size);
          font-weight: var(--paper-font-body1_-_font-weight);
          letter-spacing: var(--paper-font-body1_-_letter-spacing);
          line-height: var(--paper-font-body1_-_line-height);

        }
        .entur-delay-delayed{
          font-family: var(--paper-font-body1_-_font-family);
          -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
          font-weight: var(--paper-font-body1_-_font-weight);
          letter-spacing: var(--paper-font-body1_-_letter-spacing);
          line-height: var(--paper-font-body1_-_line-height);
          font-size: 0.8em;
          font-style: italic;
          display: flex;
          align-items: right;
          text-align: right;
          justify-content: flex-end;
        }
        .entur-delay-ontime{
          display: none;
        }
        .entur .ontime {
          color: hsla(214, 90%, 52%, 0.8);
        }

        .entur .delayed {
          color: rgba(231, 76, 60, .8);
        }

        .entur .ha-icon.traffic {
          height: 16px;
          width: 16px;
        }
        .entur-station .ha-icon {
          flex: 0 0 40;
          color: var(--paper-item-icon-color, #44739e);
        }
        .entur-glance .ha-icon{
          color: var(--primary-color);
        }
        .entur-glance .time{
          color: var(--primary-color);
          font-family: var(--paper-font-body1_-_font-family);
          -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
          font-size: var(--paper-font-body1_-_font-size);
          font-weight: var(--paper-font-body1_-_font-weight);
          letter-spacing: var(--paper-font-body1_-_letter-spacing);
          line-height: var(--paper-font-body1_-_line-height);
        }
        .entur-station .station {
          font-family: var(--paper-font-body1_-_font-family);
          -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
          font-size: var(--paper-font-body1_-_font-size);
          font-weight: var(--paper-font-body1_-_font-weight);
          letter-spacing: var(--paper-font-body1_-_letter-spacing);
          line-height: var(--paper-font-body1_-_line-height);
          line-height: 40px;
          color: var(--primary-text-color);
          margin-left: 15px;
        }
        .entur-footer {
          padding-left: 48px;
          display: flex;
          justify-content: space-between;
          font-style: italic;
        }
        .entur-footer .entur-footer-text{
          color: var(--secondary-color);
          font-family: var(--paper-font-body1_-_font-family);
          -webkit-font-smoothing: var(--paper-font-body1_-_-webkit-font-smoothing);
          font-size: 0.8em;
          font-weight: var(--paper-font-body1_-_font-weight);
          letter-spacing: var(--paper-font-body1_-_letter-spacing);
          line-height: var(--paper-font-body1_-_line-height);
          text-align: right;
          font-style: italic;
        }
        `
      card.appendChild(style)
      card.appendChild(this.content)
      this.appendChild(card)
    }

    var enturHtml = `
    <div class="entur">
    `

    entities.forEach( function(entityId) {

      const state = hass.states[entityId.entity];

      const name = entityId.name ? entityId.name : state.attributes['friendly_name'].match(/entur (.+?)(?= platform|$)/i)[1];
      const icon = entityId.icon ? entityId.icon : state.attributes['icon'];
      const destination = entityId.destination ? entityId.destination : 'unavailable';

      const line = state.attributes['route'];
      const delay = state.attributes['delay'];
			const time = state.attributes['due_at'];
			const human = moment(state.attributes['due_at'], "HH:mm").fromNow();

      const delay_status = delay > 0 ? 'delayed' : 'ontime';

      const next_line = state.attributes['next_route'];
      const next_delay = state.attributes['next_delay'];
			const next_time = state.attributes['next_due_at'];
			const next_human = moment(state.attributes['next_due_at'], "HH:mm").fromNow();

      const next_delay_status = next_delay > 0 ? 'delayed':'ontime';

      enturHtml += `
        <div class="entur-item">
          <div class="entur-header">
            <div class="entur-station">
              <ha-icon class="ha-icon entity" icon="mdi:${icon}"></ha-icon>
              <span class="station">${name}</span>
                  `
      if (destination != 'unavailable'){
        enturHtml += `
              <span class="station"> -> ${destination}</span>
        `
      }
      enturHtml += `
            </div>
          </div>
        `
      enturHtml += `
          <div class="entur-content">
            <div class="entur-title">
              <span class="line">${line}</span>
            </div>
            <div class="entur-delay-${delay_status}">
              <span class="${delay_status}">
                <ha-icon class="ha-icon traffic" icon="mdi:bus-clock"></ha-icon>
                <span class="delay">${delay} min.</span>
              </span>
            </div>

            <div class="entur-glance">
              <ha-icon class="ha-icon clock" icon="mdi:clock"></ha-icon>
              <span class="time">${time}</span>
            </div>
          </div>
                  `
      if (showhuman != false){
        enturHtml += `
          <div class="entur-footer">
            <span class="entur-footer-text">
              Arrives ${human}
            </span>
          </div>
        `
      }
      enturHtml += `
          <div class="entur-content">
            <div class="entur-title">
              <span class="line">${next_line}</span>
            </div>
            <div class="entur-delay-${next_delay_status}">
              <span class="${next_delay_status}">
                <ha-icon class="ha-icon traffic" icon="mdi:bus-clock"></ha-icon>
                <span class="delay">${next_delay} min.</span>
              </span>
            </div>

            <div class="entur-glance">
              <ha-icon class="ha-icon clock" icon="mdi:clock"></ha-icon>
              <span class="time">${next_time}</span>
            </div>
          </div>
                  `
      if (showhuman != false){
        enturHtml += `
          <div class="entur-footer">
            <span class="entur-footer-text">
              Arrives ${next_human}
            </span>
          </div>
        `
      }
      enturHtml += `
        </div>

      `
    })
    enturHtml += `
    </div>
    `

    this.content.innerHTML = enturHtml;
  }

  setConfig (config) {
    if (!config.entities) {
      throw new Error('You need to add one or more entities')
    }
    this.config = config
  }

  getCardSize () {
    return 1
  }
}

customElements.define('entur-card',  EnTurCard)
