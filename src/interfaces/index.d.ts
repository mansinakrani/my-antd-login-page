export interface ICategory {
  id: number;
  title: string;
}
export interface IPost {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
  category: { id: number };
}

export interface CredentialResponse {
  credential?: string;
  // select_by?:
  //     | "auto"
  //     | "user"
  //     | "user_1tap"
  //     | "user_2tap"
  //     | "btn"
  //     | "btn_confirm"
  //     | "brn_add_session"
  //     | "btn_confirm_add_session";
  clientId?: string;
}