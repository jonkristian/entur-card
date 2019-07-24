# Entur Card
This card is made to work with the [Entur public transport](https://www.home-assistant.io/components/sensor.entur_public_transport/) component. You will have to configure the Entur component before you can use this card.
To easily extract stop id's from entur you can log in [here](https://stoppested.entur.org) with username and password **guest**.


[![image.png](https://i.postimg.cc/KjGQ2pwz/image.png)](https://postimg.cc/S2PcLdyF)

>⚠️ Unfortunately there is currently no provided method to define a start and a stop station with entur. But you can add a whitelist of *lines* so that you can force only relevant results.

### Installation

- Copy the `entur-card.js` file to your `config/www`
- Add `entur-card.js` as a dependency in your `ui-lovelace.yaml`

```yaml
resources:
  - url: /local/entur-card.js?v=1
    type: js
```

>⚠️ Make sure you change v=1 to a higher number every time you update your card with new code!

## Options for card

### CONFIGURATION VARIABLES
**type**
(string)(Required) custom:entur-card

**name**
(string)(Required) Name of the card

**show_clock**
(boolean) Display clock

**show_next**
(boolean) Display next line if true

**show_human**:
(boolean)(Optional) Display human readable time if true

**show_extra_departures**:
(boolean) Requires number_of_departures defined in your entur compontent.

**entities**
(list)(Required) A list of entity IDs or entity objects, see below.

## Options For Entities
If you define entities as objects instead of strings, you can add more customization and configuration:

### CONFIGURATION VARIABLES
**entity**
(string)(Required) Home Assistant entity ID.

**name**
(string)(Optional) Overwrites friendly name.

**destination**
(string)(Optional) Destination to show in title (Only for visual representation).


#### Configure the new card inside `ui-lovelace.yaml`

## Example configuration for this card.
```yaml
- type: custom:entur-card
  name: Rutetider
  show_clock: true
  show_next: true
  show_human: true
  show_extra_departures: true
  entities:
    - entity: sensor.transport_studentersamfundet
      name: Studentersamfundet
      destination: Halstein Gård
    - entity: sensor.transport_trondheim_s_platform_4
      name: Trondheim Sentralbanestasjon
    - entity: sensor.transport_trondheim_lufthavn
      name: Trondheim lufthavn
```

⭐️ this repository if you found it useful ❤️
