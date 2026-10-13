# Changelog

## v1.0.2-beta — v37 automatic SignalRGB startup

- New installations default to LIVE; starts synchronizing approximately 3 seconds after SignalRGB initializes. No repeated OFF → LIVE toggle needed after launching SignalRGB.
- Previously saved OFF/LIVE modes recognized; saved OFF remains OFF if SignalRGB preserves that preference.
- Verified by the maintainer after ending and reopening SignalRGB; **not yet verified after a complete Windows reboot**.
- Preserves v36 six-packet RGB format, 70 ms frame-start limit, 750 ms static/Pause keepalive, Esc flicker fix, HID ACK validation and fail-closed error handling.
- Previous development prototypes affected typing; this is still experimental.

## v1.0.1-beta — v36 static-color keepalive fix

- Fix solid colors and **paused SignalRGB effects** reverting to onboard Rainbow after inactivity.
- Resend the identical verified six-packet frame about every 750 ms when lighting is unchanged.
- Retain six-packet per-key RGB protocol, Esc flicker fix and USB ACK checking.

## v1.0.0-beta — v35 initial release

- First experimental continuous SignalRGB plugin for wired AULA F75 HE.
- Supports SignalRGB solid colors, Rainbow and other per-key effects.
- Includes Esc RGB flicker fix, OFF/LIVE control and error lockout.
