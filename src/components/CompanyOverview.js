import React, { useState } from "react";
import {ChevronDown, ChevronUp} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";


const CompanyOverview = ({info}) => {
    const [showSummary, setShowSummary] = useState(false);
    if (!info) return null;

    const {
        longName,
        summary,
        sector,
        industry,
        website,
        employees,
        marketCap
    } = info;

    return (
    <div className="bg-white dark:bg-[#232a31] dark:text-white p-4 mb-7 rounded shadow-md text-sm w-full max-w-[300px]">
    
    {/* EXPANDABLE BUTTON FOR SUMMARY */}
    <button
        onClick={() => setShowSummary(!showSummary)}
        className="text-gray-100 mb-2 flex items-center gap-2 px-3 py-1 w-fit min-w-[220px] hover:text-emerald-400 transition-colors duration-250 hover:scale-[1.02] active:scale-[0.98]"
    >
        {showSummary ? (
            <>
            <ChevronUp size={16} /> Hide Summary
            </>
        ) : (
            <>
            <ChevronDown size={16} /> Show Company Summary
            </>
        )}
    </button>

        <AnimatePresence initial={false}>
        {showSummary && ( 
            <motion.div
            key="summary"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.25}}
            className="overflow-hidden mb-4"
            >
                <p>{summary}</p>
            </motion.div>
        )}
        </AnimatePresence>

        
    <div className="grid grid-cols-2 gap-4">
        <p><strong>Sector:</strong> {sector}</p>
        <p><strong>Industry:</strong> {industry}</p>
        <p><strong>Employees:</strong> {employees?.toLocaleString()}</p>
        <p><strong>Market Cap:</strong> ${Number(marketCap).toLocaleString()}</p>
        <p><a href={website} className="text-gray-100">{website}</a></p>
    </div>
    </div>
    );
};

export default CompanyOverview;