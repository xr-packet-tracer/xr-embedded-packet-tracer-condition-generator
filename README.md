# XR Embedded Packet Tracer - Condition Generator

This project is a web UI for generating IOS XR embedded packet tracer match conditions in `offset / value / mask` form.

It helps build match triplets for:
- Ethernet
- Dot1q
- MPLS
- IPv4
- IPv6
- SRv6
- TCP
- UDP

The application does not run packet tracing itself. It generates condition triplets that can be used with XR packet tracer workflows.

## XR Constraints

IOS XR packet tracer supports:
- maximum 3 conditions
- maximum 4 octets per condition

The UI now includes guided helpers to make those limits visible while building matches:
- MAC address matching by byte start and byte length
- IPv6 matching by byte start and byte length
- SRv6 locator mask generation
- SRv6 micro-SID mask generation
- live condition-budget summaries in the relevant forms

## Runtime Requirements

This project is intended to run on current Node.js LTS versions.

See [package.json](/nobackup/avidakov/ws/xr-dev/tmp/xr-packet-tracer-master/package.json) for the supported engine range:
- `node >=18 <25`

Recommended:
- Node.js 20 LTS
- npm bundled with that Node.js release

If `npm` is not installed on your MacBook, install Node.js first. The standard Node.js package installer already includes `npm`.

## Local Development

From the project directory:

```bash
npm install
npm start
```

The app starts in development mode and is typically served on:

```text
http://localhost:3000
```

## Validation

Run:

```bash
npm test
npm run build
```

Recommended validation sequence:
1. `npm install`
2. `npm test`
3. `npm run build`

## Guided Matching

### Ethernet

For DMAC and SMAC, the UI supports guided legal masks:
- select match start byte
- select match length from 1 to 4 bytes
- generate a legal mask

This is easier than manually constructing a mask while staying inside the XR 4-octet limit.

### IPv6

For source and destination IPv6 addresses, the UI supports:
- manual IPv6 address and mask entry
- guided mask generation using byte start and byte length
- live condition count for the current mask

This makes it easier to match only the IPv6 slice that matters instead of matching a larger address region than XR packet tracer can represent.

### SRv6

The SRv6 UI supports both:
- raw SRH field matching
  - Next Header
  - Header Extension Length
  - Routing Type
  - Segments Left
  - Flags
  - Tag
- SRv6 destination-address guidance
  - locator-based matching
  - micro-SID based matching

To use SRv6 locator or micro-SID helpers:
1. enter the SRv6 destination IPv6 address
2. select locator length and/or micro-SID layout
3. enable locator and/or micro-SID triplet generation
4. submit to generate the corresponding triplets

## Example Workflows

### Match first 4 bytes of DMAC

1. Add `Ethernet`
2. Check `Ethernet`
3. Enter the DMAC value
4. Set `DMAC Match Start Byte` to `0`
5. Set `DMAC Match Length` to `4 bytes`
6. Click `Generate legal DMAC mask`
7. Submit

### Match IPv6 locator /48

1. Add `IPv6`
2. Check `IPv6`
3. Enter the destination IPv6 address
4. Set `SRv6 Locator Bits` to `/48`
5. Click `Generate locator mask`
6. Submit

### Match a specific SRv6 micro-SID

1. Add `IPv6` and `SRv6` according to the intended packet layout
2. Check the relevant headers
3. In `SRv6`, enter the destination IPv6 address
4. Set locator size
5. Set micro-SID size and micro-SID index
6. Enable `Generate micro-SID triplets`
7. Submit

## Notes

- This project was updated for newer Node.js / React runtime compatibility.
- The repository currently contains source changes in place under this workspace.
- If dependency installation is blocked by local policy, copy the whole project directory to a machine that can run `npm install`, `npm test`, and `npm run build`.

## Troubleshooting

### `npm install` fails with dependency resolution errors

If `npm install` reports dependency conflicts after the dependency update, regenerate the lockfile:

```bash
rm -rf node_modules package-lock.json
npm install
```

This is preferred over `--force` or `--legacy-peer-deps`.

### `npm test` fails with `@testing-library/jest-dom/extend-expect`

The project now uses the newer import form:

```js
import "@testing-library/jest-dom";
```

If you still see the old error, make sure you are using the current [setupTests.js](/nobackup/avidakov/ws/xr-dev/tmp/xr-packet-tracer-master/src/setupTests.js).

### `npm run build` warns about local Bootstrap source maps

The project now imports Bootstrap from `node_modules` in [index.js](/nobackup/avidakov/ws/xr-dev/tmp/xr-packet-tracer-master/src/index.js):

```js
import "bootstrap/dist/css/bootstrap.min.css";
```

If you still see warnings referring to `src/bootstrap/dist/css/bootstrap.min.css.map`, make sure you are using the updated source tree.

### `npm start` says `Compiled successfully`, but the browser hangs

This can happen if VS Code is auto-forwarding and binding the same localhost port.

Symptoms:
- `npm start` reports success
- browser does not load `http://localhost:3000`
- `lsof -nP -iTCP:3000 -sTCP:LISTEN` shows both `node` and `Code Helper`

Fix:
1. Disable automatic port forwarding in VS Code
2. Restart VS Code
3. Restart `npm start`

After that, `http://localhost:3000` should point directly to the local React dev server.

### `localhost` still does not work

Run:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
curl -v --max-time 5 http://127.0.0.1:3000
```

If another application is binding `127.0.0.1:3000`, move React to another port:

```bash
PORT=3001 npm start
```
