const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not configured");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

export interface SubmitReportRequest {
  text: string;
  location: string;
  category: string;
  person_state?: string;
  timestamp?: string;
}

export interface SubmitReportResponse {
  success: boolean;
  action: "CREATED" | "FUSED";
  incident_id: string;
  report_id: string;
  fusion_score: number;
  priority: string;
  report_count: number;
}

export async function submitReport(
  report: SubmitReportRequest
): Promise<SubmitReportResponse> {
  return request<SubmitReportResponse>("/reports", {
    method: "POST",
    body: JSON.stringify(report),
  });
}

export async function getIncidents() {
  return request<{
    success: boolean;
    count: number;
    incidents: any[];
  }>("/incidents");
}

export async function getIncident(incidentId: string) {
  return request<{
    success: boolean;
    incident: any;
  }>(`/incidents/${incidentId}`);
}

export async function updateIncident(
  incidentId: string,
  updates: {
    status?: string;
    assigned_responder?: string;
  }
) {
  return request<{
    success: boolean;
    incident: any;
  }>(`/incidents/${incidentId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}