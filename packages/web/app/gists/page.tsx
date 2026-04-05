'use client';

import { GistList } from '@/components/gist/GistList';
import { CreateGistModal } from '@/components/gist/CreateGistModal';
import { UploadFileModal } from '@/components/gist/UploadFileModal';
import { useGistStore } from '@/stores/useGistStore';

export default function GistsPage() {
  const {
    isCreateModalOpen,
    setCreateModalOpen,
    isUploadModalOpen,
    setUploadModalOpen,
    currentProvider,
  } = useGistStore();

  return (
    <div className="container mx-auto p-6">
      <GistList />
      <CreateGistModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
