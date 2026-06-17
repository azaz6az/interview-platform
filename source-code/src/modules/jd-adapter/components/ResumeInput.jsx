import React, { useState, useRef, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Alert,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { parseResumeFile, getAcceptedFileTypesString, formatFileSize } from '../engine/fileParser';

/**
 * ResumeInput - 简历输入组件（增强版：支持文件上传 + 文本粘贴）
 * @param {Object} props
 * @param {string} props.value - 简历文本
 * @param {Function} props.onChange - 文本变化回调
 * @param {Function} props.onAnalyze - 分析按钮回调
 * @param {boolean} props.isAnalyzing - 是否正在分析
 */
function ResumeInput({ value, onChange, onAnalyze, isAnalyzing }) {
  const charCount = value.length;

  /** 文件上传相关状态 */
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  /** 处理文件上传（点击或拖拽） */
  const handleFileUpload = useCallback(async (file) => {
    // 校验文件类型
    const acceptedTypes = getAcceptedFileTypesString();
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setParseError(`不支持的文件格式：.${ext}。仅支持 PDF 和 DOCX 格式。`);
      return;
    }

    // 清空之前的错误提示
    setParseError('');
    setIsParsing(true);
    setParseProgress(10);
    setUploadedFile({ name: file.name, size: file.size });

    try {
      // 模拟进度更新（解析过程无法精确获取进度，用阶段性模拟）
      setParseProgress(30);
      const text = await parseResumeFile(file);
      setParseProgress(90);

      // 将提取的文本填充到文本框
      if (text.trim()) {
        onChange(text);
        setParseProgress(100);
      } else {
        setParseError('文件内容为空，无法提取文本。请直接粘贴简历内容。');
        setParseProgress(100);
      }
    } catch (error) {
      setParseError(error.message);
      setUploadedFile(null);
    } finally {
      setIsParsing(false);
      setParseProgress(0);
    }
  }, [onChange]);

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
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  /** 点击上传区域触发文件选择 */
  const handleClickUploadArea = useCallback(() => {
    if (!isParsing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isParsing]);

  /** 文件选择框 change 事件 */
  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
    // 重置 input value 以便同一文件可以再次选择
    e.target.value = '';
  }, [handleFileUpload]);

  /** 删除已上传文件（仅清除上传状态，不清除已填充的文本） */
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setParseError('');
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
          <DescriptionIcon sx={{ color: '#533afd' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 500, color: '#061b31' }}>
            Step 1：粘贴简历
          </Typography>
        </Box>

        {/* ===== 文件上传区域 ===== */}
        {!uploadedFile && !isParsing && (
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUploadArea}
            sx={{
              border: '2px dashed',
              borderColor: isDragOver ? '#533afd' : '#e5edf5',
              borderRadius: '4px',
              backgroundColor: isDragOver ? 'rgba(83,58,253,0.04)' : '#fafbfc',
              p: 3,
              mb: 2,
              textAlign: 'center',
              cursor: isParsing ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#533afd',
                backgroundColor: 'rgba(83,58,253,0.04)',
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptedFileTypesString()}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: isDragOver ? '#533afd' : '#64748d', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 400, color: isDragOver ? '#533afd' : '#64748d' }}>
              {isDragOver ? '松开即可上传' : '拖拽或点击上传简历文件'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              支持 PDF、DOCX 格式
            </Typography>
          </Box>
        )}

        {/* ===== 上传中/解析进度 ===== */}
        {isParsing && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InsertDriveFileIcon sx={{ color: '#533afd', fontSize: 'small' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {uploadedFile?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({formatFileSize(uploadedFile?.size || 0)})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={parseProgress}
                sx={{ flex: 1, borderRadius: 1, height: 6 }}
              />
              <Typography variant="body2" sx={{ color: '#533afd', fontWeight: 400 }}>
                解析中...
              </Typography>
            </Box>
          </Box>
        )}

        {/* ===== 上传成功后文件信息 ===== */}
        {uploadedFile && !isParsing && !parseError && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'rgba(21,190,83,0.08)',
              border: '1px solid rgba(21,190,83,0.2)',
            }}
          >
            <InsertDriveFileIcon sx={{ color: '#15be53', fontSize: 'small' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {uploadedFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({formatFileSize(uploadedFile.size)})
            </Typography>
            <IconButton
              size="small"
              onClick={handleRemoveFile}
              sx={{ ml: 'auto' }}
              aria-label="删除已上传文件"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* ===== 解析失败提示 ===== */}
        {parseError && (
          <Alert
            severity="error"
            onClose={() => setParseError('')}
            sx={{ mb: 2 }}
          >
            {parseError}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          将你的简历内容粘贴到下方文本框中，支持纯文本格式
        </Typography>

        <TextField
          multiline
          fullWidth
          minRows={12}
          maxRows={20}
          placeholder="请粘贴你的简历内容...&#10;&#10;示例：&#10;张三 | 大数据管理与应用专业&#10;教育背景：XX大学 2022-2026&#10;技能：Python, SQL, 数据分析&#10;实习经历：XX公司数据分析实习生..."
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
                    bgcolor: 'rgba(83,58,253,0.08)',
                    color: '#533afd',
                    border: '1px solid #b9b9f9',
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
    </Card>
  );
}

export default ResumeInput;