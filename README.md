# AULA F75 HE — Experimental SignalRGB plugin

**Unofficial community beta, v1.0.1-beta.** Per-key RGB for the **wired AULA F75 HE**, using SignalRGB effects and colors. Tested on one keyboard using firmware **1.55** and SignalRGB **2.5.74**. Not affiliated with AULA or SignalRGB.

## Latest release: v1.0.1-beta (v36)

**Fix:** v1.0.0-beta (v35) could let static colors or paused effects revert to the keyboard's onboard Rainbow mode after a few seconds of USB inactivity. The updated v36 driver repeats the last unchanged, validated six-packet RGB frame about **every 750 ms**, keeping a static or paused color active. It retains the previously tested Esc RGB flicker fix.

## Features

- Follows the **actual per-key colors** of SignalRGB's canvas: solid colors, Rainbow, gradients, waves and other supported effects.
- Continuous manual **LIVE** mode (no ten-minute cutoff).
- Approximately **10 FPS** full RGB updates with animated effects, as measured on one keyboard; static colors use low-frequency keepalive instead of streaming at full speed.
- Six-packet USB protocol, ACK verification, fail-closed error stop, 70 ms minimum frame-start spacing, Esc LED padding fix, and explicit startup OFF lock.

## Important safety warning

**Experimental; not certified for indefinite/unattended use.** Earlier experimental high-speed prototypes caused stuck or repeating Esc/Delete input, although the current build worked during its owner's supervised testing. A valid USB acknowledgment **does not prove typing safety**. Save work and supervise your initial use. If any input behaves abnormally, exit SignalRGB immediately, unplug the keyboard for **30 seconds**, reconnect and revert to stock software or the earlier tested version. **Do not run AULA Hub and SignalRGB simultaneously.**

## Compatibility

- **Wired** AULA F75 HE keyboard only: USB VID `38A6`, PID `2729`, HID interface `2`, usage page `FF68`, usage `0061`.
- Verified on **one** keyboard with firmware **1.55**; other firmware, devices and wireless modes untested.

## Installation

1. Download the latest `.js` plugin from the [v1.0.1-beta release](https://github.com/magichornet438/aula-f75-he-signalrgb/releases/tag/v1.0.1-beta) or from [`Plugins/AULA_F75_HE_SignalRGB_Keepalive_v36_PRIVATE.js`](Plugins/AULA_F75_HE_SignalRGB_Keepalive_v36_PRIVATE.js).
2. Fully close SignalRGB and AULA Hub. Back up any existing AULA custom plugin **outside** the active Plugins folder.
3. Put **only the v36 `.js`** into SignalRGB's custom Plugins folder. Remove the active v35 copy and other F75 HE plugins to avoid duplicate IDs.
4. Restart SignalRGB and select the keyboard named `AULA F75 HE (Private static keepalive v36)`. The old PRIVATE label is **intentionally preserved because the JavaScript is identical to the hardware-tested file**.
5. In plugin settings, explicitly select **OFF**, then **LIVE**. Choose any effect in SignalRGB. Try a static color and Pause; both should remain fixed instead of reverting to Rainbow.
6. To stop USB writes, select **OFF**. OFF may leave the last lighting pattern displayed; unplug and reconnect if stock lighting does not return.

## Known limitations

- Per-key animation is about 10 FPS on the tested unit, not a guaranteed frame rate.
- Static keepalive behavior is based on one user's physical test; long-term reliability on other keyboards is unknown.
- Firmware and USB behavior may differ on other hardware revisions.
- This plugin is **not** an official SignalRGB or AULA integration.

## Source and versions

- **v1.0.1-beta:** [`Plugins/AULA_F75_HE_SignalRGB_Keepalive_v36_PRIVATE.js`](Plugins/AULA_F75_HE_SignalRGB_Keepalive_v36_PRIVATE.js) — latest, Pause/static-color fix.
- **v1.0.0-beta:** [`Plugins/AULA_F75_HE_SignalRGB_Continuous_v35_PRIVATE.js`](Plugins/AULA_F75_HE_SignalRGB_Continuous_v35_PRIVATE.js) — retained for historical comparison; older version can fall back to Rainbow.

No license is bundled. The maintainer should choose a license if they intend to permit redistribution or modifications.
