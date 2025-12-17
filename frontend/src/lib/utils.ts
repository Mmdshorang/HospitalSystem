import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "jalali-moment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * تبدیل تاریخ میلادی به تاریخ شمسی
 * @param date - تاریخ میلادی (string یا Date)
 * @param format - فرمت خروجی (پیش‌فرض: YYYY/MM/DD)
 * @returns تاریخ شمسی به صورت رشته
 */
export function formatPersianDate(date: string | Date, format: string = "YYYY/MM/DD"): string {
  if (!date) return "-";
  try {
    const momentDate = moment(date);
    return momentDate.format(format);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * تبدیل تاریخ میلادی به تاریخ شمسی با فرمت کامل
 * @param date - تاریخ میلادی (string یا Date)
 * @returns تاریخ شمسی به صورت رشته (مثال: ۱۴۰۳/۰۹/۲۳)
 */
export function formatDate(date: string | Date): string {
  return formatPersianDate(date, "YYYY/MM/DD");
}

/**
 * تبدیل تاریخ میلادی به تاریخ و زمان شمسی
 * @param date - تاریخ میلادی (string یا Date)
 * @returns تاریخ و زمان شمسی به صورت رشته (مثال: ۱۴۰۳/۰۹/۲۳ ۱۴:۳۰)
 */
export function formatPersianDateTime(date: string | Date): string {
  return formatPersianDate(date, "YYYY/MM/DD HH:mm");
}

/**
 * تبدیل زمان به فرمت فارسی
 * @param time - زمان (string یا Date)
 * @returns زمان به فرمت فارسی (مثال: ۱۴:۳۰)
 */
export function formatTime(time: string | Date): string {
  if (!time) return "-";
  try {
    let date: Date;
    if (time instanceof Date) {
      date = time;
    } else {
      // اگر string است، می‌تواند فرمت HH:mm یا یک تاریخ کامل باشد
      if (time.includes("T") || time.includes("-") || time.includes("/")) {
        date = new Date(time);
      } else {
        date = new Date(`2000-01-01T${time}`);
      }
    }
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "-";
  }
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function generateInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}
