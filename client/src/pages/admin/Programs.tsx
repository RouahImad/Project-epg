import { useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { IoSchool } from "react-icons/io5";
import {
    useProgramTypes,
    useCreateProgramType,
    useUpdateProgramType,
    useDeleteProgramType,
    useMajorsGroupedByType,
    useCreateMajor,
    useUpdateMajor,
    useDeleteMajor,
} from "../../hooks/api";
import ProgramTypesTable from "../../components/programs/ProgramTypesTable";
import MajorsTable from "../../components/programs/MajorsTable";
import AddProgramTypeDialog from "../../components/programs/dialogs/AddProgramTypeDialog";
import EditProgramTypeDialog from "../../components/programs/dialogs/EditProgramTypeDialog";
import DeleteProgramTypeDialog from "../../components/programs/dialogs/DeleteProgramTypeDialog";
import AddMajorDialog from "../../components/programs/dialogs/AddMajorDialog";
import EditMajorDialog from "../../components/programs/dialogs/EditMajorDialog";
import DeleteMajorDialog from "../../components/programs/dialogs/DeleteMajorDialog";
import ManageMajorTaxesDialog from "../../components/programs/dialogs/ManageMajorTaxesDialog";
import type { Major, MajorType } from "../../types";
import { useNavigate } from "react-router";

const initialProgramType = { name: "", description: "" };
const initialMajor = {
    name: "",
    price: "",
    duration: "",
    description: "",
    majorTypeId: "",
};

const Programs = () => {
    // Program Types state
    const { data: programTypes, isLoading, isError, error } = useProgramTypes();
    const createProgramType = useCreateProgramType();
    const deleteProgramType = useDeleteProgramType();

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editProgramType, setEditProgramType] = useState<MajorType | null>(
        null
    );
    const [form, setForm] = useState<
        Omit<MajorType, "id"> | typeof initialProgramType
    >(initialProgramType);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Majors state
    const {
        data: groupedMajors,
        isLoading: isMajorsLoading,
        isError: isMajorsError,
        error: majorsError,
    } = useMajorsGroupedByType();
    const createMajor = useCreateMajor();
    const deleteMajor = useDeleteMajor();

    const [showAddMajor, setShowAddMajor] = useState(false);
    const [showEditMajor, setShowEditMajor] = useState(false);
    const [editMajor, setEditMajor] = useState<Major | null>(null);
    const [majorForm, setMajorForm] = useState<
        Omit<Major, "id" | "createdAt"> | typeof initialMajor
    >(initialMajor);
    const [deleteMajorId, setDeleteMajorId] = useState<number | null>(null);

    // Add state for manage taxes dialog
    const [showManageTaxes, setShowManageTaxes] = useState(false);
    const [selectedMajorForTaxes, setSelectedMajorForTaxes] =
        useState<Major | null>(null);

    // Handlers for program types
    const handleOpenAdd = () => {
        setForm(initialProgramType);
        setShowAdd(true);
    };
    const handleOpenEdit = (type: MajorType) => {
        setEditProgramType(type);
        setForm({ name: type.name, description: type.description });
        setShowEdit(true);
    };
    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handlers for majors
    const handleOpenAddMajor = () => {
        setMajorForm(initialMajor);
        setShowAddMajor(true);
    };
    const handleOpenEditMajor = (major: Major) => {
        setEditMajor(major);
        setMajorForm({
            name: major.name,
            price: major.price,
            duration: major.duration,
            description: major.description,
            majorTypeId: major.majorTypeId,
        });
        setShowEditMajor(true);
    };
    const handleMajorFormChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setMajorForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenManageTaxes = (major: Major) => {
        setSelectedMajorForTaxes(major);
        setShowManageTaxes(true);
    };

    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8 md:max-w-[85vw]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="flex items-center mb-6">
                    <button
                        className="mr-3 text-gray-500 hover:text-blue-600"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <FiArrowLeft size={22} />
                    </button>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <IoSchool className="text-blue-500" />
                        Program Types & Majors
                    </h2>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded flex items-center gap-2 shadow"
                    onClick={handleOpenAdd}
                    type="button"
                >
                    <FiPlus /> Add Major Type
                </button>
            </div>
            {/* Program Types Table */}
            <ProgramTypesTable
                programTypes={programTypes}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onEdit={handleOpenEdit}
                onDelete={setDeleteId}
            />
            {/* Majors Table */}
            <MajorsTable
                majors={
                    groupedMajors ? Object.values(groupedMajors).flat() : []
                }
                isLoading={isMajorsLoading}
                isError={isMajorsError}
                error={majorsError}
                onAddMajor={handleOpenAddMajor}
                onEditMajor={handleOpenEditMajor}
                onDeleteMajor={setDeleteMajorId}
                onManageTaxes={handleOpenManageTaxes}
                majorTypes={programTypes}
            />
            {/* Dialogs for Program Types */}
            <AddProgramTypeDialog
                showAdd={showAdd}
                setShowAdd={setShowAdd}
                form={form}
                handleFormChange={handleFormChange}
                createProgramType={createProgramType}
                handleAddSubmit={() => setShowAdd(false)}
            />
            <EditProgramTypeDialog
                showEdit={showEdit}
                setShowEdit={setShowEdit}
                editId={editProgramType?.id}
                form={form}
                handleFormChange={handleFormChange}
                updateProgramType={useUpdateProgramType(
                    editProgramType?.id || 0
                )}
                handleEditSubmit={() => setShowEdit(false)}
            />
            <DeleteProgramTypeDialog
                deleteId={deleteId}
                setDeleteId={setDeleteId}
                deleteProgramType={deleteProgramType}
                handleDelete={() => setDeleteId(null)}
            />
            {/* Dialogs for Majors */}
            <AddMajorDialog
                showAddMajor={showAddMajor}
                setShowAddMajor={setShowAddMajor}
                majorForm={majorForm}
                handleMajorFormChange={handleMajorFormChange}
                addMajor={createMajor}
                handleAddMajorSubmit={() => setShowAddMajor(false)}
                majorTypes={programTypes}
            />
            <EditMajorDialog
                showEditMajor={showEditMajor}
                setShowEditMajor={setShowEditMajor}
                majorForm={majorForm}
                handleMajorFormChange={handleMajorFormChange}
                updateMajor={useUpdateMajor(editMajor?.id || 0)}
                editMajor={editMajor}
                handleEditMajorSubmit={() => setShowEditMajor(false)}
                majorTypes={programTypes}
            />
            <DeleteMajorDialog
                deleteMajorId={deleteMajorId}
                setDeleteMajorId={setDeleteMajorId}
                deleteMajor={deleteMajor}
            />
            {/* Tax Management Dialog */}
            <ManageMajorTaxesDialog
                isOpen={showManageTaxes}
                onClose={() => setShowManageTaxes(false)}
                major={selectedMajorForTaxes}
            />
        </div>
    );
};

export default Programs;
