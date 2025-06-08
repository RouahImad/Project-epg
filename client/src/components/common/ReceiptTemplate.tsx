import React from "react";
import { formatDate, formatMoney } from "../../utils/helpers";
import type { ReceiptPrintDialogProps } from "./ReceiptPrintDialog";
import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../../services/api";

// Responsive frame for screen, A5 for print
const frameStyles: React.CSSProperties = {
    border: "1.5px solid #222",
    borderRadius: "4px",
    padding: "2rem",
    background: "white",
    boxSizing: "border-box",
    margin: "2rem auto",
    maxWidth: "700px",
    width: "100%",
    minWidth: "320px",
    minHeight: "60vh",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
};

const headerStyles: React.CSSProperties = {
    position: "absolute",
    top: "1.5rem",
    left: "2rem",
    fontFamily: "sans-serif",
    fontSize: "0.92rem",
    color: "#444",
    margin: 0,
    padding: 0,
    lineHeight: 1.3,
    maxWidth: "50%",
    zIndex: 2,
    fontWeight: "bold",
};

const companyNameStyle: React.CSSProperties = {
    fontSize: "0.65rem",
    marginBottom: "0.15rem",
    textTransform: "uppercase",
};

const addressStyle: React.CSSProperties = {
    whiteSpace: "pre-line",
    fontSize: "0.65rem",
    marginBottom: "0.15rem",
};

const emailStyle: React.CSSProperties = {
    fontSize: "0.65rem",
};

// Center content vertically, not horizontally, and keep content normal width
const contentWrapperStyles: React.CSSProperties = {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // vertical centering
    alignItems: "stretch",
    minHeight: "300px",
    paddingTop: "4.5rem", // space for header
    paddingBottom: "4.5rem", // space for stamp
    boxSizing: "border-box",
};

const contentStyles: React.CSSProperties = {
    width: "100%",
    maxWidth: "90%",
    margin: "0 auto",
    wordBreak: "break-word",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "0.83rem", // slightly smaller font size
};

const footerStyles: React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "1rem",
    color: "#444",
    fontStyle: "italic",
    background: "none",
    border: "none",
    minHeight: 0,
    minWidth: 0,
    marginRight: "1.5rem",
    marginBottom: "2.5rem",
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
};

const ReceiptTemplate = React.forwardRef<
    HTMLDivElement,
    Omit<ReceiptPrintDialogProps, "open" | "onClose">
>(({ studentId, studentName, major, paidAmount, taxes, date }, ref) => {
    const { data: company } = useQuery({
        queryKey: ["companyInfo"],
        queryFn: companyApi.getCompanyInfo,
    });

    // Prepare address as multi-line
    const addressLines = company?.address
        ? company.address
              .split(/,|\n/)
              .map((line: string) => line.trim())
              .filter(Boolean)
        : [];

    // Calculate taxes total
    const taxesTotal = taxes.reduce(
        (sum, tax) => sum + Number(tax.amount || 0),
        0
    );
    // Calculate expected total
    const expectedTotal = Number(major.price || 0) + Number(taxesTotal);

    return (
        <div
            ref={ref}
            className="receipt-a5-print-frame receipt-frame"
            style={frameStyles}
        >
            {/* Header: Company info, absolute top left */}
            <div className="receipt-header" style={headerStyles}>
                <div className="receipt-company-name" style={companyNameStyle}>
                    {company?.name || ""}
                </div>
                <div className="receipt-company-address" style={addressStyle}>
                    {addressLines.map((line: string, idx: number) => (
                        <div key={idx}>{line}</div>
                    ))}
                </div>
                {company?.email && (
                    <div className="receipt-company-email" style={emailStyle}>
                        Mail: {company.email}
                    </div>
                )}
            </div>
            {/* Main receipt content vertically centered, normal width */}
            <div
                className="receipt-content-wrapper"
                style={contentWrapperStyles}
            >
                <div className="receipt-content" style={contentStyles}>
                    <h2 className="receipt-title text-xl font-bold mb-8 w-full border-1 text-center italic font-serif uppercase">
                        Reçu
                    </h2>
                    <div className="mb-2 w-full text-end">
                        <strong>Fes le :</strong>{" "}
                        {formatDate(date || new Date())}
                    </div>
                    <div className="mb-3">
                        <strong>CIN/ PASSPORT Nº :</strong> {studentId}
                    </div>
                    <div className="mb-3">
                        <strong>Nom et Prénom :</strong> {studentName}
                    </div>
                    <div className="mb-3">
                        <strong>Filière :</strong> {major.name}
                    </div>
                    <div className="mb-3">
                        <strong>Montant payé :</strong>{" "}
                        {formatMoney(paidAmount)}
                    </div>
                    <div className="mb-3">
                        <strong>Impots :</strong>
                        {taxes.length === 0 ? (
                            <span className="ml-2 text-gray-500">
                                Pas de Impots
                            </span>
                        ) : (
                            <ul className="ml-4">
                                {taxes.map((tax, index) => (
                                    <li key={index}>
                                        {tax.name}: {formatMoney(tax.amount)}
                                    </li>
                                ))}
                                {taxes.length > 1 && (
                                    <li>
                                        <strong>Total Impots :</strong>{" "}
                                        {formatMoney(taxesTotal)}
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div className="mb-3">
                        <strong>Total attendu :</strong>{" "}
                        {formatMoney(expectedTotal)}
                    </div>
                </div>
            </div>
            {/* Footer: Secretariat, absolute bottom right with extra space below */}
            <div className="receipt-footer" style={footerStyles}>
                Secretariat
            </div>
            <style>
                {`
                    @media print {
                        html, body {
                            height: 100%;
                        }
                        body {
                            background: white !important;
                            height: 100% !important;
                        }
                        .receipt-a5-print-frame {
                            width: 148mm !important;
                            height: 210mm !important;
                            min-width: 148mm !important;
                            min-height: 210mm !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                            outline: 3mm solid #222 !important;
                            outline-offset: -3mm !important;
                            border-radius: 4px !important;
                            padding: 16mm !important;
                            box-sizing: border-box !important;
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: flex-start !important;
                            align-items: stretch !important;
                            page-break-after: avoid !important;
                            max-width: none !important;
                            position: relative !important;
                            height: 210mm !important;
                        }
                        .receipt-header {
                            position: absolute !important;
                            top: 2rem !important;
                            left: 2.5rem !important;
                            font-size: 0.92rem !important;
                            max-width: 50% !important;
                        }
                        .receipt-company-name,
                        .receipt-company-address,
                        .receipt-company-email {
                            font-size: 0.73rem !important;
                        }
                        .receipt-footer {
                            position: absolute !important;
                            bottom: 0 !important;
                            right: 0 !important;
                            left: auto !important;
                            margin-bottom: 0 !important;
                            padding: 0 1.5rem 8.5rem 0 !important; /* increased bottom padding for stamp space */
                        }
                        @page {
                            size: A5 portrait;
                            margin: 0;
                        }
                    }
                    `}
            </style>
        </div>
    );
});

export default ReceiptTemplate;
