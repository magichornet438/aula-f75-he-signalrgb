# AULA F75 HE — Experimental SignalRGB plugin

**Unofficial community beta: v1.0.2-beta (v37).** Continuous per-key SignalRGB effects for the **wired AULA F75 HE** Hall Effect keyboard. This is a community project, not affiliated with AULA or SignalRGB.

## What's new in v1.0.2-beta

**Automatic RGB synchronization after SignalRGB starts.** v36 required selecting **OFF → LIVE** manually after launching SignalRGB. v37 defaults to LIVE for new installations, waits approximately **3 seconds** after initialization, then streams your currently selected SignalRGB effect automatically. OFF is still selectable and should remain selected if SignalRGB preserves that preference. The USB packet transport is unchanged from v36.

The developer physically confirmed that v37 resumes syncing after force-closing and relaunching SignalRGB. **Automatic startup after a full Windows restart has not yet been confirmed on hardware.** SignalRGB itself must be configured to launch with Windows for boot-time sync.

## Features

- Samples real per-key colors from SignalRGB: solid colors, gradients, Rainbow, waves, and other supported effects
- Continuous effects at approximately **10 FPS** on the tested keyboard
- Paused and static colors held using a **750 ms** periodic RGB keepalive (v36 fix)
- **Esc RGB flicker fix**, six-packet-per-frame packed protocol, verified HID acknowledgments, frame watchdog and failure lockout
- Manual OFF switch; automatically starts LIVE after SignalRGB initializes (with a 3-second delay)

## Compatibility

- **Wired AULA F75 HE only** — USB VID/PID `38A6:2729`, HID interface 2, usage page `FF68`, usage `0061`
- Tested on one keyboard with firmware **1.55** and SignalRGB **2.5.74**
- Untested on wireless modes, other F75 models, other firmware versions, or additional hardware units

## Install

1. Download [`AULA_F75_HE_SignalRGB_AutoStart_v37_PRIVATE.js`](Plugins/AULA_F75_HE_SignalRGB_AutoStart_v37_PRIVATE.js) or get the file from [v1.0.2-beta Releases](https://github.com/magichornet438/aula-f75-he-signalrgb/releases/tag/v1.0.2-beta).
2. Fully close **SignalRGB and AULA Hub**. Back up your previous F75 HE plugin **outside** the active SignalRGB Plugins folder.
3. Remove old AULA F75 HE custom plugin files from the active Plugins folder to prevent duplicate USB device registrations. Install **only v37** in that folder.
4. Launch SignalRGB, open the AULA F75 HE device, and select **LIVE - follow SignalRGB effects (no time limit)** if OFF was previously remembered. v37 normally starts LIVE automatically, approximately 3 seconds after initialization.
5. Change your SignalRGB effect to any color or animation. Confirm **Esc**, **Backspace**, **Delete**, and normal typing behave correctly.
6. For automatic startup after logging into Windows, enable SignalRGB under Windows Startup Apps. If you want to disable streaming, choose **OFF**.

## Important safety warning

**Experimental beta. Do not treat this as a proven reliable or unattended driver.** Previous aggressive prototype versions caused stuck/repeating keyboard input (notably Esc and Delete). The tested protocol performed well on one keyboard, but **passing USB ACK validation does not prove input safety**. **v37 automatically streams after startup**, which may surprise users upgrading from v36. Save work and supervise initial tests. If a key sticks or repeats, exit SignalRGB completely, disconnect the keyboard's USB cable for **30 seconds**, reconnect and return to the prior version or stock software. **Never run AULA Hub and SignalRGB together.**

**Expected behavior:** If SignalRGB exits or Windows reboots, the keyboard may revert to its built-in Rainbow lighting until SignalRGB starts and reconnects. The plugin cannot retain live RGB while SignalRGB is not running. OFF stops USB writes but does not send an unverified stock-lighting restore command; unplug/reconnect if necessary.

## Previous releases

- [v1.0.1-beta / v36](https://github.com/magichornet438/aula-f75-he-signalrgb/releases/tag/v1.0.1-beta) — fixes static-color and Pause fallback to Rainbow (manual OFF → LIVE startup)
- [v1.0.0-beta / v35](https://github.com/magichornet438/aula-f75-he-signalrgb/releases/tag/v1.0.0-beta) — initial experimental continuous per-key RGB driver

No license has been selected for this project yet. The project owner can add one later.
