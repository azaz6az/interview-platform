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
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

/**
 * JDInput - 岗位描述输入组件（增强版：支持截图上传 + 文本粘贴）
 * @param {Object} props
 * @param {string} props.value - JD 文本
 * @param {Function} props.onChange - 文本变化回调
 * @param {Function} props.onAnalyze - 分析按钮回调
 * @param {boolean} props.isAnalyzing - 是否正在分析
 * @param {string|null} props.jdImage - JD 截图的 base64 数据
 * @param {Function} props.onImageChange - JD 截图变化回调
 */
function JDInput({ value, onChange, onAnalyze, isAnalyzing, jdImage, onImageChange }) {
  const charCount = value.length;
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const fileInputRef = useRef(null);

  /** 处理图片上传 */
  const handleImageUpload = useCallback((file) => {
    // 校验文件类型
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(ext) && !validTypes.includes(file.type)) {
      setImageError('不支持的图片格式。仅支持 PNG 和 JPG 格式。');
      return;
    }

    // 校验文件大小（限制 5MB）
    if (file.size > 5 * 1024 * 1024) {
      setImageError('图片文件过大，请上传小于 5MB 的图片。');
      return;
    }

    setImageError('');

    // 使用 FileReader 转为 base64
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target.result);
    };
    reader.onerror = () => {
      setImageError('图片读取失败，请重新尝试。');
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  /** 拖拽事件处理 */
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

  /** 点击上传区域触发文件选择 */
  const handleClickUploadArea = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  /** 文件选择框 change 事件 */
  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
    // 重置 input value 以便同一文件可以再次选择
    e.target.value = '';
  }, [handleImageUpload]);

  /** 删除已上传图片 */
  const handleRemoveImage = useCallback(() => {
    onImageChange(null);
    setImageError('');
  }, [onImageChange]);

  /** 打开图片预览大图 */
  const handleOpenPreview = useCallback(() => {
    setPreviewOpen(true);
  }, []);

  /** 关闭图片预览 */
  const handleClosePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e5edf5',
        borderRadius: '6px',
        boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
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
          <WorkIcon sx={{ color: '#ea2261' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 500, color: '#061b31' }}>
            Step 2：粘贴岗位描述
          </Typography>
        </Box>

        {/* ===== 图片上传区域（未上传时显示） ===== */}
        {!jdImage && (
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUploadArea}
            sx={{
              border: '2px dashed',
              borderColor: isDragOver ? '#ea2261' : '#e5edf5',
              borderRadius: '4px',
              backgroundColor: isDragOver ? 'rgba(234,34,97,0.04)' : '#fafbfc',
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
            <CloudUploadIcon sx={{ fontSize: 40, color: isDragOver ? '#ea2261' : '#64748d', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 400, color: isDragOver ? '#ea2261' : '#64748d' }}>
              {isDragOver ? '松开即可上传' : '上传 JD 截图'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              支持 PNG、JPG 格式
            </Typography>
          </Box>
        )}

        {/* ===== 图片预览区域（已上传时显示） ===== */}
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
              {/* 缩略图预览 */}
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

              {/* 操作按钮组 */}
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

            {/* 提示文案 */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              请根据截图内容，将关键信息粘贴到下方文本框
            </Typography>
          </Box>
        )}

        {/* ===== 图片上传错误提示 ===== */}
        {imageError && (
          <Alert
            severity="error"
            onClose={() => setImageError('')}
            sx={{ mb: 2 }}
          >
            {imageError}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
              borderRadius: '4px',
              fontWeight: 500,
              fontSize: '0.7rem',
              ...(charCount > 0
                ? {
                    bgcolor: 'rgba(234,34,97,0.08)',
                    color: '#ea2261',
                    border: '1px solid rgba(234,34,97,0.3)',
                  }
                : {
                    bgcolor: '#ffffff',
                    color: '#64748d',
                    border: '1px solid #e5edf5',
                  }),
            }}
          />
        </Box>
      </CardContent>

      {/* ===== 图片放大预览 Dialog ===== */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
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