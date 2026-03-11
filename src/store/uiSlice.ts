import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  commentModal: { open: boolean; postId: string | null };
  likedByModal: { open: boolean; postId: string | null };
  alert: { message: string; type: "success" | "error" } | null;
}

const initialState: UiState = {
  commentModal: { open: false, postId: null },
  likedByModal: { open: false, postId: null },
  alert: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCommentModal(state, action: PayloadAction<string>) {
      state.commentModal = { open: true, postId: action.payload };
    },
    closeCommentModal(state) {
      state.commentModal = { open: false, postId: null };
    },
    openLikedByModal(state, action: PayloadAction<string>) {
      state.likedByModal = { open: true, postId: action.payload };
    },
    closeLikedByModal(state) {
      state.likedByModal = { open: false, postId: null };
    },
    showAlert(state, action: PayloadAction<{ message: string; type: "success" | "error" }>) {
      state.alert = action.payload;
    },
    hideAlert(state) {
      state.alert = null;
    },
  },
});

export const {
  openCommentModal,
  closeCommentModal,
  openLikedByModal,
  closeLikedByModal,
  showAlert,
  hideAlert,
} = uiSlice.actions;
export default uiSlice.reducer;
