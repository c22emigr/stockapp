import React from "react";

const CompanyOverview = ({info}) => {
    if (!info) return null;

    const {
        longName,
        summary,
        sector,
        industry,
        website,
        fullTimeEmployees,
        marketCap
    } = info;

    return (
    <div className="mt-5 bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow-md text-sm">
    <p className="mb-2">{summary}</p>

    <div className="grid grid-cols-2 gap-4">
        <p><strong>Sector:</strong> {sector}</p>
        <p><strong>Industry:</strong> {industry}</p>
        <p><strong>Employees:</strong> {fullTimeEmployees?.toLocaleString()}</p>
        <p><strong>Market Cap:</strong> ${Number(marketCap).toLocaleString()}</p>
        <p><strong>Website:</strong> <a href={website} className="text-blue-500 underline">{website}</a></p>
    </div>
    </div>
    );
};

export default CompanyOverview;