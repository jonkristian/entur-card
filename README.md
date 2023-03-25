# Entur Card

[![hacs][hacs-badge]][hacs-url]
[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
![Project Maintenance][maintenance-shield]
[![BuyMeCoffee][buymecoffeebadge]][buymecoffee]

This card is made to work with the [Entur public transport](https://www.home-assistant.io/components/sensor.entur_public_transport/) component. You will have to configure the Entur component before you can use this card.
Click [here](https://stoppested.entur.org) to get stop id's for your setup.

![Example][exampleimg]

> ⚠️ Unfortunately there is currently no provided method to define a start and a stop station with entur. But you can add a whitelist of _lines_ so that you can force only relevant results.

### Features

- 🛠 Editor (no need to edit `yaml`)
- 🌎 Internationalization
- 😍 Customize routes and lines
- 🌓 Light and dark theme support

## Installation

### HACS

Entur Card is available in [HACS][hacs] (Home Assistant Community Store).

1. Install HACS if you don't have it already
2. Open HACS in Home Assistant
3. Go to "Frontend" section
4. Click button with "+" icon
5. Search for "Entur Card"

### Manual

1. Download `entur-card.js` file from the [latest-release].
2. Put `entur-card.js` file into your `config/www` folder.
3. Add reference to `entur-card.js` in Dashboard. There's two way to do that:
   - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/entur-card.js` → Set _Resource type_ as `JavaScript Module`.
     **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
   - **Using YAML:** Add following code to `lovelace` section.
     ```yaml
     resources:
       - url: /local/entur-card.js
         type: js
     ```

---

## Card options

| Field             | Type               | Description                                        |
| ----------------- | ------------------ | -------------------------------------------------- |
| custom:entur-card | `string(required)` |
| name              | `string`           | Name of the card                                   |
| divide_routes     | `true/false`       | Add a line divider between routes                  |
| display_time      | `true/false`       | Displays the time in the header                    |
| entities          | `list(required)`   | A list of entity IDs or entity objects, see below. |

## Entity options

| Field               | Type               | Description                                           |
| ------------------- | ------------------ | ----------------------------------------------------- |
| entity              | `string(required)` | Home Assistant entity ID.                             |
| icon                | `string`           | Overrides the icon.                                   |
| name                | `string`           | Overrides friendly name.                              |
| destination         | `string`           | Display hardcoded destination name.                   |
| clock_icon_state    | `string`           | None or `left` / `right` side of the time string.     |
| extra_departures    | `string`           | `next` or `all`.                                      |
| human_readable_time | `string`           | Show for `all`, `line`, `line_next` or `line_extras`. |
| remaining_time      | `string`           | Show for `all`, `line`, `line_next` or `line_extras`. |

## Entur configuration

```yaml
sensor:
  - platform: entur_public_transport
    name: Transport
    show_on_map: true
    stop_ids:
      - "NSR:StopPlace:5850" # Grorud T bus stop
      - "NSR:StopPlace:548" # Bergen train station
      - "NSR:StopPlace:58652" # Mortavika ferry
```

## Manual card configuration

```yaml
- type: custom:entur-card
  name: Rutetider
  entities:
    - entity: sensor.transport_grorud_t
      extra_departures: all
      divide_lines: true
      clock_icon_state: left
    - entity: sensor.transport_bergen_stasjon
      human_readable_time: line
    - entity: sensor.transport_mortavika_ferjekai
      remaining_time: all
      clock_icon_state: left
  display_time: true
  divide_routes: true
```

## Contributions are welcome!

---

⭐️ this repository if you found it useful ❤️

[![BuyMeCoffee][buymecoffebadge2]][buymecoffee]

<!-- Badges -->

[buymecoffee]: https://www.buymeacoffee.com/jonkristian
[buymecoffeebadge]: https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg?style=for-the-badge
[buymecoffebadge2]: https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/white_img.png
[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/HACS-default-orange.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/
[license-shield]: https://img.shields.io/github/license/jonkristian/entur-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Jon%20Kristian%20Nilsen%20%40jonkristian-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/jonkristian/entur-card.svg?style=for-the-badge
[releases]: https://github.com/jonkristian/entur-card/releases

<!-- References -->

[hacs]: https://hacs.xyz
[exampleimg]: example.png
