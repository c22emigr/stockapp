import React, { useState } from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle
  } from "./ui/dialog";
import { Button } from "./ui/button";

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

    const preview = summary?.split(". ").slice(0, 2).join(". ") + ".";

    return (
    <div className="bg-white dark:bg-[#232a31] dark:text-white p-4 mb-7 rounded shadow-md text-sm w-96 max-w-[300px]">
    
    {/* EXPANDABLE BUTTON FOR SUMMARY */}

        <Dialog>
        <div className="space-y-2 mb-3">
            <p>{preview}</p>
            <DialogTrigger asChild>
            <Button variant="neutral" size="sm">
                Read Full Summary
            </Button>
            </DialogTrigger>
        </div>

        <DialogContent className="max-w-2xl bg-white text-slate-900 dark:bg-[#1d2228] dark:text-white p-6 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
            <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-7 mt-1 tracking-tight text-emerald-600 dark:text-gray-100">{longName}Company Summary</DialogTitle>
            </DialogHeader>
            <p className="text-sm leading-relaxed tracking-wide max-h-[70vh] overflow-y-auto whitespace-pre-line">
            {summary}
            </p>
        </DialogContent>
        </Dialog>

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