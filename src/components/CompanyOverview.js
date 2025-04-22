import React from "react";

const CompanyOverview = ({info}) => {
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
    <div className="mt-1 bg-white dark:bg-gray-800 dark:text-white p-4 mb-7 rounded shadow-md text-sm max-w-7xl">
    <p className="mb-2">{summary}</p>

    <div className="grid grid-cols-2 gap-4">
        <p><strong>Sector:</strong> {sector}</p>
        <p><strong>Industry:</strong> {industry}</p>
        <p><strong>Employees:</strong> {employees?.toLocaleString()}</p>
        <p><strong>Market Cap:</strong> ${Number(marketCap).toLocaleString()}</p>
        <p><a href={website} className="text-gray-100 underline">{website}</a></p>
    </div>
    </div>
    );
};

export default CompanyOverview;