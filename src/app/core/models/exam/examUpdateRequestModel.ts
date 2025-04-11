export interface ExamUpdateRequestModel {
  title: string;
  description: string;
  startDate: string; // ISO 8601 formatında olacak (örnek: "2025-04-09T16:37:46.696Z")
  endDate: string;
  duration: number; // dakika cinsinden süre
  } 