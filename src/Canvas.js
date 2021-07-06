/* eslint-disable */
import { inspect } from "util";
import { Group } from "@visx/group";
import { Text } from "@visx/text";

import css from "./Canvas.module.css";
import { useCanvas } from "./hooks";

const { sqrt, abs, pow, cos, tan } = Math;

export function Canvas(props) {
  const { width, height } = props;
  const asd = useCanvas(document);

  const { mouse } = asd;
  const { pos, orig } = mouse;

  const hasPos = !!pos.x && !!pos.y;
  const hasOrig = !!orig.x && !!orig.y;

  const margin = 20;

  return (
    <div className={css.root}>
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

          {hasOrig && (
            <>
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
                const ang = cos(d.x / l) * (180 / Math.PI);

                const a1 = tan(d.x / d.y) * (180 / Math.PI);

                return (
                  <Group left={p1.x} top={p1.y}>
                    <Text
                      angle={a1}
                      textAnchor="middle"
                      x={d.x}
                      y={d.y}
                      dx={5}
                      dy={-5}
                    >
                      {mouse.distance.toFixed(2)}
                    </Text>
                  </Group>
                );
              })(orig, pos)}

              <line
                x1={orig.x - margin - 0.5}
                x2={orig.x - margin - 0.5}
                y1={orig.y}
                y2={pos.y}
                stroke="#000"
              />

              <line
                y1={orig.y - margin - 0.5}
                y2={orig.y - margin - 0.5}
                x1={orig.x}
                x2={pos.x}
                stroke="#000"
              />

              <text
                x={orig.x - margin}
                y={orig.y - margin}
                dx={margin * 2}
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
