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

  const rad = 180 / PI;

  const sine = sin(opp / hyp) * rad || 0;
  const cosine = cos(adj / hyp) * rad || 0;
  const tangent = tan(opp / adj) * rad || 0;

  const sineRad = sin(opp / hyp);

  const boundary = {
    0: 0,
    90: PI / 2,
    180: PI,
    270: (3 * PI) / 2,
    360: 2 * PI,
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
    asineDeg: asine * (180 / PI),
    atan: arctan,
    atanDeg: arctan * (180 / PI),
  };

  return (
    <div className={css.root}>
      <div className={css.angDebug}>
        <dl>
          <dt>delta</dt>
          <dd>
            x: {delta.x}, y: {delta.y}
          </dd>

          <dt>adj</dt>
          <dd>{adj}</dd>

          <dt>opposite</dt>
          <dd>{opp}</dd>

          <dt>hypotenuse</dt>
          <dd>{hyp.toFixed(2)}</dd>

          <dt>sine</dt>
          <dd>{sine.toFixed(2)}</dd>

          <dt>cosine</dt>
          <dd>{cosine.toFixed(2)}</dd>

          <dt>tangent</dt>
          <dd>{tangent.toFixed(2)}</dd>

          <dt>asine</dt>
          <dd>{show.asine ? show.asine.toFixed(2) : "none"}</dd>

          <dt>asine (deg)</dt>
          <dd>{show.asineDeg ? `${show.asineDeg.toFixed(2)}°` : "none"}</dd>

          <dt>arctangent</dt>
          <dd>{show.atan ? `${show.atan.toFixed(2)}` : "none"}</dd>

          <dt>arctangent (deg)</dt>
          <dd>{show.atanDeg ? `${show.atanDeg.toFixed(2)}°` : "none"}</dd>

          <dt>sign</dt>
          <dd>
            x: {posSign.x}, y: {posSign.y}
          </dd>
        </dl>
      </div>
      <div className={css.debug}>
        <pre>{inspect(asd.mouse, { depth: Infinity })}</pre>

        {/* <pre>{inspect({ width, height, hasPos, hasOrig })}</pre> */}
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
              {(() => {
                const dx = pos.x - orig.x;
                const dy = pos.y - orig.y;
                const len = sqrt(dx * dx + dy * dy);
                const ang = cos(dy / len);
                const deg = ang * (180 / PI);

                return (
                  <>
                    <text x={pos.x} y={pos.y} dx={margin * 1} dy={margin * -1}>
                      {dx}
                    </text>
                    <text x={pos.x} y={pos.y} dx={margin * -2} dy={margin * 2}>
                      {dy}
                    </text>
                    {/* <text x={pos.x} y={pos.y} dx={-40} dy={-30}>
                      {ang.toFixed(2)}; {deg.toFixed(2)}
                    </text> */}
                  </>
                );
              })(pos, orig)}
            </>
          )}

          {hasOrig && (
            <>
              <circle
                cx={orig.x}
                cy={orig.y}
                r={mouse.minDistance}
                fill="none"
                stroke="#fff"
                strokeWidth={1.5}
              />

              <text x={orig.x} y={orig.y} textAnchor="end" dx={-10} dy={-110}>
                origin: {orig.x}, {orig.y}
              </text>

              <text x={pos.x} y={pos.y} textAnchor="start" dx={10} dy={110}>
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
              <Group
                left={orig.x - 0.5}
                top={orig.y - 100.5}
                className={css.quad}
              >
                <rect />
                <text>Q1</text>
              </Group>

              <Group
                left={orig.x - 100.5}
                top={orig.y - 100.5}
                className={css.quad}
              >
                <rect />
                <text>Q2</text>
              </Group>

              <Group
                left={orig.x - 100.5}
                top={orig.y - 0.5}
                className={css.quad}
              >
                <rect />
                <text>Q3</text>
              </Group>

              <Group
                left={orig.x - 0.5}
                top={orig.y - 0.5}
                className={css.quad}
              >
                <rect />
                <text>Q4</text>
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
                    >
                      {mouse.distance.toFixed(2)}
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
                x={orig.x - margin}
                y={orig.y - margin}
                dx={margin * -posSign.x * 2}
                dy={-10}
                textAnchor="start"
              >
                <tspan alignmentBaseline="text-top">{pos.x - orig.x}</tspan>
              </text>

              <text
                x={orig.x - margin}
                y={orig.y - margin}
                dx={-10}
                dy={margin * 2}
                textAnchor="end"
              >
                <tspan alignmentBaseline="text-bottom">{pos.y - orig.y}</tspan>
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
