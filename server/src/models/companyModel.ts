import { db } from "../config/database";
import { Company } from "../types";

export const getCompanyInfo = async (): Promise<Company> => {
    const [rows] = await db.query("SELECT * FROM companyinfo WHERE id = 1");
    const typedRow = (rows as any)[0];

    const defaults: Company = {
        id: 1,
        name: "Ecole Polytechnique des Génies",
        logoUrl: "/assets/logo.webp",
        address: "Fes - Maroc",
        // "22, Rue Mohammed El Hayani, V.N Fès, 4éme Etage, Appt 20 Imm Hazzaz Fes - Maroc",
        email: "contact@epg.ma",
        phone: "+2126 60 77 73 82",
        website: "https://epg.ma/",
    };

    for (const key of Object.keys(defaults) as Array<keyof Company>) {
        if (typedRow[key] === undefined || typedRow[key] === null) {
            typedRow[key] = defaults[key] as Company[keyof Company];
        }
    }
    return typedRow as Company;
};

export const updateCompanyInfo = async (
    company: Partial<Company>
): Promise<boolean> => {
    const { name, email, phone, address, logoUrl, website } = company;

    let configs = {
        values: "",
        passed: [] as (string | number)[],
    };
    if (name) {
        configs.values += "name = ?, ";
        configs.passed.push(name);
    }
    if (email) {
        configs.values += "email = ?, ";
        configs.passed.push(email);
    }
    if (phone) {
        configs.values += "phone = ?, ";
        configs.passed.push(phone);
    }
    if (address) {
        configs.values += "address = ?, ";
        configs.passed.push(address);
    }
    if (logoUrl) {
        configs.values += "logoUrl = ?, ";
        configs.passed.push(logoUrl);
    }
    if (website) {
        configs.values += "website = ?, ";
        configs.passed.push(website);
    }

    if (configs.values.length === 0) return false;

    // Remove trailing comma and space
    configs.values = configs.values.slice(0, -2);

    try {
        await db.query(
            `UPDATE companyinfo SET ${configs.values} WHERE id = 1`,
            configs.passed
        );
        return true;
    } catch (error) {
        console.error("Error updating company info:", error);
        return false;
    }
};
