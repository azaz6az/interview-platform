import React, { useState, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  LinearProgress,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { GRADIENTS, ACCENT_BG } from '../../../theme/theme';
import { extractTextFromImage as ocrLocal } from '../engine/ocrEngine';
import { extractTextFromImage as ocrApi } from '../../../services/aiService';
import { useApiKey } from '../../../contexts/ApiKeyContext';

/**
 * JDInput - 岗位描述输入组件
 * 支持图片上传/粘贴 + 自动 OCR 提取文字 + 手动输入
 */
function JDInput({ value, onChange, onAnalyze, isAnalyzing, jdImage, onImageChange }) {
  const charCount = value.length;
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const fileInputRef = useRef(null);
  const { apiKey, isConfigured } = useApiKey();

  const handleImageUpload = useCallback(async (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(ext) && !validTypes.includes(file.type)) {
      setImageError('不支持的图片格式。仅支持 PNG 和 JPG 格式。');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('图片文件过大，请上传小于 5MB 的图片。');
      return;
    }

    setImageError('');

    // 读取图片为 base64 并显示预览
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      onImageChange(base64);

      // 自动 OCR 提取文字
      setIsOcrProcessing(true);
      setOcrProgress(0);
      try {
        let extractedText = '';
        if (isConfigured && apiKey) {
          // 用通义千问 VL API（快）
          setOcrProgress(0.3);
          extractedText = await ocrApi(apiKey, base64);
          setOcrProgress(1);
        } else {
          // 降级到本地 tesseract.js（慢）
          extractedText = await ocrLocal(base64, setOcrProgress);
        }
        if (extractedText && extractedText.length > 5) {
          onChange(extractedText);
        } else {
          setImageError('未能识别到有效文字，请手动粘贴 JD 内容。');
        }
      } catch (err) {
        console.warn('OCR 失败:', err);
        setImageError('图片文字识别失败，请手动粘贴 JD 内容。');
      } finally {
        setIsOcrProcessing(false);
        setOcrProgress(0);
      }
    };
    reader.onerror = () => {
      setImageError('图片读取失败，请重新尝试。');
    };
    reader.readAsDataURL(file);
  }, [onImageChange, onChange, apiKey, isConfigured]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const handleClickUploadArea = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
    e.target.value = '';
  }, [handleImageUpload]);

  const handleRemoveImage = useCallback(() => {
    onImageChange(null);
    setImageError('');
  }, [onImageChange]);

  /** 粘贴图片支持 */
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // 粘贴的图片可能没有文件名，生成一个
          const namedFile = new File([file], `clipboard-${Date.now()}.png`, { type: file.type });
          handleImageUpload(namedFile);
        }
        return;
      }
    }
  }, [handleImageUpload]);

  const handleOpenPreview = useCallback(() => {
    setPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  return (
    <Card
      onPaste={handlePaste}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'divider',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: GRADIENTS.warm,
          borderRadius: '12px 12px 0 0',
        },
        '&:hover': {
          boxShadow: 'rgba(234,34,97,0.08) 0px 8px 24px -4px',
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: ACCENT_BG.pink,
              color: '#ea2261',
            }}
          >
            <WorkIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
            Step 2：粘贴岗位描述
          </Typography>
        </Box>

        {/* 图片上传区域（未上传时显示） */}
        {!jdImage && (
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUploadArea}
            sx={{
              border: '2px dashed',
              borderColor: isDragOver ? '#ea2261' : 'divider',
              borderRadius: 2,
              backgroundColor: isDragOver ? 'rgba(234,34,97,0.04)' : 'action.hover',
              p: 3,
              mb: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#ea2261',
                backgroundColor: 'rgba(234,34,97,0.04)',
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: isDragOver ? '#ea2261' : 'text.secondary', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 400, color: isDragOver ? '#ea2261' : 'text.secondary' }}>
              {isDragOver ? '松开即可上传' : '上传 JD 截图'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              支持 PNG、JPG 格式 · 支持 Ctrl+V 粘贴图片
            </Typography>
          </Box>
        )}

        {/* 图片预览区域（已上传时显示） */}
        {jdImage && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200',
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxHeight: 200,
                  p: 1,
                }}
              >
                <img
                  src={jdImage}
                  alt="JD 截图预览"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 180,
                    objectFit: 'contain',
                    borderRadius: 4,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  p: 1,
                  backgroundColor: '#fafafa',
                  borderTop: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <IconButton
                  size="small"
                  sx={{ color: '#ea2261' }}
                  onClick={handleOpenPreview}
                  aria-label="放大查看"
                  title="放大查看"
                >
                  <ZoomInIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveImage}
                  aria-label="删除图片"
                  title="删除图片"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* OCR 进度指示 */}
            {isOcrProcessing ? (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <TextSnippetIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                    正在识别图片文字... {Math.round(ocrProgress * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={ocrProgress * 100}
                  sx={{
                    borderRadius: 1,
                    height: 4,
                    '& .MuiLinearProgress-bar': { background: GRADIENTS.warm },
                  }}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic', fontWeight: 300 }}
              >
                {value ? '文字已提取到下方文本框，请检查并修改' : '请根据截图内容，将关键信息粘贴到下方文本框'}
              </Typography>
            )}
          </Box>
        )}

        {/* 图片上传错误提示 */}
        {imageError && (
          <Alert severity="error" onClose={() => setImageError('')} sx={{ mb: 2, borderRadius: 2 }}>
            {imageError}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 300 }}>
          将目标岗位的 JD 粘贴到下方，系统会自动提取关键信息
        </Typography>

        <TextField
          multiline
          fullWidth
          minRows={12}
          maxRows={20}
          placeholder="请粘贴岗位描述(JD)...&#10;&#10;示例：&#10;岗位：数据分析师&#10;职责：&#10;1. 负责公司业务数据的收集、清洗和分析&#10;2. 搭建数据看板，监控核心业务指标&#10;要求：&#10;1. 本科及以上学历，统计学/数学/计算机相关专业&#10;2. 熟练使用 SQL、Python 进行数据处理..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          variant="outlined"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              height: '100%',
              alignItems: 'flex-start',
              fontSize: '0.95rem',
              lineHeight: 1.8,
            },
            '& .MuiOutlinedInput-input': {
              fontFamily: 'inherit',
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
          <Chip
            label={`${charCount} 字`}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontWeight: 500,
              fontSize: '0.7rem',
              ...(charCount > 0
                ? {
                    bgcolor: 'rgba(234,34,97,0.08)',
                    color: '#ea2261',
                    border: '1px solid rgba(234,34,97,0.3)',
                  }
                : {
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    border: '1px solid',
                    borderColor: 'divider',
                  }),
            }}
          />
        </Box>
      </CardContent>

      {/* 图片放大预览 Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'hidden' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon color="secondary" />
          JD 截图预览
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          {jdImage && (
            <img
              src={jdImage}
              alt="JD 截图大图"
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default JDInput;
