import { apiClient } from "../api-client";

export type CompanyRole = "ADMIN" | "MANAGER" | "DEVELOPER";
export type MemberStatus = "ACTIVE" | "INVITE_PENDING" | "PENDING";

export interface CompanyMember {
  id: string;
  userId: string;
  email: string;
  fullName?: string;
  role: CompanyRole;
  status: MemberStatus;
  joinedAt?: string;
  assignedProjects?: string[];
}

export interface JoinRequest {
  id: string | number;
  requestId: string | number;
  email: string;
  githubUsername?: string;
  targetProjectId?: number | string;
  targetProjectName?: string;
  message?: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface InviteCompanyMembersRequest {
  emails: string[];
  role: CompanyRole;
  projectId?: number | string;
  projectRole?: "DEVELOPER" | "MANAGER";
}

export interface UpdateCompanyMemberRoleRequest {
  role: CompanyRole;
}

export interface InviteCompanyMembersResponse {
  success: boolean;
  invitedEmails?: string[];
  message?: string;
}

export const adminApiService = {
  /** GET /api/auth/company/members */
  async getCompanyMembers(): Promise<CompanyMember[]> {
    try {
      return await apiClient.get<CompanyMember[]>("/api/auth/company/members");
    } catch {
      return [];
    }
  },

  /** POST /api/auth/company/invite */
  async inviteCompanyMembers(
    data: InviteCompanyMembersRequest
  ): Promise<InviteCompanyMembersResponse> {
    return apiClient.post<InviteCompanyMembersResponse>(
      "/api/auth/company/invite",
      data
    );
  },

  /** PUT /api/auth/company/members/{userId}/role */
  async updateMemberRole(
    userId: string,
    role: CompanyRole
  ): Promise<{ success: boolean; message?: string }> {
    return apiClient.put<{ success: boolean; message?: string }>(
      `/api/auth/company/members/${userId}/role`,
      { role }
    );
  },

  /** DELETE /api/auth/company/members/{userId} */
  async revokeMember(
    userId: string
  ): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(
      `/api/auth/company/members/${userId}`
    );
  },

  /** GET /api/workspaces/{companyId}/join-requests */
  async getJoinRequests(companyId: number | string): Promise<JoinRequest[]> {
    try {
      return await apiClient.get<JoinRequest[]>(`/api/workspaces/${companyId}/join-requests`);
    } catch {
      return [];
    }
  },

  /** POST /api/workspaces/{companyId}/join-requests/{requestId}/approve */
  async approveJoinRequest(
    companyId: number | string,
    requestId: number | string
  ): Promise<{ success: boolean; message?: string }> {
    return apiClient.post<{ success: boolean; message?: string }>(
      `/api/workspaces/${companyId}/join-requests/${requestId}/approve`
    );
  },

  /** POST /api/workspaces/{companyId}/join-requests/{requestId}/reject */
  async rejectJoinRequest(
    companyId: number | string,
    requestId: number | string
  ): Promise<{ success: boolean; message?: string }> {
    return apiClient.post<{ success: boolean; message?: string }>(
      `/api/workspaces/${companyId}/join-requests/${requestId}/reject`
    );
  },
};

export default adminApiService;
