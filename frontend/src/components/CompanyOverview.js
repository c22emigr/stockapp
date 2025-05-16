import { useState } from "react";
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
    <div className="dark:text-white text-center p-6">
    <Dialog>
        <div className="mb-4">
        <p className="mb-2">{preview}</p>
        <DialogTrigger asChild>
            <Button variant="neutral" size="sm">
            Read Full Summary
            </Button>
        </DialogTrigger>
        </div>

        <DialogContent className="max-w-2xl bg-white text-slate-900 dark:bg-[#1d2228] dark:text-white p-6 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
        <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-7 mt-1 tracking-tight text-emerald-600 dark:text-gray-100">
            {longName} Company Summary
            </DialogTitle>
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-4"
        >
            <p className="text-sm">{summary}</p>
        </motion.div>
        )}
    </AnimatePresence>

    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm max-w-md mx-auto text-left">
        <div>
        <p className="text-gray-400">Sector</p>
        <p className="font-semibold">{sector}</p>
        </div>
        <div>
        <p className="text-gray-400">Industry</p>
        <p className="font-semibold">{industry}</p>
        </div>
        <div>
        <p className="text-gray-400">Employees</p>
        <p className="font-semibold">{employees?.toLocaleString()}</p>
        </div>
        <div>
        <p className="text-gray-400">Market Cap</p>
        <p className="font-semibold">${Number(marketCap).toLocaleString()}</p>
        </div>
        <div className="col-span-2">
        <a href={website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline break-words">
            {website}
        </a>
        </div>
    </div>
    </div>
    );
};

export default CompanyOverview;