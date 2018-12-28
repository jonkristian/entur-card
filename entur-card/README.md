# Entur Card
This card is made to work with the [Entur public transport](https://www.home-assistant.io/components/sensor.entur_public_transport/) component. You will have to configure this component before you can use this card.

[![image-16.png](https://i.postimg.cc/43g9s0Vk/image-16.png)](https://postimg.cc/75K6NmKm)

>⚠️ Unfortunately there is currently no provided method to define a start and a stop station with entur. But you can add a whitelist of *lines* so that you can force only relevant results. For now this card let's you define a destination, only added for visual reasons. Hopefully in the future we can define from / to, by then the destination option will be removed.

### Installation
*This card requires momentjs dependency to display times in various formats.*

- Copy the `entur-card.js` file to your `config/www`
- Add `entur-card.js` and `moment.js` as dependencies in your `ui-lovelace.yaml`

```yaml
resources:
  - url: https://unpkg.com/moment@2.22.2/moment.js
    type: js
  - url: /local/entur-card.js?v=1
    type: js
```

>⚠️ Make sure you change v=1 to a higher number every time you update your card with new code!

#### Configure the new card inside `ui-lovelace.yaml`

Example configuration for this card.
```yaml
- type: custom:entur-card
  title: Busstider
  icon: mdi:train-car
  entities:
    - entity: sensor.entur_halstein_gard
      name: Halstein Gård
      icon: mdi:bus
      destination: Studentersamfundet
    - entity: sensor.entur_studentersamfundet
      name: Studentersamfundet
      icon: mdi:bus
      destination: Halstein Gård
```

⭐️ this repository if you found it useful ❤️
