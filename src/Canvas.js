/* eslint-disable */
import * as L from "partial.lenses";
import { curryN, cond } from "ramda";
import { inspect } from "util";
import { Group } from "@visx/group";
import { Text } from "@visx/text";

import { Toolbar } from "./Toolbar";
import css from "./Canvas.module.css";
import { useCanvas } from "./hooks";

const { sign, sqrt, abs, pow, sin, cos, tan, atan2, asin, PI } = Math;
const π = Math.PI;

const between = curryN(3, (a, b, x) => x >= a && x <= b);

export function Canvas(props) {
  const { width, height } = props;
  const asd = useCanvas(document);

  const { mouse } = asd;
  const { pos, orig } = mouse;

  const hasPos = !!pos.x && !!pos.y;
  const hasOrig = !!orig.x && !!orig.y;

  const posSign = hasOrig
    ? { x: sign(pos.x - orig.x), y: sign(pos.y - orig.y) }
    : { x: 0, y: 0 };

  const margin = 20;

  const delta = hasOrig
    ? { x: pos.x - orig.x, y: pos.y - orig.y }
    : { x: 0, y: 0 };

  const adj = delta.x;
  const opp = delta.y;

  const hyp = sqrt(adj * adj + opp * opp);

  const rad = 180 / π;

  const sine = sin(opp / hyp) * rad || 0;
  const cosine = cos(adj / hyp) * rad || 0;
  const tangent = tan(opp / adj) * rad || 0;

  const boundary = {
    0: 0,
    90: π / 2,
    180: π,
    270: (3 * π) / 2,
    360: 2 * π,
  };

  const getQuad = cond([
    [between(boundary[0], boundary[90]), () => 1],
    [between(boundary[90], boundary[180]), () => 2],
    [between(boundary[180], boundary[270]), () => 3],
    [between(boundary[270], boundary[360]), () => 4],
    [() => true, (v) => `${v.toFixed(2)}`],
  ]);

  const arctan = atan2(delta.y, delta.x);

  const asine = asin(delta.x / hyp);

  const show = {
    asine: asine,
    asineDeg: asine * (180 / π),
    atan: arctan,
    atanDeg: arctan * (180 / π),
  };

  const quadMargin = margin * 4;

  return (
    <div className={css.root}>
      <div className={css.brand}>
        <header>Trigonometry Playground</header>

        <ol>
          <li>
            Click and drag on the canvas, this draws a line between the starting
            point and the current mouse position
          </li>
        </ol>
      </div>

      <div className={css.angDebug}>
        <dl className={css.angDebugList}>
          <dt>delta</dt>
          <dd>
            x: {delta.x}, y: {delta.y}
          </dd>

          <dt>adjacent</dt>
          <dd>{adj}</dd>

          <dt>opposite</dt>
          <dd>{opp}</dd>

          <dt>hypotenuse</dt>
          <dd>{hyp.toFixed(2)}</dd>

          <dt>sine</dt>
          <dd>{sine.toFixed(2)}</dd>

          <dt>asine</dt>
          <dd>{show.asine ? show.asine.toFixed(2) : "none"}</dd>

          <dt>asine (deg)</dt>
          <dd>{show.asineDeg ? `${show.asineDeg.toFixed(2)}°` : "none"}</dd>

          <dt>sign</dt>
          <dd>
            x: {posSign.x}, y: {posSign.y}
          </dd>
        </dl>
      </div>
      <div className={css.debug}>
        <pre>{inspect(asd.mouse, { depth: Infinity })}</pre>
      </div>

      {Object.values(asd.objects).map((o, i) => (
        <div
          key={i}
          className={[css.object, "hidden"].join(" ")}
          style={{
            ...o.canvas.size,
            transform: `translateX(${o.canvas.pos.x}px) translateY(${o.canvas.pos.y}px)`,
          }}
        >
          {`translateX(${o.canvas.pos.x}px) translateY(${o.canvas.pos.y})`}
        </div>
      ))}

      <div className={css.underlay}>
        <svg {...{ width, height }}>
          <rect
            x={margin}
            y={margin}
            width={width - margin * 2}
            height={height - margin * 2}
            className={css.canvasBorder}
          />

          <line x1={pos.x - 0.5} x2={pos.x - 0.5} y1={0} y2={height} />
          <line y1={pos.y - 0.5} y2={pos.y - 0.5} x1={0} x2={width} />

          <circle cx={pos.x} cy={pos.y} r={100} stroke="#fff" fill="none" />

          {hasOrig && (
            <>
              <Group left={orig.x} top={orig.y}>
                <circle
                  cx={0}
                  cy={0}
                  r={50}
                  fill="none"
                  stroke="#fff"
                  strokeDasharray="360"
                  strokeDashoffset={360 + show.asineDeg * posSign.y}
                  pathLength={360}
                  transform={`rotate(${posSign.y === 1 ? 90 : 270} 0 0)`}
                />

                <text x={0} y={0} dx={50} dy={50} className={css.text}>
                  {show.asineDeg.toFixed(2)}°
                </text>
              </Group>

              <circle
                cx={orig.x}
                cy={orig.y}
                r={mouse.minDistance}
                fill="none"
                stroke="#fff"
                strokeWidth={1.5}
              />

              <text
                x={orig.x}
                y={orig.y}
                textAnchor="end"
                dx={-10}
                dy={-110}
                className={css.text}
              >
                origin: {orig.x}, {orig.y}
              </text>

              <text
                x={pos.x}
                y={pos.y}
                textAnchor="start"
                dx={10}
                dy={110}
                className={css.text}
              >
                <tspan alignmentBaseline="hanging">
                  position: {pos.x}, {pos.y}
                </tspan>
              </text>

              <circle
                cx={orig.x}
                cy={orig.y}
                r={100}
                stroke="#fff"
                fill="none"
                strokeDasharray="5 5"
              />

              <Group>
                <rect
                  width={width - orig.x}
                  height={orig.y}
                  x={orig.x}
                  y={0}
                  className={css.quadRect}
                  id="q1"
                />
                <text
                  x={orig.x}
                  y={orig.y}
                  textAnchor="start"
                  dx={quadMargin}
                  dy={-quadMargin}
                  className={css.quadLabel}
                >
                  Q1
                </text>
              </Group>

              <Group>
                <rect
                  width={orig.x}
                  height={orig.y}
                  x={0}
                  y={0}
                  className={css.quadRect}
                  id="q2"
                />
                <text
                  x={orig.x}
                  y={orig.y}
                  textAnchor="end"
                  dx={-quadMargin}
                  dy={-quadMargin}
                  className={css.quadLabel}
                >
                  Q2
                </text>
              </Group>

              <Group>
                <rect
                  width={orig.x}
                  height={height - orig.y}
                  x={0}
                  y={orig.y}
                  className={css.quadRect}
                  id="q3"
                />
                <text
                  className={css.quadLabel}
                  x={orig.x}
                  y={orig.y}
                  textAnchor="end"
                  dx={-quadMargin}
                  dy={quadMargin}
                >
                  <tspan alignmentBaseline="hanging">Q3</tspan>
                </text>
              </Group>

              <Group>
                <rect
                  width={width - orig.x}
                  height={height - orig.y}
                  x={orig.x}
                  y={orig.y}
                  className={css.quadRect}
                  id="q4"
                />
                <text
                  className={css.quadLabel}
                  x={orig.x}
                  y={orig.y}
                  textAnchor="start"
                  dx={quadMargin}
                  dy={quadMargin}
                >
                  <tspan alignmentBaseline="hanging">Q4</tspan>
                </text>
              </Group>

              <line
                x1={orig.x - 0.5}
                x2={orig.x - 0.5}
                y1={0}
                y2={height}
                strokeDasharray="2 2"
              />
              <line
                y1={orig.y - 0.5}
                y2={orig.y - 0.5}
                x1={0}
                x2={width}
                strokeDasharray="2 2"
              />

              <line
                id="path"
                x1={orig.x}
                x2={pos.x}
                y1={orig.y}
                y2={pos.y}
                strokeDasharray="2 2"
              />

              {((p1, p2) => {
                const d = { x: abs(p1.x - p2.x) / 2, y: abs(p1.y - p2.y) / 2 };
                const l = sqrt(pow(d.x, 2) + pow(d.y, 2));

                return (
                  <Group left={p1.x} top={p1.y}>
                    <Text
                      angle={show.atanDeg}
                      textAnchor="middle"
                      x={d.x * posSign.x}
                      y={d.y * posSign.y}
                      dx={5}
                      dy={-5}
                      className={css.text}
                    >
                      {[mouse.distance.toFixed(2), "px"].join("")}
                    </Text>
                  </Group>
                );
              })(orig, pos)}

              <line
                x1={orig.x + margin * -posSign.x - 0.5}
                x2={orig.x + margin * -posSign.x - 0.5}
                y1={orig.y}
                y2={pos.y}
                stroke="#000"
              />

              <line
                y1={orig.y + margin * -posSign.y - 0.5}
                y2={orig.y + margin * -posSign.y - 0.5}
                x1={orig.x}
                x2={pos.x}
                stroke="#000"
              />

              <text
                x={orig.x + (abs(orig.x - pos.x) / 2) * posSign.x}
                y={orig.y}
                dy={-(margin * 2)}
                textAnchor="middle"
                className={css.text}
              >
                <tspan alignmentBaseline="center">{pos.x - orig.x}px</tspan>
              </text>

              <Group
                left={orig.x}
                top={orig.y + (abs(orig.y - pos.y) / 2) * posSign.y}
              >
                <text
                  dy={margin * 2.5}
                  textAnchor="middle"
                  className={css.text}
                  transform="rotate(90 0 0)"
                >
                  <tspan alignmentBaseline="center">{pos.y - orig.y}px</tspan>
                </text>
              </Group>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
