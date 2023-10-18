import React, { useState, useMemo, useRef, useEffect } from "react";
import { SceneMobile } from "./Scene_mobile";

const objects = ["Design System", "Motion Design",  "Talks",  "Coding", "Conversational Design"  ];
const models = objects.map((k) => "./3DModels/" + k.toLowerCase() + ".gltf");
const fakeObjects =
"Design System. Storytelling. Talks. EU Normative A11Y. Conversational Design. Cross-Platform. Motion Design. Interaction Design. Coding. UX Consultancy".split(
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

  // Define an array to represent the desired state sequence [0, 2, 0]
  const stateSequence = [0, 12, 0];
  // Keep track of the current state index
  const [currentStateIdx, setCurrentStateIdx] = useState(0);

  // Use useEffect to switch between states based on the sequence
  useEffect(() => {
    const nextStateIdx = (currentStateIdx + 1) % stateSequence.length;
    if (nextStateIdx !== 0) {
      // Transition only if the next state is not 0
      const timer = setTimeout(() => {
        setIdx(stateSequence[nextStateIdx]);
        setCurrentStateIdx(nextStateIdx);
      }, 100); // Adjust the delay as needed

      // Clear the timer when the component unmounts or when the sequence is complete
      return () => clearTimeout(timer);
    }
  }, [currentStateIdx]);

  const modelIdx = objects.indexOf(fakeObjects[idx]);
  return (
    <>
      <div>
        <div className="scene" style={{ width: "100vw", height: "60vh" }}>
          <SceneMobile shownIndex={modelIdx} models={models} target={ref} />
        </div>

        <div className="containerMobile" ref={ref}>
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