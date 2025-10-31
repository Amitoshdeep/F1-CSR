import { useLocation } from "react-router-dom";
import AiExplanation from "../components/AiExplanation"; // <— import new component

function Explanation() {
  const { state } = useLocation();
  const setup = state?.setup;

  if (!setup) return <p className="text-center mt-10">No setup data found.</p>;

  return (
    <div className="p-6 flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-azonix border-b border-white/20 pb-3">
        AI Explanation
      </h2>
      <AiExplanation setup={setup} />
    </div>
  );
}

export default Explanation;
