# AULA F75 HE — Experimental SignalRGB plugin

**Unofficial community beta, version 1.0.0-beta.** Per-key RGB for the **wired** AULA F75 HE through SignalRGB. Tested on one keyboard with firmware 1.55 and SignalRGB 2.5.74. Not affiliated with AULA or SignalRGB.

## What works

- Follows colors from SignalRGB's canvas: solid colors, gradients, Rainbow, waves and other supported SignalRGB effects (including per-key colors).
- Continuous manual LIVE mode, no ten-minute cutoff. About **10 FPS** on the tested keyboard.
- Includes the Esc RGB flicker fix, packet ACK validation, static-frame deduplication and a startup OFF lock.

## SAFETY WARNING

This driver is **experimental** and has **not been validated for unattended or unlimited use**. Earlier rapid USB-protocol prototypes caused stuck or repeating Esc/Delete keyboard input. Packet ACK success does **not** prove typing is safe. Save work and supervise initial use. If a key sticks or repeats, immediately fully exit SignalRGB, unplug the keyboard for **30 seconds**, reconnect, and remove this plugin. Do not run AULA Hub simultaneously with SignalRGB.

## Compatibility

- Wired AULA F75 HE only: USB VID `38A6`, PID `2729`; HID interface 2, usage page `FF68`, usage `0061`.
- Known tested firmware: `1.55`. Other firmware or connection modes are not validated.

## Install

1. Exit SignalRGB and AULA Hub. Back up any old working plugin somewhere outside the active Plugins folder.
2. Place **only** [`Plugins/AULA_F75_HE_SignalRGB_Continuous_v35_PRIVATE.js`](Plugins/AULA_F75_HE_SignalRGB_Continuous_v35_PRIVATE.js) in the SignalRGB custom Plugins folder. Remove other custom plugins for the same keyboard from that active directory.
3. Restart SignalRGB and find **AULA F75 HE (Private continuous RGB v35)**. The "Private" display name remains unchanged because this is the **exact tested source**.
4. Explicitly select **OFF - no USB writes (select first)** in the plugin controls, then select **LIVE - follow SignalRGB effects (no time limit)**.
5. Select any effect in the SignalRGB Effects section. For example, test solid red, blue and white; then Rainbow. Check Esc/Delete/Backspace and normal typing.
6. To stop further USB writes, set the plugin to OFF. OFF may leave the last light colors on the keyboard until you unplug/replug; it does not send an undocumented hardware reset.

## Scope and limits

One unit has passed short and multi-minute manual tests; continuous long-term stability is not established. Frame rate varies with effect content and USB behavior. On error the plugin locks and stops further writes until a restart. This is a beta release and **not** a certified stable driver.

## Source

The plugin file is **byte-for-byte identical to the user's privately tested v35 file**. Its filename and internal Private test name are preserved intentionally. No license is included
