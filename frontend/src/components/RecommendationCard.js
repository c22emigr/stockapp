import { PauseCircle, PlusCircle, MinusCircle } from "lucide-react";

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;
  return (
  <div className="dark:text-white text-center px-6 py-5 w-full max-w-md mx-auto">
    <h3 className="text-lg font-semibold mb-4">Analyst Consensus</h3>
    
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="flex flex-col items-center">
        <PlusCircle size={20} className="text-green-400 mb-1" />
        <p className="text-gray-400">Buy</p>
        <p className="font-bold">{recommendation.buy}</p>
      </div>
      <div className="flex flex-col items-center">
        <PauseCircle size={20} className="text-yellow-400 mb-1" />
        <p className="text-gray-400">Hold</p>
        <p className="font-bold">{recommendation.hold}</p>
      </div>
      <div className="flex flex-col items-center">
        <MinusCircle size={20} className="text-red-400 mb-1" />
        <p className="text-gray-400">Sell</p>
        <p className="font-bold">{recommendation.sell}</p>
      </div>
    </div>
  </div>
  );
};

export default RecommendationCard;