/* eslint-disable */
import * as L from "partial.lenses";
import { useEffect, useState } from "react";

const { abs, sqrt, pow } = Math;
const { values } = Object;

// #region Functions
const getDistance = (p1, p2) => {
  const vs = [...values(p1), ...values(p2)].some((x) => x === null);
  if (vs) {
    return null;
  }

  const d = { x: abs(p1.x - p2.x), y: abs(p1.y - p2.y) };
  const distance = sqrt(pow(d.x, 2) + pow(d.y, 2));

  return distance;
};

const getGenericMouseData = (e) => {
  const { x, y } = { x: e.clientX, y: e.clientY };

  return { x, y };
};
// #endregion

export function useToolbar() {
  const [state, setState] = useState({ select: false });

  return [
    state,
    function useToolbar$toggle(name) {
      setState((s) => ({ ...s, [name]: !s[name] }));
    },
  ];
}

/**
 *
 * @param {HTMLElement} source
 * @param {*} evs
 */
export function useMouse(source, evs) {
  useEffect(() => {
    console.log("useEffect");

    Object.entries(evs).forEach(([t, fn]) => {
      source.addEventListener(t, fn);
    });

    return () => {
      Object.entries(evs).forEach(([t, fn]) => {
        source.removeEventListener(t, fn);
      });
    };
  }, []);
}

export function useCanvas(source, objs) {
  if (!source) {
    throw new Error("canvas requires a source element");
  }

  const minDistance = 10;

  const [mouse, setMouse] = useState({
    action: null,
    pos: { x: 900, y: 700 },
    orig: { x: 600, y: 200 },
  });
  const [objects, setObjects] = useState({
    123: {
      canvas: {
        pos: { x: 10, y: 10 },
        size: { width: 50, height: 50 },
      },
    },
  });

  const mouseʼ = {
    ...mouse,
    minDistance,
    distance: getDistance(mouse.orig, mouse.pos),
  };

  const evs = {
    mousedown: (e) => {
      console.log("down", e);
      setMouse(L.set(["orig", L.pick({ clientX: "x", clientY: "y" })], e));
    },
    mousemove: (e) => {
      setMouse(L.set(["pos", L.pick({ clientX: "x", clientY: "y" })], e));
    },
    mouseup: (e) => {
      console.log("up", e);
      setMouse(L.transform(["orig", L.values, L.setOp(null)]));
    },
  };

  useMouse(source, evs);

  useEffect(() => {
    console.log("update objects", objs);
    if (!objs) return;
  }, [objs]);

  return { mouse: mouseʼ, objects };
}
