class  EnTurCard extends HTMLElement {
  set hass (hass) {

    const entities = this.config.entities;
    const title    = this.config.title;
    const icon     = this.config.icon;

    if (!this.content) {
      const card = document.createElement('ha-card')
      card.header = title

      this.content = document.createElement('div')

      const style = document.createElement('style')
      style.textContent = `
        .entur {
          padding: 0 16px 16px;
          font-weight: 300;
        }

        .entur-glance {
          color: hsla(214, 90%, 52%, 0.8);
        }

        .entur .ha-icon {
          height: 20px;
          width: 20px;
        }

        .entur-item {
          margin-bottom: 1em;
          padding-bottom: 1em;
        }

        .entur-header {
          font-size: 1.4em;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 0.5em;
          margin-bottom: 0.5em;
        }

        .entur-content {
          font-size: 1.2em;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .entur-separator {
          color: #999999;
        }

        .entur-footer {
          display: flex;
          justify-content: space-between;
          font-style: italic;
          margin-top: 0.8em;
          color: #999999;
        }

        .entur .ontime {
          color: #dddddd;
        }

        .entur .delayed {
          color: rgba(231, 76, 60, .8);
        }

        .entur .ha-icon.traffic {
          height: 16px;
          width: 16px;
        }

        .entur .time,
        .entur .destination,
        .entur .delay,
        .entur .line {
          vertical-align: middle;
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

      const line = state.attributes['route'];
      const delay = state.attributes['delay'];
      const icon = entityId.icon;
      const name = entityId.name;
      const destination = entityId.destination;
      const time = moment(state.attributes['next_due_at']).format('H:mm');
      const human = moment(state.attributes['next_due_at']).fromNow();

      let delay_status = 'ontime';
      if ( delay > 0 ) {
        delay_status = 'delayed';
      }

      enturHtml += `
        <div class="entur-item">

          <div class="entur-header">
            <span class="station">${name}</span>
          </div>

          <div class="entur-content">
            <div class="entur-title">
              <ha-icon class="ha-icon entity" icon="mdi:${icon}"></ha-icon>
              <span class="line">${line}</span>
            </div>

            <div class="entur-separator">
              <ha-icon class="ha-icon separator" icon="mdi:dots-horizontal"></ha-icon>
              <ha-icon class="ha-icon right" icon="mdi:chevron-right"></ha-icon>
            </div>

            <div class="entur-title">
              <span class="destination">${destination}</span>
            </div>

            <div class="entur-glance">
              <ha-icon class="ha-icon clock" icon="mdi:clock"></ha-icon>
              <span class="time">${time}</span>
            </div>
          </div>

          <div class="entur-footer">
            <span class="time">Arriving ${human}</span>
            <span class="traffic">
              <span class="${delay_status}">
                <ha-icon class="ha-icon traffic" icon="mdi:bus-clock"></ha-icon>
                <span class="delay">${delay} min.</span>
              </span>
            </span>
          </div>
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
