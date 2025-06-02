import React, { useState } from "react";
import {
    FiDollarSign,
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiSearch,
} from "react-icons/fi";
import type { Tax } from "../../types";
import { formatMoney } from "../../utils/helpers";

interface TaxesTableProps {
    taxes: Tax[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onAddTax: () => void;
    onEditTax: (tax: Tax) => void;
    onDeleteTax: (taxId: number) => void;
}

const TaxesTable: React.FC<TaxesTableProps> = ({
    taxes,
    isLoading,
    isError,
    error,
    onAddTax,
    onEditTax,
    onDeleteTax,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTaxes = taxes?.filter(
        (tax) =>
            tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isError) {
        console.error("Error loading taxes:", error);
    }

    return (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FiDollarSign className="text-green-500" />
                <h3 className="text-lg font-bold">Taxes</h3>

                <button
                    className="ml-auto bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 shadow"
                    onClick={onAddTax}
                    type="button"
                >
                    <FiPlus /> Add Tax
                </button>
            </div>

            {!isLoading && taxes && taxes.length > 0 && (
                <div className="mb-4 relative">
                    <div className="flex items-center border rounded overflow-hidden max-w-md">
                        <div className="pl-3 text-gray-400">
                            <FiSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search taxes..."
                            className="w-full p-2 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="text-gray-500">Loading taxes...</div>
            ) : isError ? (
                <div className="text-red-500">Failed to load taxes.</div>
            ) : !taxes || taxes.length === 0 ? (
                <div className="text-gray-500">No taxes found.</div>
            ) : filteredTaxes && filteredTaxes.length > 0 ? (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTaxes.map((tax) => (
                                <tr key={tax.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap truncate font-medium">
                                        {tax.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatMoney(tax.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap truncate">
                                        {tax.description || (
                                            <span className="text-gray-400 italic">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => onEditTax(tax)}
                                                title="Edit"
                                                type="button"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() =>
                                                    onDeleteTax(tax.id)
                                                }
                                                title="Delete"
                                                type="button"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-gray-500">No taxes match your search.</div>
            )}
        </div>
    );
};

export default TaxesTable;
