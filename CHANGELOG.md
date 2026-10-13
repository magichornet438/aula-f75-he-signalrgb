# Changelog

## v1.0.1-beta — v36 static-color keepalive fix

- Fix solid colors and **paused SignalRGB effects** reverting to the keyboard's own Rainbow lighting after inactivity.
- For identical frames, resend the existing six-packet, ACK-verified RGB data about every **750 ms** instead of deduplicating forever.
- Preserve the tested v35/v34 packet protocol, 70 ms minimum frame-start spacing, Esc LED padding fix, per-key colors, startup OFF lock, LIVE/OFF control, 300 ms per-frame watchdog and fail-closed errors.
- Verified by the maintainer on their wired AULA F75 HE. Long-term reliability on other units remains unverified.

## v1.0.0-beta — v35 initial release

- First experimental continuous SignalRGB candidate, matching privately tested v35.
- Live per-key color sampling for any supported SignalRGB effect.
- Esc flicker corrected by valid RGB padding records (v33 fix).
- Retained ACK checks, 70 ms frame-start spacing, OFF/LIVE control and fault lock.
- Known risk: older prototypes caused stuck/repeated inputs.
