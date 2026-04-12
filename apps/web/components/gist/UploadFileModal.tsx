'use client';

import { useState, useRef } from 'react';
import { Button, Input } from '@heroui/react';
import { toast } from '@heroui/react';
import { useGistStore } from '@/stores/useGistStore';
import { gistApi } from '@/lib/api/gist';
import type { GistProviderType } from '@/types/gist';

// 文件大小限制常量 (字节)
const FILE_SIZE_LIMITS: Record<GistProviderType, number> = {
  github: 100 * 1024 * 1024, // 100MB
};

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadFileModal({ isOpen, onClose }: UploadFileModalProps) {
  const { currentProvider, gists, setGists, addGist } = useGistStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetGistId, setTargetGistId] = useState<string>('');
  const [createNewGist, setCreateNewGist] = useState(true);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle dialog visibility
  useState(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentProvider) {
      const maxSize = FILE_SIZE_LIMITS[currentProvider.type];
      if (file.size > maxSize) {
        const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
        toast.danger(
          `文件大小超出 ${currentProvider.type} 限制 (最大 ${maxMB}MB)`,
        );
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentProvider) return;

    setIsUploading(true);

    try {
      const content = await selectedFile.text();
      const fileName = selectedFile.name;

      if (createNewGist) {
        if (!description) {
          toast.warning('请输入 Gist 描述');
          setIsUploading(false);
          return;
        }

        const newGist = await gistApi.createGist(currentProvider, {
          description,
          public: false,
          files: {
            [fileName]: { content },
          },
        });

        addGist(newGist);
        toast.success('文件上传成功');
      } else {
        if (!targetGistId) {
          toast.warning('请选择目标 Gist');
          setIsUploading(false);
          return;
        }

        await gistApi.updateGistContent(
          currentProvider,
          targetGistId,
          fileName,
          content,
        );

        const updatedGists = await gistApi.getGists(currentProvider);
        setGists(updatedGists);
        toast.success('文件上传成功');
      }

      handleClose();
    } catch (error) {
      toast.danger('上传失败: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    dialogRef.current?.close();
    setSelectedFile(null);
    setTargetGistId('');
    setCreateNewGist(true);
    setDescription('');
    onClose();
  };

  const getMaxFileSize = () => {
    if (!currentProvider) return 0;
    return FILE_SIZE_LIMITS[currentProvider.type];
  };

  const maxSizeMB = (getMaxFileSize() / (1024 * 1024)).toFixed(0);

  return (
    <dialog
      ref={dialogRef}
      className="p-6 rounded-lg shadow-xl border w-full max-w-lg"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">上传文件</h3>

        <div className="space-y-4">
          {/* 文件选择 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">选择文件</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-default-500"
            />
            {selectedFile && (
              <p className="text-sm text-default-500">
                已选择: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="text-xs text-default-400">
              最大文件大小: {maxSizeMB}MB
            </p>
          </div>

          {/* 上传选项 */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={createNewGist ? 'solid' : 'bordered'}
              onClick={() => setCreateNewGist(true)}
            >
              创建新 Gist
            </Button>
            <Button
              size="sm"
              variant={!createNewGist ? 'solid' : 'bordered'}
              onClick={() => setCreateNewGist(false)}
            >
              上传到现有 Gist
            </Button>
          </div>

          {/* 创建新 Gist */}
          {createNewGist && (
            <Input
              label="描述"
              placeholder="输入 Gist 描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}

          {/* 上传到现有 Gist */}
          {!createNewGist && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">选择目标 Gist</label>
              <select
                className="p-2 border rounded"
                value={targetGistId}
                onChange={(e) => setTargetGistId(e.target.value)}
              >
                <option value="">选择目标 Gist</option>
                {gists.map((gist) => (
                  <option key={gist.id} value={gist.id}>
                    {gist.description || '无描述'} ({gist.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="tertiary" onClick={handleClose}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            isDisabled={!selectedFile || isUploading}
            isLoading={isUploading}
          >
            上传
          </Button>
        </div>
      </div>
    </dialog>
  );
}
