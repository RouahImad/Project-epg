import { useState } from "react";
import { FiArrowLeft, FiDollarSign } from "react-icons/fi";
import {
    useTaxes,
    useCreateTax,
    useUpdateTax,
    useDeleteTax,
} from "../../hooks/api";
import TaxesTable from "../../components/taxes/TaxesTable";
import AddTaxDialog from "../../components/taxes/dialogs/AddTaxDialog";
import EditTaxDialog from "../../components/taxes/dialogs/EditTaxDialog";
import DeleteTaxDialog from "../../components/taxes/dialogs/DeleteTaxDialog";
import type { Tax } from "../../types";
import { useNavigate } from "react-router";

const initialTaxForm = {
    name: "",
    amount: "",
    description: "",
};

const Taxes = () => {
    const { data: taxes, isLoading, isError, error } = useTaxes();
    const createTax = useCreateTax();
    const deleteTax = useDeleteTax();

    const [showAddTax, setShowAddTax] = useState(false);
    const [showEditTax, setShowEditTax] = useState(false);
    const [editTax, setEditTax] = useState<Tax | null>(null);
    const [taxForm, setTaxForm] = useState(initialTaxForm);
    const [deleteTaxId, setDeleteTaxId] = useState<number | null>(null);

    // Handlers
    const handleOpenAddTax = () => {
        setTaxForm(initialTaxForm);
        setShowAddTax(true);
    };

    const handleOpenEditTax = (tax: Tax) => {
        setEditTax(tax);
        setTaxForm({
            name: tax.name,
            amount: String(tax.amount),
            description: tax.description || "",
        });
        setShowEditTax(true);
    };

    const handleTaxFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setTaxForm((prev) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8 md:max-w-[85vw]">
            <div className="flex items-center mb-6">
                <button
                    className="mr-3 text-gray-500 hover:text-blue-600"
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                >
                    <FiArrowLeft size={22} />
                </button>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FiDollarSign className="text-green-500" />
                    Tax Management
                </h2>
            </div>

            <TaxesTable
                taxes={taxes}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onAddTax={handleOpenAddTax}
                onEditTax={handleOpenEditTax}
                onDeleteTax={setDeleteTaxId}
            />

            {/* Dialogs */}
            <AddTaxDialog
                showAddTax={showAddTax}
                setShowAddTax={setShowAddTax}
                taxForm={taxForm}
                handleTaxFormChange={handleTaxFormChange}
                addTax={createTax}
            />
            <EditTaxDialog
                showEditTax={showEditTax}
                setShowEditTax={setShowEditTax}
                taxForm={taxForm}
                handleTaxFormChange={handleTaxFormChange}
                updateTax={useUpdateTax(editTax?.id || 0)}
                editTax={editTax}
            />
            <DeleteTaxDialog
                deleteTaxId={deleteTaxId}
                setDeleteTaxId={setDeleteTaxId}
                deleteTax={deleteTax}
            />
        </div>
    );
};

export default Taxes;
