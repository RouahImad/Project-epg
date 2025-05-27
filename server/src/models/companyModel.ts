import { db } from "../config/database";

export interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    logoUrl: string;
    website?: string;
}

export const getCompanyInfo = async (): Promise<Company | null> => {
    const [rows] = await db.query("SELECT * FROM companyinfo ");
    const companies = rows as Company[];

    return companies.length > 0 ? companies[0] : null;
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

export const insertCompanyInfo = async (
    company: Omit<Company, "id">
): Promise<boolean> => {
    const { name, email, phone, address, logoUrl, website } = company;

    try {
        await db.query(
            "INSERT INTO companyinfo (name, email, phone, address, logoUrl, website) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, phone, address, logoUrl, website || null]
        );
        return true;
    } catch (error) {
        console.error("Error inserting company info:", error);
        return false;
    }
};
