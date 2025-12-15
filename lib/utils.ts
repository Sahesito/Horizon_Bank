/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import { SocketAddress } from "net";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // Nombre del día abreviado (e.g., 'Mon')
    month: "short", // Nombre del mes abreviado (e.g., 'Oct')
    day: "numeric", // Día del mes númerico (e.g., '25')
    hour: "numeric", // Hora númerica (e.g., '8')
    minute: "numeric", // Minuto númerico (e.g., '30')
    hour12: true, // Usa un reloj de 12 horas (true) o de 24 horas (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // Nombre del día abreviado (e.g., 'Mon')
    year: "numeric", // Año númerico (e.g., '2023')
    month: "2-digit", // Nombre del mes abreviado (e.g., 'Oct')
    day: "2-digit", // Día númerico del mes (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // Nombre del mes abreviado (e.g., 'Oct')
    year: "numeric", // Año númerico (e.g., '2023')
    day: "numeric", // Día del mes númerico (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // Hora númerica (e.g., '8')
    minute: "numeric", // Minuto númerico (e.g., '30')
    hour12: true, // Usa un reloj de 12 horas (true) o de 24 horas (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Itera sobre cada transacción
  transactions &&
    transactions.forEach((transaction) => {
      // Extrae la categoria de la transacción
      const category = transaction.category;

      // Si la categoria existe categoryCounts, incrementa la cuenta
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Inicializa la cuenta en 1
        categoryCounts[category] = 1;
      }

      totalCount++;
    });

  // Convierte categoryCounts en un array de objetos
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Ordena aggregatedCategories en orden descendiente
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split la string de la URL con '/'
  const parts = url.split("/");

  // Extrae la última parte, que representa la ID del cliente
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Procesando" : "Éxito";
};

export const authFormSchema = (type: string) => z.object({

    //Inicio de sesión
    email: z.string().email(),
    password: z.string().min(8),
    
    // Registro
firstName: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(1, "Obligatorio"),
    
    lastName: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(1, "Obligatorio"),
    
    address1: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(1, "Obligatorio").max(50, "Demasiado largo"),
    
    state: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(2, "Obligatorio").max(2, "Deben ser 2 caracteres"),
    
    postalCode: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(3, "Obligatorio").max(6, "Demasiado largo"),
    
    dateOfBirth: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(1, "Obligatorio"),
    
    ssn: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(1, "Obligatorio").max(4, "Demasiado largo"),
    
    city: type === 'sign-in' 
        ? z.string().optional() 
        : z.string().min(1, "Obligatorio").max(50, "Demasiado largo"),  
})