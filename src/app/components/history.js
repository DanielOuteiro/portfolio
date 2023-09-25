import React, { useState, useMemo, useRef, Suspense } from "react";
import { Loader } from "@react-three/drei";
import { Scene } from "./Scene";

const objects = ["Design System", "Accessibility", "Motion Design"];
const models = objects.map((k) => "./3DModels/" + k.toLowerCase() + ".gltf");
const fakeObjects =
  "Design System. Coding. Motion Design. Prototyping. 3D Design. Accessibility. Wireframing. Affordance. User Testing. Interaction Design. Heuristic Evaluation. Microinteractions. Gamification. Agile. Cross-Platform".split(
    ". "
  );

const Item = ({ text, onHover, index, active }) => {
  const modelIdx = useMemo(() => objects.indexOf(text), [text]);
  const has3d = modelIdx > -1;
  return (
    <span
      className={active ? "active" : has3d ? "" : "item"}
      onPointerEnter={() => has3d && onHover(index)}
    >
      {text + ". "}
    </span>
  );
};

export default function History() {
  const ref = useRef();
  const [idx, setIdx] = useState(0);

  const modelIdx = objects.indexOf(fakeObjects[idx]);
  return (
    <>
      <div>
        <div className="scene" style={{ width: "100vw", height: "60vh" }}>
          <Scene shownIndex={modelIdx} models={models} target={ref} />
        </div>

        <div className="container" ref={ref}>
          {fakeObjects.map((o, i) => (
            <Item
              key={i}
              text={o}
              active={i === idx}
              index={i}
              onHover={setIdx}
            />
          ))}
        </div>
      </div>
    </>
  );
}
