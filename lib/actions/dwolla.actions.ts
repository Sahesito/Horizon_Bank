"use server";

import { Client } from "dwolla-v2";

const getEnvironment = (): "production" | "sandbox" => {
    const environment = process.env.DWOLLA_ENV as string;

    switch (environment) {
        case "sandbox":
            return "sandbox";
        case "production":
            return "production";
        default:
            throw new Error(
                "El entorno de Dwolla debe configurarse como `sandbox` o `producción`"
            );
    }
};

const dwollaClient = new Client({
    environment: getEnvironment(),
    key: process.env.DWOLLA_KEY as string,
    secret: process.env.DWOLLA_SECRET as string,
});

// Crea una FundingSource de Dwolla utilizando un token de Plaid
export const createFundingSource = async (
    options: CreateFundingSourceOptions
) => {
    try {
        return await dwollaClient
            .post(`customers/${options.customerId}/funding-sources`, {
                name: options.fundingSourceName,
                plaidToken: options.plaidToken,
            })
            .then((res) => res.headers.get("location"));
    } catch (err) {
        console.error("Error al crear una fuente de financiación: ", err);
    }
};

export const createOnDemandAuthorization = async () => {
    try {
        const onDemandAuthorization = await dwollaClient.post(
            "on-demand-authorizations"
        );
        const authLink = onDemandAuthorization.body._links;
        return authLink;
    } catch (err) {
        console.error("Error al crear una autorización a pedido: ", err);
    }
};

export const createDwollaCustomer = async (
    newCustomer: NewDwollaCustomerParams
) => {
    try {
        return await dwollaClient
            .post("customers", newCustomer)
            .then((res) => res.headers.get("location"));
    } catch (err) {
        console.error("Error al crear un cliente de Dwolla: ", err);
    }
};

export const createTransfer = async ({
    sourceFundingSourceUrl,
    destinationFundingSourceUrl,
    amount,
}: TransferParams) => {
    try {
        const requestBody = {
            _links: {
                source: {
                    href: sourceFundingSourceUrl,
                },
                destination: {
                    href: destinationFundingSourceUrl,
                },
            },
            amount: {
                currency: "USD",
                value: amount,
            },
        };
        return await dwollaClient
            .post("transfers", requestBody)
            .then((res) => res.headers.get("location"));
    } catch (err) {
        console.error("La transferencia falló:", err);
    }
};

export const addFundingSource = async ({
    dwollaCustomerId,
    processorToken,
    bankName,
}: AddFundingSourceParams) => {
    try {
        // Crea Dwolla auth Link
        const dwollaAuthLinks = await createOnDemandAuthorization();

        const fundingSourceOptions = {
            customerId: dwollaCustomerId,
            fundingSourceName: bankName,
            plaidToken: processorToken,
            _links: dwollaAuthLinks,
        };
        return await createFundingSource(fundingSourceOptions);
    } catch (err) {
        console.error("La transferencia falló: ", err);
    }
};
