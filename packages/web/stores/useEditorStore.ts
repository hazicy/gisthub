import { create } from 'zustand';

interface EditorState {
  content: string;
  isDirty: boolean;
  isPreviewMode: boolean;
  readOnly: boolean;

  setContent: (content: string) => void;
  setDirty: (dirty: boolean) => void;
  togglePreview: () => void;
  setPreviewMode: (mode: boolean) => void;
  setReadOnly: (readOnly: boolean) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  isDirty: false,
  isPreviewMode: false,
  readOnly: false,

  setContent: (content) => set({ content, isDirty: true }),
  setDirty: (isDirty) => set({ isDirty }),
  togglePreview: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
  setPreviewMode: (mode) => set({ isPreviewMode: mode }),
  setReadOnly: (readOnly) => set({ readOnly }),
  reset: () => set({ content: '', isDirty: false, isPreviewMode: false }),
}));