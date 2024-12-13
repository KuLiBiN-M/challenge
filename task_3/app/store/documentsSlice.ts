import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Document {
  id: string;
  title: string;
  status: "in-progress" | "under-review" | "completed";
}

// Функция для сохранения данных в LocalStorage
const saveDocumentsToLocalStorage = (documents: Document[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("documents", JSON.stringify(documents));
  }
};

const documentsSlice = createSlice({
  name: "documents",
  initialState: [] as Document[],
  reducers: {
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      return action.payload;
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.push(action.payload);
      saveDocumentsToLocalStorage(state);
    },
    moveDocument: (
      state,
      action: PayloadAction<{
        id: string;
        newStatus: "in-progress" | "under-review" | "completed";
      }>
    ) => {
      const document = state.find((doc) => doc.id === action.payload.id);
      if (document) {
        document.status = action.payload.newStatus;
        saveDocumentsToLocalStorage(state);
      }
    },
  },
});

export const { setDocuments, addDocument, moveDocument } =
  documentsSlice.actions;
export default documentsSlice.reducer;
