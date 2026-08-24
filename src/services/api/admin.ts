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
}

export interface InviteCompanyMembersRequest {
  emails: string[];
  role: CompanyRole;
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
    return apiClient.get<CompanyMember[]>("/api/auth/company/members");
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
};

export default adminApiService;
