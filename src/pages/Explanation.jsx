import { useLocation } from "react-router-dom";
import { getExplanation } from "../utils/getExplanation";
import { useEffect, useState } from "react";

function Explanation() {
  const { state } = useLocation();
  const setup = state?.setup;
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (setup) {
      getExplanation(setup).then(setExplanation);
    }
  }, [setup]);

  if (!setup) return <p className="text-center mt-10">No setup data found.</p>;

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-azonix border-b border-white/20 pb-3">
        AI Explanation
      </h2>

      {explanation ? (
        <div
          className="text-white/80 leading-relaxed whitespace-pre-wrap break-words"
        >
          {explanation}
        </div>
      ) : (
        <p className="text-white/40 animate-pulse">Generating explanation...</p>
      )}
    </div>
  );
}

export default Explanation;
